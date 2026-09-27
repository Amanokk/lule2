import { Link } from "@tanstack/react-router";
import { Copy, ExternalLink, RotateCcw, Unplug, Volume2, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CHARACTERS } from "@/lib/combat/characters";
import { DEFAULT_GIFT_MAP, actionLabel, giftLabel } from "@/lib/combat/gifts";
import { unlockAudio } from "@/lib/combat/audio";
import { postLive, subscribeLive } from "@/lib/combat/live-client";
import { useCombat } from "@/lib/combat/store";
import type { GiftAction, GiftMapping, SideMode } from "@/lib/combat/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharacterSelect } from "./character-select";
import { GiftIcon } from "./gift-icons";
import { OverlayStage } from "./overlay-stage";
import { SfxDirector } from "./sfx-director";

export function ControlPanel() {
  const hydrate = useCombat((s) => s.hydrate);
  const applyGift = useCombat((s) => s.applyGift);
  const applyChat = useCombat((s) => s.applyChat);
  const resetFight = useCombat((s) => s.resetFight);
  const setLive = useCombat((s) => s.setLive);
  const patchConfig = useCombat((s) => s.patchConfig);
  const live = useCombat((s) => s.live);
  const hydrated = useCombat((s) => s.hydrated);
  const championId = useCombat((s) => s.config.championId);

  const fire = (gift: { id: string; aliases: string[]; diamonds: number }, sender = "Simulação") => {
    unlockAudio();
    const payload = {
      sender,
      giftName: gift.aliases[0] ?? gift.id,
      giftId: gift.id,
      diamonds: gift.diamonds,
      source: "local" as const,
    };
    applyGift(payload);
    void postLive("gift", payload).catch(() => undefined);
  };

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!championId) return;
    const cfg = useCombat.getState().config;
    void postLive("config", cfg).catch(() => undefined);
  }, [championId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < DEFAULT_GIFT_MAP.length) {
        const g = DEFAULT_GIFT_MAP[idx];
        if (g) fire(g);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyGift]);

  useEffect(() => {
    return subscribeLive((ev) => {
      if (ev.type === "status") setLive(ev.live);
      if (ev.type === "hello") setLive(ev.live);
      if (ev.type === "chat") applyChat(ev.chat);
      if (ev.type === "reset") resetFight(false);
      if (ev.type === "config") patchConfig(ev.config);
      if (ev.type === "gift" && ev.gift.source !== "local") applyGift(ev.gift);
    });
  }, [setLive, applyChat, resetFight, patchConfig, applyGift]);

  return (
    <div className="panel-shell">
      <SfxDirector />
      {hydrated && !championId ? <CharacterSelect /> : null}

      <header className="panel-header">
        <div>
          <p className="panel-kicker">Overlay TikTok LIVE · 9:16</p>
          <h1 className="panel-title">Combate LIVE</h1>
        </div>
        <div className="panel-header-actions">
          <LiveBadge />
          <Button asChild variant="secondary" size="sm">
            <Link to="/overlay">
              Palco
              <ExternalLink />
            </Link>
          </Button>
        </div>
      </header>

      <div className="live-layout">
        <div className="phone-frame">
          <OverlayStage />
        </div>

        <div className="live-side">
          <Card className="panel-sim">
            <CardTitle>Simular presentes</CardTitle>
            <CardDesc>
              Na live, cada gift vira golpe, som e reação. Teste aqui antes de conectar.
            </CardDesc>
            <div className="sim-grid">
              {DEFAULT_GIFT_MAP.map((g) => (
                <button key={g.id} type="button" className="sim-btn" onClick={() => fire(g)}>
                  <GiftIcon id={g.id} />
                  <span>{giftLabel(g.id)}</span>
                  <small>{actionLabel(g.action)}</small>
                </button>
              ))}
            </div>
            <ResetRow />
          </Card>

          <Tabs defaultValue="conexao" className="panel-tabs">
            <TabsList>
              <TabsTrigger value="conexao">Conexão</TabsTrigger>
              <TabsTrigger value="elenco">Lutador</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="guia">Guia</TabsTrigger>
            </TabsList>
            <TabsContent value="conexao">
              <ConnectCard />
            </TabsContent>
            <TabsContent value="elenco">
              <RosterCard />
            </TabsContent>
            <TabsContent value="gifts">
              <MappingCard />
            </TabsContent>
            <TabsContent value="historico">
              <HistoryCard />
            </TabsContent>
            <TabsContent value="guia">
              <GuideCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {live.status === "error" && live.error ? <p className="panel-error">{live.error}</p> : null}
    </div>
  );
}

function LiveBadge() {
  const live = useCombat((s) => s.live);
  const tone =
    live.status === "connected"
      ? "ok"
      : live.status === "connecting" || live.status === "reconnecting"
        ? "warn"
        : live.status === "error"
          ? "live"
          : "neutral";
  const text = {
    disconnected: "Desconectado",
    connecting: "Conectando",
    connected: "Ao vivo",
    reconnecting: "Reconectando",
    error: "Erro",
  }[live.status];
  return (
    <Badge tone={tone}>
      <span className={`live-dot ${live.status}`} />
      {text}
      {live.username ? ` · @${live.username}` : ""}
    </Badge>
  );
}

function ResetRow() {
  const resetFight = useCombat((s) => s.resetFight);
  const patch = useCombat((s) => s.patchConfig);
  const sfx = useCombat((s) => s.config.sfxVolume);
  const crowd = useCombat((s) => s.config.crowdVolume);
  const shake = useCombat((s) => s.config.shakeEnabled);

  const hardReset = () => {
    unlockAudio();
    resetFight(false);
    void postLive("reset").catch(() => undefined);
  };

  return (
    <div className="reset-row">
      <Button variant="danger" onClick={hardReset}>
        <RotateCcw />
        Resetar luta
      </Button>
      <div className="vol-block">
        <Label htmlFor="sfx">
          <Volume2 className="inline size-3.5" /> Efeitos
        </Label>
        <input
          id="sfx"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={sfx}
          onChange={(e) => patch({ sfxVolume: Number(e.target.value) })}
        />
      </div>
      <div className="vol-block">
        <Label htmlFor="crowd">Plateia</Label>
        <input
          id="crowd"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={crowd}
          onChange={(e) => patch({ crowdVolume: Number(e.target.value) })}
        />
      </div>
      <label className="chk">
        <input type="checkbox" checked={shake} onChange={(e) => patch({ shakeEnabled: e.target.checked })} />
        Shake
      </label>
    </div>
  );
}

function ConnectCard() {
  const config = useCombat((s) => s.config);
  const patch = useCombat((s) => s.patchConfig);
  const setLive = useCombat((s) => s.setLive);
  const live = useCombat((s) => s.live);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  const overlayUrl = useMemo(() => {
    if (typeof window === "undefined") return "/overlay?transparent=1";
    return `${window.location.origin}/overlay?transparent=1`;
  }, []);

  const connect = async () => {
    unlockAudio();
    setPending(true);
    setLive({ status: "connecting", username: config.tiktokUser, error: undefined });
    try {
      await postLive("connect", { username: config.tiktokUser });
    } catch (err) {
      setLive({
        status: "error",
        username: config.tiktokUser,
        error: err instanceof Error ? err.message : "Falha ao conectar",
      });
    } finally {
      setPending(false);
    }
  };

  const disconnect = async () => {
    setPending(true);
    try {
      await postLive("disconnect");
      setLive({ status: "disconnected" });
    } finally {
      setPending(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(overlayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <Card>
      <CardTitle>TikTok LIVE</CardTitle>
      <CardDesc>
        Digite o @, abra a live no TikTok e conecte. Presentes e comentários viram golpes em tempo
        real.
      </CardDesc>
      <div className="connect-row">
        <div className="grow">
          <Label htmlFor="user">Usuário</Label>
          <div className="at-field">
            <span>@</span>
            <Input
              id="user"
              value={config.tiktokUser}
              placeholder="seuusuario"
              autoCapitalize="off"
              autoCorrect="off"
              onChange={(e) => patch({ tiktokUser: e.target.value.replace(/^@/, "") })}
            />
          </div>
        </div>
        {live.status === "connected" || live.status === "reconnecting" ? (
          <Button variant="secondary" onClick={() => void disconnect()} disabled={pending}>
            <Unplug />
            Sair
          </Button>
        ) : (
          <Button onClick={() => void connect()} disabled={pending || !config.tiktokUser.trim()}>
            <Wifi />
            {pending ? "Conectando…" : "Conectar"}
          </Button>
        )}
      </div>
      <div className="overlay-link-row">
        <Label>Fonte do OBS / palco</Label>
        <div className="at-field">
          <Input readOnly value={overlayUrl} />
          <Button variant="secondary" size="icon" onClick={() => void copy()} aria-label="Copiar URL">
            <Copy />
          </Button>
        </div>
        <p className="hint">{copied ? "Copiado." : "1080×1920 (9:16). Marque fundo transparente no OBS."}</p>
      </div>
    </Card>
  );
}

function RosterCard() {
  const config = useCombat((s) => s.config);
  const pickChampion = useCombat((s) => s.pickChampion);

  return (
    <Card>
      <CardTitle>Seu lutador</CardTitle>
      <CardDesc>Você luta no canto esquerdo. O outro personagem entra à direita.</CardDesc>
      <div className="skin-list champ-list">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`skin ${config.championId === c.id ? "is-on" : ""}`}
            onClick={() => {
              unlockAudio();
              pickChampion(c.id);
              void postLive("config", { ...useCombat.getState().config, championId: c.id }).catch(
                () => undefined,
              );
            }}
          >
            <img src={c.portrait} alt="" crossOrigin="anonymous" />
            <span>
              {c.name}
              <small className="block text-muted font-normal normal-case tracking-normal">
                {c.subtitle}
              </small>
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function MappingCard() {
  const gifts = useCombat((s) => s.config.gifts);
  const setGifts = useCombat((s) => s.setGifts);

  const update = (id: string, patch: Partial<GiftMapping>) => {
    setGifts(gifts.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  const add = () => {
    setGifts([
      ...gifts,
      {
        id: `custom-${Date.now()}`,
        aliases: ["novo gift"],
        action: "punch",
        side: "auto",
        damage: 10,
        hits: 1,
        diamonds: 1,
      },
    ]);
  };

  return (
    <Card>
      <CardTitle>Mapeamento de presentes</CardTitle>
      <CardDesc>Defina o que cada gift faz. Aliases aceitam nome ou ID numérico do TikTok.</CardDesc>
      <ScrollArea className="map-scroll">
        <div className="map-list">
          {gifts.map((g) => (
            <div key={g.id} className="map-row">
              <GiftIcon id={g.id} className="mt-2" />
              <Input
                value={g.aliases.join(", ")}
                onChange={(e) =>
                  update(g.id, {
                    aliases: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
              <select
                className="sel"
                value={g.action}
                onChange={(e) => update(g.id, { action: e.target.value as GiftAction })}
              >
                <option value="punch">Golpe</option>
                <option value="special">Especial</option>
                <option value="combo">Combo</option>
                <option value="buff">Buff de dano</option>
                <option value="spectacle">Efeito de tela</option>
              </select>
              <select
                className="sel"
                value={g.side}
                onChange={(e) => update(g.id, { side: e.target.value as SideMode })}
              >
                <option value="auto">Lado automático</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
                <option value="opposite">Lado oposto</option>
              </select>
              <Input
                type="number"
                value={g.damage}
                onChange={(e) => update(g.id, { damage: Number(e.target.value) || 0 })}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button variant="secondary" size="sm" className="mt-3" onClick={add}>
        Adicionar gift
      </Button>
    </Card>
  );
}

function HistoryCard() {
  const feed = useCombat((s) => s.fight.feed);
  return (
    <Card>
      <CardTitle>Histórico desta live</CardTitle>
      <CardDesc>Presentes recebidos (simulados ou reais) nesta sessão.</CardDesc>
      {feed.length === 0 ? (
        <p className="empty">Nenhum presente ainda. Dispare uma Rosa para testar.</p>
      ) : (
        <ul className="hist">
          {feed.map((f) => (
            <li key={f.id}>
              <span className={f.side === "left" ? "text-lula" : "text-flavio"}>{f.sender}</span>
              <span>{f.giftName}</span>
              <span className="text-muted">{f.actionLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function GuideCard() {
  return (
    <Card className="guide">
      <CardTitle>Como usar na live</CardTitle>
      <ol>
        <li>Escolha Lula ou Flávio Bolsonaro. Você fica à esquerda; o outro à direita.</li>
        <li>Teste os presentes neste painel. Cada gift causa dano, reação na tela e som.</li>
        <li>
          Copie a URL do palco e cole no OBS como fonte de navegador, <strong>1080×1920</strong>,
          com fundo transparente.
        </li>
        <li>Abra a live no TikTok, digite o @ e clique em Conectar.</li>
        <li>Comentários com “lula” / “13” ou “flavio” / “22” escolhem o lado da próxima Rosa.</li>
      </ol>
      <CardTitle className="mt-6">TikFinity</CardTitle>
      <p className="text-sm text-muted text-pretty">
        Webhook em <code>/api/live/webhook</code> com JSON
        <code> {"{ uniqueId, giftName, diamondCount }"}</code>.
      </p>
    </Card>
  );
}
