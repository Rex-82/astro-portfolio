/**
 * Generates a deterministic topographic SVG cover from a seed string.
 *
 * Uses geometric shapes as elevation sources and d3-contour
 * to produce unique topo-map covers for blog posts.
 */

import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import { contours } from 'd3-contour';
import { geoPath, geoIdentity } from 'd3-geo';

const W = 1200;
const H = 630;
const COLS = 160;
const ROWS = Math.round(COLS * (H / W));
const THRESHOLDS = 8;

const STONE = [
	'#221f1e', // stone-850 (min elevation)
	'#292524', // stone-800
	'#3c3834', // stone-750
	'#44403c', // stone-700
	'#78716c', // stone-500
	'#a8a29e', // stone-400  (~--color-accent)
	'#d6d3d1', // stone-300  (~--color-text-primary)
	'#e7e5e4', // stone-200  (~--color-text-bright)
];
const BG = '#0c0a09'; // stone-950

// --- Elevation primitives ---

function elevCircle(cx: number, cy: number, r: number, peak: number) {
	return (x: number, y: number) => {
		const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
		return d < r ? peak * (1 - d / r) : 0;
	};
}

function elevRing(
	cx: number,
	cy: number,
	r: number,
	width: number,
	peak: number,
) {
	return (x: number, y: number) => {
		const d = Math.abs(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) - r);
		return d < width ? peak * (1 - d / width) : 0;
	};
}

function elevPolygon(
	cx: number,
	cy: number,
	sides: number,
	r: number,
	peak: number,
	rand: () => number,
) {
	const fns = [elevCircle(cx, cy, r * 0.6, peak * 0.7)];
	for (let i = 0; i < sides; i++) {
		const a = (2 * Math.PI * i) / sides + rand() * 0.3;
		const vx = cx + r * 0.7 * Math.cos(a);
		const vy = cy + r * 0.7 * Math.sin(a);
		fns.push(elevCircle(vx, vy, r * 0.45, peak * 0.5));
	}
	return (x: number, y: number) => {
		let sum = 0;
		for (const fn of fns) sum = Math.max(sum, fn(x, y));
		return sum;
	};
}

function elevLine(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	width: number,
	peak: number,
) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len2 = dx * dx + dy * dy;
	return (x: number, y: number) => {
		let t = ((x - x1) * dx + (y - y1) * dy) / len2;
		t = Math.max(0, Math.min(1, t));
		const px = x1 + t * dx;
		const py = y1 + t * dy;
		const d = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
		return d < width ? peak * (1 - d / width) : 0;
	};
}

type ElevFn = (x: number, y: number) => number;

export function generateCover(seed: string): string {
	const prng = alea(seed);
	const rand = () => prng();
	const randRange = (min: number, max: number) => min + rand() * (max - min);
	const randInt = (min: number, max: number) => Math.floor(randRange(min, max));

	// Position helpers
	const anchorPos = () => ({
		cx: randRange(COLS * 0.1, COLS * 0.9),
		cy: randRange(ROWS * 0.1, ROWS * 0.9),
	});

	const edgePos = () => {
		const side = randInt(0, 4);
		if (side === 0)
			return {
				cx: randRange(-COLS * 0.1, COLS * 0.3),
				cy: randRange(ROWS * -0.2, ROWS * 1.2),
			};
		if (side === 1)
			return {
				cx: randRange(COLS * 0.7, COLS * 1.1),
				cy: randRange(ROWS * -0.2, ROWS * 1.2),
			};
		if (side === 2)
			return {
				cx: randRange(COLS * -0.2, COLS * 1.2),
				cy: randRange(ROWS * -0.1, ROWS * 0.3),
			};
		return {
			cx: randRange(COLS * -0.2, COLS * 1.2),
			cy: randRange(ROWS * 0.7, ROWS * 1.1),
		};
	};

	function makeShape(cx: number, cy: number, peak: number, sign: number): ElevFn {
		const type = rand();
		if (type < 0.4) {
			const r = randRange(ROWS * 0.5, ROWS * 1.1);
			return elevCircle(cx, cy, r, peak * sign);
		} else if (type < 0.58) {
			const r = randRange(ROWS * 0.5, ROWS * 1.1);
			const w = randRange(ROWS * 0.08, ROWS * 0.18);
			return elevRing(cx, cy, r, w, peak * sign);
		} else if (type < 0.78) {
			const sides = randInt(3, 7);
			const r = randRange(ROWS * 0.45, ROWS * 0.9);
			return elevPolygon(cx, cy, sides, r, peak * sign, rand);
		} else {
			const angle = randRange(0, Math.PI * 2);
			const len = randRange(COLS * 0.6, COLS * 1.4);
			const x2 = cx + Math.cos(angle) * len;
			const y2 = cy + Math.sin(angle) * len;
			const w = randRange(ROWS * 0.08, ROWS * 0.18);
			return elevLine(cx, cy, x2, y2, w, peak * sign);
		}
	}

	// Compose elevation sources
	const sources: ElevFn[] = [];

	const anchorCount = randInt(1, 3);
	for (let i = 0; i < anchorCount; i++) {
		const { cx, cy } = anchorPos();
		sources.push(makeShape(cx, cy, randRange(0.7, 1.0), 1));
	}

	const edgeCount = randInt(1, 4);
	for (let i = 0; i < edgeCount; i++) {
		const { cx, cy } = edgePos();
		const sign = rand() > 0.85 ? -1 : 1;
		sources.push(makeShape(cx, cy, randRange(0.4, 0.9), sign));
	}

	if (rand() > 0.5) {
		const { cx, cy } = rand() > 0.5 ? anchorPos() : edgePos();
		sources.push(makeShape(cx, cy, randRange(0.3, 0.6), -1));
	}

	// Build height field
	const values = new Float64Array(COLS * ROWS);
	const noise2D = createNoise2D(() => rand());
	const noiseScale = 0.06 + rand() * 0.04;
	const noiseAmt = 0.04 + rand() * 0.03;

	for (let j = 0; j < ROWS; j++) {
		for (let i = 0; i < COLS; i++) {
			let h = 0;
			for (const fn of sources) h += fn(i, j);
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

	// Generate contours
	const generator = contours().size([COLS, ROWS]).thresholds(THRESHOLDS);
	const bands = generator(Array.from(values));

	const projection = geoIdentity().fitSize([W, H], {
		type: 'MultiPoint' as const,
		coordinates: [
			[0, 0],
			[COLS, ROWS],
		],
	});
	const path = geoPath(projection);

	// Render SVG
	const els: string[] = [];

	for (let i = 0; i < bands.length; i++) {
		const t = i / (bands.length - 1);
		const ci = Math.min(Math.floor(t * STONE.length), STONE.length - 1);
		const d = path(bands[i]);
		if (!d) continue;
		els.push(`  <path d="${d}" fill="${STONE[ci]}" opacity="0.55"/>`);
	}

	for (let i = 0; i < bands.length; i++) {
		const t = i / (bands.length - 1);
		const ci = Math.min(
			Math.floor(t * STONE.length * 0.8) + 2,
			STONE.length - 1,
		);
		const d = path(bands[i]);
		if (!d) continue;
		els.push(
			`  <path d="${d}" fill="none" stroke="${STONE[ci]}" stroke-width="0.8" opacity="0.35"/>`,
		);
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <rect width="${W}" height="${H}" fill="${BG}"/>
${els.join('\n')}
</svg>`;
}
