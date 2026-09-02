import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = fs.readFileSync(new URL('../home-motion.js', import.meta.url), 'utf8');

function setup(options = {}) {
  const parent = {};
  const items = (options.tops || [500, 500, 500]).map((top) => {
    const classes = new Set();
    const item = {
      parentElement: parent,
      classes,
      animations: [],
      classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
      getBoundingClientRect: () => ({ top, bottom: top + 200 }),
      contains: (target) => target === item,
      animate: (frames, timing) => {
        if (options.animationError) throw new Error('animation unavailable');
        const animation = { frames, timing, cancelled: false, cancel() { this.cancelled = true; this.oncancel?.(); } };
        item.animations.push(animation);
        return animation;
      }
    };
    if (options.noAnimation) item.animate = undefined;
    return item;
  });
  const documentEvents = {};
  const windowEvents = {};
  let changeMotion;
  let observer;
  const motion = { matches: Boolean(options.reduced), addEventListener: (_, callback) => { changeMotion = callback; } };
  class Observer {
    constructor(callback, settings) {
      if (options.observerError) throw new Error('observer unavailable');
      this.callback = callback; this.settings = settings; this.observed = new Set(); observer = this;
    }
    observe(item) {
      if (options.observeError && this.observed.size === 1) throw new Error('observation failed');
      this.observed.add(item);
    }
    unobserve(item) { this.observed.delete(item); }
    disconnect() { this.observed.clear(); this.disconnected = true; }
  }
  const window = {
    location: { hash: options.hash || '' },
    matchMedia: () => motion,
    addEventListener: (type, callback) => { windowEvents[type] = callback; }
  };
  const context = vm.createContext({
    window,
    document: {
      activeElement: options.focused ? items[0] : null,
      querySelectorAll: () => items,
      getElementById: (id) => id === 'contact' ? { contains: (item) => item === items[2] } : null,
      addEventListener: (type, callback) => { documentEvents[type] = callback; }
    },
    IntersectionObserver: options.noObserver ? undefined : Observer
  });
  vm.runInContext(source, context);
  return {
    items, observer, window, documentEvents, windowEvents,
    intersect(indices, isIntersecting = true) { observer.callback(indices.map((index) => ({ target: items[index], isIntersecting }))); },
    reduce() { motion.matches = true; changeMotion({ matches: true }); }
  };
}

const visible = (item) => !item.classes.has('is-pending');

test('cards fade and rise once, with a bounded stagger across one row', () => {
  const app = setup();
  assert.ok(app.items.every((item) => !visible(item)));
  app.intersect([0], false);
  assert.equal(app.items[0].animations.length, 0);
  app.intersect([0, 1, 2]);
  assert.deepEqual(app.items.map((item) => item.animations[0].timing.delay), [0, 90, 180]);
  for (const item of app.items) {
    const animation = item.animations[0];
    assert.equal(animation.timing.duration, 720);
    assert.equal(animation.frames[0].opacity, 0);
    assert.equal(animation.frames[0].transform, 'translateY(26px)');
    animation.onfinish();
    assert.ok(animation.cancelled);
    assert.ok(visible(item));
  }
  app.intersect([0, 1, 2]);
  assert.ok(app.items.every((item) => item.animations.length === 1));
  assert.equal(app.observer.observed.size, 0);
});

test('vertically stacked cards reveal independently without a row delay', () => {
  const app = setup({ tops: [500, 800, 1100] });
  app.intersect([0, 1, 2]);
  assert.deepEqual(app.items.map((item) => item.animations[0].timing.delay), [0, 0, 0]);
});

test('reduced motion or missing browser features leave content visible', () => {
  for (const options of [{ reduced: true }, { noAnimation: true }, { noObserver: true }, { observerError: true }, { observeError: true }]) {
    const app = setup(options);
    assert.ok(app.items.every(visible), JSON.stringify(options));
    assert.ok(app.items.every((item) => item.animations.length === 0));
  }
});

test('switching reduced motion on cancels active animations and shows pending content', () => {
  const app = setup();
  app.intersect([0]);
  app.reduce();
  assert.ok(app.items.every(visible));
  assert.ok(app.items[0].animations[0].cancelled);
  assert.ok(app.observer.disconnected);
  app.intersect([1, 2]);
  assert.equal(app.items[1].animations.length, 0);
});

test('keyboard focus immediately reveals links and form controls', () => {
  const app = setup();
  app.intersect([0]);
  for (const index of [0, 1]) app.documentEvents.focusin({ target: { closest: () => app.items[index] } });
  assert.ok(visible(app.items[0]));
  assert.ok(visible(app.items[1]));
  assert.ok(app.items[0].animations[0].cancelled);
  const focused = setup({ focused: true });
  assert.ok(visible(focused.items[0]));
});

test('deep links, print, and restored pages cannot leave the contact form hidden', () => {
  const anchor = setup({ hash: '#contact' });
  assert.ok(visible(anchor.items[2]));
  const app = setup();
  app.window.location.hash = '#contact';
  app.windowEvents.hashchange();
  assert.ok(visible(app.items[2]));
  for (const event of ['beforeprint', 'pageshow']) {
    const current = setup();
    current.intersect([0]);
    current.windowEvents[event]({ persisted: true });
    assert.ok(current.items.every(visible));
    assert.ok(current.items[0].animations[0].cancelled);
  }
});

test('animation errors fail open and content above a restored scroll position stays visible', () => {
  const app = setup({ animationError: true });
  app.intersect([0, 1, 2]);
  assert.ok(app.items.every(visible));
  const restored = setup({ tops: [-400, 500, 500] });
  assert.ok(visible(restored.items[0]));
  assert.equal(restored.observer.observed.size, 2);
});

test('only homepage scroll content opts in; original hero and shared pages are untouched', () => {
  const root = new URL('../', import.meta.url);
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  assert.equal((html.match(/class="[^"]*\bhome-reveal\b/g) || []).length, 12);
  assert.match(html, /home-motion\.js\?v=[^"]+" defer/);
  assert.match(html, /home-motion\.css\?v=/);
  assert.match(html, /<h1 class="reveal">Builder, filmer, and professional breaker of things\.<\/h1>/);
  assert.match(html, /data-contact-email="Josh.Marzello@gmail.com"/);
  for (const file of ['about.html', 'Engineering.html', 'Creatives.html', 'sentry-rover.html']) {
    assert.doesNotMatch(fs.readFileSync(new URL(file, root), 'utf8'), /home-motion|home-reveal/);
  }
  const css = fs.readFileSync(new URL('home-motion.css', root), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media print/);
  assert.match(css, /:focus-within/);
  assert.doesNotMatch(css, /will-change|display:\s*none|visibility:\s*hidden/);
});
