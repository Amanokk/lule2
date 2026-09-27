/**
 * Barramento in-memory da live: conecta o conector TikTok, o painel, o overlay OBS
 * e o webhook (TikFinity) no mesmo processo.
 *
 * Em hospedagem serverless o estado não persiste entre instâncias — o simulador
 * do painel continua funcionando 100% no cliente.
 */
import type { AppConfig, BusEvent, IncomingChat, IncomingGift, LiveSnapshot } from "./types";
import { defaultConfig } from "./gifts";

type Client = ReadableStreamDefaultController<Uint8Array>;

const encoder = new TextEncoder();
const clients = new Set<Client>();

let live: LiveSnapshot = { status: "disconnected", username: "" };
let config: AppConfig = defaultConfig();

export function getLive() {
  return live;
}

export function setLive(next: LiveSnapshot) {
  live = next;
  broadcast({ type: "status", live });
}

export function getBusConfig() {
  return config;
}

export function setBusConfig(next: AppConfig) {
  config = next;
  broadcast({ type: "config", config });
}

export function broadcast(event: BusEvent) {
  const payload = encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
  for (const client of clients) {
    try {
      client.enqueue(payload);
    } catch {
      clients.delete(client);
    }
  }
}

export function subscribe(client: Client) {
  clients.add(client);
}

export function unsubscribe(client: Client) {
  clients.delete(client);
}

export function helloEvent(): BusEvent {
  return { type: "hello", live, config };
}

export function pushGift(gift: IncomingGift) {
  broadcast({ type: "gift", gift });
}

export function pushChat(chat: IncomingChat) {
  broadcast({ type: "chat", chat });
}

export function pushReset() {
  broadcast({ type: "reset" });
}

export function ssePing() {
  const payload = encoder.encode(`: ping\n\n`);
  for (const client of clients) {
    try {
      client.enqueue(payload);
    } catch {
      clients.delete(client);
    }
  }
}
