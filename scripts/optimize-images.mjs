#!/usr/bin/env bun
/**
 * Optimize images: convert JPG/PNG in static/ to AVIF + WebP at 1x/2x.
 * Run: `bun run optimize:images` or `bun run build` (added to build pipeline).
 *
 * Inputs:  static (recursively), extensions .jpg, .jpeg, .png
 * Outputs: same basename with .avif + .webp at 1x and 2x
 *
 * Idempotent: skips outputs newer than inputs.
 *
 * Note: AVIF is intentionally NOT a supported input — sharp can't read
 * from and write to the same path, and processing already-generated
 * 2x variants would create 2x2x variants. Keep source formats as
 * JPG/PNG; the pipeline emits AVIF as the optimized output.
 */

import { readdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const STATIC_DIR = join(ROOT, 'static');
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png']);

/** Recursively walk static/ and return every supported file. */
async function* walk(dir) {
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(path);
		} else if (SUPPORTED.has(extname(entry.name).toLowerCase())) {
			yield path;
		}
	}
}

/** Build the output path for a given input. */
function outPath(input, format, density) {
	const ext = extname(input);
	const stem = basename(input, ext);
	const dir = dirname(input);
	const suffix = density === 2 ? '@2x' : '';
	return join(dir, `${stem}${suffix}.${format}`);
}

/** Skip if the output is newer than the input. */
async function isFresh(input, output) {
	try {
		const [inM, outM] = await Promise.all([stat(input), stat(output)]);
		return outM.mtimeMs > inM.mtimeMs;
	} catch {
		return false;
	}
}

async function optimizeOne(input) {
	const rel = relative(STATIC_DIR, input);
	const tasks = [];

	// AVIF (1x + 2x) — best compression, modern
	for (const density of [1, 2]) {
		const out = outPath(input, 'avif', density);
		if (await isFresh(input, out)) continue;
		tasks.push(
			sharp(input, { failOn: 'none' })
				.resize({
					withoutEnlargement: true,
					...(density === 2 ? { multiplier: 2 } : {}),
				})
				.avif({ quality: 55, effort: 4, chromaSubsampling: '4:4:4' })
				.toFile(out)
				.then(() => log('✓', rel, '→', relative(STATIC_DIR, out)))
				.catch((err) => log('✗', rel, 'avif@', density, err.message)),
		);
	}

	// WebP (1x + 2x) — fallback for older browsers
	for (const density of [1, 2]) {
		const out = outPath(input, 'webp', density);
		if (await isFresh(input, out)) continue;
		tasks.push(
			sharp(input, { failOn: 'none' })
				.resize({
					withoutEnlargement: true,
					...(density === 2 ? { multiplier: 2 } : {}),
				})
				.webp({ quality: 78, effort: 4 })
				.toFile(out)
				.then(() => log('✓', rel, '→', relative(STATIC_DIR, out)))
				.catch((err) => log('✗', rel, 'webp@', density, err.message)),
		);
	}

	if (tasks.length) await Promise.all(tasks);
}

function log(...args) {
	console.log('[optimize:images]', ...args);
}

async function main() {
	log('scanning', STATIC_DIR);
	let count = 0;
	for await (const file of walk(STATIC_DIR)) {
		count++;
		await optimizeOne(file);
	}
	log(`done · ${count} file(s) processed`);
}

main().catch((err) => {
	console.error('[optimize:images] failed:', err);
	process.exit(1);
});
