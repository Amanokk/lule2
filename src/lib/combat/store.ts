import { create } from "zustand";
import { CHARACTERS, otherCharacter } from "./characters";
import { applyChat, createFight, enqueueGift, resetRound, stepFight } from "./engine";
import { defaultConfig } from "./gifts";
import type { AppConfig, FightState, IncomingChat, IncomingGift, LiveSnapshot } from "./types";

const STORAGE_KEY = "combate-live-v2";

function loadConfig(): AppConfig {
  const base = defaultConfig();
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      ...base,
      ...parsed,
      championId: parsed.championId ?? "",
      gifts: parsed.gifts?.length ? parsed.gifts : base.gifts,
    };
  } catch {
    return base;
  }
}

function saveConfig(config: AppConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* ignore quota */
  }
}

export interface CombatStore {
  config: AppConfig;
  fight: FightState;
  live: LiveSnapshot;
  hydrated: boolean;
  hydrate: () => void;
  patchConfig: (partial: Partial<AppConfig>) => void;
  setGifts: (gifts: AppConfig["gifts"]) => void;
  pickChampion: (id: string) => void;
  applyGift: (gift: IncomingGift) => void;
  applyChat: (chat: IncomingChat) => void;
  resetFight: (newRound?: boolean) => void;
  setLive: (live: Partial<LiveSnapshot>) => void;
  tick: (dt: number) => void;
}

export const useCombat = create<CombatStore>((set, get) => ({
  config: defaultConfig(),
  fight: createFight(defaultConfig()),
  live: { status: "disconnected", username: "" },
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const config = loadConfig();
    set({
      config,
      fight: createFight(config),
      hydrated: true,
      live: { status: "disconnected", username: config.tiktokUser },
    });
  },
  patchConfig: (partial) => {
    const config = { ...get().config, ...partial };
    saveConfig(config);
    set({ config });
  },
  setGifts: (gifts) => {
    const config = { ...get().config, gifts };
    saveConfig(config);
    set({ config });
  },
  pickChampion: (id) => {
    const champ = CHARACTERS.some((c) => c.id === id) ? id : CHARACTERS[0]!.id;
    const opp = otherCharacter(champ);
    const config = {
      ...get().config,
      championId: champ,
      leftId: champ,
      rightId: opp.id,
    };
    saveConfig(config);
    set({ config, fight: createFight(config) });
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
    set({ live: { ...get().live, ...live } });
  },
  tick: (dt) => {
    set({ fight: stepFight(get().fight, get().config, dt) });
  },
}));
