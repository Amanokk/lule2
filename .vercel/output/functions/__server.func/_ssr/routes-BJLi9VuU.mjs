import { o as __toESM } from "../_runtime.mjs";
import { a as giftLabel, n as actionLabel, t as DEFAULT_GIFT_MAP } from "./gifts-DVphocZm.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, c as unlockAudio, i as SfxDirector, l as useCombat, n as GiftIcon, o as postLive, r as OverlayStage, s as subscribeLive, t as CHARACTERS } from "./sfx-director-MVyPU2ai.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, n as Volume2, o as ExternalLink, r as Unplug, s as Copy, t as Wifi } from "../_libs/lucide-react.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BJLi9VuU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider", {
			neutral: "bg-surface-2 text-muted border-border",
			ok: "bg-ok/15 text-ok border-ok/30",
			warn: "bg-warn/15 text-warn border-warn/30",
			lula: "bg-lula/15 text-lula border-lula/30",
			flavio: "bg-flavio/20 text-fg border-flavio/40",
			live: "bg-lula text-fg border-lula"
		}[tone], className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-transform duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			lula: "bg-lula text-fg hover:bg-lula/90",
			flavio: "bg-flavio text-fg hover:bg-flavio/90",
			danger: "bg-lula text-fg hover:bg-lula/85"
		},
		size: {
			default: "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
			sm: "h-9 rounded-[var(--radius-xs)] px-3 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			icon: "size-11 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-fg", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("font-display text-xl tracking-wide text-fg", className),
		...props
	});
}
function CardDesc({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("mt-1 text-sm text-muted text-pretty", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-fg", "placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium uppercase tracking-[0.14em] text-muted", className),
		...props
	});
}
function ScrollArea({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		className: cn("overflow-hidden", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			className: "flex w-2 touch-none select-none bg-transparent p-0.5",
			orientation: "vertical",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("flex gap-1 rounded-[var(--radius-md)] bg-surface-2 p-1 text-muted", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("flex-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors", "data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=inactive]:hover:text-fg", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
function CharacterSelect() {
	const pickChampion = useCombat((s) => s.pickChampion);
	const choose = (id) => {
		unlockAudio();
		pickChampion(id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pick-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pick-kicker",
				children: "TikTok LIVE · 9:16"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "pick-title",
				children: "Escolha seu lutador"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pick-sub",
				children: "Quem você representa na live. O outro entra no canto oposto."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pick-grid",
				children: CHARACTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `pick-card pick-${c.color}`,
					onClick: () => choose(c.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.portrait,
							alt: c.name,
							crossOrigin: "anonymous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pick-name",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pick-role",
							children: c.subtitle
						})
					]
				}, c.id))
			})
		]
	});
}
function ControlPanel() {
	const hydrate = useCombat((s) => s.hydrate);
	const applyGift = useCombat((s) => s.applyGift);
	const applyChat = useCombat((s) => s.applyChat);
	const resetFight = useCombat((s) => s.resetFight);
	const setLive = useCombat((s) => s.setLive);
	const patchConfig = useCombat((s) => s.patchConfig);
	const live = useCombat((s) => s.live);
	const hydrated = useCombat((s) => s.hydrated);
	const championId = useCombat((s) => s.config.championId);
	const fire = (gift, sender = "Simulação") => {
		unlockAudio();
		const payload = {
			sender,
			giftName: gift.aliases[0] ?? gift.id,
			giftId: gift.id,
			diamonds: gift.diamonds,
			source: "local"
		};
		applyGift(payload);
		postLive("gift", payload).catch(() => void 0);
	};
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		if (!championId) return;
		const cfg = useCombat.getState().config;
		postLive("config", cfg).catch(() => void 0);
	}, [championId]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
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
	(0, import_react.useEffect)(() => {
		return subscribeLive((ev) => {
			if (ev.type === "status") setLive(ev.live);
			if (ev.type === "hello") setLive(ev.live);
			if (ev.type === "chat") applyChat(ev.chat);
			if (ev.type === "reset") resetFight(false);
			if (ev.type === "config") patchConfig(ev.config);
			if (ev.type === "gift" && ev.gift.source !== "local") applyGift(ev.gift);
		});
	}, [
		setLive,
		applyChat,
		resetFight,
		patchConfig,
		applyGift
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SfxDirector, {}),
			hydrated && !championId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharacterSelect, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "panel-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "panel-kicker",
					children: "Overlay TikTok LIVE · 9:16"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "panel-title",
					children: "Combate LIVE"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel-header-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/overlay",
							children: ["Palco", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {})]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "live-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "phone-frame",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlayStage, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "live-side",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "panel-sim",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Simular presentes" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Na live, cada gift vira golpe, som e reação. Teste aqui antes de conectar." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sim-grid",
								children: DEFAULT_GIFT_MAP.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "sim-btn",
									onClick: () => fire(g),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftIcon, { id: g.id }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: giftLabel(g.id) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: actionLabel(g.action) })
									]
								}, g.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResetRow, {})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "conexao",
						className: "panel-tabs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "conexao",
									children: "Conexão"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "elenco",
									children: "Lutador"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "gifts",
									children: "Gifts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "historico",
									children: "Histórico"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "guia",
									children: "Guia"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "conexao",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectCard, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "elenco",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RosterCard, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "gifts",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MappingCard, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "historico",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryCard, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "guia",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideCard, {})
							})
						]
					})]
				})]
			}),
			live.status === "error" && live.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "panel-error",
				children: live.error
			}) : null
		]
	});
}
function LiveBadge() {
	const live = useCombat((s) => s.live);
	const tone = live.status === "connected" ? "ok" : live.status === "connecting" || live.status === "reconnecting" ? "warn" : live.status === "error" ? "live" : "neutral";
	const text = {
		disconnected: "Desconectado",
		connecting: "Conectando",
		connected: "Ao vivo",
		reconnecting: "Reconectando",
		error: "Erro"
	}[live.status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		tone,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `live-dot ${live.status}` }),
			text,
			live.username ? ` · @${live.username}` : ""
		]
	});
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
		postLive("reset").catch(() => void 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "reset-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "danger",
				onClick: hardReset,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Resetar luta"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vol-block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
					htmlFor: "sfx",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "inline size-3.5" }), " Efeitos"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "sfx",
					type: "range",
					min: 0,
					max: 1,
					step: .01,
					value: sfx,
					onChange: (e) => patch({ sfxVolume: Number(e.target.value) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vol-block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "crowd",
					children: "Plateia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "crowd",
					type: "range",
					min: 0,
					max: 1,
					step: .01,
					value: crowd,
					onChange: (e) => patch({ crowdVolume: Number(e.target.value) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "chk",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: shake,
					onChange: (e) => patch({ shakeEnabled: e.target.checked })
				}), "Shake"]
			})
		]
	});
}
function ConnectCard() {
	const config = useCombat((s) => s.config);
	const patch = useCombat((s) => s.patchConfig);
	const setLive = useCombat((s) => s.setLive);
	const live = useCombat((s) => s.live);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const overlayUrl = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return "/overlay?transparent=1";
		return `${window.location.origin}/overlay?transparent=1`;
	}, []);
	const connect = async () => {
		unlockAudio();
		setPending(true);
		setLive({
			status: "connecting",
			username: config.tiktokUser,
			error: void 0
		});
		try {
			await postLive("connect", { username: config.tiktokUser });
		} catch (err) {
			setLive({
				status: "error",
				username: config.tiktokUser,
				error: err instanceof Error ? err.message : "Falha ao conectar"
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
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "TikTok LIVE" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Digite o @, abra a live no TikTok e conecte. Presentes e comentários viram golpes em tempo real." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "connect-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "user",
					children: "Usuário"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "at-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "@" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "user",
						value: config.tiktokUser,
						placeholder: "seuusuario",
						autoCapitalize: "off",
						autoCorrect: "off",
						onChange: (e) => patch({ tiktokUser: e.target.value.replace(/^@/, "") })
					})]
				})]
			}), live.status === "connected" || live.status === "reconnecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: () => void disconnect(),
				disabled: pending,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, {}), "Sair"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => void connect(),
				disabled: pending || !config.tiktokUser.trim(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {}), pending ? "Conectando…" : "Conectar"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-link-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fonte do OBS / palco" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "at-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						readOnly: true,
						value: overlayUrl
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon",
						onClick: () => void copy(),
						"aria-label": "Copiar URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: copied ? "Copiado." : "1080×1920 (9:16). Marque fundo transparente no OBS."
				})
			]
		})
	] });
}
function RosterCard() {
	const config = useCombat((s) => s.config);
	const pickChampion = useCombat((s) => s.pickChampion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Seu lutador" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Você luta no canto esquerdo. O outro personagem entra à direita." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "skin-list champ-list",
			children: CHARACTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `skin ${config.championId === c.id ? "is-on" : ""}`,
				onClick: () => {
					unlockAudio();
					pickChampion(c.id);
					postLive("config", {
						...useCombat.getState().config,
						championId: c.id
					}).catch(() => void 0);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: c.portrait,
					alt: "",
					crossOrigin: "anonymous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
					className: "block text-muted font-normal normal-case tracking-normal",
					children: c.subtitle
				})] })]
			}, c.id))
		})
	] });
}
function MappingCard() {
	const gifts = useCombat((s) => s.config.gifts);
	const setGifts = useCombat((s) => s.setGifts);
	const update = (id, patch) => {
		setGifts(gifts.map((g) => g.id === id ? {
			...g,
			...patch
		} : g));
	};
	const add = () => {
		setGifts([...gifts, {
			id: `custom-${Date.now()}`,
			aliases: ["novo gift"],
			action: "punch",
			side: "auto",
			damage: 10,
			hits: 1,
			diamonds: 1
		}]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Mapeamento de presentes" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Defina o que cada gift faz. Aliases aceitam nome ou ID numérico do TikTok." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
			className: "map-scroll",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "map-list",
				children: gifts.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "map-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftIcon, {
							id: g.id,
							className: "mt-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: g.aliases.join(", "),
							onChange: (e) => update(g.id, { aliases: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "sel",
							value: g.action,
							onChange: (e) => update(g.id, { action: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "punch",
									children: "Golpe"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "special",
									children: "Especial"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "combo",
									children: "Combo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "buff",
									children: "Buff de dano"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "spectacle",
									children: "Efeito de tela"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "sel",
							value: g.side,
							onChange: (e) => update(g.id, { side: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "auto",
									children: "Lado automático"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "left",
									children: "Esquerda"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "right",
									children: "Direita"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "opposite",
									children: "Lado oposto"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: g.damage,
							onChange: (e) => update(g.id, { damage: Number(e.target.value) || 0 })
						})
					]
				}, g.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			size: "sm",
			className: "mt-3",
			onClick: add,
			children: "Adicionar gift"
		})
	] });
}
function HistoryCard() {
	const feed = useCombat((s) => s.fight.feed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Histórico desta live" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Presentes recebidos (simulados ou reais) nesta sessão." }),
		feed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "empty",
			children: "Nenhum presente ainda. Dispare uma Rosa para testar."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "hist",
			children: feed.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: f.side === "left" ? "text-lula" : "text-flavio",
					children: f.sender
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.giftName }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: f.actionLabel
				})
			] }, f.id))
		})
	] });
}
function GuideCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "guide",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Como usar na live" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Escolha Lula ou Flávio Bolsonaro. Você fica à esquerda; o outro à direita." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Teste os presentes neste painel. Cada gift causa dano, reação na tela e som." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Copie a URL do palco e cole no OBS como fonte de navegador, ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "1080×1920" }),
					", com fundo transparente."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Abra a live no TikTok, digite o @ e clique em Conectar." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comentários com “lula” / “13” ou “flavio” / “22” escolhem o lado da próxima Rosa." })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mt-6",
				children: "TikFinity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted text-pretty",
				children: [
					"Webhook em ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/live/webhook" }),
					" com JSON",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [" ", "{ uniqueId, giftName, diamondCount }"] }),
					"."
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlPanel, {});
}
//#endregion
export { Home as component };
