// Builds one static page per grinder from the same settings brew.js uses.
// Run: node tools/build_grinders.js [grinder-id ...]   (no args = all grinders)
const fs = require("fs"), path = require("path");
const B = require("../brew.js");
const ROOT = path.join(__dirname, "..");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ROASTS = [["light", "Light"], ["medium", "Medium"], ["mediumdark", "Medium dark"], ["dark", "Dark"]];
const METHODS = [["v60", "Pour over: V60"], ["kalita", "Pour over: Kalita Wave"], ["chemex", "Pour over: Chemex"], ["frenchpress", "French press"], ["aeropress", "AeroPress"], ["espresso", "Espresso"], ["aidenSingle", "Fellow Aiden, single serve"], ["aidenBatch", "Fellow Aiden, batch"]];
const { execSync } = require("child_process");
const NAV = execSync(`python3 -c "import sys; sys.path.insert(0,'${path.join(__dirname)}'); from chrome import nav; print(nav('../', 'grinders'))"`).toString().trim();
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
  const realEsp = espresso && !g.pressurizedOnly;
  const title = g.espressoOnly ? `${g.name} Grind Settings for Espresso | Brew Guide` : `${g.name} Grind Settings for Pour Over, French Press${realEsp ? ", Espresso" : ""} and Fellow Aiden | Brew Guide`;
  const desc = g.espressoOnly ? `Where to set the ${g.name} for espresso, by roast level. Starting points from the maker's own guide.` : `Where to set your ${g.name} for V60, Kalita, Chemex, French press, AeroPress${realEsp ? ", espresso" : ""} and the Fellow Aiden, by roast level. Starting points from the maker's own guide.`;
  const url = `https://brewguide.pages.dev/grind/${id}`;
  const others = Object.keys(B.GRINDERS).filter(k => k !== id && !B.GRINDERS[k].blade)
    .map(k => `<a href="${k}">${esc(B.GRINDERS[k].name)}</a>`).join("");
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${verify}<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Brew Guide"><meta property="og:title" content="${esc(title)}"><meta property="og:url" content="${url}">
${css}
<link rel="stylesheet" href="../grind.css?v=4">
</head>
<body><nav class="nav"><div class="in"><a class="brand" href="../" style="text-decoration:none">Brew Guide</a>
${NAV}</div></nav>
<main class="wrap">
<header class="ph"><div class="eyebrow">Grind settings</div><h1>${esc(g.name)}</h1>
<p>${g.espressoOnly ? `Where to set the ${esc(g.name)} for espresso, by roast level.` : `Where to set your ${esc(g.name)} for pour over, French press${realEsp ? ", espresso" : ""} and the Fellow Aiden, by roast level.`} These are starting points. Your coffee and your taste decide the rest.</p>
<label class="gswitch">Switch grinder <select onchange="if(this.value)location.href=this.value">${Object.keys(B.GRINDERS).filter(k => !B.GRINDERS[k].blade).map(k => `<option value="${k}"${k === id ? " selected" : ""}>${esc(B.GRINDERS[k].name)}</option>`).join("")}</select></label></header>
<div class="tool">
<h2 class="sec">Starting settings</h2>
<div class="gms">${rows}</div>
${espresso && g.pressurizedOnly ? `<p class="hint">${esc(g.espressoNote)}</p>` : ""}${espresso || g.espressoOnly ? "" : `<p class="hint">Not listed for espresso. ${esc(g.espressoNote || "This grinder can't grind fine enough for real espresso.")}</p>`}
<h3>How to read the dial</h3><p>${esc(g.note)}${g.fmt === "ode" ? " “4 + 1 notch” means the dial on 4, then one notch coarser." : ""}</p>
<h3>Adjust for your coffee</h3>
<ul class="why">
${g.espressoOnly ? `<li><b>Fast, sour shot?</b> One step finer. <b>Slow, bitter shot?</b> One step coarser.</li>
<li><b>On time but sour?</b> Pull a longer shot. <b>On time but bitter?</b> Pull a shorter shot.</li>` : `<li><b>Floral or bright coffees</b> (washed Ethiopia, Kenya) for pour over: one step finer.</li>
<li><b>Fruity naturals, heavy-bodied or dark coffees</b> for pour over: one step coarser.</li>
<li><b>On the Fellow Aiden</b>, keep the setting above. Fellow's own Drops profiles barely change the grind by flavor.</li>`}
<li><b>Sour or thin?</b> One step finer. <b>Bitter or dry?</b> One step coarser. Change one thing per brew.</li>
</ul>
<h3>Where these numbers come from</h3>
<p>Each setting starts from ${esc(g.name.split(" ")[0])}'s own guide for this grinder${g.espressoOnly ? "" : ". French press and AeroPress settings use common starting points where the maker doesn't list one. The Aiden settings are checked against about 200 of Fellow's own Drops brew profiles"}. Burrs and calibration vary between units, so treat these as a place to start.</p>
<div class="cta">${g.espressoOnly ? `<a class="btn primary" href="../espresso#grinder=${id}">Get an espresso recipe for your coffee</a>` : `<a class="btn primary" href="../pour-over#grinder=${id}">Get a pour over recipe for your coffee</a><a class="btn" href="../french-press#grinder=${id}">French press &amp; AeroPress</a>${espresso ? `<a class="btn" href="../espresso#grinder=${id}">Espresso recipe</a>` : ""}<a class="btn" href="../#grinder=${id}">Fellow Aiden profile</a>`}</div>
</div>
<div class="tool"><h2 class="sec">Other grinders</h2><div class="glist">${others}</div></div>
</main><footer><div class="wrap">Built by Nick Brown. Grind settings come from each maker's own guide. Recipes are starting points, so taste and adjust.</div></footer>
<script data-goatcounter="https://brewguide.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script src="../menu.js?v=1"></script>
</body></html>
`;
  fs.writeFileSync(path.join(ROOT, "grind", id + ".html"), html);
  console.log("wrote grind/" + id + ".html");
}

// Index page listing every grinder.
const all = Object.keys(B.GRINDERS).filter(k => !B.GRINDERS[k].blade);
const cards = all.map(k => { const g = B.GRINDERS[k]; const e = g.base.espresso != null && !g.pressurizedOnly;
  return `<a class="gcard" href="${k}"><b>${esc(g.name)}</b><span>${g.espressoOnly ? "Espresso" : `Pour over, French press${e ? ", espresso" : ""}, Aiden`}</span></a>`; }).join("");
const ititle = "Coffee Grinder Settings for Pour Over, Espresso and Fellow Aiden | Brew Guide";
fs.writeFileSync(path.join(ROOT, "grind", "index.html"), `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${verify}<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${ititle}</title><meta name="description" content="Starting grind settings for ${all.length} popular grinders, by brew method and roast level. Pour over, French press, AeroPress, espresso and Fellow Aiden.">
<link rel="canonical" href="https://brewguide.pages.dev/grind/">
${css}
<link rel="stylesheet" href="../grind.css?v=4">
</head>
<body><nav class="nav"><div class="in"><a class="brand" href="../" style="text-decoration:none">Brew Guide</a>
${NAV}</div></nav>
<main class="wrap">
<header class="ph"><div class="eyebrow">Grind settings</div><h1>Find the setting for your grinder.</h1>
<p>Pick your grinder for starting settings by brew method and roast level. Missing yours? Use the feedback box on any recipe page and I'll add it.</p></header>
<div class="tool"><div class="gcards">${cards}</div></div>
</main><footer><div class="wrap">Built by Nick Brown. Grind settings come from each maker's own guide. Recipes are starting points, so taste and adjust.</div></footer>
<script data-goatcounter="https://brewguide.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script src="../menu.js?v=1"></script>
</body></html>
`);
console.log("wrote grind/index.html");

// Sitemap: tool pages plus every grinder page.
const today = new Date().toISOString().slice(0, 10);
const urls = ["", "pour-over", "french-press", "aeropress", "espresso", "grind/"].concat(all.map(k => "grind/" + k));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>https://brewguide.pages.dev/${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
console.log("wrote sitemap.xml");
