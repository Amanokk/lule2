import { o as __toESM } from "../_runtime.mjs";
import { i as findGiftMapping, n as actionLabel, o as giftVisual, r as defaultConfig } from "./gifts-DVphocZm.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sfx-director-MVyPU2ai.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHARACTERS = [{
	id: "lula",
	name: "Lula",
	subtitle: "O Estadista",
	sprite: "lula",
	color: "lula",
	portrait: "/portraits/lula.jpg"
}, {
	id: "flavio",
	name: "Flávio Bolsonaro",
	subtitle: "O Senador",
	sprite: "flavio",
	color: "flavio",
	portrait: "/portraits/flavio.jpg"
}];
var CHARACTER_MAP = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));
function getCharacter(id) {
	return CHARACTER_MAP[id] ?? CHARACTERS[0];
}
function otherCharacter(id) {
	return CHARACTERS.find((c) => c.id !== id) ?? CHARACTERS[1];
}
function spriteUrl(sprite, anim, frame) {
	return `/sprites/${sprite}/${anim}-${Math.min(4, Math.max(1, frame))}.png`;
}
var ALL_SPRITE_URLS = CHARACTERS.flatMap((c) => [
	"idle",
	"attack",
	"hurt"
].flatMap((anim) => [
	1,
	2,
	3,
	4
].map((n) => spriteUrl(c.sprite, anim, n)))).concat(CHARACTERS.map((c) => c.portrait)).concat([
	1,
	2,
	3,
	4
].map((n) => `/sprites/fx/impact-${n}.png`)).concat([
	1,
	2,
	3,
	4
].map((n) => `/sprites/fx/petal-${n}.png`)).concat(["/arena/stage.jpg"]);
/** Web Audio SFX — sintetizados em camadas. Unlock no primeiro gesto. */
var ctx = null;
var master = null;
var sfx = null;
var crowd = null;
var noise$1 = null;
var unlocked = false;
var crowdSrc = null;
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		ctx = new AudioContext({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfx = ctx.createGain();
		crowd = ctx.createGain();
		sfx.connect(master);
		crowd.connect(master);
		master.connect(ctx.destination);
		master.gain.value = 1;
		sfx.gain.value = .85;
		crowd.gain.value = .35;
	}
	return ctx;
}
function unlockAudio() {
	const c = ac();
	if (!c) return;
	if (c.state === "suspended") c.resume();
	unlocked = true;
	if (!noise$1) noise$1 = makeNoise(c);
	startCrowd();
}
function setVolumes(sfxVol, crowdVol) {
	const c = ac();
	if (!c || !sfx || !crowd) return;
	const now = c.currentTime;
	sfx.gain.setTargetAtTime(sfxVol * sfxVol, now, .03);
	crowd.gain.setTargetAtTime(crowdVol * crowdVol * .55, now, .05);
}
function makeNoise(c) {
	const len = c.sampleRate * 1.6;
	const buf = c.createBuffer(1, len, c.sampleRate);
	const data = buf.getChannelData(0);
	let last = 0;
	for (let i = 0; i < len; i++) {
		const white = Math.random() * 2 - 1;
		last = last * .7 + white * .3;
		data[i] = last;
	}
	return buf;
}
function envGain(c, dest, attack, hold, release, peak = 1) {
	const g = c.createGain();
	g.gain.setValueAtTime(1e-4, c.currentTime);
	g.gain.exponentialRampToValueAtTime(peak, c.currentTime + Math.max(.004, attack));
	g.gain.exponentialRampToValueAtTime(peak * .72, c.currentTime + attack + hold);
	g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + attack + hold + release);
	g.connect(dest);
	return g;
}
function playNoise(duration, cutoff, peak, type = "bandpass") {
	const c = ac();
	if (!c || !sfx || !noise$1 || !unlocked) return;
	const src = c.createBufferSource();
	src.buffer = noise$1;
	src.loop = true;
	src.playbackRate.value = .92 + Math.random() * .16;
	const f = c.createBiquadFilter();
	f.type = type;
	f.frequency.value = cutoff;
	f.Q.value = type === "bandpass" ? .85 : .6;
	const g = envGain(c, sfx, .004, duration * .22, duration * .72, peak);
	src.connect(f);
	f.connect(g);
	src.start();
	src.stop(c.currentTime + duration);
}
function playTone(freq, duration, type, peak, glide = .45) {
	const c = ac();
	if (!c || !sfx || !unlocked) return;
	const o = c.createOscillator();
	o.type = type;
	o.frequency.setValueAtTime(freq, c.currentTime);
	o.frequency.exponentialRampToValueAtTime(Math.max(28, freq * glide), c.currentTime + duration);
	const g = envGain(c, sfx, .005, duration * .18, duration * .78, peak);
	o.connect(g);
	o.start();
	o.stop(c.currentTime + duration + .03);
}
function playNote(freq, duration, peak, type = "sine") {
	const c = ac();
	if (!c || !sfx || !unlocked) return;
	const o = c.createOscillator();
	o.type = type;
	o.frequency.value = freq;
	const g = envGain(c, sfx, .008, duration * .25, duration * .7, peak);
	o.connect(g);
	o.start();
	o.stop(c.currentTime + duration + .02);
}
function cheer(peak = .22) {
	playNoise(.35, 1400, peak, "bandpass");
	playNoise(.28, 700, peak * .7, "lowpass");
}
function sfxPunch() {
	const rate = .9 + Math.random() * .2;
	playNoise(.055, 1900 * rate, .42);
	playNoise(.08, 420 * rate, .28, "lowpass");
	playTone(72 * rate, .16, "sine", .62, .38);
	playTone(210 * rate, .05, "square", .07, .5);
	playTone(1400 * rate, .03, "triangle", .05, .2);
}
function sfxHeavy() {
	const rate = .94 + Math.random() * .1;
	playNoise(.14, 900 * rate, .55, "lowpass");
	playNoise(.1, 1600 * rate, .35);
	playTone(52 * rate, .28, "sine", .72, .32);
	playTone(96 * rate, .18, "triangle", .22, .4);
	playTone(340 * rate, .08, "square", .08, .45);
	cheer(.18);
}
function sfxSpecial() {
	playNoise(.22, 500, .45, "lowpass");
	playNoise(.16, 2200, .32);
	playTone(64, .34, "sawtooth", .28, .55);
	playTone(160, .26, "square", .1, .5);
	playTone(480, .2, "triangle", .14, .7);
	playTone(720, .12, "sine", .08, .8);
	cheer(.24);
}
function sfxKo() {
	playTone(48, .9, "sine", .78, .28);
	playTone(72, .7, "triangle", .28, .35);
	playNoise(.7, 380, .48, "lowpass");
	playNoise(.45, 1100, .22);
	playTone(196, .35, "sine", .16, .5);
	setTimeout(() => cheer(.32), 80);
}
function sfxGift() {
	playNote(880, .12, .16);
	playNote(1320, .14, .12, "triangle");
	playNote(1760, .1, .08);
}
function sfxBuff() {
	playNote(523, .2, .16);
	playNote(659, .24, .13);
	playNote(784, .28, .1, "triangle");
}
function sfxRose() {
	playNote(698, .14, .14);
	playNote(880, .16, .12, "triangle");
	playNoise(.12, 2400, .08);
}
function sfxGalaxy() {
	playTone(40, .8, "sine", .4, 1.4);
	playTone(80, .7, "sawtooth", .12, 1.6);
	playNote(523, .4, .1);
	playNote(784, .5, .08, "triangle");
	playNoise(.6, 600, .28, "lowpass");
	cheer(.28);
}
function sfxCombo(hits) {
	const n = Math.min(8, hits);
	playNote(440 + n * 80, .1, .12);
	playNote(660 + n * 90, .12, .1, "triangle");
	sfxPunch();
}
function sfxByVisual(visual, action) {
	if (visual === "galaxy") {
		sfxGalaxy();
		return;
	}
	if (visual === "rose" || visual === "white-rose") {
		sfxRose();
		return;
	}
	if (action === "buff") {
		sfxBuff();
		return;
	}
	if (action === "special" || action === "spectacle") {
		sfxSpecial();
		return;
	}
	if (action === "combo") {
		sfxCombo(3);
		return;
	}
	sfxGift();
}
function startCrowd() {
	const c = ac();
	if (!c || !crowd || !noise$1 || crowdSrc) return;
	const src = c.createBufferSource();
	src.buffer = noise$1;
	src.loop = true;
	const f = c.createBiquadFilter();
	f.type = "lowpass";
	f.frequency.value = 980;
	const g = c.createGain();
	g.gain.value = .1;
	src.connect(f);
	f.connect(g);
	g.connect(crowd);
	src.start();
	crowdSrc = src;
	const pulse = () => {
		if (!c || !g) return;
		const target = .07 + Math.random() * .08;
		g.gain.setTargetAtTime(target, c.currentTime, .45);
		window.setTimeout(pulse, 700 + Math.random() * 900);
	};
	pulse();
}
function resumeAudioIfNeeded() {
	if (!unlocked || !ctx) return;
	if (ctx.state === "suspended") ctx.resume();
}
/** Assina o SSE do servidor para o overlay OBS receber gifts/config/reset. */
function subscribeLive(onEvent) {
	const es = new EventSource("/api/live/events");
	es.onmessage = (msg) => {
		try {
			onEvent(JSON.parse(msg.data));
		} catch {}
	};
	return () => es.close();
}
async function postLive(action, body) {
	const res = await fetch(`/api/live/${action}`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: body == null ? void 0 : JSON.stringify(body)
	});
	const json = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(json.error || `Falha em ${action}`);
	return json;
}
var ATTACK_DUR = .42;
var SPECIAL_DUR = .62;
var HURT_DUR = .48;
var seq = 1;
var particleSeq = 1;
var floaterSeq = 1;
function freshFighter() {
	return {
		hp: 0,
		energy: 0,
		anim: "idle",
		animAge: 0,
		flash: 0,
		lunge: 0,
		squash: 1,
		buffUntil: 0,
		buffMult: 1,
		glow: 0
	};
}
function createFight(config) {
	const left = freshFighter();
	const right = freshFighter();
	left.hp = config.maxHp;
	right.hp = config.maxHp;
	return {
		left,
		right,
		round: 1,
		hits: 0,
		ko: null,
		koAge: 0,
		resetIn: null,
		queue: [],
		active: null,
		hitstop: 0,
		trauma: 0,
		screenFlash: 0,
		particles: [],
		floaters: [],
		callout: null,
		reactions: [],
		feed: [],
		chats: [],
		lastAutoSide: "right",
		chatBias: null,
		combo: 0,
		comboAge: 0,
		spectacle: 0
	};
}
function resetRound(state, config, nextRound) {
	const left = freshFighter();
	const right = freshFighter();
	left.hp = config.maxHp;
	right.hp = config.maxHp;
	return {
		...state,
		left,
		right,
		round: nextRound ? state.round + 1 : state.round,
		ko: null,
		koAge: 0,
		resetIn: null,
		queue: [],
		active: null,
		hitstop: 0,
		trauma: 0,
		screenFlash: 0,
		particles: [],
		floaters: [],
		callout: null,
		reactions: [],
		combo: 0,
		comboAge: 0,
		spectacle: 0
	};
}
function other(side) {
	return side === "left" ? "right" : "left";
}
function resolveSide(state, mode, hint) {
	if (mode === "left" || mode === "right") return mode;
	const auto = state.chatBias ?? (state.lastAutoSide === "left" ? "right" : "left");
	if (mode === "opposite") return other(hint ?? auto);
	return auto;
}
function enqueueGift(state, config, gift) {
	const mapping = findGiftMapping(config.gifts, gift.giftName, gift.giftId);
	const diamonds = gift.diamonds ?? mapping?.diamonds ?? 1;
	const action = mapping?.action ?? "punch";
	const hits = mapping?.hits ?? 1;
	let damage = mapping?.damage ?? Math.min(120, Math.max(5, Math.round(diamonds * 2)));
	if (!mapping) damage = Math.min(120, Math.max(5, Math.round(diamonds * 2)));
	const visual = giftVisual(mapping?.id ?? gift.giftName);
	const attacker = resolveSide(state, mapping?.side ?? "auto");
	const id = `g${seq++}`;
	const next = {
		id,
		kind: action,
		attacker,
		damage,
		hitsLeft: action === "combo" ? hits : 1,
		sender: gift.sender || "Anônimo",
		giftName: gift.giftName || "Presente",
		diamonds
	};
	const maxAge = action === "spectacle" ? 2.6 : action === "special" || action === "combo" ? 2.1 : 1.55;
	const reaction = {
		id: `r${seq++}`,
		visual,
		giftName: next.giftName,
		sender: next.sender,
		action,
		side: attacker,
		diamonds,
		age: 0,
		maxAge
	};
	const feed = [{
		id,
		at: Date.now(),
		sender: next.sender,
		giftName: next.giftName,
		actionLabel: actionLabel(action),
		side: attacker,
		damage,
		visual
	}, ...state.feed].slice(0, 24);
	return {
		...state,
		lastAutoSide: attacker,
		queue: [...state.queue, next],
		feed,
		callout: {
			sender: next.sender,
			giftName: next.giftName,
			visual,
			age: 0
		},
		reactions: [reaction, ...state.reactions].slice(0, 8)
	};
}
var LEFT_WORDS = [
	"lula",
	"luiz",
	"13",
	"pt",
	"esquerda"
];
var RIGHT_WORDS = [
	"flavio",
	"flávio",
	"bolsonaro",
	"22",
	"pl",
	"direita"
];
function applyChat(state, chat) {
	const text = chat.comment.toLowerCase();
	let bias = state.chatBias;
	if (LEFT_WORDS.some((w) => text.includes(w))) bias = "left";
	if (RIGHT_WORDS.some((w) => text.includes(w))) bias = "right";
	const item = {
		id: `c${seq++}`,
		at: Date.now(),
		sender: chat.sender || "chat",
		comment: chat.comment.slice(0, 140)
	};
	return {
		...state,
		chatBias: bias,
		chats: [item, ...state.chats].slice(0, 12)
	};
}
function fighter(state, side) {
	return side === "left" ? state.left : state.right;
}
function setFighter(state, side, f) {
	return side === "left" ? {
		...state,
		left: f
	} : {
		...state,
		right: f
	};
}
function spawnBurst(state, side, amount, color) {
	const x = side === "left" ? 28 : 72;
	const y = 68;
	const extra = [];
	for (let i = 0; i < amount; i++) {
		const a = Math.random() * Math.PI * 2;
		const s = 40 + Math.random() * 180;
		extra.push({
			id: particleSeq++,
			x: x + (Math.random() * 6 - 3),
			y: y + (Math.random() * 8 - 4),
			vx: Math.cos(a) * s,
			vy: Math.sin(a) * s - 40,
			life: .35 + Math.random() * .4,
			maxLife: .7,
			size: 3 + Math.random() * 5,
			color
		});
	}
	return [...state.particles, ...extra].slice(-110);
}
function beginHit(state, config, action) {
	const atkSide = action.attacker;
	const defSide = other(atkSide);
	let atk = { ...fighter(state, atkSide) };
	let def = { ...fighter(state, defSide) };
	const special = action.kind === "special" || action.kind === "spectacle" || atk.energy >= config.maxEnergy;
	const durationKind = special ? "special" : "attack";
	if (action.kind === "buff") {
		atk.buffUntil = 8;
		atk.buffMult = 1.65;
		atk.glow = 1;
		atk.energy = Math.min(config.maxEnergy, atk.energy + 18);
		return {
			...setFighter(setFighter(state, atkSide, atk), defSide, def),
			active: {
				...action,
				hitsLeft: 0
			},
			floaters: [...state.floaters, {
				id: floaterSeq++,
				x: atkSide === "left" ? 26 : 74,
				y: 48,
				text: "DANO +",
				life: 1.1,
				maxLife: 1.1,
				side: atkSide
			}].slice(-12)
		};
	}
	atk.anim = durationKind;
	atk.animAge = 0;
	atk.lunge = 0;
	if (special) {
		atk.energy = 0;
		atk.glow = 1;
	} else atk.energy = Math.min(config.maxEnergy, atk.energy + Math.min(28, 6 + action.diamonds * .4));
	return {
		...setFighter(setFighter(state, atkSide, atk), defSide, def),
		active: action
	};
}
function connectHit(state, config, action) {
	if (state.ko) return state;
	const atkSide = action.attacker;
	const defSide = other(atkSide);
	let atk = { ...fighter(state, atkSide) };
	let def = { ...fighter(state, defSide) };
	const special = action.kind === "special" || action.kind === "spectacle" || atk.anim === "special";
	const buff = atk.buffUntil > 0 ? atk.buffMult : 1;
	let dmg = Math.round(action.damage * buff * (special ? 1.35 : 1));
	if (action.kind === "spectacle") dmg = Math.round(dmg * 1.15);
	def.hp = Math.max(0, def.hp - dmg);
	def.anim = def.hp <= 0 ? "ko" : "hurt";
	def.animAge = 0;
	def.flash = 1;
	def.squash = .86;
	def.lunge = -1;
	atk.lunge = 1;
	atk.squash = 1.08;
	const color = atkSide === "left" ? "lula" : "flavio";
	const particles = spawnBurst(state, defSide, special || action.kind === "spectacle" ? 32 : 16, action.kind === "spectacle" ? "spark" : color);
	const ko = def.hp <= 0 ? defSide : null;
	return {
		...setFighter(setFighter(state, atkSide, atk), defSide, def),
		hits: state.hits + 1,
		combo: state.combo + 1,
		comboAge: 0,
		trauma: Math.min(1, state.trauma + (special ? .55 : action.kind === "spectacle" ? .8 : .28)),
		screenFlash: action.kind === "spectacle" ? .7 : special ? .45 : .22,
		hitstop: special ? .09 : .05,
		particles,
		spectacle: action.kind === "spectacle" ? 1 : state.spectacle,
		ko,
		koAge: 0,
		resetIn: ko ? config.autoResetSec : state.resetIn,
		floaters: [...state.floaters, {
			id: floaterSeq++,
			x: defSide === "left" ? 26 : 74,
			y: 46,
			text: `-${dmg}`,
			life: .9,
			maxLife: .9,
			side: defSide
		}].slice(-12)
	};
}
function stepFight(state, config, dt) {
	let s = state;
	const cap = Math.min(dt, .1);
	if (s.resetIn != null && s.ko) {
		const resetIn = s.resetIn - cap;
		if (resetIn <= 0) return resetRound(s, config, true);
		s = {
			...s,
			resetIn,
			koAge: s.koAge + cap
		};
	}
	let sim = cap;
	if (s.hitstop > 0) {
		const rest = s.hitstop - cap;
		s = {
			...s,
			hitstop: Math.max(0, rest)
		};
		sim = rest < 0 ? -rest : 0;
	}
	if (sim <= 0) return present(s, cap);
	if (!s.active && s.queue.length > 0 && !s.ko) {
		const [next, ...rest] = s.queue;
		s = beginHit({
			...s,
			queue: rest
		}, config, next);
	}
	const action = s.active;
	if (action && action.kind === "buff") s = {
		...s,
		active: null
	};
	else if (action && !s.ko) {
		const atk = fighter(s, action.attacker);
		const dur = atk.anim === "special" ? SPECIAL_DUR : ATTACK_DUR;
		const age = atk.animAge;
		if (age < dur * .42 && age + sim >= dur * .42) s = connectHit(s, config, action);
		if (age + sim >= dur) {
			const leftoverHits = action.hitsLeft - 1;
			let atk2 = { ...fighter(s, action.attacker) };
			if (atk2.anim !== "ko") {
				atk2.anim = "idle";
				atk2.animAge = 0;
			}
			s = setFighter(s, action.attacker, atk2);
			if (leftoverHits > 0 && !s.ko) s = {
				...s,
				active: null,
				queue: [{
					...action,
					id: `g${seq++}`,
					hitsLeft: leftoverHits
				}, ...s.queue]
			};
			else s = {
				...s,
				active: null
			};
		}
	}
	s = tickFighter(s, "left", sim);
	s = tickFighter(s, "right", sim);
	return present(s, sim);
}
function tickFighter(state, side, dt) {
	const f = { ...fighter(state, side) };
	f.animAge += dt;
	f.flash = Math.max(0, f.flash - dt * 4);
	f.glow = Math.max(0, f.glow - dt * .7);
	f.lunge += (0 - f.lunge) * (1 - Math.exp(-10 * dt));
	f.squash += (1 - f.squash) * (1 - Math.exp(-12 * dt));
	if (f.buffUntil > 0) f.buffUntil = Math.max(0, f.buffUntil - dt);
	if (f.anim === "hurt" && f.animAge > HURT_DUR && f.hp > 0) {
		f.anim = "idle";
		f.animAge = 0;
	}
	return setFighter(state, side, f);
}
function present(state, dt) {
	const trauma = Math.max(0, state.trauma - dt * 1.8);
	const screenFlash = Math.max(0, state.screenFlash - dt * 2.4);
	const spectacle = Math.max(0, state.spectacle - dt * .55);
	const comboAge = state.comboAge + dt;
	const combo = comboAge > 2.2 ? 0 : state.combo;
	const particles = state.particles.map((p) => ({
		...p,
		life: p.life - dt,
		x: p.x + p.vx * dt / 8,
		y: p.y + p.vy * dt / 8,
		vy: p.vy + 180 * dt
	})).filter((p) => p.life > 0);
	const floaters = state.floaters.map((f) => ({
		...f,
		life: f.life - dt,
		y: f.y - dt * 18
	})).filter((f) => f.life > 0);
	const callout = state.callout == null ? null : state.callout.age + dt > 1.6 ? null : {
		...state.callout,
		age: state.callout.age + dt
	};
	const reactions = state.reactions.map((r) => ({
		...r,
		age: r.age + dt
	})).filter((r) => r.age < r.maxAge);
	return {
		...state,
		trauma,
		screenFlash,
		spectacle,
		combo: comboAge > 2.2 ? 0 : combo,
		comboAge: comboAge > 2.2 ? 0 : comboAge,
		particles,
		floaters,
		callout,
		reactions
	};
}
function spriteFrame(anim, age) {
	if (anim === "ko") return {
		sheet: "hurt",
		frame: Math.min(4, 1 + Math.floor(Math.min(age, .45) / .12))
	};
	if (anim === "hurt") return {
		sheet: "hurt",
		frame: Math.min(4, 1 + Math.floor(age / HURT_DUR * 4))
	};
	if (anim === "attack" || anim === "special") return {
		sheet: "attack",
		frame: Math.min(4, 1 + Math.floor(age / (anim === "special" ? SPECIAL_DUR : ATTACK_DUR) * 4))
	};
	return {
		sheet: "idle",
		frame: 1
	};
}
var STORAGE_KEY = "combate-live-v2";
function loadConfig() {
	const base = defaultConfig();
	if (typeof window === "undefined") return base;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return base;
		const parsed = JSON.parse(raw);
		return {
			...base,
			...parsed,
			championId: parsed.championId ?? "",
			gifts: parsed.gifts?.length ? parsed.gifts : base.gifts
		};
	} catch {
		return base;
	}
}
function saveConfig(config) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {}
}
var useCombat = create((set, get) => ({
	config: defaultConfig(),
	fight: createFight(defaultConfig()),
	live: {
		status: "disconnected",
		username: ""
	},
	hydrated: false,
	hydrate: () => {
		if (get().hydrated) return;
		const config = loadConfig();
		set({
			config,
			fight: createFight(config),
			hydrated: true,
			live: {
				status: "disconnected",
				username: config.tiktokUser
			}
		});
	},
	patchConfig: (partial) => {
		const config = {
			...get().config,
			...partial
		};
		saveConfig(config);
		set({ config });
	},
	setGifts: (gifts) => {
		const config = {
			...get().config,
			gifts
		};
		saveConfig(config);
		set({ config });
	},
	pickChampion: (id) => {
		const champ = CHARACTERS.some((c) => c.id === id) ? id : CHARACTERS[0].id;
		const opp = otherCharacter(champ);
		const config = {
			...get().config,
			championId: champ,
			leftId: champ,
			rightId: opp.id
		};
		saveConfig(config);
		set({
			config,
			fight: createFight(config)
		});
	},
	applyGift: (gift) => {
		set({ fight: enqueueGift(get().fight, get().config, gift) });
	},
	applyChat: (chat) => {
		set({ fight: applyChat(get().fight, chat) });
	},
	resetFight: (newRound = false) => {
		set({ fight: resetRound(get().fight, get().config, newRound) });
	},
	setLive: (live) => {
		set({ live: {
			...get().live,
			...live
		} });
	},
	tick: (dt) => {
		set({ fight: stepFight(get().fight, get().config, dt) });
	}
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var svg = "h-5 w-5";
function GiftIcon({ id, className }) {
	const cls = cn(svg, className);
	switch (id) {
		case "rose":
		case "white-rose": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 21c0-4 4-6 4-10a4 4 0 1 0-8 0c0 4 4 6 4 10Z" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 11c2-2 3.5-2.5 5-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 21V11" })
			]
		});
		case "donut": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "8",
					cy: "9",
					r: "0.7",
					fill: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "15",
					cy: "10",
					r: "0.7",
					fill: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "10",
					cy: "16",
					r: "0.7",
					fill: "currentColor"
				})
			]
		});
		case "capybara": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "4",
					y: "9",
					width: "16",
					height: "9",
					rx: "4.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "13",
					r: "0.8",
					fill: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "14",
					cy: "13",
					r: "0.8",
					fill: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 9V7m10 2V7" })
			]
		});
		case "dino": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 18h3l1-4 4 1 2-5 5 1-2 4 3 3h-4l-2-2-6 1-1 3H5Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16.5",
				cy: "8.5",
				r: "0.6",
				fill: "currentColor"
			})]
		});
		case "perfume": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "7",
				y: "9",
				width: "10",
				height: "11",
				rx: "2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 9V6h4v3M12 4v2" })]
		});
		case "sunglasses": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 12h3l2 4h4l2-4h7" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "5",
					y: "12",
					width: "6",
					height: "5",
					rx: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "13",
					y: "12",
					width: "6",
					height: "5",
					rx: "2"
				})
			]
		});
		case "galaxy": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "3"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 3v2m0 14v2M3 12h2m14 0h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" })]
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: cls,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "8",
				width: "14",
				height: "11",
				rx: "2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8V5m-3 3c0-2 6-2 6 0" })]
		});
	}
}
function GiftFxLayer() {
	const reactions = useCombat((s) => s.fight.reactions);
	if (!reactions.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "gift-fx-layer",
		children: reactions.map((r) => {
			const t = r.age / r.maxAge;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("gift-fx", `gift-fx-${r.visual}`, r.side),
				style: { "--t": t },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "gift-fx-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftIcon, {
							id: r.visual,
							className: "h-9 w-9"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.sender }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["enviou ", r.giftName] })] })]
					}),
					r.visual === "rose" || r.visual === "white-rose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetalRain, { white: r.visual === "white-rose" }) : null,
					r.visual === "galaxy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gift-fx-cosmos" }) : null,
					r.visual === "donut" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gift-fx-orbit" }) : null,
					r.visual === "dino" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gift-fx-stomp" }) : null,
					r.visual === "perfume" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gift-fx-aura" }) : null,
					r.visual === "sunglasses" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gift-fx-flash" }) : null,
					r.visual === "capybara" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gift-fx-stamp" }) : null
				]
			}, r.id);
		})
	});
}
function PetalRain({ white }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "petal-rain",
		children: Array.from({ length: 10 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: `/sprites/fx/petal-${i % 4 + 1}.png`,
			alt: "",
			className: cn("petal", white && "is-white"),
			style: {
				left: `${8 + i * 9 % 84}%`,
				animationDelay: `${i % 5 * .12}s`,
				animationDuration: `${1.4 + i % 3 * .2}s`
			},
			crossOrigin: "anonymous"
		}, i))
	});
}
var BASE_W = 1080;
var BASE_H = 1920;
function OverlayStage({ transparent, interactive = false, className }) {
	const config = useCombat((s) => s.config);
	const fight = useCombat((s) => s.fight);
	const live = useCombat((s) => s.live);
	const tick = useCombat((s) => s.tick);
	const wrapRef = (0, import_react.useRef)(null);
	const [scale, setScale] = (0, import_react.useState)(.35);
	const last = (0, import_react.useRef)(0);
	const showArena = !(transparent ?? config.transparent);
	(0, import_react.useEffect)(() => {
		ALL_SPRITE_URLS.forEach((src) => {
			const img = new Image();
			img.src = src;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const fit = () => {
			const r = el.getBoundingClientRect();
			setScale(Math.min(r.width / BASE_W, r.height / BASE_H));
		};
		fit();
		const obs = new ResizeObserver(fit);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		last.current = performance.now();
		let raf = 0;
		const loop = (now) => {
			const dt = Math.min(.1, (now - last.current) / 1e3);
			last.current = now;
			tick(dt);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [tick]);
	const shakeAmt = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || !config.shakeEnabled ? 0 : fight.trauma * fight.trauma;
	const sx = (noise(fight.trauma * 12.1) - .5) * 22 * shakeAmt;
	const sy = (noise(fight.trauma * 9.4 + 20) - .5) * 16 * shakeAmt;
	const rot = (noise(fight.trauma * 7.2 + 40) - .5) * 1.4 * shakeAmt;
	const left = getCharacter(config.leftId);
	const right = getCharacter(config.rightId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: cn("relative h-full w-full overflow-hidden", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fight-stage absolute left-1/2 top-1/2 origin-center",
			style: {
				width: BASE_W,
				height: BASE_H,
				transform: `translate(-50%, -50%) scale(${scale}) translate(${sx}px, ${sy}px) rotate(${rot}deg)`
			},
			children: [
				showArena ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/arena/stage.jpg",
					alt: "",
					className: "absolute inset-0 h-full w-full object-cover",
					crossOrigin: "anonymous"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "stage-vignette" }),
				fight.spectacle > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "stage-galaxy",
					style: { opacity: fight.spectacle }
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FighterView, { side: "left" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FighterView, { side: "right" }),
				fight.particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("particle", `particle-${p.color}`),
					style: {
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: p.size * 2,
						height: p.size * 2,
						opacity: p.life / p.maxLife
					}
				}, p.id)),
				fight.floaters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("floater", f.side === "left" ? "text-lula" : "text-fg"),
					style: {
						left: `${f.x}%`,
						top: `${f.y}%`,
						opacity: f.life / f.maxLife
					},
					children: f.text
				}, f.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftFxLayer, {}),
				fight.callout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gift-callout",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gift-callout-user",
						children: fight.callout.sender
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "gift-callout-gift",
						children: ["enviou ", fight.callout.giftName]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftFeed, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatTicker, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hit-counter",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hit-counter-label",
						children: "Golpes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hit-counter-num tabular-nums",
						children: fight.hits
					})]
				}),
				fight.combo > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "combo-pop",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: fight.combo
					}), " HIT"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "live-chip",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("live-dot", live.status) }), live.status === "connected" ? `@${live.username}` : live.status === "connecting" || live.status === "reconnecting" ? live.status === "reconnecting" ? "Reconectando" : "Conectando" : "Simulador"]
				}),
				fight.ko ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KoBanner, {
					loser: fight.ko === "left" ? left.name : right.name,
					resetIn: fight.resetIn
				}) : null,
				fight.screenFlash > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "screen-flash",
					style: { opacity: fight.screenFlash * .55 }
				}) : null,
				interactive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0" }) : null
			]
		})
	});
}
function Hud() {
	const config = useCombat((s) => s.config);
	const fight = useCombat((s) => s.fight);
	const left = getCharacter(config.leftId);
	const right = getCharacter(config.rightId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpBlock, {
				side: "left",
				name: left.name,
				sub: left.subtitle,
				hp: fight.left.hp,
				max: config.maxHp,
				energy: fight.left.energy,
				maxEnergy: config.maxEnergy,
				portrait: left.portrait,
				buff: fight.left.buffUntil > 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vs-badge",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["ROUND ", fight.round] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpBlock, {
				side: "right",
				name: right.name,
				sub: right.subtitle,
				hp: fight.right.hp,
				max: config.maxHp,
				energy: fight.right.energy,
				maxEnergy: config.maxEnergy,
				portrait: right.portrait,
				buff: fight.right.buffUntil > 0
			})
		]
	});
}
function HpBlock({ side, name, sub, hp, max, energy, maxEnergy, portrait, buff }) {
	const pct = Math.max(0, hp / max * 100);
	const epct = Math.max(0, energy / maxEnergy * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("hp-block", side),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: portrait,
			alt: "",
			className: "hp-avatar",
			crossOrigin: "anonymous"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hp-meta",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hp-names",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: sub })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("hp-bar", side),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hp-fill",
						style: { width: `${pct}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("en-bar", buff && "is-buff"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "en-fill",
						style: { width: `${epct}%` }
					})
				})
			]
		})]
	});
}
function FighterView({ side }) {
	const config = useCombat((s) => s.config);
	const f = useCombat((s) => s.fight[side]);
	const char = getCharacter(side === "left" ? config.leftId : config.rightId);
	const { sheet, frame } = spriteFrame(f.anim, f.animAge);
	const src = spriteUrl(char.sprite, sheet, frame);
	const lungePx = f.lunge * 90;
	const impactSrc = `/sprites/fx/impact-${Math.min(4, 1 + Math.floor(f.flash * 4))}.png`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fighter", side, char.color, f.anim === "idle" && "is-idle", f.anim === "special" && "is-special", f.anim === "ko" && "is-ko", f.glow > .3 && "is-glow"),
		style: {
			transform: side === "left" ? `translateX(${lungePx}px) scale(${f.squash}, ${2 - f.squash})` : `scaleX(-1) translateX(${lungePx}px) scale(${f.squash}, ${2 - f.squash})`,
			filter: f.flash > .4 ? "brightness(2.15) contrast(1.05)" : void 0
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: char.name,
			draggable: false,
			crossOrigin: "anonymous"
		}), f.flash > .15 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: impactSrc,
			alt: "",
			className: "impact-fx",
			crossOrigin: "anonymous"
		}) : null]
	});
}
function GiftFeed() {
	const feed = useCombat((s) => s.fight.feed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "gift-feed",
		children: feed.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("gift-row", item.side),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gift-row-user",
					children: item.sender
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gift-row-gift",
					children: item.giftName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gift-row-dmg tabular-nums",
					children: item.actionLabel
				})
			]
		}, item.id))
	});
}
function ChatTicker() {
	const chats = useCombat((s) => s.fight.chats);
	if (!chats.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "chat-ticker",
		children: chats.slice(0, 3).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: c.sender }),
			" ",
			c.comment
		] }, c.id))
	});
}
function KoBanner({ loser, resetIn }) {
	const winnerSide = useCombat((s) => s.fight.ko === "left" ? "right" : "left");
	const config = useCombat((s) => s.config);
	const winner = getCharacter(winnerSide === "left" ? config.leftId : config.rightId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ko-banner",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ko-k",
				children: "K"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ko-o",
				children: "O"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				winner.name,
				" vence · ",
				loser,
				" nocauteado"
			] }),
			resetIn != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
				"Próximo round em ",
				Math.max(0, resetIn).toFixed(1),
				"s"
			] }) : null
		]
	});
}
function noise(t) {
	const x = Math.sin(t * 12.9898) * 43758.5453;
	return x - Math.floor(x);
}
function SfxDirector() {
	const hits = useCombat((s) => s.fight.hits);
	const ko = useCombat((s) => s.fight.ko);
	const combo = useCombat((s) => s.fight.combo);
	const reactionHead = useCombat((s) => s.fight.reactions[0]?.id ?? "");
	const sfxVolume = useCombat((s) => s.config.sfxVolume);
	const crowdVolume = useCombat((s) => s.config.crowdVolume);
	const prevHits = (0, import_react.useRef)(0);
	const prevKo = (0, import_react.useRef)(null);
	const prevReaction = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		setVolumes(sfxVolume, crowdVolume);
	}, [sfxVolume, crowdVolume]);
	(0, import_react.useEffect)(() => {
		const vis = () => resumeAudioIfNeeded();
		document.addEventListener("visibilitychange", vis);
		return () => document.removeEventListener("visibilitychange", vis);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hits > prevHits.current) {
			const last = useCombat.getState().fight.feed[0];
			const n = useCombat.getState().fight.combo;
			if (last?.actionLabel === "Espetáculo") sfxSpecial();
			else if (last?.actionLabel === "Especial") sfxHeavy();
			else if (n > 2) sfxCombo(n);
			else sfxPunch();
		}
		prevHits.current = hits;
	}, [hits]);
	(0, import_react.useEffect)(() => {
		if (ko && !prevKo.current) sfxKo();
		prevKo.current = ko;
	}, [ko]);
	(0, import_react.useEffect)(() => {
		if (reactionHead && reactionHead !== prevReaction.current) {
			const r = useCombat.getState().fight.reactions[0];
			if (r) sfxByVisual(r.visual, r.action);
		}
		prevReaction.current = reactionHead;
	}, [reactionHead, combo]);
	return null;
}
//#endregion
export { cn as a, unlockAudio as c, SfxDirector as i, useCombat as l, GiftIcon as n, postLive as o, OverlayStage as r, subscribeLive as s, CHARACTERS as t };
