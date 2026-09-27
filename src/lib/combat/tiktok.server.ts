/**
 * Conexão TikTok LIVE via tiktok-live-connector (Webcast não oficial).
 * Só importe este módulo de rotas de servidor.
 */
import { getLive, pushChat, pushGift, setLive } from "./bus.server";

type ConnectionLike = {
  connect: () => Promise<unknown>;
  disconnect: () => Promise<unknown> | unknown;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
};

let connection: ConnectionLike | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnects = 0;

function giftNameOf(data: Record<string, unknown>): string {
  const ext = data.extendedGiftInfo as Record<string, unknown> | undefined;
  const details = data.giftDetails as Record<string, unknown> | undefined;
  const gift = data.gift as Record<string, unknown> | undefined;
  const name =
    (ext?.name as string) ||
    (details?.giftName as string) ||
    (data.giftName as string) ||
    (gift?.name as string) ||
    String(data.giftId ?? "Presente");
  return name;
}

function diamondsOf(data: Record<string, unknown>): number {
  const ext = data.extendedGiftInfo as Record<string, unknown> | undefined;
  const n =
    (ext?.diamond_count as number) ||
    (data.diamondCount as number) ||
    (data.repeatCount as number) ||
    1;
  return Number(n) || 1;
}

function userOf(data: Record<string, unknown>): string {
  const user = data.user as Record<string, unknown> | undefined;
  return (
    (user?.uniqueId as string) ||
    (user?.nickname as string) ||
    (data.uniqueId as string) ||
    (data.nickname as string) ||
    "viewer"
  );
}

async function attach(username: string) {
  const mod = await import("tiktok-live-connector");
  const TikTokLiveConnection = (mod as { TikTokLiveConnection: new (u: string, o?: object) => ConnectionLike })
    .TikTokLiveConnection;
  const WebcastEvent = (mod as { WebcastEvent?: Record<string, string> }).WebcastEvent;

  const conn = new TikTokLiveConnection(username.replace(/^@/, ""), {
    enableExtendedGiftInfo: true,
    processInitialData: false,
  });
  connection = conn;

  const giftEvent = WebcastEvent?.GIFT ?? "gift";
  const chatEvent = WebcastEvent?.CHAT ?? "chat";
  const disconnected = WebcastEvent?.DISCONNECTED ?? "disconnected";
  const errorEvent = "error";

  conn.on(giftEvent, (...args: unknown[]) => {
    const data = (args[0] ?? {}) as Record<string, unknown>;
    // Streak: ainda assim cada incremento vira um golpe — melhor para o overlay.
    pushGift({
      sender: userOf(data),
      giftName: giftNameOf(data),
      giftId: (data.giftId as string | number) ?? undefined,
      diamonds: diamondsOf(data),
      repeatCount: Number(data.repeatCount ?? 1) || 1,
      source: "tiktok",
    });
  });

  conn.on(chatEvent, (...args: unknown[]) => {
    const data = (args[0] ?? {}) as Record<string, unknown>;
    const comment =
      (data.comment as string) ||
      ((data as { msg?: string }).msg ?? "");
    if (!comment) return;
    pushChat({ sender: userOf(data), comment });
  });

  conn.on(disconnected, () => {
    if (getLive().status === "disconnected") return;
    setLive({ status: "reconnecting", username });
    scheduleReconnect(username);
  });

  conn.on(errorEvent, (...args: unknown[]) => {
    const err = args[0];
    const message = err instanceof Error ? err.message : String(err ?? "erro");
    setLive({ status: "error", username, error: message });
  });

  await conn.connect();
  reconnects = 0;
  setLive({ status: "connected", username });
}

function scheduleReconnect(username: string) {
  if (reconnectTimer) return;
  reconnects += 1;
  const wait = Math.min(15000, 1500 * reconnects);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connectTikTok(username).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      setLive({ status: "reconnecting", username, error: message });
      scheduleReconnect(username);
    });
  }, wait);
}

export async function connectTikTok(username: string) {
  const clean = username.replace(/^@/, "").trim();
  if (!clean) throw new Error("Informe o @ do TikTok");
  await disconnectTikTok();
  setLive({ status: "connecting", username: clean });
  try {
    await attach(clean);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setLive({
      status: "error",
      username: clean,
      error:
        message.includes("LIVE") || message.toLowerCase().includes("not found")
          ? "Não encontrei uma live aberta nesse @. Abra a live e tente de novo, ou use o simulador."
          : message,
    });
    throw err;
  }
}

export async function disconnectTikTok() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  const prev = connection;
  connection = null;
  reconnects = 0;
  if (prev) {
    try {
      await prev.disconnect();
    } catch {
      /* already closed */
    }
  }
  setLive({ status: "disconnected", username: getLive().username });
}
