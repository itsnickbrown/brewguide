/* Brew Guide: bean-first recipes for the Fellow Aiden, pour over and espresso.
   Pick the coffee first (origin, process, roast), then your gear. The page returns
   a recipe and a grind setting for your grinder.

   AFFILIATE LINKS: paste approved links into LINKS below, keyed by product id.
   If a product has no link there and AMAZON_TAG is set, it falls back to an
   Amazon search link with your tag. With neither, it links to a plain Amazon search. */

const AMAZON_TAG = "nickbrewguide-20";
const LINKS = {
  // "fellow-aiden": "https://fellow.pxf.io/....",   // from Impact
  // "baratza-encore-esp": "https://baratza.pxf.io/....",
  // "trade": "https://drinktrade.pxf.io/....",
};

/* ---------------- coffee data ---------------- */
const FAMILIES = {
  floral:  { name: "Floral and tea-like", eg: "jasmine, bergamot, black tea, lemongrass" },
  citrus:  { name: "Bright citrus", eg: "lemon, lime, grapefruit, green apple" },
  stone:   { name: "Stone fruit and sweet acidity", eg: "peach, apricot, cherry, plum" },
  berry:   { name: "Berry, wine and fermented", eg: "blueberry, strawberry, wine, tropical" },
  choc:    { name: "Chocolate, nut and caramel", eg: "milk chocolate, almond, toffee, brown sugar" },
  heavy:   { name: "Heavy body and syrup", eg: "molasses, dark chocolate, fig, cedar" },
  roasty:  { name: "Roasty and dark", eg: "smoke, tobacco, bittersweet, roasted nut" },
};

const ORIGINS = {
  ethiopia:   { name: "Ethiopia", regions: ["Yirgacheffe","Sidama","Guji","Limu","Harrar"], washed: "floral", procs: ["washed","natural","honey","anaerobic"] },
  kenya:      { name: "Kenya", regions: ["Nyeri","Kirinyaga","Embu","Murang'a"], washed: "citrus", procs: ["washed","natural"] },
  colombia:   { name: "Colombia", regions: ["Huila","Nariño","Cauca","Tolima","Antioquia"], washed: "stone", procs: ["washed","natural","honey","anaerobic"] },
  brazil:     { name: "Brazil", regions: ["Cerrado Mineiro","Sul de Minas","Mogiana"], washed: "choc", natural: "choc", procs: ["natural","pulped natural","washed"] },
  guatemala:  { name: "Guatemala", regions: ["Antigua","Huehuetenango","Atitlán"], washed: "choc", procs: ["washed","natural","honey"] },
  costarica:  { name: "Costa Rica", regions: ["Tarrazú","West Valley","Central Valley"], washed: "stone", procs: ["washed","honey","natural","anaerobic"] },
  panama:     { name: "Panama", regions: ["Boquete","Volcán"], washed: "stone", procs: ["washed","natural","honey","anaerobic"] },
  honduras:   { name: "Honduras", regions: ["Marcala","Santa Bárbara","Copán"], washed: "choc", procs: ["washed","natural","honey"] },
  elsalvador: { name: "El Salvador", regions: ["Santa Ana","Apaneca"], washed: "choc", procs: ["washed","natural","honey"] },
  nicaragua:  { name: "Nicaragua", regions: ["Jinotega","Nueva Segovia"], washed: "choc", procs: ["washed","natural","honey"] },
  mexico:     { name: "Mexico", regions: ["Chiapas","Oaxaca","Veracruz"], washed: "choc", procs: ["washed","natural"] },
  peru:       { name: "Peru", regions: ["Cajamarca","Cusco","Amazonas"], washed: "choc", procs: ["washed","natural"] },
  bolivia:    { name: "Bolivia", regions: ["Caranavi","Samaipata"], washed: "stone", procs: ["washed","natural"] },
  ecuador:    { name: "Ecuador", regions: ["Loja","Pichincha"], washed: "stone", procs: ["washed","natural","honey"] },
  rwanda:     { name: "Rwanda", regions: ["Nyamasheke","Huye"], washed: "stone", procs: ["washed","natural"] },
  burundi:    { name: "Burundi", regions: ["Kayanza","Ngozi"], washed: "stone", procs: ["washed","natural"] },
  tanzania:   { name: "Tanzania", regions: ["Kilimanjaro","Mbeya"], washed: "citrus", procs: ["washed","natural"] },
  uganda:     { name: "Uganda", regions: ["Mt. Elgon","Rwenzori"], washed: "choc", procs: ["washed","natural"] },
  sumatra:    { name: "Indonesia (Sumatra)", regions: ["Aceh Gayo","Lintong"], washed: "heavy", procs: ["wet-hulled","washed","natural"] },
  png:        { name: "Papua New Guinea", regions: ["Eastern Highlands","Western Highlands"], washed: "choc", procs: ["washed","natural"] },
  yemen:      { name: "Yemen", regions: ["Haraz","Bani Matar"], washed: "berry", natural: "berry", procs: ["natural","washed"] },
  india:      { name: "India", regions: ["Chikmagalur","Coorg"], washed: "heavy", procs: ["washed","natural","monsooned"] },
  blend:      { name: "Blend or espresso blend", regions: [], washed: "choc", natural: "choc", procs: ["blend"] },
};

const VARIETALS = {
  "": "Not sure / not listed",
  heirloom: "Ethiopian landrace (heirloom, 74110)",
  gesha: "Gesha (Geisha)",
  sl28: "SL28 / SL34",
  ruiru: "Ruiru 11 / Batian",
  sl14: "SL14 / Bugisu",
  pinkbourbon: "Pink Bourbon",
  sidra: "Sidra",
  castillo: "Castillo / Colombia",
  caturra: "Caturra",
  catuai: "Catuai",
  bourbon: "Bourbon (red or yellow)",
  typica: "Typica",
  mundonovo: "Mundo Novo",
  pacas: "Pacas",
  pacamara: "Pacamara",
  villasarchi: "Villa Sarchi",
  parainema: "Parainema",
  maragogype: "Maragogype",
  tabi: "Tabi",
  kent: "Kent",
  s795: "S795",
  ateng: "Ateng / Tim Tim",
  arusha: "Arusha",
  yemenia: "Yemenia (Udaini, Jaadi)",
};

/* Varietals you'll actually see on bags from each origin. */
const ORIGIN_VARS = {
  ethiopia: ["heirloom","gesha"],
  kenya: ["sl28","ruiru"],
  colombia: ["castillo","caturra","pinkbourbon","gesha","typica","tabi","sidra"],
  brazil: ["catuai","mundonovo","bourbon"],
  guatemala: ["bourbon","caturra","catuai","typica","pacamara","gesha"],
  costarica: ["caturra","catuai","villasarchi","gesha"],
  panama: ["gesha","catuai","caturra","typica","pacamara"],
  honduras: ["catuai","caturra","parainema","bourbon","pacas","gesha"],
  elsalvador: ["bourbon","pacas","pacamara","gesha"],
  nicaragua: ["caturra","catuai","maragogype","pacamara","gesha"],
  mexico: ["typica","bourbon","caturra","catuai"],
  peru: ["typica","caturra","bourbon","gesha"],
  bolivia: ["caturra","typica","gesha"],
  ecuador: ["typica","sidra","caturra","gesha"],
  rwanda: ["bourbon"],
  burundi: ["bourbon"],
  tanzania: ["bourbon","kent","sl28"],
  uganda: ["sl14","sl28"],
  sumatra: ["ateng","typica"],
  png: ["typica","bourbon","arusha"],
  yemen: ["yemenia"],
  india: ["s795","kent"],
  blend: [],
};

const PROC_NAME = { washed: "Washed", natural: "Natural", honey: "Honey", anaerobic: "Anaerobic or experimental",
  "pulped natural": "Pulped natural", "wet-hulled": "Wet-hulled", monsooned: "Monsooned", blend: "Blend" };

const ROASTS = { ultralight: "Very light", light: "Light", medium: "Medium", mediumdark: "Medium dark", dark: "Dark" };
const AGES = { fresh: "0 to 7 days off roast", peak: "8 to 21 days", mid: "22 to 35 days", old: "35+ days" };

/* Pick the flavor family the recipe builds toward. */
function familyFor(s) {
  const o = ORIGINS[s.origin] || ORIGINS.blend;
  let fam;
  let why;
  if (s.notes && s.notes.length) { fam = s.notes[0]; why = `You picked ${FAMILIES[fam].name.toLowerCase()} notes from the bag.`; }
  else if (s.varietal === "gesha") { fam = "floral"; why = "Gesha is known for florals, so the recipe protects them."; }
  else if ((s.varietal === "sl28" || s.varietal === "ruiru") && s.process === "washed") { fam = "citrus"; why = "Washed SL28 lots and their Kenyan descendants tend toward bright, juicy acidity."; }
  else if (s.process === "natural" || s.process === "anaerobic") { fam = o.natural || "berry"; why = `${PROC_NAME[s.process]} coffees from ${o.name} usually lean ${FAMILIES[fam].name.toLowerCase()}.`; }
  else if (s.process === "honey" || s.process === "pulped natural") { fam = o.washed === "choc" || o.washed === "heavy" ? "choc" : "stone"; why = `${PROC_NAME[s.process]} coffees keep more sweetness, so the recipe builds for a full, sweet middle.`; }
  else if (s.process === "wet-hulled" || s.process === "monsooned") { fam = "heavy"; why = `${PROC_NAME[s.process]} coffees are low acid and heavy, so the recipe builds for body.`; }
  else { fam = o.washed; why = `Washed coffees from ${o.name} usually taste ${FAMILIES[fam].name.toLowerCase()}.`; }

  if (s.roast === "dark") { if (fam !== "roasty") why += " Dark roast takes over, so the recipe keeps the bitter tail out."; fam = "roasty"; }
  else if (s.roast === "mediumdark" && ["floral","citrus","stone","berry"].includes(fam)) { fam = "choc"; why += " At medium dark, the fruit fades and chocolate and caramel lead."; }
  return { fam, why };
}

/* ---------------- grinders ----------------
   Starting settings for a MEDIUM roast. Sources: manufacturer manuals and guides
   (Baratza, Fellow, OXO, Breville, Comandante, Timemore, Niche). Lighter roasts move
   finer and darker roasts move coarser by roastStep. micro is the smallest useful move. */
const GRINDERS = {
  "fellow-ode-2": { name: "Fellow Ode Gen 2", unit: "setting", min: 1, max: 11, step: 1/3, roastStep: 2/3, micro: 1/3,
    base: { aidenSingle: 4 + 1/3, aidenBatch: 7, v60: 5, kalita: 5 + 1/3, chemex: 6 + 2/3, espresso: null },
    fmt: "ode", note: "The dial has 11 numbers with two notches between each. Fellow says the Ode is not for espresso.", buy: "fellow-ode-2" },
  "fellow-opus-2": { name: "Fellow Opus 2 (Gen 2)", unit: "setting", min: 0, max: 10, step: 0.1, roastStep: { espresso: 0.25, other: 0.5 }, micro: 0.1,
    base: { aidenSingle: 5, aidenBatch: 7, v60: 6, kalita: 6.5, chemex: 7.5, espresso: 1.2 },
    fmt: "dec", note: "Stepless dial from 0 (fine) to 10 (coarse). Fellow's own recipes run about 4 to 6 for Aiden single serve, 6 to 10 for batch, 5.5 to 7 for pour over and 0.8 to 1.5 for espresso.", buy: "fellow-opus-2" },
  "fellow-opus": { name: "Fellow Opus (original)", unit: "setting", min: 1, max: 11, step: 0.25, roastStep: 0.5, micro: 0.25,
    base: { aidenSingle: 4.75, aidenBatch: 6, v60: 4.5, kalita: 4.75, chemex: 5.5, espresso: 1.5 },
    fmt: "dec", note: "Outer ring sets the number. Use the inner ring for fine espresso steps. Fellow suggests the higher end of a range for darker roasts.", buy: "fellow-opus" },
  "baratza-encore": { name: "Baratza Encore", unit: "setting", min: 0, max: 40, step: 1, roastStep: 2, micro: 1,
    base: { aidenSingle: 16, aidenBatch: 18, v60: 15, kalita: 16, chemex: 20, espresso: 8 },
    espressoNote: "Baratza lists 8 as an espresso start, but the Encore can only make real espresso with a pressurized basket.",
    pressurizedOnly: true, fmt: "int", note: "40 settings. Baratza's own starting points: V60 15, drip 18, Chemex 20, French press 28.", buy: "baratza-encore" },
  "baratza-encore-esp": { name: "Baratza Encore ESP", unit: "setting", min: 1, max: 40, step: 1, roastStep: { espresso: 2, other: 1 }, micro: 1,
    base: { aidenSingle: 26, aidenBatch: 28, v60: 25, kalita: 26, chemex: 30, espresso: 15 },
    fmt: "int", note: "Settings 1 to 20 are small espresso steps. Settings 21 to 40 are big filter steps, so move one at a time.", buy: "baratza-encore-esp" },
  "baratza-virtuoso": { name: "Baratza Virtuoso+", unit: "setting", min: 0, max: 40, step: 1, roastStep: 2, micro: 1,
    base: { aidenSingle: 16, aidenBatch: 18, v60: 15, kalita: 16, chemex: 20, espresso: 8 },
    espressoNote: "Baratza lists 8 as an espresso start, but the Virtuoso+ is a filter grinder. Use a pressurized basket.",
    pressurizedOnly: true, fmt: "int", note: "Same starting points as the Encore: V60 15, drip 18, Chemex 20.", buy: "baratza-virtuoso" },
  "oxo-8717000": { name: "OXO Brew Conical Burr (8717000)", unit: "setting", min: 1, max: 15, step: 0.5, roastStep: 1, micro: 0.5,
    base: { aidenSingle: 10, aidenBatch: 11, v60: 9, kalita: 9.5, chemex: 10, espresso: null },
    fmt: "oxo", note: "15 numbers with micro positions between them. Twist the hopper for micro moves. OXO's manual puts pour over and drip at 6 to 10.", buy: "oxo-8717000" },
  "breville-sgp": { name: "Breville Smart Grinder Pro", unit: "setting", min: 1, max: 60, step: 1, roastStep: { espresso: 2, other: 3 }, micro: 1,
    base: { aidenSingle: 38, aidenBatch: 42, v60: 38, kalita: 40, chemex: 44, espresso: 12 },
    pressurized: 30, fmt: "int", note: "60 settings. Breville groups them as espresso 1 to 30, drip 31 to 48, French press 55 to 60.", buy: "breville-sgp" },
  "comandante-c40": { name: "Comandante C40 MK4", unit: "clicks", min: 0, max: 40, step: 1, roastStep: 2, micro: 1,
    base: { aidenSingle: 24, aidenBatch: 26, v60: 24, kalita: 25, chemex: 28, espresso: 11 },
    fmt: "clicks", note: "Count clicks from fully closed. About 30 microns per click.", buy: "comandante-c40" },
  "timemore-c2": { name: "Timemore Chestnut C2", unit: "clicks", min: 0, max: 36, step: 1, roastStep: 1, micro: 1,
    base: { aidenSingle: 18, aidenBatch: 20, v60: 18, kalita: 19, chemex: 21, espresso: null },
    fmt: "clicks", note: "Count clicks from fully closed. Timemore's manual puts pour over at 18 to 24 clicks. The steps are too coarse for real espresso.", buy: "timemore-c2" },
  "timemore-078s": { name: "Timemore Sculptor 078S", unit: "setting", min: 0, max: 18, step: 0.25, roastStep: { espresso: 0.5, other: 1 }, micro: 0.25,
    base: { aidenSingle: 10.5, aidenBatch: 11.5, v60: 10, kalita: 10.5, chemex: 12, espresso: 2.5 },
    fmt: "dec", note: "Stepless dial. Timemore's manual puts espresso at 1 to 4, pour over at 8 to 13 and French press at 14 and up. For espresso, higher RPM runs the shot faster and lower RPM slows it down.", buy: "timemore-078s" },
  "1zpresso-k-ultra": { name: "1Zpresso K-Ultra", unit: "setting", min: 0, max: 15, step: 0.1, roastStep: { espresso: 0.2, other: 0.4 }, micro: 0.1,
    base: { aidenSingle: 7.8, aidenBatch: 8.6, v60: 7.5, kalita: 8, chemex: 8.8, espresso: 2.6 },
    fmt: "kultra", note: "Read it as number.click on the outer dial, so 7.5 means the dot on 7 plus 5 clicks. Each click is 20 microns. Common starting points are about 2.5 for espresso and 7 to 9.5 for pour over.", buy: "1zpresso-k-ultra" },
  "weber-eg1": { name: "Weber Workshops EG-1", unit: "numbers past burr lock", min: 0, max: 28, step: 0.2, roastStep: { espresso: 0.5, other: 1 }, micro: 0.2,
    base: { aidenSingle: 11, aidenBatch: 13, v60: 10.5, kalita: 11.5, chemex: 13, espresso: 5.5 },
    fmt: "eg1", note: "The EG-1 has no fixed zero, so count from burr lock: close the burrs until they just touch, note that number, then add the setting shown. Each tick is 5 microns. Settings assume the CORE burrs. With ULTRA burrs, start a couple of numbers coarser for filter.", buy: "weber-eg1" },
  "niche-zero": { name: "Niche Zero", unit: "setting", min: 0, max: 50, step: 1, roastStep: { espresso: 2, other: 4 }, micro: 1,
    base: { aidenSingle: 45, aidenBatch: 50, v60: 45, kalita: 47, chemex: 50, espresso: 15 },
    fmt: "int", note: "Stepless dial. Niche suggests about 15 for espresso and 35 to 50 for V60. Units vary, so treat these as a start.", buy: "niche-zero" },
  "blade": { name: "Blade grinder or pre-ground", unit: "", blade: true, base: {}, buy: null },
};

function roastSteps(g, method) { const r = g.roastStep; return typeof r === "number" ? r : (method === "espresso" ? r.espresso : r.other); }
const ROAST_OFFSET = { ultralight: -1.5, light: -1, medium: 0, mediumdark: 1, dark: 2 };
/* Fellow's Drops barely move the Aiden grind with roast or flavor: on an Ode Gen 2 single serve
   they average ~4.5 light, ~4.2 medium, ~4.8 medium dark, ~5 dark. So the Aiden uses smaller shifts. */
const AIDEN_ROAST = { ultralight: 0, light: 0, medium: 0, mediumdark: 0.5, dark: 1 };
const AIDEN_FAMILY_GRIND = { heavy: 1, roasty: 1 };
const FAMILY_GRIND = { floral: -1, citrus: -1, stone: 0, berry: 1, choc: 0, heavy: 1, roasty: 1 };

function fmtSetting(g, v) {
  const r = Math.round(v * 1000) / 1000;
  if (g.fmt === "ode") { const whole = Math.floor(r + 1e-6); const n = Math.round((r - whole) * 3); return n === 0 ? `${whole}` : `${whole}, ${n} notch${n > 1 ? "es" : ""} coarser`; }
  if (g.fmt === "oxo") { const whole = Math.floor(r + 1e-6); return r - whole > 0.25 ? `${whole}, one micro coarser` : `${whole}`; }
  if (g.fmt === "dec") return `${r}`;
  if (g.fmt === "eg1") return `${(Math.round(r * 5) / 5).toFixed(1)} numbers past burr lock`;
  if (g.fmt === "kultra") { const v = Math.round(r * 10) / 10; return v >= 10 ? `1 full turn, then ${(v - 10).toFixed(1)}` : v.toFixed(1); }
  if (g.fmt === "clicks") return `${Math.round(r)} clicks`;
  return `${Math.round(r)}`;
}
function microWord(g) { return g.fmt === "oxo" ? "one micro step" : g.fmt === "ode" ? "one notch" : g.unit === "clicks" ? "one click" : g.fmt === "dec" ? `${g.micro} on the dial` : "one setting"; }

/* Grind for a method. Returns {text, value, note} or {none:true,...}. */
function grindFor(gid, method, s, fam, extraMicro = 0) {
  const g = GRINDERS[gid];
  if (!g) return { none: true, text: "Pick a grinder" };
  if (g.blade) return { blade: true, text: method === "espresso" ? "A blade grinder can't make espresso." : "Medium, like coarse sand",
    note: "Blade grinders chop beans unevenly, so the cup mixes sour and bitter. A burr grinder is the biggest upgrade you can make." };
  const b = g.base[method];
  if (b == null) return { none: true, text: "This grinder isn't built for espresso.", note: g.note };
  let v = b;
  if (method === "espresso" && s.basket === "pressurized" && g.pressurized) v = g.pressurized;
  const aiden = method.startsWith("aiden");
  v += (aiden ? AIDEN_ROAST : ROAST_OFFSET)[s.roast] * roastSteps(g, method);
  if (method !== "espresso") v += ((aiden ? AIDEN_FAMILY_GRIND : FAMILY_GRIND)[fam] || 0) * g.micro;
  if (method === "espresso" && s.age === "fresh") v += g.micro; // very fresh coffee runs fast and gassy
  if (method === "espresso" && s.age === "old") v -= g.micro;
  if (s.decaf === "yes" && !aiden) v -= g.micro; // decaf extracts fast, so grind a touch finer (Fellow's Aiden decaf profiles don't)
  v += extraMicro * g.micro;
  v = Math.min(g.max, Math.max(g.min, Math.round(v / g.step) * g.step));
  let note = g.note;
  if (method === "espresso" && g.espressoNote) note = g.espressoNote;
  return { text: fmtSetting(g, v), value: v, note, warn: method === "espresso" && g.pressurizedOnly && s.basket !== "pressurized" };
}

const F = t => `${t}°F`;
const C = t => `${Math.round((t - 32) * 5 / 9)}°C`;
const temp = t => `${F(t)} (${C(t)})`;
const g1 = n => Math.round(n * 10) / 10;

/* ---------------- Fellow Aiden ---------------- */
/* Calibrated against 200 Fellow Drops "Fellow's Take" posts (Nov 2026). Fellow runs light washed
   coffees around 200-205F, fermented and experimental lots cooler (~195F), medium roasts ~203F,
   and dark roasts with a very hot bloom and cool pulses (~185F). Pulse temps step down. */
const AIDEN = {
  floral: { t: 202, r: 16.5, bR: 2.5, bS: 35, bT: +3, p: 4, gap: 23, fall: 4 },
  citrus: { t: 203, r: 16.5, bR: 2, bS: 40, bT: +3, p: 3, gap: 28, fall: 6 },
  stone:  { t: 203, r: 16, bR: 2.5, bS: 40, bT: +2, p: 3, gap: 28, fall: 3 },
  berry:  { t: 197, r: 16, bR: 3, bS: 45, bT: +3, p: 2, gap: 28, fall: 2 },
  choc:   { t: 204, r: 15.5, bR: 2.5, bS: 35, bT: +1, p: 3, gap: 23, fall: 2 },
  heavy:  { t: 203, r: 15.5, bR: 2, bS: 30, bT: +2, p: 2, gap: 28, fall: 0 },
  roasty: { t: 188, r: 16, bR: 2, bS: 30, bT: +20, p: 2, gap: 23, fall: 0 },
};
function aidenRecipe(s) {
  const { fam, why } = familyFor(s);
  const a = { ...AIDEN[fam] }, why2 = [];
  if ((s.roast === "light" || s.roast === "ultralight") && (fam === "choc" || fam === "heavy")) { a.t += 2; why2.push(["Temperature", "Plus 2°F because a light roast is dense and slow to give up sweetness."]); }
  if (s.roast === "ultralight") { a.t += 6; why2.push(["Temperature", "Plus 6°F for a very light, Nordic-style roast. These beans are dense and hard to extract. Fellow brews Drops from roasters like SEY and Hex at 210°F."]); }
  if (s.roast === "mediumdark" && fam !== "roasty") { a.t -= 2; why2.push(["Temperature", "Minus 2°F to keep a medium dark roast from drying out."]); }
  if (s.age === "fresh") { a.bR = 3; a.bS = 45; why2.push(["Bloom", "1:3 for 45 seconds. Coffee this fresh is full of gas that blocks water."]); }
  if (s.age === "mid") why2.push(["Temperature", "If it tastes flat, add 2°F next time. Coffee at 3 to 5 weeks has lost some aromatics."]);
  if (s.age === "old") { a.bS = 25; a.r = Math.max(15, a.r - 0.5); why2.push(["Ratio", "Tightened 0.5 to win back body on older coffee."]); }
  const cap = t => Math.min(210, Math.max(176, t)); // the Aiden's temperature range tops out at 210F
  // Dial-in: each tasting note changes one thing, in the order a barista would try it.
  const tweaks = [];
  let grindAdj = 0, sourN = 0, bitterN = 0;
  (s.tw ? s.tw.split(",") : []).filter(k => TWEAKS[k]).forEach((k, i) => {
    let did;
    const hotter = () => { if (a.t >= 210) { grindAdj -= 1; return "one grind step finer (already at the Aiden's 210°F max)"; } const n = Math.min(210, a.t + 3); const d = n - a.t; a.t = n; return `${d}°F hotter`; };
    if (k === "sour") { sourN++; if (sourN % 2) { grindAdj -= 1; did = "one grind step finer"; } else did = hotter(); }
    if (k === "bitter") { bitterN++; if (bitterN % 2) { grindAdj += 1; did = "one grind step coarser"; } else { a.t -= 3; did = "3°F cooler"; } }
    if (k === "thin") { a.r = Math.max(14.5, a.r - 0.5); did = `ratio tightened to 1:${a.r}`; }
    if (k === "hollow") { a.bS = Math.min(90, a.bS + 10); did = `bloom stretched to ${a.bS} seconds`; }
    if (k === "dry") { if (a.p > 1) { a.p -= 1; did = `one less pulse (${a.p})`; } else { grindAdj += 1; did = "one grind step coarser"; } }
    if (k === "flat") did = hotter();
    tweaks.push({ cup: i + 1, k, label: TWEAKS[k][0], did });
  });
  a.t = cap(a.t);
  const batch = s.size === "batch";
  const g = grindFor(s.grinder, batch ? "aidenBatch" : "aidenSingle", s, fam, grindAdj);
  const bloomT = cap(a.t + (a.bT || 0));
  const singleT = Array.from({ length: a.p }, (_, i) => cap(a.t - (a.p > 1 ? Math.round(a.fall * i / (a.p - 1)) : 0)));
  const batchT = a.t;
  const all = [bloomT, batchT, ...singleT];
  const mixed = all.some(x => x !== all[0]);
  const sections = [
    { title: "Profile", rows: [
      ["Temperature", mixed ? "Mixed (set per pulse below)" : temp(a.t)],
      ["Coffee-to-Water Ratio", `1:${a.r}`],
      ["Cold Brew", "Off"],
    ] },
    { title: "Bloom", rows: [
      ["Bloom", "On"],
      ["Bloom Ratio", `1:${a.bR}`],
      ["Bloom Time", `${a.bS}s`],
      ["Bloom Temperature", temp(bloomT)],
    ] },
    { title: `Single Serve Pulses${batch ? "" : " (what you'll brew)"}`, rows: [
      ["Number of Pulses", `${a.p}`],
      ["Time between pulses", `${a.gap}s`],
      ...singleT.map((x, i) => [`Pulse ${i + 1} temperature`, temp(x)]),
    ] },
    { title: `Batch Pulses${batch ? " (what you'll brew)" : ""}`, rows: [
      ["Number of Pulses", "1"],
      ["Time between pulses", `${a.gap}s`],
      ["Pulse 1 temperature", temp(batchT)],
    ] },
    { title: "Brewer and grinder", rows: [
      ["Basket", batch ? "Flat bottom, shower head on the three blue dots" : "Cone, shower head on the one green dot"],
      ["Grind", g.text],
    ] },
  ];
  if (a.fall) why2.push(["Pulse temps", `Step down from ${singleT[0]}°F to ${singleT[singleT.length - 1]}°F. Cooler late pulses keep the finish clean, the way Fellow builds its Drops profiles.`]);
  if (bloomT > a.t) why2.push(["Bloom temp", `${bloomT - a.t}°F hotter than the pulses to open the coffee up early.`]);
  if (s.decaf === "yes") why2.push(["Decaf", "Same grind as regular. Fellow's own Aiden decaf profiles don't grind finer, so neither does this."]);
  const rows = sections.flatMap(x => x.rows);
  const name = shortName(s, fam);
  return { fam, why, why2: famWhy(fam, "aiden").concat(why2), rows, sections, grind: g, name,
    taste: tasteChecks(fam), fixes: AIDEN_FIXES, tweaks, method: "aiden" };
}
function famWhy(fam, m) {
  const t = {
    floral: [["Temperature", "Hot bloom to open it up, then pulses that cool as they go so the florals stay delicate."], ["Pulses", "More, shorter pulses for clarity."]],
    citrus: [["Ratio", "A little open so the acidity reads clean, not sharp."], ["Temperature", "Pulses step down hard so the acidity stays juicy, not sharp."]],
    stone:  [["Everything", "Close to defaults. Stone fruit coffees need a full, even extraction to taste sweet instead of tart."]],
    berry:  [["Temperature", "Cooler so fermented fruit doesn't turn boozy."], ["Bloom", "Long and wet to settle a coffee that's often full of gas."], ["Grind", "One step coarser and fewer pulses so the fruit stays distinct instead of muddy."]],
    choc:   [["Everything", "Close to defaults. Chocolate and caramel sit in the middle of the extraction."]],
    heavy:  [["Ratio", "Tighter for body."], ["Grind", "One step coarser, with longer gaps between pulses for contact time."]],
    roasty: [["Temperature", "A very hot bloom to wake up the grounds, then much cooler pulses to keep ash and bitterness out. Fellow brews its dark roast Drops this way."], ["Grind", "Coarser so the bitter compounds stay in the grounds."]],
  }[fam] || [];
  if (m === "espresso") return [];
  if (m === "aiden") return t.filter(x => x[0] !== "Grind" || fam === "heavy" || fam === "roasty");
  return t;
}
function tasteChecks(fam) {
  const t = {
    floral: ["Smell it before you sip. The florals should be there in the aroma.", "Look for a tea-like, light body. That's right for this coffee.", "Taste it hot and again as it cools. Florals read best warm, sweetness shows up cooler."],
    citrus: ["The acidity should be juicy, not sour. Juicy makes your mouth water in a good way.", "Check for sweetness under the brightness as it cools."],
    stone:  ["It should taste sweet first, then fruity. If it's tart before sweet, it's under-extracted.", "Taste again as it cools. The fruit should get rounder, not sharper."],
    berry:  ["The fruit should be clear, like you can name it. If it's a vague sweet blur, there's too much agitation.", "A little winey is fine. Boozy or vinegar is too far."],
    choc:   ["Look for a sweet, round middle and a clean finish.", "If it finishes dry or chalky, it went too far."],
    heavy:  ["Body should feel thick and syrupy, not muddy.", "The finish should be sweet. Bitterness that lingers means too much extraction."],
    roasty: ["It should be bittersweet, like dark chocolate, not ashy.", "If it tastes like smoke or char, drop the temperature next time."],
  };
  return t[fam];
}
/* Tasting buttons for the Aiden dial-in helper: [button label, what it usually means]. */
const TWEAKS = {
  sour:   ["Sour or sharp", "Under-extracted. First a finer grind, then more heat if it's still sour."],
  bitter: ["Bitter or harsh", "Over-extracted. First a coarser grind, then less heat if it's still bitter."],
  thin:   ["Thin or watery", "Not enough coffee for the water. Tighten the ratio."],
  hollow: ["Hollow middle", "The bloom didn't fully wet the grounds. Bloom longer."],
  dry:    ["Dry, chalky finish", "Too much agitation. Fewer pulses."],
  flat:   ["Flat or dull", "Needs more energy. A bit more heat."],
};
const AIDEN_FIXES = [
  ["Sour, sharp", "Under-extracted", "One grind step finer"],
  ["Thin, watery", "Ratio too wide", "Tighten the ratio by 0.5"],
  ["Hollow, empty middle", "Under-extracted", "Bloom to 40 seconds"],
  ["Bitter, harsh", "Over-extracted", "One grind step coarser"],
  ["Dry, chalky finish", "Too much agitation", "Drop one pulse"],
  ["Ashy, smoky", "Too hot for the roast", "Minus 4°F"],
  ["Flat, dull", "Under-developed or old coffee", "Plus 3°F"],
  ["Muddy", "Too much agitation", "Drop one pulse"],
];

/* ---------------- pour over ---------------- */
const PO = {
  floral: { t: 208, r: 16.5, swirl: true },
  citrus: { t: 207, r: 16.5, swirl: true },
  stone:  { t: 205, r: 16, swirl: true },
  berry:  { t: 203, r: 16, swirl: false },
  choc:   { t: 203, r: 16, swirl: true },
  heavy:  { t: 202, r: 15.5, swirl: false },
  roasty: { t: 195, r: 16.5, swirl: false },
};
const DRIPPERS = {
  v60:    { name: "Hario V60", grind: "v60", target: { 1: "2:45", 2: "3:15" } },
  kalita: { name: "Kalita Wave", grind: "kalita", target: { 1: "3:00", 2: "3:30" } },
  chemex: { name: "Chemex", grind: "chemex", target: { 1: "3:45", 2: "4:15" } },
};
function pourRecipe(s) {
  const { fam, why } = familyFor(s);
  const p = { ...PO[fam] }, why2 = [];
  if (s.roast === "ultralight") { p.t = Math.min(212, p.t + 4); why2.push(["Temperature", "Hotter for a very light, Nordic-style roast. These beans are dense and slow to extract."]); }
  const cups = s.cups === "2" ? 2 : 1;
  const dose = cups === 2 ? 30 : 15;
  if (s.dripper === "chemex" && cups === 1) why2.push(["Size", "A Chemex works best at 25 grams or more. Two cups will taste better than one."]);
  if (s.age === "old") { p.r = Math.max(15, p.r - 0.5); why2.push(["Ratio", "Tightened 0.5 to win back body on older coffee."]); }
  const water = Math.round(dose * p.r);
  const fresh = s.age === "fresh" || fam === "floral" || fam === "berry";
  const bloomW = Math.round(dose * (fresh ? 3 : 2));
  const bloomS = fresh ? 45 : 35;
  const d = DRIPPERS[s.dripper] || DRIPPERS.v60;
  const g = grindFor(s.grinder, d.grind, s, fam, cups === 2 ? 1 : 0);
  const mid = Math.round(water * 0.6);
  const steps = [
    [`0:00`, `Pour ${bloomW} g to wet all the grounds. ${p.swirl ? "Swirl gently." : "Don't stir."} Wait ${bloomS} seconds.`],
    [`0:${bloomS}`, `Pour to ${mid} g in slow circles, staying off the paper.`],
    [`1:${bloomS === 45 ? "20" : "10"}`, `Pour to ${water} g.${p.swirl ? " Give it one gentle swirl to flatten the bed." : " Pour into the center to keep agitation low."}`],
    [`${d.target[cups]}`, `Drawdown should finish around here. Much later means grind coarser. Much sooner means grind finer.`],
  ];
  const rows = [
    ["Coffee", `${dose} g`], ["Water", `${water} g (1:${p.r})`], ["Water temp", temp(p.t)],
    ["Grind", g.text], ["Target time", d.target[cups]],
  ];
  return { fam, why, why2: famWhy(fam, "pour").filter(x => x[0] !== "Pulses").concat(why2), rows, steps, grind: g,
    name: shortName(s, fam), taste: tasteChecks(fam), fixes: POUR_FIXES, method: "pour", dripper: d.name };
}
const POUR_FIXES = [
  ["Sour, sharp", "Under-extracted", "One grind step finer"],
  ["Bitter, harsh", "Over-extracted", "One grind step coarser"],
  ["Drains slow, cup is bitter", "Grind too fine or too many fines", "Two steps coarser"],
  ["Drains fast, cup is weak", "Grind too coarse", "Two steps finer"],
  ["Flat, nothing there", "Water too cool", "Plus 3°F"],
  ["Thin", "Ratio too wide", "Tighten the ratio by 0.5"],
];

/* ---------------- espresso ---------------- */
const ESP = {
  ultralight: { ratio: 2.5, time: 30, t: 203 },
  light:      { ratio: 2.5, time: 30, t: 201 },
  medium:     { ratio: 2, time: 28, t: 199 },
  mediumdark: { ratio: 2, time: 27, t: 197 },
  dark:       { ratio: 1.8, time: 25, t: 194 },
};
function espRecipe(s) {
  const { fam, why } = familyFor(s);
  const e = { ...ESP[s.roast] }, why2 = [];
  if ((s.roast === "light" || s.roast === "ultralight") && (fam === "stone" || fam === "berry")) { e.ratio = 2.3; why2.push(["Ratio", "1:2.3 keeps fruity light roasts sweet without going thin."]); }
  if (s.roast === "medium" && (fam === "floral" || fam === "citrus")) { e.ratio = 2.2; why2.push(["Ratio", "A slightly longer shot opens up the brighter notes."]); }
  if ((s.roast === "light" || s.roast === "ultralight")) why2.push(["Pre-infusion", "If your machine has it, use 5 to 8 seconds. Light roasts extract more evenly with it. Count it in the shot time."]);
  if (s.roast === "dark") why2.push(["Temperature", "Lower to keep dark roasts from tasting burnt."]);
  if (s.age === "fresh") why2.push(["Rest", "Espresso from beans under a week old runs fast and foamy. Let them rest to day 7 if you can. The grind is one step coarser to help."]);
  const dose = 18, out = Math.round(dose * e.ratio);
  const g = grindFor(s.grinder, "espresso", s, fam);
  const rows = [
    ["Dose", `${dose} g`], ["Yield", `${out} g (1:${e.ratio})`], ["Shot time", `${e.time} seconds, counted from when you press start (pre-infusion included)`],
    ["Brew temp", temp(e.t)], ["Basket", s.basket === "pressurized" ? "Pressurized (double wall)" : "Unpressurized (single wall)"], ["Grind", g.text],
  ];
  return { fam, why, why2, rows, grind: g, name: shortName(s, fam), taste: tasteChecks(fam), fixes: ESP_FIXES, method: "espresso", out, time: e.time };
}
const ESP_FIXES = [
  ["Fast and sour", "Grind too coarse", "One grind step finer"],
  ["Slow and bitter", "Grind too fine", "One grind step coarser"],
  ["On time but sour", "Under-extracted", "Pull 4 g longer, or plus 2°F"],
  ["On time but bitter", "Over-extracted", "Pull 4 g shorter, or minus 2°F"],
  ["Spurts or blond streaks", "Channeling", "Break up clumps before tamping and tamp level"],
];

function shortName(s, fam) {
  const code = { ethiopia:"ETH", kenya:"KEN", colombia:"COL", brazil:"BRA", guatemala:"GUA", costarica:"CR", panama:"PAN", honduras:"HON",
    elsalvador:"ELS", nicaragua:"NIC", mexico:"MEX", peru:"PER", bolivia:"BOL", ecuador:"ECU", rwanda:"RWA", burundi:"BUR", tanzania:"TAN",
    uganda:"UGA", sumatra:"SUM", png:"PNG", yemen:"YEM", india:"IND", blend:"BLEND" }[s.origin] || "COF";
  const word = { floral: "Floral", citrus: "Bright", stone: "Sweet", berry: "Fruit", choc: "Choc", heavy: "Body", roasty: "Dark" }[fam];
  const r = { ultralight: "VL", light: "L", medium: "M", mediumdark: "MD", dark: "D" }[s.roast] || "";
  return `${code} ${word} ${r}${s.size === "batch" ? "B" : ""}`.slice(0, 12).trim();
}

/* ---------------- gear ---------------- */
const GEAR = {
  "fellow-aiden":       { name: "Fellow Aiden", q: "Fellow Aiden precision coffee maker", why: "The brewer these profiles are built for." },
  "fellow-ode-2":       { name: "Fellow Ode Gen 2", q: "Fellow Ode Brew Grinder Gen 2", why: "Flat burr grinder built for filter coffee. Great match for the Aiden and pour over." },
  "fellow-opus-2":      { name: "Fellow Opus 2", q: "Fellow Opus 2 conical burr grinder", why: "Fellow's newer all-rounder. Stepless, bigger burrs, espresso to cold brew." },
  "fellow-opus":        { name: "Fellow Opus", q: "Fellow Opus conical burr grinder", why: "One grinder for espresso and filter at a fair price." },
  "baratza-encore":     { name: "Baratza Encore", q: "Baratza Encore conical burr grinder", why: "The classic starter burr grinder for drip and pour over." },
  "baratza-encore-esp": { name: "Baratza Encore ESP", q: "Baratza Encore ESP grinder", why: "Starter grinder with real espresso steps and good filter range." },
  "baratza-virtuoso":   { name: "Baratza Virtuoso+", q: "Baratza Virtuoso+ grinder", why: "A step up from the Encore for filter coffee, with a timer." },
  "oxo-8717000":        { name: "OXO Brew Conical Burr Grinder", q: "OXO Brew Conical Burr Coffee Grinder 8717000", why: "Budget burr grinder that handles drip and pour over well." },
  "breville-sgp":       { name: "Breville Smart Grinder Pro", q: "Breville Smart Grinder Pro BCG820", why: "60 settings and timed dosing. Strongest on espresso." },
  "comandante-c40":     { name: "Comandante C40 MK4", q: "Comandante C40 MK4 hand grinder", why: "The hand grinder most pour over recipes are written for." },
  "timemore-c2":        { name: "Timemore Chestnut C2", q: "Timemore Chestnut C2 manual grinder", why: "Best value hand grinder for pour over and French press." },
  "timemore-078s":      { name: "Timemore Sculptor 078S", q: "Timemore Sculptor 078S electric coffee grinder", why: "78mm flat burr grinder that handles espresso and pour over, with adjustable RPM." },
  "1zpresso-k-ultra":   { name: "1Zpresso K-Ultra", q: "1Zpresso K-Ultra manual coffee grinder", why: "Hand grinder with an outside dial. Pour over to espresso in one turn." },
  "weber-eg1":          { name: "Weber Workshops EG-1", q: "Weber Workshops EG-1 coffee grinder", why: "80mm flat burr single dose grinder for espresso and filter." },
  "niche-zero":         { name: "Niche Zero", q: "Niche Zero grinder", why: "Single dose grinder known for espresso with low retention." },
  "hario-v60":          { name: "Hario V60 dripper", q: "Hario V60 02 dripper", why: "The standard cone for pour over." },
  "chemex":             { name: "Chemex 6-cup", q: "Chemex 6 cup classic", why: "Thick filters for a very clean cup. Brew two cups or more." },
  "kalita":             { name: "Kalita Wave 185", q: "Kalita Wave 185 dripper", why: "Flat bottom dripper that's more forgiving than a V60." },
  "stagg-ekg":          { name: "Fellow Stagg EKG kettle", q: "Fellow Stagg EKG electric kettle", why: "Gooseneck kettle that holds an exact temperature." },
  "scale":              { name: "Timemore Black Mirror scale", q: "Timemore Black Mirror Basic coffee scale", why: "A scale with a timer. Every recipe here is in grams." },
  "bambino":            { name: "Breville Bambino Plus", q: "Breville Bambino Plus espresso machine", why: "Small espresso machine with pre-infusion and auto milk." },
  "wdt":                { name: "WDT tool", q: "espresso WDT distribution tool needle", why: "Breaks up clumps before tamping. Cheap fix for channeling." },
};
function gearLink(id) {
  if (LINKS[id]) return LINKS[id];
  const g = GEAR[id] || { q: id };
  return `https://www.amazon.com/s?k=${encodeURIComponent(g.q)}${AMAZON_TAG ? `&tag=${encodeURIComponent(AMAZON_TAG)}` : ""}`;
}
const BEANS_LINK = () => LINKS.trade || "https://www.drinktrade.com/";

/* ---------------- export for tests ---------------- */
if (typeof module !== "undefined") module.exports = { ORIGINS, GRINDERS, FAMILIES, familyFor, grindFor, aidenRecipe, pourRecipe, espRecipe, gearLink, fmtSetting };

/* ---------------- page ---------------- */
if (typeof document !== "undefined") (function () {
  const MODE = document.body.dataset.mode; // aiden | pour | espresso
  const $ = id => document.getElementById(id);
  const esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const opt = (v, t, sel) => `<option value="${esc(v)}"${v === sel ? " selected" : ""}>${esc(t)}</option>`;

  const DEF = { origin: "ethiopia", region: "", process: "washed", varietal: "", roast: "light", age: "peak", decaf: "no", tw: "", notes: [],
    grinder: MODE === "espresso" ? "baratza-encore-esp" : "fellow-ode-2", size: "single", dripper: "v60", cups: "1", basket: "unpressurized" };
  let s = { ...DEF };
  try { const h = new URLSearchParams(location.hash.slice(1)); h.forEach((v, k) => { if (k in DEF) s[k] = k === "notes" ? v.split(",").filter(x => FAMILIES[x]) : v; }); } catch (_) {}
  if (!ORIGINS[s.origin]) s.origin = DEF.origin;
  if (!GRINDERS[s.grinder]) s.grinder = DEF.grinder;

  function fillSelects() {
    $("origin").innerHTML = Object.entries(ORIGINS).map(([k, o]) => opt(k, o.name, s.origin)).join("");
    const o = ORIGINS[s.origin];
    if (!o.procs.includes(s.process)) s.process = o.procs[0];
    $("region").innerHTML = opt("", o.regions.length ? "Any region" : "Not needed", s.region) + o.regions.map(r => opt(r, r, s.region)).join("");
    $("region").disabled = !o.regions.length;
    $("process").innerHTML = o.procs.map(p => opt(p, PROC_NAME[p], s.process)).join("");
    const vs = ORIGIN_VARS[s.origin] || [];
    if (s.varietal && !vs.includes(s.varietal)) s.varietal = "";
    $("varietal").innerHTML = opt("", VARIETALS[""], s.varietal) + vs.map(k => opt(k, VARIETALS[k], s.varietal)).join("");
    $("varietal").disabled = !vs.length;
    $("age").innerHTML = Object.entries(AGES).map(([k, v]) => opt(k, v, s.age)).join("");
    if ($("decaf")) $("decaf").value = s.decaf;
    const gs = Object.entries(GRINDERS);
    $("grinder").innerHTML = gs.map(([k, g]) => opt(k, g.name, s.grinder)).join("");
    document.querySelectorAll("[data-roast]").forEach(b => b.classList.toggle("on", b.dataset.roast === s.roast));
    $("notes").innerHTML = Object.entries(FAMILIES).map(([k, f]) => `<button type="button" class="chip${s.notes.includes(k) ? " on" : ""}" data-note="${k}" title="${esc(f.eg)}">${esc(f.name)}</button>`).join("");
    if ($("size")) $("size").value = s.size;
    if ($("dripper")) $("dripper").value = s.dripper;
    if ($("cups")) $("cups").value = s.cups;
    if ($("basket")) $("basket").value = s.basket;
  }

  function table(rows) { return `<table class="rt">${rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>`; }
  function gearCard(ids, title) {
    return `<div class="gear"><h3>${esc(title)}</h3><div class="gear-grid">${ids.filter(i => GEAR[i]).map(i => `<a class="g" href="${esc(gearLink(i))}" target="_blank" rel="sponsored nofollow noopener" data-gear="${i}"><b>${esc(GEAR[i].name)}</b><span>${esc(GEAR[i].why)}</span><em>Check price &rsaquo;</em></a>`).join("")}</div></div>`;
  }

  function render() {
    const R = MODE === "aiden" ? aidenRecipe(s) : MODE === "pour" ? pourRecipe(s) : espRecipe(s);
    const g = GRINDERS[s.grinder];
    const o = ORIGINS[s.origin];
    const title = `${s.region ? s.region + ", " : ""}${o.name}. ${PROC_NAME[s.process]}, ${ROASTS[s.roast].toLowerCase()} roast`;
    let html = `<div class="res-head"><div><div class="eyebrow">${MODE === "aiden" ? `Profile name: ${esc(R.name)}` : MODE === "pour" ? esc(R.dripper) : "Espresso"}</div><h2>${esc(title)}</h2>
      <p class="fam">Building toward <b>${esc(FAMILIES[R.fam].name.toLowerCase())}</b>. ${esc(R.why)}</p></div>
      <button class="btn" type="button" id="share">Copy link</button></div>`;
    html += R.sections ? R.sections.map(x => `<h3 class="rt-h">${esc(x.title)}</h3>` + table(x.rows)).join("") : table(R.rows);
    if (R.grind) {
      const gr = R.grind;
      if (gr.blade || gr.none) html += `<div class="callout warn"><b>${esc(gr.text)}</b> ${esc(gr.note || "")}</div>`;
      else html += `<p class="gnote"><b>${esc(g.name)}:</b> ${esc(gr.note)}${gr.warn ? " You picked an unpressurized basket, so expect a fast, sour shot until you upgrade the grinder." : ""} <a href="grind/${esc(s.grinder)}">All ${esc(g.name)} settings</a></p>`;
    }
    if (R.steps) html += `<h3>Pour schedule</h3><ol class="steps2">${R.steps.map(x => `<li><b>${esc(x[0])}</b> ${esc(x[1])}</li>`).join("")}</ol>`;
    if (R.method === "espresso") html += `<h3>How to dial it in</h3><p>Start the timer when you press start, so pre-infusion counts toward the time. Pull the shot and stop at <b>${R.out} g</b>. If it took much less than ${R.time} seconds, go one step finer. Much more, one step coarser. Change one thing per shot.</p>`;
    if (R.why2.length) html += `<h3>Why these numbers</h3><ul class="why">${R.why2.map(x => `<li><b>${esc(x[0])}.</b> ${esc(x[1])}</li>`).join("")}</ul>`;
    html += `<h3>Taste for this</h3><ul class="why">${R.taste.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    if (R.method === "aiden") {
      html += `<div class="dial" id="dial"><h3>Dial it in for your bag</h3>
        <p>Brew it, taste it, then tap what you noticed. Each tap changes one setting and updates the profile above, in the order a barista would try it.</p>
        <div class="dial-btns">${Object.entries(TWEAKS).map(([k, v]) => `<button type="button" class="chip" data-tw="${k}" title="${esc(v[1])}">${esc(v[0])}</button>`).join("")}</div>`;
      if (R.tweaks.length) {
        html += `<ol class="dial-log">${R.tweaks.map(x => `<li><b>After cup ${x.cup}: ${esc(x.label.toLowerCase())}.</b> Changed: ${esc(x.did)}. <span>${esc(TWEAKS[x.k][1])}</span></li>`).join("")}</ol>
          <p class="hint">Changes are saved in this page's link. Copy the link to keep this bag's profile.</p>
          <div class="dial-act"><button type="button" class="btn" data-tw-undo>Undo last</button><button type="button" class="btn" data-tw-reset>Start over</button></div>`;
      } else html += `<p class="hint">Tasted great? Leave it. You're dialed in.</p>`;
      html += `</div>`;
    } else
    html += `<h3>If it's off, change one thing</h3><table class="fix"><tr><th>Tastes</th><th>Likely cause</th><th>Next brew</th></tr>${R.fixes.map(f => `<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td></tr>`).join("")}</table>`;
    html += `<p class="fine">Grind numbers are starting points from each maker's guide. Burrs and calibration vary between units, so taste and adjust.</p>`;
    $("result").innerHTML = html;

    // gear suggestions that fit the situation
    let gear = [];
    const gr = R.grind || {};
    if (gr.blade) gear = MODE === "espresso" ? ["baratza-encore-esp", "fellow-opus-2", "breville-sgp"] : ["oxo-8717000", "baratza-encore", "fellow-ode-2", "timemore-c2"];
    else if (gr.none && MODE === "espresso") gear = ["baratza-encore-esp", "fellow-opus-2", "niche-zero"];
    else if (gr.warn) gear = ["baratza-encore-esp", "fellow-opus-2", "breville-sgp"];
    const base = MODE === "aiden" ? ["fellow-aiden", "fellow-ode-2", "fellow-opus-2", "baratza-encore-esp", "scale", "oxo-8717000"]
      : MODE === "pour" ? ["hario-v60", "stagg-ekg", "scale", "comandante-c40", "fellow-ode-2", "kalita"]
      : ["bambino", "baratza-encore-esp", "niche-zero", "wdt", "scale", "fellow-opus-2"];
    const ids = [...new Set(gear.concat(base))].filter(i => i !== s.grinder).slice(0, 6);
    $("gear").innerHTML = gearCard(ids, gear.length ? "Upgrades that fix this" : "Gear for this recipe") +
      `<div class="beans"><div><b>Want more coffees like this one?</b><span>Trade matches you with roasters by flavor and ships beans fresh.</span></div><a class="btn primary" href="${esc(BEANS_LINK())}" target="_blank" rel="sponsored nofollow noopener" data-gear="trade">Find beans</a></div>`;

    const p = new URLSearchParams();
    Object.keys(DEF).forEach(k => { const v = k === "notes" ? s.notes.join(",") : s[k]; if (v && v !== DEF[k] && !(k === "notes" && !v)) p.set(k, v); });
    history.replaceState(null, "", "#" + p.toString());
  }

  function count(path) { try { window.goatcounter && window.goatcounter.count({ path, event: true }); } catch (_) {} }

  document.addEventListener("change", e => {
    const id = e.target.id; if (!(id in DEF)) return;
    s[id] = e.target.value;
    if (["origin", "region", "process", "varietal", "age"].includes(id)) s.tw = "";
    if (id === "origin") { s.region = ""; s.process = ORIGINS[s.origin].procs[0]; }
    fillSelects(); render();
  });
  document.addEventListener("click", e => {
    const r = e.target.closest("[data-roast]"); if (r) { s.roast = r.dataset.roast; s.tw = ""; fillSelects(); render(); return; }
    const tw = e.target.closest("[data-tw]"); if (tw) { s.tw = s.tw ? s.tw + "," + tw.dataset.tw : tw.dataset.tw; render(); count("dial-" + tw.dataset.tw); const d = document.getElementById("dial"); d && d.scrollIntoView({ block: "nearest" }); return; }
    if (e.target.closest("[data-tw-undo]")) { s.tw = s.tw.split(",").slice(0, -1).join(","); render(); return; }
    if (e.target.closest("[data-tw-reset]")) { s.tw = ""; render(); return; }
    const n = e.target.closest("[data-note]");
    if (n) { const k = n.dataset.note; s.notes = s.notes.includes(k) ? s.notes.filter(x => x !== k) : s.notes.concat(k).slice(-2); fillSelects(); render(); return; }
    if (e.target.id === "share") { navigator.clipboard && navigator.clipboard.writeText(location.href).then(() => { e.target.textContent = "Copied"; setTimeout(() => e.target.textContent = "Copy link", 1500); }); count("share-" + MODE); return; }
    if (e.target.id === "fbSend") {
      const type = $("fbType").value, txt = $("fbText").value.trim(), email = $("fbEmail").value.trim();
      if (!txt) { $("fbMsg").textContent = "Add a sentence or two so I know what to fix."; return; }
      const fd = new URLSearchParams();
      fd.append("entry.1687808053", type);
      fd.append("entry.1263591643", `${txt}\n\nPage: ${location.href}\nGrinder: ${(GRINDERS[s.grinder] || {}).name}`);
      if (email) fd.append("entry.1154471066", email);
      e.target.disabled = true;
      fetch("https://docs.google.com/forms/d/e/1FAIpQLSeex50dFUYQsEWL67ONnF-RorlF8U-y7OhAgSjEFBlQm_lEuw/formResponse", { method: "POST", mode: "no-cors", body: fd })
        .then(() => { $("fbText").value = ""; $("fbMsg").textContent = "Thanks. Got it."; count("feedback-" + MODE); })
        .catch(() => { $("fbMsg").innerHTML = 'That didn\'t send. <a href="https://docs.google.com/forms/d/e/1FAIpQLSeex50dFUYQsEWL67ONnF-RorlF8U-y7OhAgSjEFBlQm_lEuw/viewform" target="_blank" rel="noopener">Use the form instead</a>.'; })
        .finally(() => { e.target.disabled = false; });
      return;
    }
    const g = e.target.closest("[data-gear]"); if (g) count("gear-" + g.dataset.gear + "-" + MODE);
  });

  fillSelects(); render();
})();
