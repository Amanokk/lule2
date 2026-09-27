import { a as setLive, i as pushGift, n as getLive, r as pushChat } from "./router-DXQyCNzs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tiktok.server-0ZP68S9e.js
/**
* Conexão TikTok LIVE via tiktok-live-connector (Webcast não oficial).
* Só importe este módulo de rotas de servidor.
*/
var connection = null;
var reconnectTimer = null;
var reconnects = 0;
function giftNameOf(data) {
	const ext = data.extendedGiftInfo;
	const details = data.giftDetails;
	const gift = data.gift;
	return ext?.name || details?.giftName || data.giftName || gift?.name || String(data.giftId ?? "Presente");
}
function diamondsOf(data) {
	const n = data.extendedGiftInfo?.diamond_count || data.diamondCount || data.repeatCount || 1;
	return Number(n) || 1;
}
function userOf(data) {
	const user = data.user;
	return user?.uniqueId || user?.nickname || data.uniqueId || data.nickname || "viewer";
}
async function attach(username) {
	const mod = await import("../_libs/tiktok-live-connector.mjs").then((n) => n.t);
	const TikTokLiveConnection = mod.TikTokLiveConnection;
	const WebcastEvent = mod.WebcastEvent;
	const conn = new TikTokLiveConnection(username.replace(/^@/, ""), {
		enableExtendedGiftInfo: true,
		processInitialData: false
	});
	connection = conn;
	const giftEvent = WebcastEvent?.GIFT ?? "gift";
	const chatEvent = WebcastEvent?.CHAT ?? "chat";
	const disconnected = WebcastEvent?.DISCONNECTED ?? "disconnected";
	const errorEvent = "error";
	conn.on(giftEvent, (...args) => {
		const data = args[0] ?? {};
		pushGift({
			sender: userOf(data),
			giftName: giftNameOf(data),
			giftId: data.giftId ?? void 0,
			diamonds: diamondsOf(data),
			repeatCount: Number(data.repeatCount ?? 1) || 1,
			source: "tiktok"
		});
	});
	conn.on(chatEvent, (...args) => {
		const data = args[0] ?? {};
		const comment = data.comment || (data.msg ?? "");
		if (!comment) return;
		pushChat({
			sender: userOf(data),
			comment
		});
	});
	conn.on(disconnected, () => {
		if (getLive().status === "disconnected") return;
		setLive({
			status: "reconnecting",
			username
		});
		scheduleReconnect(username);
	});
	conn.on(errorEvent, (...args) => {
		const err = args[0];
		const message = err instanceof Error ? err.message : String(err ?? "erro");
		setLive({
			status: "error",
			username,
			error: message
		});
	});
	await conn.connect();
	reconnects = 0;
	setLive({
		status: "connected",
		username
	});
}
function scheduleReconnect(username) {
	if (reconnectTimer) return;
	reconnects += 1;
	const wait = Math.min(15e3, 1500 * reconnects);
	reconnectTimer = setTimeout(() => {
		reconnectTimer = null;
		connectTikTok(username).catch((err) => {
			const message = err instanceof Error ? err.message : String(err);
			setLive({
				status: "reconnecting",
				username,
				error: message
			});
			scheduleReconnect(username);
		});
	}, wait);
}
async function connectTikTok(username) {
	const clean = username.replace(/^@/, "").trim();
	if (!clean) throw new Error("Informe o @ do TikTok");
	await disconnectTikTok();
	setLive({
		status: "connecting",
		username: clean
	});
	try {
		await attach(clean);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		setLive({
			status: "error",
			username: clean,
			error: message.includes("LIVE") || message.toLowerCase().includes("not found") ? "Não encontrei uma live aberta nesse @. Abra a live e tente de novo, ou use o simulador." : message
		});
		throw err;
	}
}
async function disconnectTikTok() {
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
	const prev = connection;
	connection = null;
	reconnects = 0;
	if (prev) try {
		await prev.disconnect();
	} catch {}
	setLive({
		status: "disconnected",
		username: getLive().username
	});
}
//#endregion
export { connectTikTok, disconnectTikTok };
