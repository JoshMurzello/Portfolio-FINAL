const STORAGE_PREFIX = "stl-drop-unlocked:";

const DROPS = [
  {
    id: "toothbrush-holder",
    title: "Toothbrush Holder",
    slug: "toothbrush-holder",
    thumbnail: "./images/toothbrush with brush.png",
    summary: "A playful bathroom organizer framed like a product drop instead of a loose file dump.",
    buildVideoUrl: "https://www.youtube.com/embed/vXWEqWA96l0?start=1",
    printNotes: [
      "Designed as a fast-print utility object with enough personality to feel giftable.",
      "This slot is where final setup notes, support notes, and fitment callouts will live.",
      "Use the post-unlock panel to keep people on the page with media and next-step prompts."
    ],
    downloadLabel: "View product page",
    downloadUrl: "3Dprint.html",
    status: "locked",
    printerCompatibility: "Best suited for standard FDM printers with a flat bed and normal cooling.",
    printTime: "Estimate 2h 40m",
    material: "PLA or PETG",
    layerHeight: "0.20 mm"
  },
  {
    id: "spiral-container",
    title: "Spiral Storage Container",
    slug: "spiral-storage-container",
    thumbnail: "./images/spiral holder with items.png",
    summary: "A simple utility print with enough shape language to feel like part organizer, part decor piece.",
    buildVideoUrl: "",
    printNotes: [
      "This drop demonstrates the no-video release state for products that are ready before a process edit is published.",
      "Final notes can cover tolerance fit, support strategy, and how the form evolved through iteration."
    ],
    downloadLabel: "View product page",
    downloadUrl: "3Dprint.html",
    status: "locked",
    printerCompatibility: "Standard FDM printers with moderate overhang cooling.",
    printTime: "Estimate 3h 10m",
    material: "PLA",
    layerHeight: "0.24 mm"
  },
  {
    id: "guitar-holder",
    title: "Guitar Holder",
    slug: "guitar-holder",
    thumbnail: "./images/guitar holder with guitar.png",
    summary: "A wall-mount concept that lets the file live next to the story of the build and the use case it solves.",
    buildVideoUrl: "https://www.youtube.com/embed/m1027_95uUI",
    printNotes: [
      "This is where structural caveats, mounting guidance, and version history can live once finalized.",
      "The framework keeps notes per drop so each release can feel specific instead of using one generic FAQ."
    ],
    downloadLabel: "View product page",
    downloadUrl: "3Dprint.html",
    status: "locked",
    printerCompatibility: "Use reinforced wall-mount settings and test fit before loading.",
    printTime: "Estimate 4h 15m",
    material: "PETG",
    layerHeight: "0.20 mm"
  }
];

const state = {
  activeDropId: DROPS[0]?.id || null,
  submittingDropId: null
};

const featuredCardEl = document.getElementById("featured-card");
const detailEl = document.getElementById("drop-detail");
const dropGridEl = document.getElementById("drop-grid");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getUnlockedStorageKey(dropId) {
  return `${STORAGE_PREFIX}${dropId}`;
}

function isDropUnlocked(dropId) {
  return window.localStorage.getItem(getUnlockedStorageKey(dropId)) === "true";
}

function setDropUnlocked(dropId) {
  window.localStorage.setItem(getUnlockedStorageKey(dropId), "true");
}

function getActiveDrop() {
  return DROPS.find((drop) => drop.id === state.activeDropId) || DROPS[0];
}

function getResolvedStatus(drop) {
  if (state.submittingDropId === drop.id) return "submitting";
  if (isDropUnlocked(drop.id)) return "unlocked";
  return drop.status || "locked";
}

function getStatusLabel(status) {
  if (status === "submitting") return "Unlocking";
  if (status === "unlocked") return "Unlocked";
  return "Locked";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function subscribeAndUnlock({ dropId, email }) {
  return new Promise((resolve, reject) => {
    if (!dropId) {
      reject(new Error("Missing drop id."));
      return;
    }

    if (!validateEmail(email)) {
      reject(new Error("Enter a valid email to unlock the STL."));
      return;
    }

    window.setTimeout(() => {
      resolve({
        ok: true,
        dropId
      });
    }, 850);
  });
}

function getDownloadUrl(dropId) {
  const drop = DROPS.find((item) => item.id === dropId);
  if (!drop || !drop.downloadUrl || drop.downloadUrl === "#") return null;
  return drop.downloadUrl;
}

function renderFeaturedCard(drop) {
  const status = getResolvedStatus(drop);
  featuredCardEl.innerHTML = `
    <div class="featured-card-shell">
      <div class="featured-visual" style="background-image: url('${escapeHtml(drop.thumbnail)}');"></div>
      <div class="featured-copy">
        <div class="status-row">
          <span class="status-pill" data-status="${status === "submitting" ? "locked" : status}">${getStatusLabel(status)}</span>
          <span class="meta-pill">Creator-led free drop</span>
        </div>
        <h3>${escapeHtml(drop.title)}</h3>
        <p>${escapeHtml(drop.summary)}</p>
        <div class="unlock-support">Unlock the full drop: the file, the build context, and future releases worth opening.</div>
      </div>
    </div>
  `;
}

function renderVideoPanel(drop) {
  if (drop.buildVideoUrl) {
    return `
      <div class="video-frame media-panel">
        <h3>Related build video</h3>
        <p>Keep the motion and story next to the file so the download feels like part of a release.</p>
        <iframe
          src="${escapeHtml(drop.buildVideoUrl)}"
          title="${escapeHtml(drop.title)} build video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;
  }

  return `
    <div class="video-frame media-panel">
      <div class="media-placeholder">
        <h3>Video slot ready</h3>
        <p>This release ships with still images first. Add a YouTube or hosted build edit later without changing the layout.</p>
      </div>
    </div>
  `;
}

function renderUnlockPanel(drop) {
  const status = getResolvedStatus(drop);
  const downloadUrl = getDownloadUrl(drop.id);

  if (status === "unlocked") {
    return `
      <section class="unlock-panel unlock-success" aria-live="polite">
        <span class="success-pill">Unlocked</span>
        <h3>${escapeHtml(drop.title)} is ready.</h3>
        <p>The file is now available and the rest of the page shifts toward engagement instead of stopping at the download.</p>
        <div class="unlock-actions">
          <a class="download-button ${downloadUrl ? "" : "is-disabled"}" href="${downloadUrl || "#"}"${downloadUrl ? " download" : ' aria-disabled="true"'}>${escapeHtml(drop.downloadLabel)}</a>
          <a class="ghost-button" href="#community">See the community loop</a>
        </div>
        <div class="support-panel">
          <h3>Keep them engaged after unlock</h3>
          <ul class="next-step-list">
            <li>Watch the build and connect the file back to the story.</li>
            <li>Reply with what I should design next.</li>
            <li>Tag me if you print this or remix it.</li>
            <li>Check the other free drops in the archive.</li>
          </ul>
        </div>
      </section>
    `;
  }

  const loading = status === "submitting";
  const message = loading ? "Unlocking the drop..." : "";
  const tone = loading ? "success" : "";

  return `
    <section class="unlock-panel ${loading ? "is-loading" : ""}">
      <p class="panel-label">Unlock the file</p>
      <h3>Unlock the full drop.</h3>
      <p>Enter your email to unlock the STL, build notes, and future drops. The promise is simple: occasional updates only, and only when there is something worth sending.</p>
      <form class="unlock-form" data-drop-form="${escapeHtml(drop.id)}" novalidate>
        <div class="field">
          <label for="unlock-email-${escapeHtml(drop.id)}">Email address</label>
          <input id="unlock-email-${escapeHtml(drop.id)}" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required>
        </div>
        <div class="checkbox-field">
          <input id="unlock-consent-${escapeHtml(drop.id)}" name="consent" type="checkbox">
          <label for="unlock-consent-${escapeHtml(drop.id)}">I am okay hearing about future free print drops and occasional related updates.</label>
        </div>
        <button class="unlock-submit" type="submit"${loading ? " disabled" : ""}>${loading ? "Unlocking..." : "Unlock STL"}</button>
        <p class="form-message" data-tone="${tone}" role="status" aria-live="polite">${escapeHtml(message)}</p>
      </form>
    </section>
  `;
}

function renderDetail(drop) {
  const status = getResolvedStatus(drop);
  detailEl.innerHTML = `
    <div class="drop-detail-shell">
      <div class="detail-top">
        <div class="preview-panel">
          <div class="detail-copy">
            <div class="status-row">
              <span class="status-pill" data-status="${status === "submitting" ? "locked" : status}">${getStatusLabel(status)}</span>
              <span class="meta-pill">/${escapeHtml(drop.slug)}</span>
            </div>
            <h2 id="drop-detail-title">${escapeHtml(drop.title)}</h2>
            <p>Unlock the full drop, then keep the momentum with the story, settings, and next action around the file.</p>
          </div>
          <div class="preview-frame" style="background-image: url('${escapeHtml(drop.thumbnail)}');">
            <div class="preview-badges">
              <span class="meta-pill">${escapeHtml(drop.material)}</span>
              <span class="meta-pill">${escapeHtml(drop.layerHeight)}</span>
            </div>
          </div>
        </div>
        ${renderVideoPanel(drop)}
      </div>
      <div class="detail-bottom">
        <div class="info-panels">
          <section class="notes-card">
            <h3>Print notes</h3>
            <ul class="notes-list">
              ${drop.printNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
            </ul>
          </section>
          <section class="spec-card">
            <h3>Compatibility and settings</h3>
            <div class="spec-grid">
              <p><strong>Printer fit</strong>${escapeHtml(drop.printerCompatibility)}</p>
              <p><strong>Print time</strong>${escapeHtml(drop.printTime)}</p>
              <p><strong>Material</strong>${escapeHtml(drop.material)}</p>
              <p><strong>Layer height</strong>${escapeHtml(drop.layerHeight)}</p>
            </div>
          </section>
        </div>
        ${renderUnlockPanel(drop)}
      </div>
    </div>
  `;
}

function renderArchive() {
  const activeId = state.activeDropId;
  dropGridEl.innerHTML = DROPS.map((drop) => {
    const status = getResolvedStatus(drop);
    return `
      <button class="archive-card ${drop.id === activeId ? "is-active" : ""}" type="button" data-drop-select="${escapeHtml(drop.id)}" aria-pressed="${drop.id === activeId ? "true" : "false"}">
        <div class="archive-thumb" style="background-image: url('${escapeHtml(drop.thumbnail)}');"></div>
        <div class="archive-body">
          <div class="status-row">
            <span class="status-pill" data-status="${status === "submitting" ? "locked" : status}">${getStatusLabel(status)}</span>
          </div>
          <h3>${escapeHtml(drop.title)}</h3>
          <p>${escapeHtml(drop.summary)}</p>
          <div class="archive-meta">
            <span class="meta-pill">${escapeHtml(drop.material)}</span>
            <span class="meta-pill">${escapeHtml(drop.printTime)}</span>
          </div>
        </div>
      </button>
    `;
  }).join("");
}

function renderAll() {
  const activeDrop = getActiveDrop();
  renderFeaturedCard(activeDrop);
  renderDetail(activeDrop);
  renderArchive();
}

function setActiveDrop(dropId) {
  if (!DROPS.some((drop) => drop.id === dropId)) return;
  state.activeDropId = dropId;
  renderAll();
  bindDynamicEvents();
}

function handleArchiveClick(event) {
  const button = event.target.closest("[data-drop-select]");
  if (!button) return;
  setActiveDrop(button.getAttribute("data-drop-select"));
}

function handleUnlockSubmit(event) {
  const form = event.target.closest("[data-drop-form]");
  if (!form) return;

  event.preventDefault();
  const dropId = form.getAttribute("data-drop-form");
  const emailInput = form.querySelector('input[name="email"]');
  const consentInput = form.querySelector('input[name="consent"]');
  const messageEl = form.querySelector(".form-message");
  const email = emailInput ? emailInput.value.trim() : "";
  const consent = Boolean(consentInput?.checked);

  if (!validateEmail(email)) {
    if (messageEl) {
      messageEl.textContent = "Enter a valid email to unlock the STL.";
      messageEl.dataset.tone = "error";
    }
    emailInput?.focus();
    return;
  }

  state.submittingDropId = dropId;
  renderAll();
  bindDynamicEvents();

  subscribeAndUnlock({ dropId, email, consent })
    .then(() => {
      setDropUnlocked(dropId);
      state.submittingDropId = null;
      renderAll();
      bindDynamicEvents();
    })
    .catch((error) => {
      state.submittingDropId = null;
      renderAll();
      bindDynamicEvents();
      const nextForm = document.querySelector(`[data-drop-form="${dropId}"]`);
      const nextMessage = nextForm?.querySelector(".form-message");
      if (nextMessage) {
        nextMessage.textContent = error instanceof Error ? error.message : "Unable to unlock the STL right now.";
        nextMessage.dataset.tone = "error";
      }
    });
}

function bindDynamicEvents() {
  dropGridEl.querySelectorAll("[data-drop-select]").forEach((button) => {
    button.addEventListener("click", handleArchiveClick);
  });

  detailEl.querySelectorAll("[data-drop-form]").forEach((form) => {
    form.addEventListener("submit", handleUnlockSubmit);
  });
}

function setupRevealObserver() {
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealEls.forEach((element) => observer.observe(element));
}

renderAll();
bindDynamicEvents();
setupRevealObserver();

window.stlDropsAdapter = {
  subscribeAndUnlock,
  getDownloadUrl
};
