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
  const refs = Object.fromEntries(['current', 'total', 'meta', 'project-title', 'task', 'impact', 'skills', 'tags', 'link'].map((name) => [`orbit-${name}`, new Element()]));
  const html = fs.readFileSync(new URL('../Engineering.html', import.meta.url), 'utf8');
  const buttons = [...html.matchAll(/data-filter="([^"]+)"/g)].map(([, filter]) => { const button = new Element('button'); button.dataset.filter = filter; return button; });
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

test('projects lead the carousel, SpaceX leads internships, and AI tools finish it', () => {
  const app = setup();
  const projects = app.window.ENGINEERING_PROJECTS;
  const expected = ['bci', 'sentry-rover', 'self-balancing-robot', 'me2110', 'cycloidal-actuator', 'pomodoro', 'print', 'electric-skateboard', 'mars', 'spacex', 'tesla', 'lg', 'price', 'stl-animator', 'stacy'];
  assert.deepEqual(Array.from(projects, (project) => project.id), expected);
  assert.equal(app.refs['orbit-project-title'].textContent, 'Brain Controlled Interface');
  assert.deepEqual(app.buttons.map((button) => button.dataset.filter), ['all', 'project', 'internship', 'ai-tool']);
  const html = fs.readFileSync(new URL('../Engineering.html', import.meta.url), 'utf8');
  assert.match(html, /id="orbit-project-title">Brain Controlled Interface<\/h2>/);
  const directory = html.match(/<details class="orbit-directory">([\s\S]*?)<\/details>/)[1];
  assert.deepEqual([...directory.matchAll(/<a href="([^"]+)"/g)].map((match) => match[1]), Array.from(projects).filter((project) => project.link).map((project) => project.link));
  app.scrubber.value = String(projects.findIndex((project) => project.id === 'spacex')); app.scrubber.emit('input'); app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'SpaceX Avionics Manufacturing');
});

test('skills stay prominent, accurate, and disappear for projects without supplied tags', () => {
  const app = setup();
  const projects = app.window.ENGINEERING_PROJECTS;
  const select = (id) => {
    const index = projects.findIndex((project) => project.id === id);
    app.scrubber.value = String(index); app.scrubber.emit('input'); app.flush();
    return projects[index];
  };
  for (const id of ['sentry-rover', 'self-balancing-robot', 'me2110']) {
    const project = select(id);
    assert.equal(app.refs['orbit-skills'].hidden, false);
    assert.deepEqual(app.refs['orbit-tags'].children.map((item) => item.textContent), Array.from(project.tags));
    assert.ok(app.refs['orbit-tags'].children.every((item) => item.tagName === 'LI'));
  }
  select('stacy');
  assert.equal(app.refs['orbit-skills'].hidden, true);
  assert.equal(app.refs['orbit-tags'].children.length, 0);
  select('sentry-rover');
  assert.equal(app.refs['orbit-skills'].hidden, false);
  const html = fs.readFileSync(new URL('../Engineering.html', import.meta.url), 'utf8');
  assert.match(html, /role="group" aria-labelledby="orbit-skills-label"/);
  assert.match(html, /<ul class="orbit-tags" id="orbit-tags">/);
  assert.ok(html.indexOf('id="orbit-skills"') < html.indexOf('id="orbit-task"'));
  const page = fs.readFileSync(new URL('../sentry-rover.html', import.meta.url), 'utf8');
  assert.match(page, /<title>Vision Tracking Robot \| Josh Murzello<\/title>/);
  assert.match(page, /<h1 id="case-title">Vision<br>tracking robot\.<\/h1>/);
  assert.doesNotMatch(page, /autonomous(?:<br>|\s)+tracking robot/i);
  assert.match(page, /youtube-nocookie.com\/embed\/hJwOXDbev68/);
});

test('all projects and their actual assets are included', () => {
  const app = setup();
  const projects = app.window.ENGINEERING_PROJECTS;
  assert.equal(projects.length, 15);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.equal(app.carousel.children.length, projects.length);
  assert.equal(app.refs['orbit-project-title'].textContent, projects[0].title);
  assert.equal(app.refs['orbit-total'].textContent, '15');
  for (const project of projects) {
    assert.ok(fs.existsSync(new URL(`../${project.image}`, import.meta.url)), project.image);
    if (project.link) assert.ok(fs.existsSync(new URL(`../${project.link}`, import.meta.url)), project.link);
  }
  assert.match(projects.find((project) => project.id === 'self-balancing-robot').image, /self-balancing-bench-still/);
  assert.match(projects.find((project) => project.id === 'cycloidal-actuator').image, /cycloidal-actuator-bench/);
  const trackingRobot = projects.find((project) => project.id === 'sentry-rover');
  assert.equal(trackingRobot.title, 'Vision Tracking Robot');
  assert.equal(trackingRobot.image, './images/optimized/tracking-robot-finished.jpg');
  assert.ok(trackingRobot.tags.includes('MobileNet-SSD'));
  assert.equal(trackingRobot.link, 'sentry-rover.html');
});

test('filters preserve internships, robots, and AI tools', () => {
  const app = setup();
  app.buttons.find((button) => button.dataset.filter === 'internship').emit('click');
  assert.equal(app.carousel.children.length, 4);
  app.buttons.find((button) => button.dataset.filter === 'project').emit('click');
  assert.equal(app.carousel.children.length, 10);
  const labels = app.carousel.children.map((card) => card.attributes['aria-label']);
  for (const title of ['Mechatronics Gauntlet Robot', 'Vision Tracking Robot', 'ME 2110 Barbenheimer Bot', 'Cycloidal Actuator', 'Electric Skateboard', 'Focus Dial', 'MARS Research']) assert.ok(labels.some((label) => label.startsWith(title)));
  app.buttons[3].emit('click');
  assert.equal(app.carousel.children.length, 2);
  assert.equal(app.scrubber.max, '1');
  app.scrubber.value = '1'; app.scrubber.emit('input'); app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Stacy');
  assert.equal(app.refs['orbit-link'].hidden, true);
  app.buttons[0].emit('click'); app.flush();
  assert.equal(app.refs['orbit-link'].hidden, false);
  assert.equal(app.refs['orbit-link'].href, 'bci.html');
});

test('the renamed mechatronics project retains its URL and full lab scope', () => {
  const app = setup();
  const project = app.window.ENGINEERING_PROJECTS.find((item) => item.id === 'self-balancing-robot');
  assert.equal(project.title, 'Mechatronics Gauntlet Robot');
  assert.equal(project.year, '2026');
  assert.equal(project.link, 'self-balancing-robot.html');
  for (const skill of ['Embedded C', 'STM32', 'PWM', 'Encoders', 'PID', 'I2C', 'IMU']) assert.ok(project.tags.includes(skill));
  const html = fs.readFileSync(new URL('../self-balancing-robot.html', import.meta.url), 'utf8');
  assert.match(html, /<title>Mechatronics Gauntlet Robot \| Josh Murzello<\/title>/);
  assert.match(html, /href="https:\/\/www.joshmurzello.com\/self-balancing-robot.html"/);
  const labs = [...html.matchAll(/<details class="robot-lab" id="lab-(\d)"/g)].map((match) => Number(match[1]));
  assert.deepEqual(labs, [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const phrase of ['Elegoo robot kit', 'HAL API', 'pull-up', 'OPA340', 'HC-SR04', 'feed-forward', '20 cm reference', 'half-step', 'supplied Kalman-filter library', 'separate bonus']) assert.ok(html.includes(phrase), phrase);
  assert.doesNotMatch(html, /Core Loop|Document the tuning|What this project proves|from ground up/);
  assert.doesNotMatch(html, /tracking-robot-|MobileNet|Pi Camera/);
});

test('wheel and range select projects; boundaries and zoom are not trapped', () => {
  const app = setup();
  assert.equal(app.viewport.emit('wheel', { deltaY: -500 }).defaultPrevented, false);
  assert.equal(app.viewport.emit('wheel', { deltaY: 500, ctrlKey: true }).defaultPrevented, false);
  assert.equal(app.viewport.emit('wheel', { deltaY: 560 }).defaultPrevented, true);
  app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Vision Tracking Robot');
  const cycloidalIndex = app.window.ENGINEERING_PROJECTS.findIndex((project) => project.id === 'cycloidal-actuator');
  app.scrubber.value = String(cycloidalIndex); app.scrubber.emit('input'); app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, 'Cycloidal Actuator');
  assert.match(app.scrubber.attributes['aria-valuetext'], /5 of 15: Cycloidal Actuator/);
});

test('keyboard does not override native range controls and reduced motion settles immediately', () => {
  const app = setup(true);
  app.stage.emit('keydown', { key: 'ArrowRight', target: app.scrubber });
  assert.equal(app.refs['orbit-current'].textContent, '01');
  app.stage.emit('keydown', { key: 'ArrowRight', target: app.viewport });
  assert.equal(app.refs['orbit-current'].textContent, '02');
  assert.equal(app.frames.size, 0);
  app.stage.emit('keydown', { key: 'End', target: app.viewport });
  assert.equal(app.refs['orbit-current'].textContent, '15');
  app.stage.emit('keydown', { key: 'Home', target: app.viewport });
  app.carousel.children[0].emit('click');
  assert.equal(app.window.location.href, 'bci.html');
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
  assert.equal(app.refs['orbit-project-title'].textContent, 'Vision Tracking Robot');
  assert.equal(app.viewport.hasPointerCapture(1), false);
  app.carousel.children[1].emit('click');
  assert.equal(app.window.location.href, 'sentry-rover.html');
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
  assert.match(html, /mailto:Josh.Murzello@gmail.com/);
  for (const path of ['index.html', 'Creatives.html', 'about.html', 'self-balancing-robot.html', 'me2110.html', 'cyclodial-actuator.html', 'eboard.html']) assert.ok(html.includes(`href="${path}"`));
  assert.match(html, /<noscript>/);
});

test('Barbenheimer remains a separate project with its original records and media', () => {
  const app = setup();
  const projects = app.window.ENGINEERING_PROJECTS;
  const index = projects.findIndex((project) => project.id === 'me2110');
  const project = projects[index];
  assert.equal(project.title, 'ME 2110 Barbenheimer Bot');
  assert.equal(project.link, 'me2110.html');
  assert.equal(project.category, 'project');
  assert.equal(project.image, './images/ME2110cadmodel.png');
  assert.equal(project.imageMode, 'contain');
  app.scrubber.value = String(index); app.scrubber.emit('input'); app.flush();
  assert.equal(app.refs['orbit-project-title'].textContent, project.title);
  assert.equal(app.refs['orbit-link'].href, 'me2110.html');
  const html = fs.readFileSync(new URL('../me2110.html', import.meta.url), 'utf8');
  for (const phrase of ['My intro into fabricating an autonomous robot from scratch. Who said it was easy?', 'cascading lift mechanism', 'out of 68 teams, we placed 12th', 'ranked first of 32 teams', 'ME2110cadmodel.png', 'ME2110track.png']) assert.ok(html.includes(phrase), phrase);
  assert.equal((html.match(/Achieving 95 points/g) || []).length, 1);
  assert.doesNotMatch(html, /Archived engineering|tracking-robot-|self-balancing-/);
});
