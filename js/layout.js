// layout.js - renders shared navbar and footer across pages
(() => {
  const mount = (selector, html, position) => {
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("div");
      node.id = selector.replace(/^#/, "");
      if (position === "start") {
        document.body.prepend(node);
      } else {
        document.body.appendChild(node);
      }
    }
    node.innerHTML = html;
    return node;
  };

  const activePage = document.body?.dataset?.page || "";

  const navLinks = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About", href: "about.html" },
    { id: "workout", label: "Workout", href: "workout.html" },
    { id: "diet", label: "Diet", href: "diet.html" },
    { id: "lifestyle", label: "Lifestyle", href: "lifestyle.html" },
    { id: "self-development", label: "Self Dev.", href: "self-development.html" },
    { id: "tools", label: "Tools", href: "tools.html" },
    { id: "blog", label: "Blog", href: "blog.html" },
    { id: "gallery", label: "Gallery", href: "gallery.html" },
    { id: "youtube", label: "YouTube", href: "youtube.html" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  const socialLinks = [
    { label: "YouTube", icon: "assets/images/youtube.png", href: "https://www.youtube.com/@Thefitbhaskar", target: "_blank" },
    { label: "Instagram", icon: "assets/images/insta.png", href: "https://www.instagram.com/thefitbhaskar/", target: "_blank" }
  ];

  const headerHtml = `
    <header class="navbar">
      <div class="wrapper nav-inner">
        <a class="brand" href="index.html">TheFit<span>Bhaskar</span></a>
        <div class="hamburger" aria-label="Toggle menu" role="button" tabindex="0">
          <span></span><span></span><span></span>
        </div>
        <nav class="nav-links">
          ${navLinks
      .map(link => `<a ${link.id === activePage ? 'class="active"' : ""} href="${link.href}">${link.label}</a>`)
      .join("")}
        </nav>
      </div>
    </header>
  `;

  const footerHtml = `
    <footer class="footer">
      <div class="wrapper footer-inner">
        <div><strong>TheFitBhaskar</strong> &copy; ${new Date().getFullYear()} | Personal documentation project</div>
        <div class="socials">
          ${socialLinks
            .map(social => {
              const target = social.target ? ` target="${social.target}" rel="noopener noreferrer"` : "";
              return social.icon
                ? `<a href="${social.href}" aria-label="${social.label}"${target}><img class="social-icon" src="${social.icon}" alt="${social.label}" loading="lazy"></a>`
                : `<a href="${social.href}" aria-label="${social.label}"${target}>${social.text || social.label}</a>`;
            })
            .join("")}
        </div>
      </div>
    </footer>
  `;

  mount("#site-header", headerHtml, "start");
  mount("#site-footer", footerHtml, "end");
})();
