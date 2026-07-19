(function () {
  const buildWallItems = [
    {
      title: "Battery Manufacturing",
      label: "Factory",
      category: "hardware",
      image: "./images/optimized/tesla-friends-1400.jpg",
      href: "tesla.html",
      copy: "Production fixtures, validation loops, PLC-backed measurement, and yield-focused engineering.",
      size: "wide"
    },
    {
      title: "Vision Rover",
      label: "Robotics",
      category: "hardware",
      image: "./images/optimized/engineer-cover-1800.jpg",
      href: "sentry-rover.html",
      copy: "Camera tracking, distance sensing, STM32 handoff, and state-based physical response.",
      size: "tall"
    },
    {
      title: "BCI Prototype",
      label: "Signal",
      category: "hardware",
      image: "./images/IMG_0754.JPG",
      href: "bci.html",
      copy: "EEG acquisition, threshold tuning, and a physical control layer built from noisy input."
    },
    {
      title: "STL Animator",
      label: "Tool",
      category: "cad",
      image: "./images/ME2110cadmodel.png",
      href: "tools/stl-animator/",
      copy: "A browser tool for turning static CAD meshes into motion-ready clips."
    },
    {
      title: "Printed Products",
      label: "Product",
      category: "product",
      image: "./images/A1picture.jpg",
      href: "3Dprint.html",
      copy: "Useful everyday objects shaped through fast CAD, print, test, and photo cycles.",
      size: "wide"
    },
    {
      title: "Studio Lens",
      label: "Creative",
      category: "creative",
      image: "./images/camerame.png",
      href: "Creatives.html",
      copy: "Visual documentation that makes the technical work easier to feel and remember."
    },
    {
      title: "Portrait System",
      label: "Creative",
      category: "creative",
      image: "./images/phillu good closeup.jpg",
      href: "Creatives.html",
      copy: "Color, expression, and composition treated as a repeatable visual system."
    },
    {
      title: "Product Drop",
      label: "Product",
      category: "product",
      image: "./images/toothbrush with brush.png",
      href: "stl-drops.html",
      copy: "A richer release pattern for turning free STL files into audience-building artifacts."
    }
  ];

  function initReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      items.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initTabs() {
    const groups = document.querySelectorAll("[data-tab-group]");
    groups.forEach((group) => {
      const buttons = group.querySelectorAll("[data-tab-target]");
      const panels = group.querySelectorAll("[data-tab-panel]");
      if (!buttons.length || !panels.length) return;

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const target = button.getAttribute("data-tab-target");
          buttons.forEach((candidate) => {
            const isActive = candidate === button;
            candidate.classList.toggle("is-active", isActive);
            candidate.setAttribute("aria-selected", isActive ? "true" : "false");
          });

          panels.forEach((panel) => {
            const isActive = panel.getAttribute("data-tab-panel") === target;
            panel.classList.toggle("is-active", isActive);
          });
        });
      });
    });
  }

  function initContactForms() {
    document.querySelectorAll(".inhouse-contact-form").forEach((form) => {
      if (form.dataset.bound === "true") return;
      form.dataset.bound = "true";

      const status = form.querySelector(".contact-status");
      const contactEmail = form.getAttribute("data-contact-email") || "murzello.josh@gmail.com";

      const setStatus = (message, isError) => {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle("error", Boolean(isError));
      };

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const honeypot = form.querySelector("input[name='website']");
        if (honeypot && honeypot.value.trim()) return;

        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !subject || !message) {
          setStatus("Please complete every field before sending.", true);
          return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          setStatus("Please enter a valid email address.", true);
          return;
        }

        const mailSubject = encodeURIComponent(subject);
        const mailBody = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;
        setStatus("Opening your email app...");
        form.reset();
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetSelector = link.getAttribute("href");
        if (!targetSelector || targetSelector === "#") return;
        const target = document.querySelector(targetSelector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initHeroInteraction() {
    const hero = document.querySelector(".hero");
    const blueprint = document.querySelector(".hero-blueprint");
    if (!hero || !blueprint) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      blueprint.style.setProperty("--hero-x", `${x.toFixed(2)}%`);
      blueprint.style.setProperty("--hero-y", `${y.toFixed(2)}%`);
    });
  }

  function initRotatingWords() {
    const node = document.querySelector(".rotating-word");
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const words = (node.dataset.words || "").split(",").map((word) => word.trim()).filter(Boolean);
    if (words.length < 2) return;

    let index = Math.max(0, words.indexOf(node.textContent.trim()));
    window.setInterval(() => {
      index = (index + 1) % words.length;
      if (typeof node.animate !== "function") {
        node.textContent = words[index];
        return;
      }
      node.animate(
        [
          { opacity: 1 },
          { opacity: 0 }
        ],
        { duration: 180, easing: "ease-out" }
      ).onfinish = () => {
        node.textContent = words[index];
        node.animate(
          [
            { opacity: 0 },
            { opacity: 1 }
          ],
          { duration: 220, easing: "ease-out" }
        );
      };
    }, 3600);
  }

  function initCardLight() {
    const cards = document.querySelectorAll(".feature-card, .metric-card, .card");
    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--card-x", `${x.toFixed(2)}%`);
        card.style.setProperty("--card-y", `${y.toFixed(2)}%`);
      });
    });
  }

  function renderBuildWall(filter = "all") {
    const wall = document.getElementById("build-wall");
    if (!wall) return;

    const items = buildWallItems.filter((item) => filter === "all" || item.category === filter);
    wall.innerHTML = items.map((item) => {
      return `
        <a class="build-tile" href="${item.href}">
          <span class="build-tile-media" style="background-image:url('${item.image}');" aria-hidden="true"></span>
          <span class="build-tile-body">
            <span class="build-tile-label">${item.label}</span>
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </span>
        </a>
      `;
    }).join("");
  }

  function initBuildWall() {
    const buttons = document.querySelectorAll(".build-filter");
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.buildFilter || "all";
        buttons.forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", active ? "true" : "false");
        });
        renderBuildWall(filter);
      });
    });

    renderBuildWall("all");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveals();
    initTabs();
    initContactForms();
    initSmoothScroll();
    initHeroInteraction();
    initRotatingWords();
    initCardLight();
    initBuildWall();
  });
})();
