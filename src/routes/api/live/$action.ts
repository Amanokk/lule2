import { createFileRoute } from "@tanstack/react-router";
import {
  getBusConfig,
  getLive,
  helloEvent,
  pushChat,
  pushGift,
  pushReset,
  setBusConfig,
  subscribe,
  unsubscribe,
} from "@/lib/combat/bus.server";
import type { AppConfig, IncomingGift } from "@/lib/combat/types";

const encoder = new TextEncoder();

export const Route = createFileRoute("/api/live/$action")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const action = params.action;
        if (action === "events") {
          let ping: ReturnType<typeof setInterval> | undefined;
          let current: ReadableStreamDefaultController<Uint8Array> | undefined;
          const stream = new ReadableStream<Uint8Array>({
            start(controller) {
              current = controller;
              subscribe(controller);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(helloEvent())}\n\n`));
              ping = setInterval(() => {
                try {
                  controller.enqueue(encoder.encode(`: ping\n\n`));
                } catch {
                  if (ping) clearInterval(ping);
                  unsubscribe(controller);
                }
              }, 20000);
            },
            cancel() {
              if (ping) clearInterval(ping);
              if (current) unsubscribe(current);
            },
          });
          return new Response(stream, {
            headers: {
              "content-type": "text/event-stream; charset=utf-8",
              "cache-control": "no-cache, no-transform",
              connection: "keep-alive",
            },
          });
        }
        if (action === "status" || action === "config") {
          return Response.json({ live: getLive(), config: getBusConfig() });
        }
        return Response.json({ error: "unknown" }, { status: 404 });
      },
      POST: async ({ params, request }) => {
        const action = params.action;
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

        if (action === "connect") {
          const username = String(body.username ?? "").replace(/^@/, "").trim();
          try {
            const { connectTikTok } = await import("@/lib/combat/tiktok.server");
            await connectTikTok(username);
            return Response.json({ ok: true, live: getLive() });
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return Response.json({ error: message, live: getLive() }, { status: 400 });
          }
        }

        if (action === "disconnect") {
          const { disconnectTikTok } = await import("@/lib/combat/tiktok.server");
          await disconnectTikTok();
          return Response.json({ ok: true, live: getLive() });
        }

        if (action === "gift") {
          const gift: IncomingGift = {
            sender: String(body.sender ?? "viewer"),
            giftName: String(body.giftName ?? "gift"),
            giftId: (body.giftId as string | number | undefined) ?? undefined,
            diamonds: Number(body.diamonds ?? 1) || 1,
            repeatCount: Number(body.repeatCount ?? 1) || 1,
            source: (body.source as IncomingGift["source"]) ?? "local",
          };
          pushGift(gift);
          return Response.json({ ok: true });
        }

        if (action === "reset") {
          pushReset();
          return Response.json({ ok: true });
        }

        if (action === "config") {
          setBusConfig(body as unknown as AppConfig);
          return Response.json({ ok: true });
        }

        if (action === "webhook") {
          const giftName = String(body.giftName ?? body.name ?? body.gift ?? "");
          const comment = String(body.comment ?? body.message ?? "");
          const sender = String(body.uniqueId ?? body.nickname ?? body.sender ?? "viewer");
          if (giftName) {
            pushGift({
              sender,
              giftName,
              giftId: (body.giftId as string | number | undefined) ?? undefined,
              diamonds: Number(body.diamondCount ?? body.diamonds ?? 1) || 1,
              source: "webhook",
            });
          } else if (comment) {
            pushChat({ sender, comment });
          }
          return Response.json({ ok: true });
        }

        return Response.json({ error: "unknown" }, { status: 404 });
      },
    },
  },
});
