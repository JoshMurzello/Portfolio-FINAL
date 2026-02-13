const PROJECTS = [
  {
    id: "city-after-hours",
    title: "Engineering Through My Lens",
    year: "2025",
    role: "Videographer, Editor, Builder",
    tools: ["Sony a6700"],
    categories: ["video", "experiments"],
    featured: true,
    thumbnail: "./images/camerame.png",
    thumbAlt: "Camera setup used to document engineering builds",
    summary: "Cinematic build documentation from prototype sketches to final assembly, designed to make engineering feel human and high-energy.",
    story: "This series documents real build sessions: fabrication, wiring, assembly, and iteration. The visual approach mixes tight detail shots and process storytelling so every project feels like both an engineering log and a short film.",
    links: [
      { label: "Watch Cut (placeholder)", url: "#" },
      { label: "Behind the Scenes (placeholder)", url: "#" }
    ],
    media: [
      {
        type: "embed",
        src: "https://www.youtube.com/embed/vXWEqWA96l0?si=6SeovOf7xar-Cbvd&start=1",
        title: "Engineering Through My Lens YouTube showcase"
      },
      {
        type: "embed",
        src: "https://www.youtube.com/embed/m1027_95uUI?si=JAz2yA0cgrTjqTUx",
        title: "Engineering Through My Lens secondary YouTube showcase"
      },
      { type: "image", src: "./images/camerame.png", alt: "Camera and creator setup for engineering documentation" },
      { type: "image", src: "./images/Make this (1).png", alt: "Engineering build photo from camera roll" }
    ]
  },
  {
    id: "portrait-language",
    title: "Portrait Language",
    year: "2024",
    role: "Photographer, Colorist",
    tools: ["Sony A7", "Lightroom", "Photoshop"],
    categories: ["photo", "design"],
    featured: true,
    thumbnail: "./images/phillu good closeup.jpg",
    thumbAlt: "Portrait close-up with warm cinematic color grade",
    summary: "Portrait sessions where expression and color grading are treated as one system.",
    story: "This project pushed me to art-direct location, wardrobe, and grade as one composition. Every frame is designed for emotional clarity first.",
    links: [{ label: "Full Set (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/phillu good closeup.jpg", alt: "Portrait close-up" },
      { type: "image", src: "./images/DSC00008.jpg", alt: "Natural light portrait" },
      { type: "image", src: "./images/DSC00015.jpg", alt: "Waterfall portrait scene" }
    ]
  },
  {
    id: "studio-identity-kit",
    title: "Studio Identity Kit",
    year: "2025",
    role: "Creative Director, Designer",
    tools: ["Figma", "Illustrator", "After Effects"],
    categories: ["design", "experiments"],
    featured: true,
    thumbnail: "./images/IMG_0848.png",
    thumbAlt: "Studio visual identity moodboard",
    summary: "A visual system for Murzello Studios: tone, type, motion, and templates.",
    story: "This is where creative ops meets style. The objective was consistency without losing personality across social cuts, thumbnails, and campaign posts.",
    links: [{ label: "Brand Deck (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/IMG_0848.png", alt: "Identity reference board" },
      { type: "placeholder", label: "Motion styleframes placeholder" }
    ]
  },
  {
    id: "fabrication-aesthetic",
    title: "Fabrication Aesthetic",
    year: "2026",
    role: "Designer, Prototype Builder",
    tools: ["Fusion 360", "Bambu Studio", "Keyshot"],
    categories: ["3d", "design"],
    featured: true,
    thumbnail: "./images/A1picture.jpg",
    thumbAlt: "3D printed object displayed with dramatic lighting",
    summary: "Product form studies where mechanical constraints become visual language.",
    story: "I approached this like a concept album: each printed iteration tells a chapter about utility, silhouette, and tactility.",
    links: [{ label: "Process Notes (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/A1picture.jpg", alt: "3D print prototype" },
      { type: "image", src: "./images/toothbrush holder.png", alt: "Prototype variation" },
      { type: "placeholder", label: "Turntable video placeholder" }
    ]
  },
  {
    id: "travel-essay-greenville",
    title: "Greenville Essay",
    year: "2024",
    role: "Photographer",
    tools: ["Sony A7", "Lightroom"],
    categories: ["photo"],
    featured: false,
    thumbnail: "./images/Greenville.jpg",
    thumbAlt: "Greenville skyline during golden hour",
    summary: "A warm-toned travel series focused on architecture and motion.",
    story: "Shot over one weekend with a simple brief: no staged scenes, only honest city rhythm.",
    links: [{ label: "Gallery (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/Greenville.jpg", alt: "Greenville skyline" },
      { type: "image", src: "./images/DSC00122.jpg", alt: "Street perspective" }
    ]
  },
  {
    id: "band-visual-pack",
    title: "Band Visual Pack",
    year: "2024",
    role: "Photographer, Retoucher",
    tools: ["Lightroom", "Photoshop"],
    categories: ["photo", "design"],
    featured: false,
    thumbnail: "./images/DSC00102.jpg",
    thumbAlt: "Band portrait in performance setting",
    summary: "Cover, social, and promo visual assets for live music rollout.",
    story: "The visual objective was gritty but polished. We used high-contrast grading and constrained color accents.",
    links: [{ label: "Campaign Assets (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/DSC00102.jpg", alt: "Band group shot" },
      { type: "image", src: "./images/DSC00038.jpg", alt: "Performance-adjacent atmosphere" }
    ]
  },
  {
    id: "build-log-cuts",
    title: "Build Log Cuts",
    year: "2025",
    role: "Shooter, Editor",
    tools: ["Premiere Pro", "After Effects"],
    categories: ["video", "3d"],
    featured: false,
    thumbnail: "./images/skateboard.jpg",
    thumbAlt: "Engineering build clip keyframe",
    summary: "Short-form cuts documenting builds from sketch to final prototype.",
    story: "I designed a repeatable edit system: hooks at 2 seconds, tactile closeups, and process overlays for clarity.",
    links: [{ label: "Reel (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/skateboard.jpg", alt: "Build process hero frame" },
      { type: "placeholder", label: "Short-form reel embed placeholder" }
    ]
  },
  {
    id: "signal-visual-study",
    title: "Signal Visual Study",
    year: "2026",
    role: "Experiment Lead",
    tools: ["TouchDesigner", "Python", "After Effects"],
    categories: ["experiments", "design"],
    featured: false,
    thumbnail: "./images/mars.png",
    thumbAlt: "Abstract signal visual experimentation",
    summary: "Generative visual experiments inspired by bio-signal patterns.",
    story: "A bridge between engineering and art direction: translating noisy data into visual rhythm.",
    links: [{ label: "Prototype Notes (placeholder)", url: "#" }],
    media: [
      { type: "image", src: "./images/mars.png", alt: "Generative visual reference" },
      { type: "placeholder", label: "Interactive demo placeholder" }
    ]
  }
];

/*
HOW TO ADD A NEW PROJECT
1. Duplicate one object inside PROJECTS above.
2. Set a unique id (kebab-case), title, year, role, summary, and story.
3. Add categories from: "video", "photo", "design", "3d", "experiments".
4. Set featured: true to show in Featured Works (max recommended: 6).
5. Update thumbnail and media paths (use local /images/... files).
6. Add links (or keep placeholder # links while drafting).
7. Save and refresh: cards + modal are generated automatically.
*/

const featuredGrid = document.getElementById("featured-grid");
const galleryGrid = document.getElementById("gallery-grid");
const chips = [...document.querySelectorAll(".filter-chip")];
const filterGlide = document.querySelector(".filter-glide");
const modal = document.getElementById("project-modal");
let lastFocusedElement = null;

const modalRefs = {
  title: document.getElementById("modal-title"),
  category: document.getElementById("modal-category"),
  summary: document.getElementById("modal-summary"),
  role: document.getElementById("modal-role"),
  tools: document.getElementById("modal-tools"),
  story: document.getElementById("modal-story"),
  media: document.getElementById("modal-media"),
  links: document.getElementById("modal-links")
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeFilter = "all";

function projectMatchesFilter(project, filter) {
  if (filter === "all") return true;
  return project.categories.includes(filter);
}

function createTag(label) {
  const span = document.createElement("span");
  span.textContent = label;
  return span;
}

function createWorkCard(project, large = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `work-card ${large ? "featured-large" : "featured-small"}`;
  button.dataset.id = project.id;
  button.dataset.categories = project.categories.join(" ");
  button.setAttribute("aria-label", `Open case study: ${project.title}`);

  button.innerHTML = `
    <div class="media">
      <img src="${project.thumbnail}" alt="${project.thumbAlt}">
    </div>
    <div class="card-body">
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="meta"></div>
    </div>
  `;

  const metaEl = button.querySelector(".meta");
  project.categories.forEach((cat) => metaEl.appendChild(createTag(cat)));

  button.addEventListener("click", () => openModal(project.id));
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(project.id);
    }
  });

  return button;
}

function renderFeatured() {
  const featured = PROJECTS.filter((project) => project.featured);
  featuredGrid.innerHTML = "";

  featured.forEach((project, index) => {
    const card = createWorkCard(project, index % 3 === 0);
    featuredGrid.appendChild(card);
  });
}

function renderGallery(filter = "all") {
  const galleryProjects = PROJECTS.filter((project) => !project.featured);
  galleryGrid.innerHTML = "";

  galleryProjects.forEach((project) => {
    const wrapper = document.createElement("article");
    wrapper.className = "gallery-item";
    wrapper.dataset.id = project.id;
    wrapper.dataset.categories = project.categories.join(" ");

    if (!projectMatchesFilter(project, filter)) {
      wrapper.hidden = true;
    }

    const card = createWorkCard(project);
    wrapper.appendChild(card);
    galleryGrid.appendChild(wrapper);

    if (!wrapper.hidden) {
      requestAnimationFrame(() => wrapper.classList.add("is-visible"));
    }
  });
}

function applyFilter(nextFilter) {
  activeFilter = nextFilter;

  chips.forEach((chip) => {
    const isActive = chip.dataset.filter === nextFilter;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  updateFilterGlide();

  const items = [...galleryGrid.querySelectorAll(".gallery-item")];
  items.forEach((item) => {
    const categories = (item.dataset.categories || "").split(" ");
    const show = nextFilter === "all" || categories.includes(nextFilter);

    if (show) {
      item.hidden = false;
      requestAnimationFrame(() => item.classList.add("is-visible"));
    } else {
      item.classList.remove("is-visible");
      setTimeout(() => {
        item.hidden = true;
      }, prefersReducedMotion ? 0 : 180);
    }
  });

  const featuredCards = [...featuredGrid.querySelectorAll(".work-card")];
  featuredCards.forEach((card) => {
    const categories = (card.dataset.categories || "").split(" ");
    const show = nextFilter === "all" || categories.includes(nextFilter);
    card.hidden = !show;
  });
}

function updateFilterGlide() {
  const activeChip = document.querySelector(".filter-chip.is-active");
  if (!activeChip || !filterGlide) return;

  const railBox = activeChip.parentElement.getBoundingClientRect();
  const chipBox = activeChip.getBoundingClientRect();
  filterGlide.style.width = `${chipBox.width}px`;
  filterGlide.style.transform = `translateX(${chipBox.left - railBox.left}px)`;
}

function toCategoryLabel(categories) {
  return categories
    .map((item) => item.toUpperCase())
    .join(" / ");
}

function renderModalMedia(project) {
  modalRefs.media.innerHTML = "";

  project.media.forEach((asset) => {
    const figure = document.createElement("figure");

    if (asset.type === "image") {
      const img = document.createElement("img");
      img.src = asset.src;
      img.alt = asset.alt || "Project media";
      figure.appendChild(img);
    } else if (asset.type === "embed") {
      const iframe = document.createElement("iframe");
      iframe.src = asset.src;
      iframe.title = asset.title || "Embedded media";
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      figure.appendChild(iframe);
    } else {
      const box = document.createElement("div");
      box.className = "media-placeholder";
      box.textContent = asset.label || "Media placeholder";
      figure.appendChild(box);
    }

    modalRefs.media.appendChild(figure);
  });
}

function renderModalLinks(project) {
  modalRefs.links.innerHTML = "";
  project.links.forEach((entry) => {
    const link = document.createElement("a");
    link.href = entry.url;
    link.target = entry.url.startsWith("http") ? "_blank" : "_self";
    link.rel = entry.url.startsWith("http") ? "noopener" : "";
    link.textContent = entry.label;
    modalRefs.links.appendChild(link);
  });
}

function openModal(projectId) {
  const project = PROJECTS.find((item) => item.id === projectId);
  if (!project || !modal) return;
  lastFocusedElement = document.activeElement;

  modalRefs.title.textContent = project.title;
  modalRefs.category.textContent = toCategoryLabel(project.categories);
  modalRefs.summary.textContent = project.summary;
  modalRefs.role.textContent = project.role;
  modalRefs.tools.textContent = project.tools.join(", ");
  modalRefs.story.textContent = project.story;

  renderModalMedia(project);
  renderModalLinks(project);

  document.body.style.overflow = "hidden";
  modal.showModal();

  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!modal.open) return;
  modal.close();
  document.body.style.overflow = "";
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function initModal() {
  if (!modal) return;

  modal.addEventListener("click", (event) => {
    const content = modal.querySelector(".modal-content");
    if (!content) return;
    const bounds = content.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outside) closeModal();
  });

  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = modal.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
}

function initHeaderAndMenu() {
  const header = document.getElementById("site-header");
  const nav = document.getElementById("site-nav");
  const menuBtn = document.querySelector(".menu-toggle");

  const updateHeader = () => {
    if (!header) return;
    header.style.borderColor = window.scrollY > 40 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)";
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.dataset.open === "true";
      nav.dataset.open = open ? "false" : "true";
      menuBtn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  }
}

function initReveals() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    revealItems.forEach((item) => item.classList.add("is-revealed"));
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

  revealItems.forEach((item) => observer.observe(item));
}

function initHeroParallax() {
  if (prefersReducedMotion) return;
  const hero = document.querySelector(".hero");
  const haloA = document.querySelector(".halo-a");
  const haloB = document.querySelector(".halo-b");
  if (!hero || !haloA || !haloB) return;

  let pointerX = 0;
  let pointerY = 0;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  const tick = () => {
    haloA.style.transform = `translate(${pointerX * 12}px, ${pointerY * 10}px)`;
    haloB.style.transform = `translate(${pointerX * -10}px, ${pointerY * -8}px)`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function initFilters() {
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      applyFilter(chip.dataset.filter || "all");
    });
  });

  window.addEventListener("resize", updateFilterGlide);
  updateFilterGlide();
}

function init() {
  renderFeatured();
  renderGallery("all");
  initModal();
  initHeaderAndMenu();
  initFilters();
  initHeroParallax();
  initReveals();
  applyFilter("all");
}

document.addEventListener("DOMContentLoaded", init);
