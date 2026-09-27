import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as unlockAudio, i as SfxDirector, l as useCombat, r as OverlayStage, s as subscribeLive } from "./sfx-director-MVyPU2ai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overlay-re5Q5N9M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OverlayPage() {
	const hydrate = useCombat((s) => s.hydrate);
	const applyGift = useCombat((s) => s.applyGift);
	const applyChat = useCombat((s) => s.applyChat);
	const resetFight = useCombat((s) => s.resetFight);
	const setLive = useCombat((s) => s.setLive);
	const patchConfig = useCombat((s) => s.patchConfig);
	const [transparent, setTransparent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		hydrate();
		const params = new URLSearchParams(window.location.search);
		const obs = params.get("transparent") === "1" || params.get("obs") === "1";
		setTransparent(obs);
		if (obs) document.documentElement.classList.add("obs-mode");
		return () => document.documentElement.classList.remove("obs-mode");
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		return subscribeLive((ev) => {
			if (ev.type === "gift") applyGift(ev.gift);
			if (ev.type === "chat") applyChat(ev.chat);
			if (ev.type === "reset") resetFight(false);
			if (ev.type === "status") setLive(ev.live);
			if (ev.type === "config") patchConfig(ev.config);
			if (ev.type === "hello") {
				setLive(ev.live);
				patchConfig(ev.config);
			}
		});
	}, [
		applyGift,
		applyChat,
		resetFight,
		setLive,
		patchConfig
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: transparent ? "overlay-page is-obs" : "overlay-page",
		onPointerDown: () => unlockAudio(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SfxDirector, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlayStage, { transparent })]
	});
}
//#endregion
export { OverlayPage as component };
