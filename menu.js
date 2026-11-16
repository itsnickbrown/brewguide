// Close the Recipes menu when tapping anywhere else.
document.addEventListener("click", e => { document.querySelectorAll("details.menu[open]").forEach(d => { if (!d.contains(e.target)) d.removeAttribute("open"); }); });
