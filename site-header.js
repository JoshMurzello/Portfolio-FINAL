(function () {
  const navItems = [
    { href: "index.html", label: "Home" },
    { href: "Engineering.html", label: "Engineering" },
    { href: "Creatives.html", label: "Creatives" },
    { href: "about.html", label: "About" },
  ];

  function currentFile() {
    const raw = window.location.pathname.split("/").pop() || "index.html";
    return raw === "" ? "index.html" : raw;
  }

  function detectCurrent(href, page) {
    const pageName = page.toLowerCase();
    if (href === "index.html") return page === "index.html" || page === "";
    if (
      href === "Engineering.html" &&
      [
        "tesla.html",
        "lg.html",
        "price.html",
        "bci.html",
        "sentry-rover.html",
        "3dprint.html",
        "camera-storage.html",
        "self-balancing-robot.html",
        "spacex.html",
        "cyclodial-actuator.html",
        "pomodoro.html",
        "stl-drops.html",
        "plant-shelf.html",
        "dinkrack.html",
        "eboard.html",
        "mars.html",
        "me2110.html"
      ].includes(pageName)
    ) {
      return true;
    }
    if (href === "Creatives.html" && pageName === "creatives-clean.html") return true;
    return pageName === href.toLowerCase();
  }

  function headerMarkup() {
    const page = currentFile();
    const links = navItems
      .map((item) => {
        const current = detectCurrent(item.href, page) ? ' aria-current="page"' : "";
        return `<a href="${item.href}"${current}>${item.label}</a>`;
      })
      .join("");

    return `
<header class="unified-header" id="site-header">
  <div class="unified-header-shell">
    <a href="index.html" class="unified-brand"><img src="favicon.svg" alt="" class="unified-brand-logo" aria-hidden="true">JOSH MURZELLO</a>
    <button class="menu-toggle unified-menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle menu">Menu</button>
    <nav id="site-nav" class="site-nav unified-nav" aria-label="Primary navigation">${links}</nav>
  </div>
</header>`;
  }

  function findReplaceTarget() {
    const bodyChildren = Array.from(document.body.children);
    if (!bodyChildren.length) return null;

    const skipLink = bodyChildren.find((el) => el.classList && el.classList.contains("skip-link"));
    const first = bodyChildren.find((el) => el !== skipLink && el.tagName !== "SCRIPT");

    if (!first) return null;

    const className = (first.className || "").toString();
    const looksLikeHeader =
      first.tagName === "HEADER" ||
      first.id === "site-header" ||
      /\bheader\b/i.test(className);

    return looksLikeHeader ? first : null;
  }

  function mountHeader() {
    document.body.classList.add("unified-site-header");

    const target = findReplaceTarget();
    const skipLink = document.querySelector(".skip-link");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = headerMarkup().trim();
    const newHeader = wrapper.firstElementChild;

    if (target) {
      target.replaceWith(newHeader);
    } else if (skipLink && skipLink.parentNode) {
      skipLink.insertAdjacentElement("afterend", newHeader);
    } else {
      document.body.insertAdjacentElement("afterbegin", newHeader);
    }

    const header = document.getElementById("site-header");
    const nav = document.getElementById("site-nav");
    const toggle = header ? header.querySelector(".unified-menu-toggle") : null;

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        nav.classList.toggle("open", !expanded);
        nav.dataset.open = expanded ? "false" : "true";
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function () {
          toggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("open");
          nav.dataset.open = "false";
        });
      });
    }

    if (header) {
      const onScroll = function () {
        if (window.scrollY > 40) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHeader);
  } else {
    mountHeader();
  }
})();
