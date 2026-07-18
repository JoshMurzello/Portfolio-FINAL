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

  document.addEventListener("DOMContentLoaded", () => {
    initReveals();
    initTabs();
    initContactForms();
    initSmoothScroll();
  });
})();
