(function () {
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
      const contactEmail = form.getAttribute("data-contact-email") || "Josh.Marzello@gmail.com";

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

  document.addEventListener("DOMContentLoaded", () => {
    initReveals();
    initTabs();
    initContactForms();
    initSmoothScroll();
    initHeroInteraction();
    initRotatingWords();
    initCardLight();
  });
})();
