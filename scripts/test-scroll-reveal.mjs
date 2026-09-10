import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../scroll-reveal.js', import.meta.url), 'utf8');
function setup(reduced = false) {
  let notify;
  const events = {};
  const animations = [];
  const item = { closest: () => null, contains: x => x === item, animate: (frames, options) => {
    const animation = { frames, options, cancelled: false, cancel() { this.cancelled = true; } };
    animations.push(animation); return animation;
  } };
  const preference = { matches: reduced, addEventListener: (name, fn) => { events.preference = fn; } };
  class Observer { constructor(fn) { notify = fn; } observe() {} }
  const document = { readyState: 'complete', activeElement: null, querySelectorAll: () => [item], addEventListener: (name, fn) => { events[name] = fn; } };
  vm.runInNewContext(source, { document, Element: { prototype: { animate() {} } }, IntersectionObserver: Observer,
    window: { IntersectionObserver: Observer, matchMedia: () => preference, addEventListener: (name, fn) => { events[name] = fn; } } });
  return { item, animations, events, preference, enter: () => notify([{target: item, isIntersecting: true}]), leave: () => notify([{target: item, isIntersecting: false}]) };
}
test('reveals repeat after leaving and re-entering, without idle animation loops', () => {
  const app = setup(); app.enter(); app.enter(); assert.equal(app.animations.length, 1);
  app.leave(); assert.equal(app.animations[0].cancelled, true);
  app.enter(); assert.equal(app.animations.length, 2);
  assert.equal(app.animations[1].options.duration, 460);
  assert.doesNotMatch(source, /requestAnimationFrame|setInterval|unobserve|preventDefault/);
});
test('reduced motion, keyboard focus, and printing cancel optional motion', () => {
  const app = setup(true); app.enter(); assert.equal(app.animations.length, 0);
  app.preference.matches = false; app.leave(); app.enter();
  app.events.focusin({ target: app.item }); assert.equal(app.animations[0].cancelled, true);
  app.events.beforeprint(); app.leave(); app.enter(); assert.equal(app.animations.length, 1);
});
test('shared motion excludes carousels and existing homepage motion and is wired to core pages', () => {
  for (const selector of ['.orbit-stage', '.location-gallery', '.home-reveal', 'dialog']) assert.ok(source.includes(selector));
  for (const file of ['index.html', 'about.html', 'Engineering.html', 'Creatives.html', 'bci.html', 'spacex.html']) {
    assert.match(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), /scroll-reveal.js\?v=20260910-1/);
  }
});
