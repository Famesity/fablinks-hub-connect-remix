#!/usr/bin/env node
/**
 * Generates the Open Graph image: public/og-image.png (1200x630).
 *
 * Pure Node — no image dependencies (the sandbox has no ImageMagick/PIL).
 * Deterministic: running it twice produces byte-identical output.
 *
 * Usage:
 *   node scripts/generate-og-image.mjs                # writes public/og-image.png
 *   node scripts/generate-og-image.mjs /tmp/test.png  # writes elsewhere
 *
 * To restyle the artwork, tweak the palette constants and the title/tagline
 * strings below, then re-run and verify with:
 *   node -e "const b=require('fs').readFileSync('public/og-image.png');"
 */
import zlib from 'node:zlib';
import fs from 'node:fs';

const W = 1200, H = 630;
const OUT = process.argv[2] || 'public/og-image.png';
const px = new Uint8Array(W * H * 4);

// ---- palette (ent theme, matches --ent-* tokens in src/index.css) ----
const INK = [10, 12, 22];        // ent-ink
const STAGE = [4, 26, 64];       // ent-stage
const GOLD1 = [250, 194, 30];    // ent-gold
const GOLD2 = [225, 117, 9];     // ent-gold-deep
const WHITE = [244, 246, 255];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

function setPx(x, y, [r, g, b], a = 1) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  px[i] = Math.round(px[i] * (1 - a) + r * a);
  px[i + 1] = Math.round(px[i + 1] * (1 - a) + g * a);
  px[i + 2] = Math.round(px[i + 2] * (1 - a) + b * a);
  px[i + 3] = 255;
}

// ---- background: diagonal ink -> stage gradient ----
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = (x / W) * 0.35 + (y / H) * 0.65;
    setPx(x, y, mix(INK, STAGE, t));
  }
}

// ---- stage grid, gold 7%, fading toward the bottom ----
const GRID = 52;
for (let y = 0; y < H; y++) {
  const fade = Math.max(0, 1 - y / (H * 0.9));
  if (y % GRID === 0) for (let x = 0; x < W; x++) setPx(x, y, GOLD1, 0.07 * fade);
}
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    const fade = Math.max(0, 1 - y / (H * 0.9));
    if (x % GRID === 0) setPx(x, y, GOLD1, 0.07 * fade);
  }
}

// ---- soft gold glow behind the title ----
const cx = W / 2, cy = H * 0.42, R = 460;
for (let y = Math.max(0, cy - R); y < Math.min(H, cy + R); y++) {
  for (let x = Math.max(0, cx - R); x < Math.min(W, cx + R); x++) {
    const d = Math.hypot(x - cx, y - cy) / R;
    if (d < 1) setPx(x, y, GOLD1, 0.10 * (1 - d) * (1 - d));
  }
}

// ---- marquee bulbs: top & bottom border ----
function bulb(x, y, r) {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const d = Math.hypot(dx, dy);
      if (d <= r) setPx(x + dx, y + dy, GOLD1, d <= r - 1.5 ? 0.95 : 0.35);
    }
  }
}
for (let x = 24; x < W; x += 48) { bulb(x, 22, 5); bulb(x, H - 22, 5); }

// ---- 5x7 block font ----
const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

function textWidth(str, cell, tracking = 1) {
  return str.length * (5 + tracking) * cell - tracking * cell;
}

function drawText(str, x0, y0, cell, colorFn, tracking = 1) {
  let x = x0;
  for (const ch of str) {
    const glyph = FONT[ch] || FONT[' '];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (glyph[r][c] !== '#') continue;
        for (let dy = 0; dy < cell; dy++) {
          for (let dx = 0; dx < cell; dx++) {
            const pxX = x + c * cell + dx;
            const pxY = y0 + r * cell + dy;
            setPx(pxX, pxY, colorFn(pxX, pxY));
          }
        }
      }
    }
    x += (5 + tracking) * cell;
  }
}

// gold gradient sweep across the word
const goldAt = (x) => mix(GOLD2, GOLD1, (Math.sin((x / W) * Math.PI * 1.2 - 0.4) + 1) / 2);
const whiteAt = () => WHITE;

// ---- title: FABLINKS ----
const title = 'FABLINKS';
const titleCell = 15;
const tw = textWidth(title, titleCell);
drawText(title, Math.round((W - tw) / 2), 140, titleCell, goldAt);

// ---- rule under the title ----
{
  const barW = Math.round(tw * 0.7), barX = Math.round((W - barW) / 2), barY = 278;
  for (let y = barY; y < barY + 6; y++)
    for (let x = barX; x < barX + barW; x++)
      setPx(x, y, goldAt(x), 0.9);
}

// ---- tagline ----
const tagline = 'CAMPUS ENTERTAINMENT HUB';
const tagCell = 5;
const tagW = textWidth(tagline, tagCell);
drawText(tagline, Math.round((W - tagW) / 2), 320, tagCell, whiteAt);

// ---- strip line ----
const strip = 'EVENTS  BLOG  DIGITAL SERVICES';
const stripCell = 4;
const stripW = textWidth(strip, stripCell);
drawText(strip, Math.round((W - stripW) / 2), 420, stripCell, (x) => goldAt(x));

// ---- separator dots between the strip words ----
function dotAt(cx0, cy0) {
  for (let dy = -6; dy <= 6; dy++)
    for (let dx = -6; dx <= 6; dx++)
      if (dx * dx + dy * dy <= 36) setPx(cx0 + dx, cy0 + dy, goldAt(cx0), dx * dx + dy * dy <= 20 ? 1 : 0.4);
}
{
  const words = ['EVENTS', 'BLOG', 'DIGITAL SERVICES'];
  const yMid = 420 + (7 * stripCell) / 2;
  let cursor = Math.round((W - stripW) / 2);
  for (let i = 0; i < words.length - 1; i++) {
    cursor += words[i].length * 6 * stripCell; // word advance
    dotAt(cursor + 5.5 * stripCell, yMid);     // midpoint of the gap
    cursor += 12 * stripCell;                  // two space glyphs
  }
}

// ---- PNG encode ----
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const raw = Buffer.alloc(H * (1 + W * 4));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 4)] = 0; // filter: none
  Buffer.from(px.buffer, y * W * 4, W * 4).copy(raw, y * (1 + W * 4) + 1);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync(OUT, png);
console.log(`wrote ${OUT} (${png.length} bytes, ${W}x${H})`);
