# Shared page chrome: Recipes menu and method picker. Used to update pages in place.
ICONS = {
 "pour": '<path d="M4 6h16l-6 8h-4z"/><path d="M8 19h8M10 14v5M14 14v5"/>',
 "frenchpress": '<rect x="7" y="8" width="10" height="12" rx="1.5"/><path d="M12 3v9M9 12h6M17 11h2v5h-2"/>',
 "aeropress": '<rect x="8" y="10" width="8" height="10" rx="1"/><path d="M9.5 4h5v6h-5zM6 20h12"/>',
 "espresso": '<path d="M5 9h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2 2 0 0 1 0 4H16M8.5 3.5v2.5M12.5 3.5v2.5"/>',
 "aiden": '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 7h6M10 14h4v4h-4z"/>',
}
def svg(k): return f'<svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[k]}</svg>'
def nav(pre="", on=""):
    g = ' class="on"' if on == "grinders" else ""
    return (f'<div class="links"><details class="menu"><summary>Recipes</summary><div class="menu-pop">'
      f'<a href="{pre}pour-over"><b>Pour over</b><span>V60, Kalita, Chemex</span></a>'
      f'<a href="{pre}french-press"><b>French press &amp; AeroPress</b><span>Plus Hario Switch and Clever</span></a>'
      f'<a href="{pre}espresso"><b>Espresso</b><span>Shots, lattes and more</span></a>'
      f'<a href="{pre or "./"}"><b>Fellow Aiden</b><span>Brew profiles for the Aiden</span></a>'
      f'</div></details><a href="{pre}grind/"{g}>Grinders</a></div>')
def methods(pre=""):
    items = [("pour","pour-over","Pour over"),("frenchpress","french-press","French press"),("aeropress","aeropress","AeroPress"),("espresso","espresso","Espresso"),("aiden", pre or "./","Fellow Aiden")]
    return '<nav class="methods" aria-label="Brew method">' + "".join(
      f'<a data-m="{k}" href="{(pre + h) if h != (pre or "./") else h}">{svg(k)}<span>{n}</span></a>' for k,h,n in items) + '</nav>'
