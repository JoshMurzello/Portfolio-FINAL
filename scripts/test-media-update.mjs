import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');
const context = vm.createContext({window: {}});
vm.runInContext(read('travel-albums.js'), context);
const albums = context.window.TRAVEL_ALBUMS;

test('four source-backed journals contain 21 distinct captioned photos', () => {
  assert.deepEqual(Array.from(albums, (album) => [album.id, album.media.length]), [['japan', 8], ['vietnam', 6], ['california', 4], ['austin', 3]]);
  const sources = albums.flatMap((album) => album.media.map((asset) => asset.src));
  assert.equal(new Set(sources).size, 21);
  for (const album of albums) {
    assert.ok(album.photoJournal && album.categories.includes('travel'));
    assert.ok(fs.existsSync(new URL(album.thumbnail, root)));
    for (const asset of album.media) {
      assert.ok(asset.alt.length > 25 && asset.caption.length > 10);
      assert.ok(asset.width > 0 && asset.height > 0);
      assert.ok(fs.statSync(new URL(asset.src, root)).size < 850_000, asset.src);
      assert.ok(fs.existsSync(new URL(asset.src.replace(/\.webp$/, '-640.webp'), root)));
    }
  }
});

test('journals are discoverable before the scroll archive and use full-frame responsive images', () => {
  const html = read('Creatives.html');
  assert.ok(html.indexOf('id="photo-journals"') < html.indexOf('id="velocity-gallery"'));
  assert.ok(html.indexOf('src="travel-albums.js') < html.indexOf('src="creatives.js'));
  const js = read('creatives.js');
  assert.match(js, /img\.srcset/);
  assert.match(js, /modal\.scrollTop = 0/);
  assert.match(js, /modalRefs\.media\.replaceChildren\(\)/);
  assert.match(read('creatives.css'), /is-photo-album \.modal-media img \{ aspect-ratio: auto/);
});

test('new videos are opt-in, silent, captioned, and lightweight', () => {
  const pages = ['camera-storage.html', 'cyclodial-actuator.html'];
  let count = 0;
  for (const page of pages) {
    const html = read(page);
    for (const match of html.matchAll(/<video\b([^>]+)>([\s\S]*?)<\/video>/g)) {
      count++;
      const attributes = match[1];
      assert.match(attributes, /controls/);
      assert.match(attributes, /playsinline/);
      assert.match(attributes, /muted/);
      assert.match(attributes, /preload="none"/);
      assert.doesNotMatch(attributes, /autoplay/);
      const id = attributes.match(/aria-describedby="([^"]+)"/)[1];
      assert.ok(html.includes(`id="${id}"`));
      const poster = attributes.match(/poster="([^"]+)"/)[1];
      assert.ok(fs.existsSync(new URL(poster, root)));
      const video = match[2].match(/<source src="([^"]+)"/)[1];
      const bytes = fs.readFileSync(new URL(video, root));
      assert.ok(bytes.length > 5_000 && bytes.length < 5_000_000, video);
      assert.ok(bytes.includes(Buffer.from('avc1')), `${video} is H.264`);
      assert.ok(bytes.indexOf('moov') > 0 && bytes.indexOf('moov') < bytes.indexOf('mdat'), `${video} is fast-start MP4`);
    }
  }
  assert.equal(count, 3);
});

test('approved project grouping keeps products together and Focus Dial standalone', () => {
  const html = read('3Dprint.html');
  for (const page of ['camera-storage.html', 'plant-shelf.html', 'dinkrack.html']) assert.ok(html.includes(`href="${page}"`));
  assert.ok(!html.includes('href="pomodoro.html"'));
  const engineering = read('Engineering.html');
  for (const page of ['pomodoro.html', 'mars.html']) assert.ok(engineering.includes(`href="${page}"`));
  const downloads = engineering.match(/<aside class="orbit-downloads"[\s\S]*?<\/aside>/)[0];
  assert.match(downloads, /href="stl-drops.html"/);
  assert.ok(engineering.indexOf(downloads) > engineering.indexOf('</main>'));
  const catalogContext = vm.createContext({ window: {} });
  vm.runInContext(read('engineering-projects.js'), catalogContext);
  const catalog = catalogContext.window.ENGINEERING_PROJECTS;
  for (const id of ['camera-storage', 'plant-shelf', 'dinkrack', 'stl-drops']) assert.ok(!catalog.some(project => project.id === id));
  const drops = read('stl-drops.html');
  assert.match(drops, /No downloadable files have been released/);
  assert.doesNotMatch(drops, /<form|src="stl-drops.js"|Unlock the current drop/);
  assert.doesNotMatch(read('camera-storage.html'), /next revision gets photographed/);
  assert.doesNotMatch(read('pomodoro.html'), /artifact target:/);
});
