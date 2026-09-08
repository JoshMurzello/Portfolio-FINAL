import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = fs.readFileSync(new URL('../home-motion.js', import.meta.url), 'utf8');

function setup(options = {}) {
  const windowEvents = {};
  const documentEvents = {};
  const eventOptions = {};
  const frames = new Map();
  let nextFrame = 0;
  let resize;
  let preferenceChange;
  let failWrites = false;
  const node = (top, height = 200, parent = null) => {
    const classes = new Set();
    const styles = new Map();
    const element = {
      offsetTop: top, offsetHeight: height, offsetParent: parent, parentElement: parent,
      classes, styles,
      classList: {
        add: (name) => classes.add(name),
        remove: (name) => classes.delete(name),
        contains: (name) => classes.has(name),
        toggle: (name, value) => value ? classes.add(name) : classes.delete(name)
      },
      style: { setProperty: (name, value) => {
        if (failWrites) throw new Error('style write failed');
        styles.set(name, value);
      } },
      contains: (target) => target === element,
      querySelector: () => null,
      // Deliberately unusable: animation must not influence layout measurement.
      getBoundingClientRect: () => { throw new Error('animated geometry read'); }
    };
    return element;
  };
  const root = node(0);
  root.scrollHeight = options.pageHeight ?? 3600;
  const parent = node(options.parentTop || 0);
  const items = (options.tops || [1000, 1000, 1000]).map((top) => node(top, 400, parent));
  items.forEach((item) => {
    const media = node(0, 240, item);
    item.querySelector = () => media;
  });
  if (options.heading) items[0].classes.add('section-head');
  const hero = node(80, 800);
  const backdrop = node(0);
  const preference = {
    matches: Boolean(options.reduced),
    addEventListener: (_, callback) => { preferenceChange = callback; }
  };
  const window = {
    innerWidth: options.width || 1280, innerHeight: options.height || 800,
    scrollY: options.scroll || 0,
    location: { hash: options.hash || '' },
    matchMedia: () => preference,
    requestAnimationFrame: options.noRAF ? undefined : (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
    addEventListener: (type, callback, settings) => { windowEvents[type] = callback; eventOptions[type] = settings; }
  };
  const contact = { contains: (item) => item === items[2] };
  const document = {
    documentElement: root, body: parent, activeElement: options.focused ? items[0] : null,
    querySelectorAll: () => items,
    querySelector: (selector) => selector === '.hero' ? hero : backdrop,
    getElementById: (id) => id === 'contact' ? contact : null,
    addEventListener: (type, callback) => { documentEvents[type] = callback; }
  };
  class Observer {
    constructor(callback) { resize = callback; }
    observe() {}
  }
  vm.runInNewContext(source, {
    window, document, ResizeObserver: options.noObserver ? undefined : Observer
  });
  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback());
  };
  flush();
  return {
    items, root, parent, hero, backdrop, window, document, frames, windowEvents, documentEvents, eventOptions, flush,
    scroll(y) { window.scrollY = y; windowEvents.scroll(); flush(); },
    reduce(value = true) { preference.matches = value; preferenceChange(); flush(); },
    resize() { resize?.(); flush(); },
    fail() { failWrites = true; }
  };
}

const value = (node, name) => Number.parseFloat(node.styles.get(name));
const active = (app) => app.root.classes.has('home-scroll-active');
const snapshot = (item) => Object.fromEntries(item.styles);

test('scroll distance scrubs entrances continuously and reverses to the exact previous frame', () => {
  const app = setup();
  assert.ok(active(app));
  assert.equal(value(app.items[0], '--home-y'), 64);
  app.scroll(270);
  const early = snapshot(app.items[0]);
  app.scroll(400);
  const middle = snapshot(app.items[0]);
  assert.ok(Number.parseFloat(middle['--home-y']) < Number.parseFloat(early['--home-y']));
  assert.ok(Number.parseFloat(middle['--home-opacity']) > Number.parseFloat(early['--home-opacity']));
  app.scroll(700);
  assert.equal(value(app.items[0], '--home-y'), 0);
  assert.equal(value(app.items[0], '--home-opacity'), 1);
  app.scroll(400);
  assert.deepEqual(snapshot(app.items[0]), middle);
  app.scroll(270);
  assert.deepEqual(snapshot(app.items[0]), early);
  app.scroll(0);
  assert.equal(value(app.items[0], '--home-y'), 64);
});

test('desktop rows stagger by distance, while stacked mobile content has no stagger', () => {
  const app = setup();
  app.scroll(400);
  const shifts = app.items.map((item) => value(item, '--home-y'));
  assert.ok(shifts[0] < shifts[1] && shifts[1] < shifts[2]);
  const mobile = setup({ width: 390 });
  mobile.scroll(400);
  assert.equal(value(mobile.items[0], '--home-y'), value(mobile.items[2], '--home-y'));
  assert.ok(value(mobile.items[0], '--home-y') < shifts[0]);
  const stacked = setup({ tops: [1000, 1600, 2200] });
  const samples = stacked.items.map((item, i) => {
    stacked.scroll(400 + i * 600);
    return value(item, '--home-y');
  });
  assert.deepEqual(samples, [shifts[0], shifts[0], shifts[0]]);
});

test('text stays fully opaque in the reading zone and while leaving at the top', () => {
  const app = setup({ heading: true });
  app.scroll(700);
  assert.equal(value(app.items[0], '--home-scale'), 1);
  assert.equal(value(app.items[0], '--home-y'), 0);
  app.scroll(1300);
  app.items.forEach((item) => {
    assert.equal(value(item, '--home-opacity'), 1);
    assert.ok(value(item, '--home-y') >= -16);
  });
  assert.ok(value(app.items[0], '--home-y') < 0);
});

test('photo movement continues after the card entrance; overscan always covers the image frame', () => {
  const app = setup();
  app.scroll(700);
  const first = snapshot(app.items[0]);
  app.scroll(1000);
  assert.equal(value(app.items[0], '--home-opacity'), 1);
  assert.notEqual(snapshot(app.items[0])['--home-image-y'], first['--home-image-y']);
  for (let y = 0; y <= 2800; y += 20) {
    app.scroll(y);
    const item = app.items[0];
    const offset = Math.abs(value(item, '--home-image-y')) / 100;
    const spare = (value(item, '--home-image-scale') - 1) / 2;
    assert.ok(offset <= spare, 'photo must not expose empty edges');
    const heroOffset = Math.abs(value(app.backdrop, '--home-hero-y')) / 100;
    const heroSpare = (value(app.backdrop, '--home-hero-scale') - 1) / 2;
    assert.ok(heroOffset <= heroSpare, 'hero must not expose empty edges');
  }
});

test('scroll events are passive, coalesced, and never run an idle animation loop', () => {
  const app = setup();
  assert.equal(app.eventOptions.scroll.passive, true);
  assert.equal(app.frames.size, 0);
  for (let i = 0; i < 100; i++) app.windowEvents.scroll();
  assert.equal(app.frames.size, 1);
  app.flush();
  assert.equal(app.frames.size, 0);
  const before = snapshot(app.items[0]);
  app.flush();
  assert.deepEqual(snapshot(app.items[0]), before);
  app.scroll(2800);
  assert.ok(app.items.every((item) => !item.classes.has('home-in-motion')));
});

test('reduced motion, unsupported browsers, and runtime errors leave content visible', () => {
  for (const options of [{ reduced: true }, { noRAF: true }]) assert.ok(!active(setup(options)));
  assert.ok(active(setup({ noObserver: true })));
  const app = setup();
  app.windowEvents.scroll();
  app.reduce();
  assert.ok(!active(app));
  assert.equal(app.frames.size, 0);
  app.reduce(false);
  assert.ok(active(app));
  app.fail();
  app.scroll(350);
  assert.ok(!active(app));
  app.windowEvents.scroll();
  assert.equal(app.frames.size, 0);
});

test('keyboard focus and anchors keep interactive content fully visible', () => {
  const focused = setup({ focused: true });
  assert.equal(value(focused.items[0], '--home-opacity'), 1);
  const app = setup();
  app.document.activeElement = app.items[1];
  app.documentEvents.focusin();
  app.flush();
  assert.equal(value(app.items[1], '--home-y'), 0);
  assert.equal(value(app.items[1], '--home-opacity'), 1);
  app.document.activeElement = null;
  app.documentEvents.focusout();
  app.flush();
  assert.equal(value(app.items[1], '--home-y'), 64);
  const anchor = setup({ hash: '#contact' });
  assert.equal(value(anchor.items[2], '--home-opacity'), 1);
  anchor.window.location.hash = '';
  anchor.windowEvents.hashchange();
  anchor.flush();
  assert.equal(value(anchor.items[2], '--home-y'), 64);
  assert.ok(active(setup({ hash: '#%invalid' })));
});

test('print, restored pages, responsive layouts, and late size changes reset correctly', () => {
  const app = setup();
  app.windowEvents.beforeprint();
  assert.ok(!active(app));
  app.windowEvents.afterprint();
  app.flush();
  assert.ok(active(app));
  app.window.scrollY = 700;
  app.windowEvents.pageshow({ persisted: true });
  app.flush();
  assert.equal(value(app.items[0], '--home-y'), 0);
  app.items[0].offsetTop = 1600;
  app.resize();
  assert.equal(value(app.items[0], '--home-y'), 64);
  app.items[0].offsetTop = 1000;
  app.window.innerHeight = 1200;
  app.windowEvents.resize();
  app.flush();
  assert.equal(value(app.items[0], '--home-y'), 0);
});

test('untransformed layout offsets include positioned parents; the bottom section finishes', () => {
  const app = setup({ tops: [500, 500, 500], parentTop: 500 });
  app.scroll(400);
  const standard = setup();
  standard.scroll(400);
  assert.deepEqual(snapshot(app.items[0]), snapshot(standard.items[0]));
  const bottom = setup({ tops: [2600, 2600, 2600], pageHeight: 3000 });
  bottom.scroll(2200);
  bottom.items.forEach((item) => {
    assert.equal(value(item, '--home-opacity'), 1);
    assert.equal(value(item, '--home-y'), 0);
  });
  const short = setup({ tops: [100, 100, 100], pageHeight: 700 });
  assert.ok(short.items.every((item) => value(item, '--home-opacity') === 1));
});

test('homepage-only opt-in preserves content, native scrolling, image frames, and accessibility', () => {
  const root = new URL('../', import.meta.url);
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  assert.equal((html.match(/class="[^"]*\bhome-reveal\b/g) || []).length, 12);
  assert.equal((html.match(/class="home-media-frame"/g) || []).length, 3);
  assert.match(html, /home-motion\.js\?v=20260903-1" defer/);
  assert.match(html, /home-motion\.css\?v=20260903-1/);
  assert.match(html, /<h1 class="reveal">Builder, filmer, and professional breaker of things\.<\/h1>/);
  assert.match(html, /data-contact-email="Josh.Murzello@gmail.com"/);
  for (const file of ['about.html', 'Engineering.html', 'Creatives.html', 'sentry-rover.html']) {
    assert.doesNotMatch(fs.readFileSync(new URL(file, root), 'utf8'), /home-motion|home-reveal/);
  }
  const css = fs.readFileSync(new URL('home-motion.css', root), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /print/);
  assert.match(css, /:focus-within/);
  assert.doesNotMatch(css, /display:\s*none|visibility:\s*hidden|transition:|animation:/);
  assert.doesNotMatch(source, /preventDefault|\.animate\(|setInterval|IntersectionObserver/);
});
