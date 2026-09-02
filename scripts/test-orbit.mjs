import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = fs.readFileSync(new URL('../engineering-orbit.js', import.meta.url), 'utf8');
const data = fs.readFileSync(new URL('../engineering-projects.js', import.meta.url), 'utf8');

class Element {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.style = {};
    this.dataset = {};
    this.attributes = {};
    this.events = {};
    this.textContent = '';
    this.value = '0';
    this.classes = new Set();
    this.capture = new Set();
    this.clientHeight = 600;
    this.classList = {
      add: (name) => this.classes.add(name),
      remove: (name) => this.classes.delete(name),
      toggle: (name, value) => value ? this.classes.add(name) : this.classes.delete(name)
    };
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; if (name === 'href') delete this.href; }
  append(...children) { this.children.push(...children); }
  appendChild(child) { this.append(child); }
  replaceChildren(...children) { this.children = children; }
  addEventListener(type, handler) { (this.events[type] ||= []).push(handler); }
  closest() { return ['INPUT', 'TEXTAREA', 'SELECT'].includes(this.tagName) ? this : null; }
  setPointerCapture(id) { this.capture.add(id); }
  hasPointerCapture(id) { return this.capture.has(id); }
  releasePointerCapture(id) { this.capture.delete(id); }
  emit(type, options = {}) {
    const event = { target: this, isPrimary: true, button: 0, pointerId: 1, pointerType: 'mouse', deltaMode: 0, deltaX: 0, deltaY: 0, defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; }, ...options };
    for (const handler of this.events[type] || []) handler(event);
    return event;
  }
}

function setup(reduce = false) {
  const stage = new Element();
  const viewport = new Element();
  const carousel = new Element();
  const scrubber = new Element('input');
  const refs = Object.fromEntries(['current', 'total', 'meta', 'project-title', 'task', 'impact', 'tags', 'link'].map((name) => [`orbit-${name}`, new Element()]));
  const buttons = ['all', 'internship', 'project', 'ai-tool'].map((filter) => { const button = new Element('button'); button.dataset.filter = filter; return button; });
  let nextId = 1;
  const frames = new Map();
  const timers = new Map();
  const media = new Element();
  media.matches = reduce;
  const window = { innerWidth: 1280, location: { href: '' }, matchMedia: () => media, addEventListener() {} };
  const context = vm.createContext({
    window,
    document: {
      querySelector: (selector) => ({ '.orbit-stage': stage, '.orbit-viewport': viewport, '.orbit-scrubber': scrubber })[selector],
      querySelectorAll: () => buttons,
      getElementById: (id) => id === 'orbit-carousel' ? carousel : refs[id],
      createElement: (tag) => new Element(tag)
    },
    requestAnimationFrame: (callback) => { const id = nextId++; frames.set(id, callback); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout: (callback) => { const id = nextId++; timers.set(id, callback); return id; },
    clearTimeout: (id) => timers.delete(id)
  });
  vm.runInContext(data, context);
  vm.runInContext(source, context);
  function flush() {
    let loops = 0;
    while (frames.size || timers.size) {
      assert.ok(loops++ < 1000, 'animation must settle');
      const pending = [...frames.values(), ...timers.values()];
      frames.clear(); timers.clear();
      pending.forEach((callback) => callback());
    }
  }
  return { stage, viewport, carousel, scrubber, refs, buttons, window, media, frames, flush };
}

test('all projects and their actual assets are included', () => {
  const app = setup();
  const projects = app.window.ENGINEERING_PROJECTS;
  assert.equal(projects.length, 12);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.equal(app.carousel.children.length, projects.length);
  assert.equal(app.refs['orbit-project-title'].textContent, projects[0].title);
  assert.equal(app.refs['orbit-total'].textContent, '12');
  for (const project of projects) {
    assert.ok(fs.existsSync(new URL(`../${project.image}`, import.meta.url)), project.image);
    if (project.link) assert.ok(fs.existsSync(new URL(`../${project.link}`, import.meta.url)), project.link);
  }
  assert.match(projects.find((project) => project.id === 'self-balancing-robot').image, /finished/);
  assert.match(projects.find((project) => project.id === 'cycloidal-actuator').image, /cycloidal-actuator-bench/);
});

test('filters preserve internships, robots, and AI tools', () => {
  const app = setup();
  app.buttons[1].emit('click');
  assert.equal(app.carousel.children.length, 4);
  app.buttons[2].emit('click');
  assert.equal(app.carousel.children.length, 7);
  const labels = app.carousel.children.map((card) => card.attributes['aria-label']);
  for (const title of ['Self Balancing Robot', 'Vision-Guided Sentry Rover', 'Cycloidal Actuator', 'Electric Skateboard']) assert.ok(labels.some((label) => label.startsWith(title)));
  app.buttons[3].emit('click');
  assert.equal(app.carousel.children.length, 2);
  assert.equal(app.scrubber.max, '1');
  app.scrubber.value = '1'; app.scrubber.emit('input'); app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Stacy');
  assert.equal(app.refs['orbit-link'].hidden, true);
  app.buttons[0].emit('click'); app.flush();
  assert.equal(app.refs['orbit-link'].hidden, false);
  assert.equal(app.refs['orbit-link'].href, 'spacex.html');
});

test('wheel and range select projects; boundaries and zoom are not trapped', () => {
  const app = setup();
  assert.equal(app.viewport.emit('wheel', { deltaY: -500 }).defaultPrevented, false);
  assert.equal(app.viewport.emit('wheel', { deltaY: 500, ctrlKey: true }).defaultPrevented, false);
  assert.equal(app.viewport.emit('wheel', { deltaY: 560 }).defaultPrevented, true);
  app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Tesla');
  app.scrubber.value = '7'; app.scrubber.emit('input'); app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Cycloidal Actuator');
  assert.match(app.scrubber.attributes['aria-valuetext'], /8 of 12: Cycloidal Actuator/);
});

test('keyboard does not override native range controls and reduced motion settles immediately', () => {
  const app = setup(true);
  app.stage.emit('keydown', { key: 'ArrowRight', target: app.scrubber });
  assert.equal(app.refs['orbit-current'].textContent, '01');
  app.stage.emit('keydown', { key: 'ArrowRight', target: app.viewport });
  assert.equal(app.refs['orbit-current'].textContent, '02');
  assert.equal(app.frames.size, 0);
  app.stage.emit('keydown', { key: 'End', target: app.viewport });
  assert.equal(app.refs['orbit-current'].textContent, '12');
  app.stage.emit('keydown', { key: 'Home', target: app.viewport });
  app.carousel.children[0].emit('click');
  assert.equal(app.window.location.href, 'spacex.html');
});

test('a tap can open a project; a drag does not accidentally navigate', () => {
  const app = setup();
  app.viewport.emit('pointerdown', { clientX: 700, clientY: 300 });
  assert.equal(app.viewport.hasPointerCapture(1), false);
  app.viewport.emit('pointermove', { clientX: 265, clientY: 300 });
  assert.equal(app.viewport.hasPointerCapture(1), true);
  app.viewport.emit('pointerup');
  app.carousel.children[1].emit('click');
  assert.equal(app.window.location.href, '');
  app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Tesla');
  assert.equal(app.viewport.hasPointerCapture(1), false);
  app.carousel.children[1].emit('click');
  assert.equal(app.window.location.href, 'tesla.html');
});

test('touch scroll and pointer cancellation release drag state', () => {
  const app = setup();
  app.viewport.emit('pointerdown', { clientX: 500, clientY: 300, pointerType: 'touch' });
  app.viewport.emit('pointermove', { clientX: 490, clientY: 350, pointerType: 'touch' });
  assert.equal(app.viewport.hasPointerCapture(1), false);
  app.viewport.emit('pointerdown', { clientX: 500, clientY: 300 });
  app.viewport.emit('pointermove', { clientX: 350, clientY: 300 });
  app.viewport.emit('pointercancel'); app.flush();
  assert.equal(app.viewport.hasPointerCapture(1), false);
  assert.equal(app.viewport.classes.has('is-dragging'), false);
});

test('the live page has production navigation, metadata, and a script-free project directory', () => {
  const html = fs.readFileSync(new URL('../Engineering.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /noindex|Engineering Draft|engineering-.*preview|engineering-draft-data/);
  assert.match(html, /engineering-orbit.js/);
  assert.match(html, /mailto:Josh.Marzello@gmail.com/);
  for (const path of ['index.html', 'Creatives.html', 'about.html', 'self-balancing-robot.html', 'cyclodial-actuator.html', 'eboard.html']) assert.ok(html.includes(`href="${path}"`));
  assert.match(html, /<noscript>/);
});
