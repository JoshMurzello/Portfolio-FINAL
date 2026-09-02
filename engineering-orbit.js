(function () {
  const allProjects = window.ENGINEERING_PROJECTS || [];
  const stage = document.querySelector('.orbit-stage');
  const carousel = document.getElementById('orbit-carousel');
  const viewport = document.querySelector('.orbit-viewport');
  const scrubber = document.querySelector('.orbit-scrubber');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  if (!stage || !carousel || !viewport || !scrubber || !allProjects.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const refs = Object.fromEntries(['current', 'total', 'meta', 'task', 'impact', 'tags', 'link'].map((name) => [name, document.getElementById(`orbit-${name}`)]));
  refs.title = document.getElementById('orbit-project-title');
  let projects = [...allProjects];
  let position = 0;
  let target = 0;
  let frameId = 0;
  let wheelTimer = 0;
  let displayedIndex = -1;
  let pointer = null;
  let suppressClick = false;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const spacing = () => Math.min(window.innerWidth * 0.34, 470);

  function categoryLabel(project) {
    if (project.category === 'internship') return 'Internship';
    if (project.category === 'ai-tool') return 'AI tool';
    return 'Project';
  }

  function updateProjectCopy(index) {
    const project = projects[index];
    if (!project || displayedIndex === index) return;
    displayedIndex = index;
    refs.current.textContent = String(index + 1).padStart(2, '0');
    refs.meta.textContent = [categoryLabel(project), project.year].filter(Boolean).join(' / ');
    refs.title.textContent = project.title;
    refs.task.textContent = project.summary;
    refs.impact.textContent = project.impact;
    refs.tags.replaceChildren();
    (project.tags || []).forEach((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      refs.tags.appendChild(span);
    });
    refs.link.hidden = !project.link;
    if (project.link) refs.link.href = project.link;
    else refs.link.removeAttribute('href');
    scrubber.setAttribute('aria-valuetext', `${index + 1} of ${projects.length}: ${project.title}`);
  }

  function renderScene() {
    const activeIndex = clamp(Math.round(position), 0, projects.length - 1);
    [...carousel.children].forEach((card, index) => {
      const delta = index - position;
      const distance = Math.abs(delta);
      const x = delta * spacing();
      const y = Math.pow(distance, 1.45) * 15;
      const z = -distance * 150;
      const rotateY = clamp(delta * -9, -27, 27);
      const rotateZ = clamp(delta * 1.4, -4, 4);
      const scale = Math.max(0.72, 1 - distance * 0.1);
      card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
      card.style.opacity = String(Math.max(0.18, 1 - distance * 0.27));
      card.style.zIndex = String(100 - Math.round(distance * 10));
      card.classList.toggle('is-active', index === activeIndex);
      card.setAttribute('aria-pressed', String(index === activeIndex));
    });
    scrubber.value = String(activeIndex);
    updateProjectCopy(activeIndex);
  }

  function animate() {
    position += (target - position) * 0.095;
    if (Math.abs(target - position) < 0.001) position = target;
    renderScene();
    frameId = position !== target ? requestAnimationFrame(animate) : 0;
  }

  function startAnimation() {
    target = clamp(target, 0, projects.length - 1);
    if (reducedMotion.matches) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      position = Math.round(target);
      target = position;
      renderScene();
    } else if (!frameId) {
      frameId = requestAnimationFrame(animate);
    }
  }

  function renderCards() {
    cancelAnimationFrame(frameId);
    clearTimeout(wheelTimer);
    frameId = 0;
    carousel.replaceChildren();
    projects.forEach((project, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'orbit-card';
      card.dataset.index = String(index);
      card.dataset.imageMode = project.imageMode || 'cover';
      card.setAttribute('aria-label', `${project.title}, ${categoryLabel(project)}`);
      const image = document.createElement('img');
      image.src = project.image;
      image.alt = `${project.title} project preview`;
      image.draggable = false;
      image.decoding = 'async';
      image.loading = index < 2 ? 'eager' : 'lazy';
      image.style.objectPosition = project.imagePosition || 'center';
      const caption = document.createElement('span');
      caption.className = 'orbit-card-caption';
      const title = document.createElement('strong');
      title.textContent = project.title;
      const meta = document.createElement('span');
      meta.textContent = [categoryLabel(project), project.year].filter(Boolean).join(' / ');
      caption.append(title, meta);
      card.append(image, caption);
      card.addEventListener('click', (event) => {
        if (suppressClick) { event.preventDefault(); return; }
        if (Math.round(position) === index && Math.abs(position - index) < 0.05 && project.link) {
          window.location.href = project.link;
          return;
        }
        target = index;
        startAnimation();
      });
      card.addEventListener('focus', () => {
        target = index;
        startAnimation();
      });
      carousel.appendChild(card);
    });
    position = 0;
    target = 0;
    displayedIndex = -1;
    scrubber.min = '0';
    scrubber.max = String(projects.length - 1);
    refs.total.textContent = String(projects.length).padStart(2, '0');
    renderScene();
  }

  viewport.addEventListener('wheel', (event) => {
    if (event.ctrlKey) return;
    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
    const delta = (event.deltaY + event.deltaX) * multiplier;
    if (!delta || (target <= 0 && delta < 0) || (target >= projects.length - 1 && delta > 0)) return;
    event.preventDefault();
    target += reducedMotion.matches ? Math.sign(delta) : delta * 0.0018;
    startAnimation();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { target = Math.round(target); startAnimation(); }, 150);
  }, { passive: false });

  viewport.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    clearTimeout(wheelTimer);
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, target, dragging: false };
    suppressClick = false;
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = pointer.x - event.clientX;
    const dy = pointer.y - event.clientY;
    if (!pointer.dragging) {
      if (Math.abs(dx) < 7) return;
      if (event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) { pointer = null; return; }
      pointer.dragging = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
    target = pointer.target + dx / spacing();
    startAnimation();
  });

  function endPointer(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dragged = pointer.dragging;
    pointer = null;
    viewport.classList.remove('is-dragging');
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    if (dragged) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      target = Math.round(target);
      startAnimation();
    }
  }
  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
  viewport.addEventListener('lostpointercapture', endPointer);
  viewport.addEventListener('pointerleave', () => { if (pointer && !pointer.dragging) pointer = null; });

  scrubber.addEventListener('input', () => {
    clearTimeout(wheelTimer);
    target = Number(scrubber.value);
    startAnimation();
  });

  stage.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = Math.round(target) + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = Math.round(target) - 1;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = projects.length - 1;
    else return;
    event.preventDefault();
    clearTimeout(wheelTimer);
    startAnimation();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      const filtered = allProjects.filter((project) => filter === 'all' || (project.filters || [project.category]).includes(filter));
      if (!filtered.length) return;
      projects = filtered;
      filterButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('is-active', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      renderCards();
    });
  });

  reducedMotion.addEventListener('change', startAnimation);
  window.addEventListener('resize', renderScene);
  renderCards();
})();
