import type { BusEvent } from "./types";

/** Assina o SSE do servidor para o overlay OBS receber gifts/config/reset. */
export function subscribeLive(onEvent: (ev: BusEvent) => void): () => void {
  const es = new EventSource("/api/live/events");
  es.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data) as BusEvent;
      onEvent(data);
    } catch {
      /* ignore malformed */
    }
  };
  return () => es.close();
}

export async function postLive(action: string, body?: unknown) {
  const res = await fetch(`/api/live/${action}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body == null ? undefined : JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
  if (!res.ok) throw new Error(json.error || `Falha em ${action}`);
  return json;
}

export async function getLiveStatus() {
  const res = await fetch("/api/live/status");
  return (await res.json()) as { live: { status: string; username: string; error?: string } };
}
