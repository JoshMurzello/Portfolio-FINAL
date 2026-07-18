const PROJECTS = [
  {
    id: "tesla",
    title: "Tesla",
    category: "internship",
    year: "2025",
    summary: "Battery manufacturing support for Model 3/Y from cell to pack out.",
    impact: "Designed fixtures, PLC systems, and automated stations during high-volume production ramp.",
    image: "./images/optimized/tesla-friends-1400.jpg",
    link: "tesla.html",
    proof: "Fixtures, PLC integration, validation plans, GD&T drawings",
    tags: ["Automation", "Wirebonding", "PLC", "Battery Pack"]
  },
  {
    id: "lg",
    title: "LG Electronics",
    category: "internship",
    year: "2024",
    summary: "Lab testing and electrical system validation for HVAC products.",
    impact: "Benchmarked performance and supported PCB-related test workflows for sensor and thermostat systems.",
    image: "./images/LG-Logo.png",
    imageMode: "contain",
    link: "lg.html",
    proof: "FEA studies, DFM revisions, defect-rate reduction",
    tags: ["PCB", "Testing", "HVAC", "R32"]
  },
  {
    id: "price",
    title: "Price Industries",
    category: "internship",
    year: "2023",
    summary: "Manufacturing floor optimization and asset automation work.",
    impact: "Improved throughput paths and supported machine setup for more reliable production cycles.",
    image: "./images/price.jpeg",
    link: "price.html",
    proof: "Floor observations, throughput analysis, process updates",
    tags: ["Manufacturing", "Optimization", "Process Engineering"]
  },
  {
    id: "bci",
    title: "Brain Controlled Interface",
    category: "project",
    year: "2024",
    summary: "Prototype interface translating EEG signals into actionable digital control.",
    impact: "Built an end-to-end experimental stack from data collection through interpretation and control mapping.",
    image: "./images/IMG_0754.JPG",
    link: "bci.html",
    proof: "EEG acquisition, signal thresholds, Arduino control loop",
    tags: ["BCI", "Machine Learning", "Python", "Signal Processing"]
  },
  {
    id: "sentry-rover",
    title: "Vision-Guided Sentry Rover",
    category: "project",
    year: "2024",
    summary: "A Raspberry Pi and STM32 rover that tracks, centers, and follows a person using camera and distance sensing.",
    impact: "Built the perception-to-actuation loop for human tracking, distance keeping, and a flywheel foam-ball response sequence.",
    image: "./images/optimized/engineer-cover-1800.jpg",
    link: "sentry-rover.html",
    proof: "Perception architecture, STM32 handoff, rover behavior states",
    tags: ["Raspberry Pi", "Pi Camera 3", "STM32", "ToF Sensor", "Computer Vision"]
  },
  {
    id: "print",
    title: "3D Printing Product Series",
    category: "project",
    year: "2024",
    summary: "Designed and iterated practical consumer-focused printed products.",
    impact: "Shipped multiple iterations from concept sketches to final usable designs.",
    image: "./images/A1picture.jpg",
    link: "3Dprint.html",
    proof: "CAD iteration, print testing, product photography, MakerWorld-ready assets",
    tags: ["CAD", "Rapid Prototyping", "Product Design"]
  },
  {
    id: "stl-animator",
    title: "STL Animator Tool",
    category: "project",
    filters: ["project", "ai-tool"],
    year: "2026",
    summary: "Browser-based tool for loading STL files and generating turntable, dolly, hero, split, and explode animation clips.",
    impact: "Runs fully client-side for static hosting, with upload-first workflow and in-browser recording export.",
    image: "./images/ME2110cadmodel.png",
    link: "tools/stl-animator/",
    proof: "Three.js viewer, client-side recording, static-hosted tool workflow",
    tags: ["Three.js", "WebGL", "STL", "Animation Tool"]
  }
];

function compareProjectsByYearDesc(a, b) {
  const categoryRank = (item) => (item.category === 'internship' ? 0 : 1);
  const rankA = categoryRank(a);
  const rankB = categoryRank(b);
  if (rankA !== rankB) return rankA - rankB;

  const yearA = Number(a.year) || 0;
  const yearB = Number(b.year) || 0;
  if (yearB !== yearA) return yearB - yearA;
  return a.title.localeCompare(b.title);
}

const SORTED_PROJECTS = [...PROJECTS].sort(compareProjectsByYearDesc);

const filters = [...document.querySelectorAll('.filter-chip')];
const filterGlide = document.querySelector('.filter-glide');
const projectList = document.getElementById('project-list');
const wallGrid = document.getElementById('wall-grid');

const spotlightRefs = {
  image: document.getElementById('spotlight-image'),
  category: document.getElementById('spotlight-category'),
  title: document.getElementById('spotlight-title'),
  summary: document.getElementById('spotlight-summary'),
  impact: document.getElementById('spotlight-impact'),
  tags: document.getElementById('spotlight-tags'),
  link: document.getElementById('spotlight-link')
};

let activeFilter = 'all';
let selectedId = SORTED_PROJECTS[0]?.id;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function categoryLabel(cat) {
  if (cat === 'internship') return 'Internship';
  if (cat === 'project') return 'Project';
  if (cat === 'ai-tool') return 'AI Tool';
  if (cat === 'research') return 'Research';
  return 'Work';
}

function matchesFilter(item, filter) {
  if (filter === 'all') return true;
  return (item.filters || [item.category]).includes(filter);
}

function getVisibleProjects() {
  return SORTED_PROJECTS.filter((item) => matchesFilter(item, activeFilter));
}

function updateSpotlight(project) {
  if (!project) return;
  spotlightRefs.image.src = project.image;
  spotlightRefs.image.alt = project.title + ' cover image';
  spotlightRefs.image.style.objectFit = project.imageMode === 'contain' ? 'contain' : 'cover';
  spotlightRefs.image.style.background = project.imageMode === 'contain' ? '#0f0f14' : 'transparent';
  spotlightRefs.category.textContent = categoryLabel(project.category) + ' • ' + project.year;
  spotlightRefs.title.textContent = project.title;
  spotlightRefs.summary.textContent = project.summary;
  spotlightRefs.impact.textContent = project.impact;
  spotlightRefs.link.href = project.link;
  spotlightRefs.link.textContent = 'View ' + project.title;
  spotlightRefs.tags.innerHTML = '';
  project.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.textContent = tag;
    spotlightRefs.tags.appendChild(span);
  });
}

function updateProjectButtonSelection() {
  const buttons = projectList.querySelectorAll('.project-button');
  buttons.forEach((btn) => {
    btn.classList.toggle('is-selected', btn.dataset.id === selectedId);
  });
}

function renderProjectList() {
  const visible = getVisibleProjects();

  if (!visible.some((item) => item.id === selectedId)) {
    selectedId = visible[0]?.id;
  }

  projectList.innerHTML = '';
  visible.forEach((project) => {
    const item = document.createElement('a');
    item.className = 'project-button' + (project.id === selectedId ? ' is-selected' : '');
    item.dataset.id = project.id;
    item.href = project.link;
    item.innerHTML = `
      <span class="title">${project.title}</span>
      <span class="meta">${categoryLabel(project.category)} • ${project.year}</span>
    `;
    item.addEventListener('mouseenter', () => {
      selectedId = project.id;
      updateProjectButtonSelection();
      updateSpotlight(project);
    });
    item.addEventListener('focus', () => {
      selectedId = project.id;
      updateProjectButtonSelection();
      updateSpotlight(project);
    });
    projectList.appendChild(item);
  });

  updateSpotlight(visible.find((item) => item.id === selectedId));
}

function renderWall() {
  const visible = getVisibleProjects();
  wallGrid.innerHTML = '';
  visible.forEach((project) => {
    const a = document.createElement('a');
    a.className = 'wall-card';
    a.href = project.link;
    a.innerHTML = `
      <img src="${project.image}" alt="${project.title} preview" loading="lazy" decoding="async" style="object-fit:${project.imageMode === 'contain' ? 'contain' : 'cover'}; background:${project.imageMode === 'contain' ? '#101117' : 'transparent'};">
      <div class="wall-card-body">
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <p class="proof-line">${project.proof}</p>
      </div>
    `;
    wallGrid.appendChild(a);
  });
}

function updateFilterGlide() {
  const active = document.querySelector('.filter-chip.is-active');
  if (!active || !filterGlide) return;
  const railRect = active.parentElement.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  filterGlide.style.width = activeRect.width + 'px';
  filterGlide.style.transform = `translateX(${activeRect.left - railRect.left}px)`;
}

function applyFilter(next) {
  activeFilter = next;
  filters.forEach((btn) => {
    const isActive = btn.dataset.filter === next;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  updateFilterGlide();
  renderProjectList();
  renderWall();
}

function initFilters() {
  filters.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'all'));
  });
  window.addEventListener('resize', updateFilterGlide);
}

function initReveal() {
  const nodes = document.querySelectorAll('.reveal');
  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    nodes.forEach((node) => node.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  nodes.forEach((node) => observer.observe(node));
}

function initTilt() {
  if (reduceMotion) return;
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 5;
      const rotateY = (x - 0.5) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initReveal();
  initTilt();
  applyFilter('all');
});
