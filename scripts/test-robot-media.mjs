import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const html = fs.readFileSync(new URL('self-balancing-robot.html', root), 'utf8');

test('robot demos have controls, a still fallback, and no forced playback', () => {
  const players = [...html.matchAll(/<video\b([^>]+)>([\s\S]*?)<\/video>/g)];
  assert.equal(players.length, 2);
  for (const [, attributes, body] of players) {
    for (const attribute of ['controls', 'playsinline', 'muted', 'preload="none"', 'aria-label=', 'aria-describedby=']) assert.ok(attributes.includes(attribute));
    assert.doesNotMatch(attributes, /autoplay/);
    const poster = attributes.match(/poster="([^"]+)"/)[1];
    const video = body.match(/src="([^"]+)"/)[1];
    assert.ok(fs.existsSync(new URL(poster, root)));
    assert.ok(fs.existsSync(new URL(video, root)));
    assert.ok(html.includes(`href="${video}"`));
  }
});

test('web clips use H.264 MP4 with metadata before video data for early playback', () => {
  for (const name of ['maze', 'bench']) {
    const buffer = fs.readFileSync(new URL(`videos/optimized/self-balancing-${name}-web.mp4`, root));
    const atoms = [];
    for (let offset = 0; offset + 8 <= buffer.length;) {
      const shortSize = buffer.readUInt32BE(offset);
      const size = shortSize === 1 ? Number(buffer.readBigUInt64BE(offset + 8)) : shortSize === 0 ? buffer.length - offset : shortSize;
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      atoms.push(type);
      assert.ok(size >= 8 && offset + size <= buffer.length, `valid ${type} atom`);
      offset += size;
    }
    assert.equal(atoms[0], 'ftyp');
    assert.ok(atoms.indexOf('moov') >= 0 && atoms.indexOf('moov') < atoms.indexOf('mdat'));
    assert.ok(buffer.includes(Buffer.from('avc1')), 'H.264 codec');
    assert.ok(buffer.length < 5_000_000, 'bounded web clip size');
  }
});

test('updated robot media replaces the previous photos without deleting originals', () => {
  assert.match(html, /self-balancing-late-night\.jpg/);
  assert.match(html, /self-balancing-bench-still\.jpg/);
  assert.doesNotMatch(html, /self-balancing-robot-(?:finished|build)-1600\.jpg/);
  assert.match(html, /Original speed · Audio removed/);
  for (const name of ['finished', 'build']) assert.ok(fs.existsSync(new URL(`images/optimized/self-balancing-robot-${name}-1600.jpg`, root)));
});
