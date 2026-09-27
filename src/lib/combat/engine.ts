import { actionLabel, findGiftMapping, giftVisual } from "./gifts";
import type {
  AppConfig,
  CombatAction,
  FightState,
  FighterRuntime,
  GiftReaction,
  IncomingChat,
  IncomingGift,
  Particle,
  Side,
} from "./types";

const ATTACK_DUR = 0.42;
const SPECIAL_DUR = 0.62;
const HURT_DUR = 0.48;
let seq = 1;
let particleSeq = 1;
let floaterSeq = 1;

function freshFighter(): FighterRuntime {
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
    glow: 0,
  };
}

export function createFight(config: AppConfig): FightState {
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
    spectacle: 0,
  };
}

export function resetRound(state: FightState, config: AppConfig, nextRound: boolean): FightState {
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
    spectacle: 0,
  };
}

function other(side: Side): Side {
  return side === "left" ? "right" : "left";
}

type GiftMappingSide = "auto" | "left" | "right" | "opposite";

function resolveSide(state: FightState, mode: GiftMappingSide, hint?: Side): Side {
  if (mode === "left" || mode === "right") return mode;
  const auto = state.chatBias ?? (state.lastAutoSide === "left" ? "right" : "left");
  if (mode === "opposite") return other(hint ?? auto);
  return auto;
}

export function enqueueGift(state: FightState, config: AppConfig, gift: IncomingGift): FightState {
  const mapping = findGiftMapping(config.gifts, gift.giftName, gift.giftId);
  const diamonds = gift.diamonds ?? mapping?.diamonds ?? 1;
  const action = mapping?.action ?? "punch";
  const hits = mapping?.hits ?? 1;
  let damage = mapping?.damage ?? Math.min(120, Math.max(5, Math.round(diamonds * 2)));
  if (!mapping) damage = Math.min(120, Math.max(5, Math.round(diamonds * 2)));
  const visual = giftVisual(mapping?.id ?? gift.giftName);

  const attacker = resolveSide(state, mapping?.side ?? "auto");
  const id = `g${seq++}`;
  const next: CombatAction = {
    id,
    kind: action,
    attacker,
    damage,
    hitsLeft: action === "combo" ? hits : 1,
    sender: gift.sender || "Anônimo",
    giftName: gift.giftName || "Presente",
    diamonds,
  };

  const maxAge = action === "spectacle" ? 2.6 : action === "special" || action === "combo" ? 2.1 : 1.55;
  const reaction: GiftReaction = {
    id: `r${seq++}`,
    visual,
    giftName: next.giftName,
    sender: next.sender,
    action,
    side: attacker,
    diamonds,
    age: 0,
    maxAge,
  };

  const feed = [
    {
      id,
      at: Date.now(),
      sender: next.sender,
      giftName: next.giftName,
      actionLabel: actionLabel(action),
      side: attacker,
      damage,
      visual,
    },
    ...state.feed,
  ].slice(0, 24);

  return {
    ...state,
    lastAutoSide: attacker,
    queue: [...state.queue, next],
    feed,
    callout: { sender: next.sender, giftName: next.giftName, visual, age: 0 },
    reactions: [reaction, ...state.reactions].slice(0, 8),
  };
}

const LEFT_WORDS = ["lula", "luiz", "13", "pt", "esquerda"];
const RIGHT_WORDS = ["flavio", "flávio", "bolsonaro", "22", "pl", "direita"];

export function applyChat(state: FightState, chat: IncomingChat): FightState {
  const text = chat.comment.toLowerCase();
  let bias = state.chatBias;
  if (LEFT_WORDS.some((w) => text.includes(w))) bias = "left";
  if (RIGHT_WORDS.some((w) => text.includes(w))) bias = "right";
  const item = {
    id: `c${seq++}`,
    at: Date.now(),
    sender: chat.sender || "chat",
    comment: chat.comment.slice(0, 140),
  };
  return {
    ...state,
    chatBias: bias,
    chats: [item, ...state.chats].slice(0, 12),
  };
}

function fighter(state: FightState, side: Side): FighterRuntime {
  return side === "left" ? state.left : state.right;
}

function setFighter(state: FightState, side: Side, f: FighterRuntime): FightState {
  return side === "left" ? { ...state, left: f } : { ...state, right: f };
}

function spawnBurst(state: FightState, side: Side, amount: number, color: Particle["color"]): Particle[] {
  const x = side === "left" ? 28 : 72;
  const y = 68;
  const extra: Particle[] = [];
  for (let i = 0; i < amount; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 40 + Math.random() * 180;
    extra.push({
      id: particleSeq++,
      x: x + (Math.random() * 6 - 3),
      y: y + (Math.random() * 8 - 4),
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 40,
      life: 0.35 + Math.random() * 0.4,
      maxLife: 0.7,
      size: 3 + Math.random() * 5,
      color,
    });
  }
  return [...state.particles, ...extra].slice(-110);
}

function beginHit(state: FightState, config: AppConfig, action: CombatAction): FightState {
  const atkSide = action.attacker;
  const defSide = other(atkSide);
  let atk = { ...fighter(state, atkSide) };
  let def = { ...fighter(state, defSide) };
  const special = action.kind === "special" || action.kind === "spectacle" || atk.energy >= config.maxEnergy;
  const durationKind: FighterRuntime["anim"] = special ? "special" : "attack";

  if (action.kind === "buff") {
    atk.buffUntil = 8;
    atk.buffMult = 1.65;
    atk.glow = 1;
    atk.energy = Math.min(config.maxEnergy, atk.energy + 18);
    return {
      ...setFighter(setFighter(state, atkSide, atk), defSide, def),
      active: { ...action, hitsLeft: 0 },
      floaters: [
        ...state.floaters,
        {
          id: floaterSeq++,
          x: atkSide === "left" ? 26 : 74,
          y: 48,
          text: "DANO +",
          life: 1.1,
          maxLife: 1.1,
          side: atkSide,
        },
      ].slice(-12),
    };
  }

  atk.anim = durationKind;
  atk.animAge = 0;
  atk.lunge = 0;
  if (special) {
    atk.energy = 0;
    atk.glow = 1;
  } else {
    atk.energy = Math.min(config.maxEnergy, atk.energy + Math.min(28, 6 + action.diamonds * 0.4));
  }

  return {
    ...setFighter(setFighter(state, atkSide, atk), defSide, def),
    active: action,
  };
}

function connectHit(state: FightState, config: AppConfig, action: CombatAction): FightState {
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
  def.squash = 0.86;
  def.lunge = -1;
  atk.lunge = 1;
  atk.squash = 1.08;

  const color: Particle["color"] = atkSide === "left" ? "lula" : "flavio";
  const particles = spawnBurst(
    state,
    defSide,
    special || action.kind === "spectacle" ? 32 : 16,
    action.kind === "spectacle" ? "spark" : color,
  );

  const ko = def.hp <= 0 ? defSide : null;
  return {
    ...setFighter(setFighter(state, atkSide, atk), defSide, def),
    hits: state.hits + 1,
    combo: state.combo + 1,
    comboAge: 0,
    trauma: Math.min(1, state.trauma + (special ? 0.55 : action.kind === "spectacle" ? 0.8 : 0.28)),
    screenFlash: action.kind === "spectacle" ? 0.7 : special ? 0.45 : 0.22,
    hitstop: special ? 0.09 : 0.05,
    particles,
    spectacle: action.kind === "spectacle" ? 1 : state.spectacle,
    ko,
    koAge: 0,
    resetIn: ko ? config.autoResetSec : state.resetIn,
    floaters: [
      ...state.floaters,
      {
        id: floaterSeq++,
        x: defSide === "left" ? 26 : 74,
        y: 46,
        text: `-${dmg}`,
        life: 0.9,
        maxLife: 0.9,
        side: defSide,
      },
    ].slice(-12),
  };
}

export function stepFight(state: FightState, config: AppConfig, dt: number): FightState {
  let s = state;
  const cap = Math.min(dt, 0.1);

  if (s.resetIn != null && s.ko) {
    const resetIn = s.resetIn - cap;
    if (resetIn <= 0) return resetRound(s, config, true);
    s = { ...s, resetIn, koAge: s.koAge + cap };
  }

  let sim = cap;
  if (s.hitstop > 0) {
    const rest = s.hitstop - cap;
    s = { ...s, hitstop: Math.max(0, rest) };
    sim = rest < 0 ? -rest : 0;
  }
  if (sim <= 0) {
    return present(s, cap);
  }

  if (!s.active && s.queue.length > 0 && !s.ko) {
    const [next, ...rest] = s.queue;
    s = beginHit({ ...s, queue: rest }, config, next!);
  }

  const action = s.active;
  if (action && action.kind === "buff") {
    s = { ...s, active: null };
  } else if (action && !s.ko) {
    const atk = fighter(s, action.attacker);
    const dur = atk.anim === "special" ? SPECIAL_DUR : ATTACK_DUR;
    const age = atk.animAge;
    const struck = age < dur * 0.42 && age + sim >= dur * 0.42;
    if (struck) {
      s = connectHit(s, config, action);
    }
    if (age + sim >= dur) {
      const leftoverHits = action.hitsLeft - 1;
      let atk2 = { ...fighter(s, action.attacker) };
      if (atk2.anim !== "ko") {
        atk2.anim = "idle";
        atk2.animAge = 0;
      }
      s = setFighter(s, action.attacker, atk2);
      if (leftoverHits > 0 && !s.ko) {
        s = {
          ...s,
          active: null,
          queue: [{ ...action, id: `g${seq++}`, hitsLeft: leftoverHits }, ...s.queue],
        };
      } else {
        s = { ...s, active: null };
      }
    }
  }

  s = tickFighter(s, "left", sim);
  s = tickFighter(s, "right", sim);
  return present(s, sim);
}

function tickFighter(state: FightState, side: Side, dt: number): FightState {
  const f = { ...fighter(state, side) };
  f.animAge += dt;
  f.flash = Math.max(0, f.flash - dt * 4);
  f.glow = Math.max(0, f.glow - dt * 0.7);
  f.lunge += (0 - f.lunge) * (1 - Math.exp(-10 * dt));
  f.squash += (1 - f.squash) * (1 - Math.exp(-12 * dt));
  if (f.buffUntil > 0) f.buffUntil = Math.max(0, f.buffUntil - dt);
  if (f.anim === "hurt" && f.animAge > HURT_DUR && f.hp > 0) {
    f.anim = "idle";
    f.animAge = 0;
  }
  return setFighter(state, side, f);
}

function present(state: FightState, dt: number): FightState {
  const trauma = Math.max(0, state.trauma - dt * 1.8);
  const screenFlash = Math.max(0, state.screenFlash - dt * 2.4);
  const spectacle = Math.max(0, state.spectacle - dt * 0.55);
  const comboAge = state.comboAge + dt;
  const combo = comboAge > 2.2 ? 0 : state.combo;
  const particles = state.particles
    .map((p) => ({
      ...p,
      life: p.life - dt,
      x: p.x + (p.vx * dt) / 8,
      y: p.y + (p.vy * dt) / 8,
      vy: p.vy + 180 * dt,
    }))
    .filter((p) => p.life > 0);
  const floaters = state.floaters
    .map((f) => ({ ...f, life: f.life - dt, y: f.y - dt * 18 }))
    .filter((f) => f.life > 0);
  const callout =
    state.callout == null
      ? null
      : state.callout.age + dt > 1.6
        ? null
        : { ...state.callout, age: state.callout.age + dt };
  const reactions = state.reactions
    .map((r) => ({ ...r, age: r.age + dt }))
    .filter((r) => r.age < r.maxAge);
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
    reactions,
  };
}

export function spriteFrame(
  anim: FighterRuntime["anim"],
  age: number,
): { sheet: "idle" | "attack" | "hurt"; frame: number } {
  if (anim === "ko") {
    const f = Math.min(4, 1 + Math.floor(Math.min(age, 0.45) / 0.12));
    return { sheet: "hurt", frame: f };
  }
  if (anim === "hurt") {
    const f = Math.min(4, 1 + Math.floor((age / HURT_DUR) * 4));
    return { sheet: "hurt", frame: f };
  }
  if (anim === "attack" || anim === "special") {
    const dur = anim === "special" ? SPECIAL_DUR : ATTACK_DUR;
    const f = Math.min(4, 1 + Math.floor((age / dur) * 4));
    return { sheet: "attack", frame: f };
  }
  return { sheet: "idle", frame: 1 };
}
