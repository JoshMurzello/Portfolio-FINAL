const PROJECTS = [
  {
    id: "spacex",
    title: "SpaceX Avionics Manufacturing",
    category: "internship",
    year: "2026",
    summary: "Manufacturing engineering work supporting Starship avionics hardware through automation, vendor build readiness, inspection requirements, and traceable production processes.",
    impact: "Connected fixture design, automation software, OCR-based inspection, supplier quality, and production documentation into repeatable avionics manufacturing workflows.",
    image: "./images/optimized/spacex-cover-1800.jpg",
    link: "spacex.html",
    proof: "Automation, vendor build readiness, inspection requirements, and traceable production processes",
    flow: ["Hardware", "Inspection + traceability", "Production"],
    artifacts: {
      cad: { title: "Fixture design", copy: "Fixture design supported repeatable avionics manufacturing workflows." },
      build: { title: "Production readiness", copy: "Automation software and vendor build readiness connected hardware to repeatable production processes." },
      test: { title: "Inspection requirements", copy: "OCR-based inspection and supplier quality requirements supported traceable hardware acceptance." },
      result: { title: "Manufacturing impact", copy: "Production documentation connected the work into repeatable avionics manufacturing workflows." }
    },
    tags: ["Avionics", "Automation", "OCR Inspection", "Supplier Quality"]
  },
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
    flow: ["Constraint", "Fixture + PLC", "Yield"],
    artifacts: {
      cad: { title: "Fixture architecture", copy: "Measurement fixtures, rail components, tolerance stack-ups, and station-ready hardware packaged for production use." },
      build: { title: "Factory integration", copy: "Sensor placement, PLC feedback, vendor-machined components, and deployment constraints handled under ramp pressure." },
      test: { title: "Validation matrix", copy: "DOE, gage R&R, MSA, acceptance criteria, and alignment tolerance checks used to protect station readiness." },
      result: { title: "Production impact", copy: "Manual checks reduced, rework risk lowered, alignment brought into tolerance, and first-pass yield stabilized." }
    },
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
    flow: ["Defect", "FEA + DFM", "Reliability"],
    artifacts: {
      cad: { title: "Housing geometry", copy: "GD&T-controlled sensor housing work focused on preserving critical tolerances while reducing assembly friction." },
      build: { title: "PCBA support", copy: "Mounting structures and reinforcement options shaped around real assembly and vibration constraints." },
      test: { title: "Stress analysis", copy: "FEA and manufacturing feedback loops used to identify weak points and guide design revisions." },
      result: { title: "Defect reduction", copy: "Assembly errors and recurring PCBA defects reduced through targeted DFM and root-cause work." }
    },
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
    flow: ["Floor data", "Process map", "Throughput"],
    artifacts: {
      cad: { title: "Layout thinking", copy: "Production paths and station constraints mapped to understand where material, people, and machine timing created drag." },
      build: { title: "Shop-floor changes", copy: "Practical updates focused on setup reliability, machine usage, and repeatable production cycles." },
      test: { title: "Throughput checks", copy: "Observed cycle behavior and process bottlenecks translated into improvement opportunities." },
      result: { title: "Cleaner flow", copy: "Better production paths and more reliable setup behavior supported stronger shop-floor execution." }
    },
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
    flow: ["EEG", "Thresholds", "Motion"],
    artifacts: {
      cad: { title: "Interface map", copy: "Control states defined around noisy EEG behavior instead of assuming perfect brain-signal precision." },
      build: { title: "Hardware stack", copy: "Consumer headset, Python processing, serial handoff, and Arduino output assembled into one live loop." },
      test: { title: "Signal tuning", copy: "Thresholds, false triggers, calibration behavior, and user fatigue shaped the usable interaction model." },
      result: { title: "Tangible control", copy: "The system proved a mental-state input could trigger a physical response in a testable prototype." }
    },
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
    flow: ["Camera + ToF", "Pi + STM32", "Rover"],
    artifacts: {
      cad: { title: "System architecture", copy: "Camera tracking, ToF ranging, embedded control, drivetrain response, and launcher behavior connected as one system." },
      build: { title: "Robot integration", copy: "Raspberry Pi handled perception while STM32 handled low-level physical response and timing." },
      test: { title: "Behavior states", copy: "Tracking, centering, following, holding distance, stopping, and launcher timing each became explicit test states." },
      result: { title: "Closed loop response", copy: "The rover reacted to a person with visual tracking, range context, and a conditional mechanical output." }
    },
    tags: ["Raspberry Pi", "Pi Camera 3", "STM32", "ToF Sensor", "Computer Vision"]
  },
  {
    id: "self-balancing-robot",
    title: "Self Balancing Robot",
    category: "project",
    year: "",
    summary: "Building a self balancing robot from ground up.",
    impact: "Having it navigate maze, perform turns, imu tracking etc",
    image: "./images/optimized/self-balancing-robot-finished-1600.jpg",
    imagePosition: "center 62%",
    link: "self-balancing-robot.html",
    proof: "Maze navigation • Turns • IMU tracking",
    flow: [],
    artifacts: null,
    tags: []
  },
  {
    id: "cycloidal-actuator",
    title: "Cycloidal Actuator",
    category: "project",
    year: "2026",
    summary: "Designing a compact, high-reduction drive system for robotics.",
    impact: "A 3D-printed cycloidal actuator intended for robotic joint applications.",
    image: "./images/optimized/cycloidal-actuator-bench-1600.jpg",
    link: "cyclodial-actuator.html",
    proof: "15:1 reduction • Parametric CAD • 3D-print tolerance iteration",
    flow: [],
    artifacts: null,
    tags: ["Robotics", "Fusion 360", "Mechanical Design", "Rapid Prototyping"]
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
    flow: ["Friction", "CAD + Print", "Use"],
    artifacts: {
      cad: { title: "Fast CAD loop", copy: "Every object starts from a real everyday constraint and moves quickly from model to print." },
      build: { title: "Printed iteration", copy: "Form, print orientation, supports, visible surfaces, and fit are tested in physical plastic early." },
      test: { title: "Use-case fit", copy: "Parts are judged by repeat use, not novelty: does it solve the problem and look intentional?" },
      result: { title: "Product-ready object", copy: "The strongest prints become photographed, documented, and ready for a public drop or MakerWorld listing." }
    },
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
    flow: ["STL", "WebGL scene", "Clip"],
    artifacts: {
      cad: { title: "Mesh intake", copy: "The tool loads local STL files into a browser scene without requiring backend processing." },
      build: { title: "Animation presets", copy: "Turntable, dolly, hero, split, and explode behaviors make static CAD feel presentable fast." },
      test: { title: "Client-side export", copy: "Recording and export workflows are tested against static hosting constraints and browser APIs." },
      result: { title: "Creator utility", copy: "CAD models become shareable motion clips without leaving the portfolio environment." }
    },
    tags: ["Three.js", "WebGL", "STL", "Animation Tool"]
  },
  {
    id: "electric-skateboard",
    title: "Electric Skateboard",
    category: "project",
    year: "",
    summary: "Building an Electric Skateboard from scratch",
    impact: "Personal project I took on because I was tired of walking around campus and the buses were unpredictable.",
    image: "./images/skateboard.jpg",
    link: "eboard.html",
    proof: "",
    flow: [],
    artifacts: null,
    tags: []
  },
  {
    id: "stacy",
    title: "Stacy",
    category: "ai-tool",
    year: "",
    summary: "Work with Stacy for real estate automation and vendor services.",
    impact: "More information coming later.",
    image: "./images/stacy-placeholder.svg",
    imageMode: "contain",
    link: null,
    proof: "",
    flow: [],
    artifacts: null,
    tags: []
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
  link: document.getElementById('spotlight-link'),
  artifactKicker: document.getElementById('artifact-kicker'),
  artifactTitle: document.getElementById('artifact-title'),
  artifactCopy: document.getElementById('artifact-copy'),
  artifactTabs: document.querySelector('.artifact-tabs'),
  artifactPanel: document.querySelector('.artifact-panel'),
  systemDiagram: document.querySelector('.system-diagram'),
  systemNodes: [
    document.getElementById('system-node-a'),
    document.getElementById('system-node-b'),
    document.getElementById('system-node-c')
  ]
};

let activeFilter = 'all';
let selectedId = SORTED_PROJECTS[0]?.id;
let activeArtifact = 'cad';
let revealObserver = null;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function categoryLabel(cat) {
  if (cat === 'internship') return 'Internship';
  if (cat === 'project') return 'Project';
  if (cat === 'ai-tool') return 'AI Tool';
  if (cat === 'research') return 'Research';
  return 'Work';
}

function projectMeta(project) {
  return [categoryLabel(project.category), project.year].filter(Boolean).join(' • ');
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
  spotlightRefs.image.style.objectPosition = project.imagePosition || 'center';
  spotlightRefs.image.style.background = project.imageMode === 'contain' ? '#0f0f14' : 'transparent';
  spotlightRefs.category.textContent = projectMeta(project);
  spotlightRefs.title.textContent = project.title;
  spotlightRefs.summary.textContent = project.summary;
  spotlightRefs.impact.textContent = project.impact;
  spotlightRefs.link.hidden = !project.link;
  if (project.link) {
    spotlightRefs.link.href = project.link;
    spotlightRefs.link.textContent = 'View ' + project.title;
  } else {
    spotlightRefs.link.removeAttribute('href');
    spotlightRefs.link.textContent = '';
  }
  spotlightRefs.tags.innerHTML = '';
  project.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.textContent = tag;
    spotlightRefs.tags.appendChild(span);
  });
  updateArtifactPanel(project);
  updateSystemDiagram(project);

  if (!reduceMotion) {
    spotlightRefs.image.animate(
      [
        { opacity: 0.58, transform: 'scale(1.035)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
    document.querySelector('.spotlight-body')?.animate(
      [
        { opacity: 0.35, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 460, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }
}

function updateArtifactPanel(project) {
  const artifact = project.artifacts?.[activeArtifact] || project.artifacts?.cad;
  const hasArtifacts = Boolean(artifact);
  if (spotlightRefs.artifactTabs) spotlightRefs.artifactTabs.hidden = !hasArtifacts;
  if (spotlightRefs.artifactPanel) spotlightRefs.artifactPanel.hidden = !hasArtifacts;
  if (!artifact) {
    spotlightRefs.artifactKicker.textContent = '';
    spotlightRefs.artifactTitle.textContent = '';
    spotlightRefs.artifactCopy.textContent = '';
    return;
  }
  spotlightRefs.artifactKicker.textContent = activeArtifact;
  spotlightRefs.artifactTitle.textContent = artifact.title;
  spotlightRefs.artifactCopy.textContent = artifact.copy;
}

function updateSystemDiagram(project) {
  const flow = project.flow || [];
  if (spotlightRefs.systemDiagram) spotlightRefs.systemDiagram.hidden = flow.length === 0;
  spotlightRefs.systemNodes.forEach((node, index) => {
    if (!node) return;
    node.textContent = flow[index] || '';
  });
}

function updateProjectButtonSelection() {
  const buttons = projectList.querySelectorAll('.project-button');
  buttons.forEach((btn) => {
    const isSelected = btn.dataset.id === selectedId;
    btn.classList.toggle('is-selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

function renderProjectList() {
  const visible = getVisibleProjects();

  if (!visible.some((item) => item.id === selectedId)) {
    selectedId = visible[0]?.id;
  }

  projectList.innerHTML = '';
  visible.forEach((project, index) => {
    const item = document.createElement('button');
    item.className = 'project-button reveal-block' + (project.id === selectedId ? ' is-selected' : '');
    item.dataset.id = project.id;
    item.type = 'button';
    item.setAttribute('aria-pressed', project.id === selectedId ? 'true' : 'false');
    item.innerHTML = `
      <span class="project-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="project-button-copy">
        <span class="title">${project.title}</span>
        <span class="meta">${projectMeta(project)}</span>
      </span>
    `;
    const selectProject = () => {
      selectedId = project.id;
      updateProjectButtonSelection();
      updateSpotlight(project);
    };
    item.addEventListener('mouseenter', selectProject);
    item.addEventListener('focus', selectProject);
    item.addEventListener('click', selectProject);
    projectList.appendChild(item);
  });

  updateSpotlight(visible.find((item) => item.id === selectedId));
  observeRevealGroup([...projectList.children], 42);
}

function renderWall() {
  const visible = getVisibleProjects();
  wallGrid.innerHTML = '';
  visible.forEach((project) => {
    const a = document.createElement(project.link ? 'a' : 'article');
    a.className = 'wall-card reveal-block';
    if (project.link) a.href = project.link;
    a.innerHTML = `
      <img src="${project.image}" alt="${project.title} preview" loading="lazy" decoding="async" style="object-fit:${project.imageMode === 'contain' ? 'contain' : 'cover'}; object-position:${project.imagePosition || 'center'}; background:${project.imageMode === 'contain' ? '#101117' : 'transparent'};">
      <div class="wall-card-body">
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        ${project.proof ? `<p class="proof-line">${project.proof}</p>` : ''}
      </div>
    `;
    wallGrid.appendChild(a);
  });
  observeRevealGroup([...wallGrid.children], 58);
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

function initArtifactTabs() {
  const tabs = [...document.querySelectorAll('.artifact-tab')];
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeArtifact = tab.dataset.artifactTab || 'cad';
      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.classList.toggle('is-active', selected);
        candidate.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      const project = SORTED_PROJECTS.find((item) => item.id === selectedId);
      if (project) updateArtifactPanel(project);
    });
  });
}

function revealImmediately(nodes) {
  nodes.forEach((node) => node.classList.add('is-revealed'));
}

function observeRevealGroup(nodes, staggerMs = 60) {
  nodes.forEach((node, index) => {
    node.style.setProperty('--reveal-delay', Math.min(index * staggerMs, 300) + 'ms');
    node.classList.remove('is-revealed');
  });

  if (reduceMotion || !revealObserver) {
    revealImmediately(nodes);
    return;
  }

  nodes.forEach((node) => revealObserver.observe(node));
}

function initReveal() {
  const nodes = [...document.querySelectorAll('.reveal, .reveal-block')];
  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    revealImmediately(nodes);
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  const groups = [
    [...document.querySelectorAll('.metrics .reveal-block')],
    [...document.querySelectorAll('.explorer-grid .reveal-block')],
    [...document.querySelectorAll('.pipeline-track .reveal-block')],
    [...document.querySelectorAll('.wall-grid .reveal-block')]
  ];
  const grouped = new Set(groups.flat());

  groups.forEach((group) => observeRevealGroup(group, 64));
  nodes.filter((node) => !grouped.has(node)).forEach((node) => revealObserver.observe(node));
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

function initCountUp() {
  const values = [...document.querySelectorAll('[data-count]')];
  if (!values.length) return;

  const setFinalValue = (node) => {
    node.textContent = `${node.dataset.count || '0'}${node.dataset.suffix || ''}`;
  };

  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    values.forEach(setFinalValue);
    return;
  }

  values.forEach((node) => {
    node.textContent = `0${node.dataset.suffix || ''}`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const node = entry.target;
      const target = Number(node.dataset.count) || 0;
      const suffix = node.dataset.suffix || '';
      const duration = target >= 1000 ? 1450 : 1050;
      const start = performance.now();
      node.classList.add('is-counting');

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }
        setFinalValue(node);
        node.classList.remove('is-counting');
      };

      requestAnimationFrame(tick);
      observer.unobserve(node);
    });
  }, { threshold: 0.55 });

  values.forEach((node) => observer.observe(node));
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initArtifactTabs();
  applyFilter('all');
  initReveal();
  initTilt();
  initCountUp();
});
