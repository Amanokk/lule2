//#region node_modules/.nitro/vite/services/ssr/assets/gifts-DVphocZm.js
var DEFAULT_GIFT_MAP = [
	{
		id: "rose",
		aliases: [
			"rose",
			"rosa",
			"roses",
			"5655"
		],
		action: "punch",
		side: "auto",
		damage: 8,
		hits: 1,
		diamonds: 1
	},
	{
		id: "white-rose",
		aliases: [
			"white rose",
			"rosa branca",
			"rosa blanca",
			"whiterose"
		],
		action: "punch",
		side: "opposite",
		damage: 8,
		hits: 1,
		diamonds: 1
	},
	{
		id: "donut",
		aliases: [
			"donut",
			"doughnut",
			"rosquinha",
			"rosquinha de açúcar",
			"donut pink"
		],
		action: "special",
		side: "left",
		damage: 42,
		hits: 1,
		diamonds: 30
	},
	{
		id: "capybara",
		aliases: [
			"capybara",
			"capivara",
			"capy",
			"capybaras"
		],
		action: "special",
		side: "right",
		damage: 55,
		hits: 1,
		diamonds: 99
	},
	{
		id: "dino",
		aliases: [
			"mini dino",
			"dino",
			"t-rex",
			"trex",
			"dinosaur",
			"dinossauro"
		],
		action: "combo",
		side: "auto",
		damage: 12,
		hits: 3,
		diamonds: 5
	},
	{
		id: "perfume",
		aliases: [
			"perfume",
			"fragrance",
			"colônia",
			"colonia"
		],
		action: "buff",
		side: "auto",
		damage: 0,
		hits: 1,
		diamonds: 20
	},
	{
		id: "sunglasses",
		aliases: [
			"sunglasses",
			"óculos",
			"oculos",
			"glasses",
			"óculos de sol"
		],
		action: "spectacle",
		side: "auto",
		damage: 18,
		hits: 1,
		diamonds: 10
	},
	{
		id: "galaxy",
		aliases: [
			"galaxy",
			"galáxia",
			"galaxia",
			"universe",
			"universo",
			"universe gift"
		],
		action: "spectacle",
		side: "auto",
		damage: 90,
		hits: 1,
		diamonds: 1e3
	}
];
function defaultConfig() {
	return {
		tiktokUser: "",
		championId: "",
		leftId: "lula",
		rightId: "flavio",
		maxHp: 1e3,
		maxEnergy: 100,
		sfxVolume: .85,
		crowdVolume: .4,
		shakeEnabled: true,
		transparent: false,
		autoResetSec: 5,
		gifts: DEFAULT_GIFT_MAP.map((g) => ({
			...g,
			aliases: [...g.aliases]
		}))
	};
}
function norm(s) {
	return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function findGiftMapping(mappings, giftName, giftId) {
	const id = giftId != null ? String(giftId) : "";
	const name = norm(giftName);
	return mappings.find((m) => m.aliases.some((a) => {
		const na = norm(a);
		return na === name || na === id || na.length > 3 && name.includes(na);
	}));
}
function actionLabel(action) {
	switch (action) {
		case "punch": return "Golpe";
		case "special": return "Especial";
		case "combo": return "Combo";
		case "buff": return "Dano+";
		case "spectacle": return "Espetáculo";
	}
}
var VISUALS = [
	"rose",
	"white-rose",
	"donut",
	"capybara",
	"dino",
	"perfume",
	"sunglasses",
	"galaxy"
];
function giftVisual(idOrName) {
	const n = norm(idOrName);
	for (const v of VISUALS) if (n === v || n.includes(v.replace("-", " ")) || n.includes(v)) return v;
	if (n.includes("rosa") && (n.includes("branca") || n.includes("white"))) return "white-rose";
	if (n.includes("rosa") || n.includes("rose")) return "rose";
	if (n.includes("rosquinha") || n.includes("donut")) return "donut";
	if (n.includes("capivara") || n.includes("capy")) return "capybara";
	if (n.includes("dino")) return "dino";
	if (n.includes("galaxy") || n.includes("galaxia") || n.includes("universo")) return "galaxy";
	if (n.includes("oculos") || n.includes("glass")) return "sunglasses";
	if (n.includes("perfume") || n.includes("colonia")) return "perfume";
	return "generic";
}
function giftLabel(id) {
	return {
		rose: "Rosa",
		"white-rose": "Rosa branca",
		donut: "Rosquinha",
		capybara: "Capivara",
		dino: "Mini Dino",
		perfume: "Perfume",
		sunglasses: "Óculos",
		galaxy: "Galáxia"
	}[id] ?? id;
}
//#endregion
export { giftLabel as a, findGiftMapping as i, actionLabel as n, giftVisual as o, defaultConfig as r, DEFAULT_GIFT_MAP as t };
