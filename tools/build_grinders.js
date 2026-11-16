// Builds one static page per grinder from the same settings brew.js uses.
// Run: node tools/build_grinders.js [grinder-id ...]   (no args = all grinders)
const fs = require("fs"), path = require("path");
const B = require("../brew.js");
const ROOT = path.join(__dirname, "..");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ROASTS = [["light", "Light"], ["medium", "Medium"], ["mediumdark", "Medium dark"], ["dark", "Dark"]];
const METHODS = [["v60", "Pour over: V60"], ["kalita", "Pour over: Kalita Wave"], ["chemex", "Pour over: Chemex"], ["espresso", "Espresso"], ["aidenSingle", "Fellow Aiden, single serve"], ["aidenBatch", "Fellow Aiden, batch"]];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(B.GRINDERS).filter(k => !B.GRINDERS[k].blade);
const head = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const verify = (head.match(/<meta name="google-site-verification"[^>]*>/) || [""])[0];
const css = (head.match(/<link rel="stylesheet"[^\n]*/) || [""])[0].replace(/href="/g, 'href="../');

for (const id of ids) {
  const g = B.GRINDERS[id];
  const rows = METHODS.filter(([m]) => g.base[m] != null).map(([m, label]) => {
    const cells = ROASTS.map(([r]) => B.grindFor(id, m, { roast: r, age: "peak", decaf: "no", basket: "unpressurized" }, "stone").text);
    const short = c => c.replace(/, (\d) notch(es)? coarser/, " + $1 notch$2").replace(/, one micro coarser/, " + micro");
    return `<div class="gm"><div class="gm-h">${esc(label)}</div><div class="gm-r">${cells.map((c, i) => `<div><span>${ROASTS[i][1]}</span><b>${esc(short(c))}</b></div>`).join("")}</div></div>`;
  }).join("");
  const espresso = g.base.espresso != null;
  const title = `${g.name} Grind Settings for Pour Over${espresso ? ", Espresso" : ""} and Fellow Aiden | Brew Guide`;
  const desc = `Where to set your ${g.name} for V60, Kalita, Chemex${espresso ? ", espresso" : ""} and the Fellow Aiden, by roast level. Starting points from the maker's own guide.`;
  const url = `https://brewguide.pages.dev/grind/${id}`;
  const others = Object.keys(B.GRINDERS).filter(k => k !== id && !B.GRINDERS[k].blade)
    .map(k => `<a href="${k}">${esc(B.GRINDERS[k].name)}</a>`).join("");
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${verify}<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Brew Guide"><meta property="og:title" content="${esc(title)}"><meta property="og:url" content="${url}">
${css}
<link rel="stylesheet" href="../grind.css?v=2">
</head>
<body><nav class="nav"><div class="in"><a class="brand" href="../" style="text-decoration:none">Brew Guide</a>
<div class="links"><a href="../"><span class="sm-hide">Fellow </span>Aiden</a><a href="../pour-over">Pour over</a><a href="../espresso">Espresso</a><a href="./" class="on">Grinders</a></div></div></nav>
<main class="wrap">
<header class="ph"><div class="eyebrow">Grind settings</div><h1>${esc(g.name)}</h1>
<p>Where to set your ${esc(g.name)} for pour over${espresso ? ", espresso" : ""} and the Fellow Aiden, by roast level. These are starting points. Your coffee and your taste decide the rest.</p></header>
<div class="tool">
<h2 class="sec">Starting settings</h2>
<div class="gms">${rows}</div>
${espresso && g.pressurizedOnly ? `<p class="hint">${esc(g.espressoNote)}</p>` : ""}${espresso ? "" : `<p class="hint">Not listed for espresso. ${esc(g.espressoNote || "This grinder can't grind fine enough for real espresso.")}</p>`}
<h3>How to read the dial</h3><p>${esc(g.note)}${g.fmt === "ode" ? " “4 + 1 notch” means the dial on 4, then one notch coarser." : ""}</p>
<h3>Adjust for your coffee</h3>
<ul class="why">
<li><b>Floral or bright coffees</b> (washed Ethiopia, Kenya) for pour over: one step finer.</li>
<li><b>Fruity naturals, heavy-bodied or dark coffees</b> for pour over: one step coarser.</li>
<li><b>On the Fellow Aiden</b>, keep the setting above. Fellow's own Drops profiles barely change the grind by flavor.</li>
<li><b>Sour or thin?</b> One step finer. <b>Bitter or dry?</b> One step coarser. Change one thing per brew.</li>
</ul>
<h3>Where these numbers come from</h3>
<p>Each setting starts from ${esc(g.name.split(" ")[0])}'s own guide for this grinder. The Aiden settings are checked against about 200 of Fellow's own Drops brew profiles. Burrs and calibration vary between units, so treat these as a place to start.</p>
<div class="cta"><a class="btn primary" href="../pour-over#grinder=${id}">Get a pour over recipe for your coffee</a>${espresso ? `<a class="btn" href="../espresso#grinder=${id}">Espresso recipe</a>` : ""}<a class="btn" href="../#grinder=${id}">Fellow Aiden profile</a></div>
</div>
<div class="tool"><h2 class="sec">Other grinders</h2><div class="glist">${others}</div></div>
</main><footer><div class="wrap">Built by Nick Brown. Grind settings come from each maker's own guide. Recipes are starting points, so taste and adjust.</div></footer>
<script data-goatcounter="https://brewguide.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body></html>
`;
  fs.writeFileSync(path.join(ROOT, "grind", id + ".html"), html);
  console.log("wrote grind/" + id + ".html");
}

// Index page listing every grinder.
const all = Object.keys(B.GRINDERS).filter(k => !B.GRINDERS[k].blade);
const cards = all.map(k => { const g = B.GRINDERS[k]; const e = g.base.espresso != null && !g.pressurizedOnly;
  return `<a class="gcard" href="${k}"><b>${esc(g.name)}</b><span>Pour over${e ? ", espresso" : ""}, Fellow Aiden</span></a>`; }).join("");
const ititle = "Coffee Grinder Settings for Pour Over, Espresso and Fellow Aiden | Brew Guide";
fs.writeFileSync(path.join(ROOT, "grind", "index.html"), `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${verify}<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${ititle}</title><meta name="description" content="Starting grind settings for ${all.length} popular grinders, by brew method and roast level. Fellow, Baratza, OXO, Breville, Comandante, Timemore, 1Zpresso, Niche and Weber.">
<link rel="canonical" href="https://brewguide.pages.dev/grind/">
${css}
<link rel="stylesheet" href="../grind.css?v=2">
</head>
<body><nav class="nav"><div class="in"><a class="brand" href="../" style="text-decoration:none">Brew Guide</a>
<div class="links"><a href="../"><span class="sm-hide">Fellow </span>Aiden</a><a href="../pour-over">Pour over</a><a href="../espresso">Espresso</a><a href="./" class="on">Grinders</a></div></div></nav>
<main class="wrap">
<header class="ph"><div class="eyebrow">Grind settings</div><h1>Find the setting for your grinder.</h1>
<p>Pick your grinder for starting settings by brew method and roast level. Missing yours? Use the feedback box on any recipe page and I'll add it.</p></header>
<div class="tool"><div class="gcards">${cards}</div></div>
</main><footer><div class="wrap">Built by Nick Brown. Grind settings come from each maker's own guide. Recipes are starting points, so taste and adjust.</div></footer>
<script data-goatcounter="https://brewguide.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body></html>
`);
console.log("wrote grind/index.html");

// Sitemap: tool pages plus every grinder page.
const today = new Date().toISOString().slice(0, 10);
const urls = ["", "pour-over", "espresso", "grind/"].concat(all.map(k => "grind/" + k));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>https://brewguide.pages.dev/${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
console.log("wrote sitemap.xml");
