// js/nav.js

// Central nav config – future me yahin par new tab add karna hai
const NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "workouts.html", label: "Programs" },
  { href: "diet.html", label: "Diet" },
  { href: "results.html", label: "Results" },
  { href: "plans.html", label: "Plans" },
  { href: "contact.html", label: "Contact" },
];

// Create header HTML
function buildHeader() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  let links = NAV_ITEMS.map((item) => {
    const isActive = item.href === current;
    return `
      <a href="${item.href}" class="nav-link ${isActive ? "active" : ""}">
        ${item.label}
      </a>
    `;
  }).join("");

  return `
    <header class="site-header">
      <div class="nav-inner">
        <a href="index.html" class="logo">
          TheFit<span>Bhaskar</span>.in
        </a>
        <div class="nav-menu">
          ${links}
        </div>
      </div>
    </header>
  `;
}

// Create footer HTML
function buildFooter() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      © ${year} TheFitBhaskar.in • All Rights Reserved
    </footer>
  `;
}

// Inject header/footer once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");

  if (headerMount) headerMount.innerHTML = buildHeader();
  if (footerMount) footerMount.innerHTML = buildFooter();
});
