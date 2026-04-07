/**
 * Prototype: geometric shapes as elevation sources → topographic contour map.
 *
 * Each seed places different shapes (circles, polygons, rects) that define
 * the height field. d3-contour then renders topo lines around them.
 *
 * Usage:
 *   node scripts/gen-cover-proto.js "hello-world"
 */

import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import { contours } from 'd3-contour';
import { geoPath, geoIdentity } from 'd3-geo';

const seed = process.argv[2] || 'hello-world';
const W = 1200;
const H = 630;
const COLS = 160;
const ROWS = Math.round(COLS * (H / W));
const THRESHOLDS = 8;

// --- Seeded RNG ---
const prng = alea(seed);
const rand = () => prng();
const randRange = (min, max) => min + rand() * (max - min);
const randInt = (min, max) => Math.floor(randRange(min, max));
const pick = (arr) => arr[randInt(0, arr.length)];

// --- Palette ---
const SLATE = [
	'#0f172a', '#1e293b', '#334155', '#475569',
	'#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0',
];
const BG = '#0f172a';

// ============================================================
// Elevation primitives — each returns a height contribution
// for a given (x, y) in grid space [0..COLS, 0..ROWS]
// ============================================================

function elevCircle(cx, cy, r, peak) {
	return (x, y) => {
		const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
		return d < r ? peak * (1 - d / r) : 0;
	};
}

function elevRing(cx, cy, r, width, peak) {
	return (x, y) => {
		const d = Math.abs(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) - r);
		return d < width ? peak * (1 - d / width) : 0;
	};
}

function elevRect(rx, ry, rw, rh, peak, angle) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const hw = rw / 2;
	const hh = rh / 2;
	const rcx = rx + hw;
	const rcy = ry + hh;
	return (x, y) => {
		// Rotate point into rect's local space
		const dx = x - rcx;
		const dy = y - rcy;
		const lx = Math.abs(dx * cos + dy * sin);
		const ly = Math.abs(-dx * sin + dy * cos);
		if (lx > hw || ly > hh) return 0;
		const tx = 1 - lx / hw;
		const ty = 1 - ly / hh;
		return peak * Math.min(tx, ty);
	};
}

function elevPolygon(cx, cy, sides, r, peak) {
	// Approximate polygon as multiple overlapping circles at vertices + center
	const fns = [elevCircle(cx, cy, r * 0.6, peak * 0.7)];
	for (let i = 0; i < sides; i++) {
		const a = (2 * Math.PI * i) / sides + rand() * 0.3;
		const vx = cx + r * 0.7 * Math.cos(a);
		const vy = cy + r * 0.7 * Math.sin(a);
		fns.push(elevCircle(vx, vy, r * 0.45, peak * 0.5));
	}
	return (x, y) => {
		let sum = 0;
		for (const fn of fns) sum = Math.max(sum, fn(x, y));
		return sum;
	};
}

function elevLine(x1, y1, x2, y2, width, peak) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len2 = dx * dx + dy * dy;
	return (x, y) => {
		// Project point onto line segment
		let t = ((x - x1) * dx + (y - y1) * dy) / len2;
		t = Math.max(0, Math.min(1, t));
		const px = x1 + t * dx;
		const py = y1 + t * dy;
		const d = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
		return d < width ? peak * (1 - d / width) : 0;
	};
}

// ============================================================
// Compose elevation sources based on seed
// ============================================================

// Position helpers
// "anchor": center guaranteed inside viewport (partially or fully)
const anchorPos = () => ({
	cx: randRange(COLS * 0.1, COLS * 0.9),
	cy: randRange(ROWS * 0.1, ROWS * 0.9),
});
// "edge": center snapped near one of the 4 edges, extends inward
const edgePos = () => {
	const side = randInt(0, 4);
	if (side === 0) return { cx: randRange(-COLS * 0.1, COLS * 0.3), cy: randRange(ROWS * -0.2, ROWS * 1.2) };  // left
	if (side === 1) return { cx: randRange(COLS * 0.7, COLS * 1.1), cy: randRange(ROWS * -0.2, ROWS * 1.2) };  // right
	if (side === 2) return { cx: randRange(COLS * -0.2, COLS * 1.2), cy: randRange(ROWS * -0.1, ROWS * 0.3) }; // top
	return              { cx: randRange(COLS * -0.2, COLS * 1.2), cy: randRange(ROWS * 0.7, ROWS * 1.1) };    // bottom
};

function makeShape(cx, cy, peak, sign) {
	const type = rand();
	if (type < 0.40) {
		// Circle — most common, large enough to always leave contours visible
		const r = randRange(ROWS * 0.5, ROWS * 1.1);
		return elevCircle(cx, cy, r, peak * sign);
	} else if (type < 0.58) {
		// Ring — large, wide
		const r = randRange(ROWS * 0.5, ROWS * 1.1);
		const w = randRange(ROWS * 0.08, ROWS * 0.18);
		return elevRing(cx, cy, r, w, peak * sign);
	} else if (type < 0.78) {
		// Polygon — organic blob, bigger
		const sides = randInt(3, 7);
		const r = randRange(ROWS * 0.45, ROWS * 0.9);
		return elevPolygon(cx, cy, sides, r, peak * sign);
	} else {
		// Ridge line — long diagonal ridge
		const angle = randRange(0, Math.PI * 2);
		const len = randRange(COLS * 0.6, COLS * 1.4);
		const x2 = cx + Math.cos(angle) * len;
		const y2 = cy + Math.sin(angle) * len;
		const w = randRange(ROWS * 0.08, ROWS * 0.18);
		return elevLine(cx, cy, x2, y2, w, peak * sign);
	}
}

const sources = [];

// 1. Always 1-2 anchor shapes with strong positive peak — guaranteed visible
const anchorCount = randInt(1, 3);
for (let i = 0; i < anchorCount; i++) {
	const { cx, cy } = anchorPos();
	sources.push({ fn: makeShape(cx, cy, randRange(0.7, 1.0), 1) });
}

// 2. 1-3 edge shapes — enter from a border
const edgeCount = randInt(1, 4);
for (let i = 0; i < edgeCount; i++) {
	const { cx, cy } = edgePos();
	const sign = rand() > 0.85 ? -1 : 1; // mostly positive, occasional valley
	sources.push({ fn: makeShape(cx, cy, randRange(0.4, 0.9), sign) });
}

// 3. Optionally 1 valley anywhere for terrain interest
if (rand() > 0.5) {
	const { cx, cy } = rand() > 0.5 ? anchorPos() : edgePos();
	sources.push({ fn: makeShape(cx, cy, randRange(0.3, 0.6), -1) });
}

// ============================================================
// Build height field
// ============================================================

const values = new Float64Array(COLS * ROWS);
const noise2D = createNoise2D(() => rand());
const noiseScale = 0.06 + rand() * 0.04;
const noiseAmt = 0.04 + rand() * 0.03;

for (let j = 0; j < ROWS; j++) {
	for (let i = 0; i < COLS; i++) {
		let h = 0;
		for (const src of sources) {
			h += src.fn(i, j);
		}
		// Add subtle noise to break geometric perfection
		h += noiseAmt * noise2D(i * noiseScale, j * noiseScale);
		values[j * COLS + i] = h;
	}
}

// Normalize to [0, 1]
let minV = Infinity;
let maxV = -Infinity;
for (let k = 0; k < values.length; k++) {
	if (values[k] < minV) minV = values[k];
	if (values[k] > maxV) maxV = values[k];
}
const range = maxV - minV || 1;
for (let k = 0; k < values.length; k++) {
	values[k] = (values[k] - minV) / range;
}

// ============================================================
// Generate contours
// ============================================================

const generator = contours().size([COLS, ROWS]).thresholds(THRESHOLDS);
const bands = generator(values);

const projection = geoIdentity().fitSize([W, H], {
	type: 'MultiPoint',
	coordinates: [[0, 0], [COLS, ROWS]],
});
const path = geoPath(projection);

// ============================================================
// Render SVG
// ============================================================

const els = [];

// Filled bands
for (let i = 0; i < bands.length; i++) {
	const t = i / (bands.length - 1);
	const ci = Math.min(Math.floor(t * SLATE.length), SLATE.length - 1);
	const d = path(bands[i]);
	if (!d) continue;
	els.push(`  <path d="${d}" fill="${SLATE[ci]}" opacity="0.55"/>`);
}

// Contour stroke lines
for (let i = 0; i < bands.length; i++) {
	const t = i / (bands.length - 1);
	const ci = Math.min(Math.floor(t * SLATE.length * 0.8) + 2, SLATE.length - 1);
	const d = path(bands[i]);
	if (!d) continue;
	els.push(`  <path d="${d}" fill="none" stroke="${SLATE[ci]}" stroke-width="0.8" opacity="0.35"/>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
${els.join('\n')}
</svg>`;

process.stdout.write(svg);
