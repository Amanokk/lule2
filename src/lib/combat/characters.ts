import type { CharacterDef } from "./types";

export const CHARACTERS: CharacterDef[] = [
  {
    id: "lula",
    name: "Lula",
    subtitle: "O Estadista",
    sprite: "lula",
    color: "lula",
    portrait: "/portraits/lula.jpg",
  },
  {
    id: "flavio",
    name: "Flávio Bolsonaro",
    subtitle: "O Senador",
    sprite: "flavio",
    color: "flavio",
    portrait: "/portraits/flavio.jpg",
  },
];

export const CHARACTER_MAP: Record<string, CharacterDef> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
);

export function getCharacter(id: string): CharacterDef {
  return CHARACTER_MAP[id] ?? CHARACTERS[0]!;
}

export function otherCharacter(id: string): CharacterDef {
  return CHARACTERS.find((c) => c.id !== id) ?? CHARACTERS[1]!;
}

export const SPRITE_FRAMES = 4;

export function spriteUrl(sprite: string, anim: "idle" | "attack" | "hurt", frame: number) {
  const f = Math.min(SPRITE_FRAMES, Math.max(1, frame));
  return `/sprites/${sprite}/${anim}-${f}.png`;
}

export const ALL_SPRITE_URLS: string[] = CHARACTERS.flatMap((c) =>
  (["idle", "attack", "hurt"] as const).flatMap((anim) =>
    [1, 2, 3, 4].map((n) => spriteUrl(c.sprite, anim, n)),
  ),
)
  .concat(CHARACTERS.map((c) => c.portrait))
  .concat([1, 2, 3, 4].map((n) => `/sprites/fx/impact-${n}.png`))
  .concat([1, 2, 3, 4].map((n) => `/sprites/fx/petal-${n}.png`))
  .concat(["/arena/stage.jpg"]);
