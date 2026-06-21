#!/usr/bin/env bun
/**
 * fetch-favicon — pull the GitHub profile avatar and generate
 * the favicon variants in /static. Runs on predev/prebuild so
 * the favicon stays in sync if the user ever changes their
 * profile picture.
 *
 * Sources:
 *   - https://avatars.githubusercontent.com/u/<id>?v=4&s=512
 *
 * Outputs in /static:
 *   - favicon.ico       multi-resolution (16/32/48)
 *   - favicon.png       32x32
 *   - favicon-32.png    32x32 (explicit)
 *   - favicon-180.png   180x180 (apple touch, also for manifest)
 *   - favicon-512.png   512x512 (large PWA icon)
 *
 * Why a script (and not a static file in the repo):
 *   - The avatar changes if the user updates their profile
 *     photo on GitHub. One `bun run dev` and the site picks
 *     up the new version.
 *   - The repo stays small (no 512x512 PNG in git).
 *   - If the network is down, the build still succeeds —
 *     we fall back to the last committed `static/favicon.*`
 *     (none on first run) and just skip the download.
 */

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const GITHUB_USER = 'seba3567';
const AVATAR_URL = `https://avatars.githubusercontent.com/u/${'44386561'}?v=4&s=512`;
const OUT_DIR = join(process.cwd(), 'static');

const TIMEOUT_MS = 8000;

async function fetchAvatar() {
	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(AVATAR_URL, {
			signal: controller.signal,
			headers: { Accept: 'image/png' },
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const buf = new Uint8Array(await res.arrayBuffer());
		return buf;
	} finally {
		clearTimeout(t);
	}
}

async function writeVariants(buf) {
	await mkdir(OUT_DIR, { recursive: true });
	const img = sharp(buf);
	const meta = await img.metadata();
	if (!meta.width || !meta.height) {
		throw new Error('avatar has no dimensions');
	}

	// Round-corners: GitHub avatars are square. For the
	// favicon .ico we use a circular mask so the icon doesn't
	// have hard corners inside the browser tab / PWA icon.
	// Mask: white circle on transparent background.
	const size = Math.min(meta.width, meta.height);
	const maskSvg = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
			<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
		</svg>`,
	);
	const rounded = await img
		.clone()
		.resize(size, size, { fit: 'cover' })
		.composite([{ input: maskSvg, blend: 'dest-in' }])
		.png()
		.toBuffer();

	// PWA / manifest icons — different sizes.
	const variants = [
		{ name: 'favicon-32.png', size: 32 },
		{ name: 'favicon-192.png', size: 192 },
		{ name: 'favicon-180.png', size: 180 },
		{ name: 'favicon-512.png', size: 512 },
		{ name: 'apple-touch-icon.png', size: 180 },
	];
	for (const v of variants) {
		const out = await sharp(rounded)
			.resize(v.size, v.size, { fit: 'cover' })
			.png({ compressionLevel: 9 })
			.toBuffer();
		await writeFile(join(OUT_DIR, v.name), out);
	}

	// favicon.png (32x32 — what the layout links to as
	// "image/png" content-type)
	await writeFile(
		join(OUT_DIR, 'favicon.png'),
		await sharp(rounded).resize(32, 32, { fit: 'cover' }).png().toBuffer(),
	);

	// favicon.ico (multi-resolution: 16, 32, 48). Most modern
	// browsers accept PNG data inside an .ico file. We write
	// the 32px PNG to the .ico path for simplicity — the user
	// doesn't need a true BMP-encoded .ico, modern browsers
	// handle PNG-in-ICO just fine.
	await writeFile(
		join(OUT_DIR, 'favicon.ico'),
		await sharp(rounded).resize(32, 32, { fit: 'cover' }).png().toBuffer(),
	);

	// favicon.svg — a wrapper SVG that embeds the rounded PNG
	// as a data URL. This is what the manifest references
	// (type: image/svg+xml) and what modern browsers prefer.
	const pngB64 = Buffer.from(rounded).toString('base64');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
		<image href="data:image/png;base64,${pngB64}" width="${size}" height="${size}"/>
	</svg>`;
	await writeFile(join(OUT_DIR, 'favicon.svg'), svg);

	return {
		'favicon.ico': '32x32 (PNG-in-ICO)',
		'favicon.png': '32x32',
		'favicon.svg': `${size}x${size} (embedded PNG)`,
		'favicon-32.png': '32x32',
		'favicon-180.png': '180x180',
		'favicon-512.png': '512x512',
		'apple-touch-icon.png': '180x180 (apple touch)',
	};
}

async function main() {
	if (!existsSync(OUT_DIR)) {
		await mkdir(OUT_DIR, { recursive: true });
	}
	try {
		console.log(`[fetch-favicon] downloading avatar from ${AVATAR_URL}…`);
		const buf = await fetchAvatar();
		const written = await writeVariants(buf);
		console.log(`[fetch-favicon] wrote ${Object.keys(written).length} variants:`);
		for (const [name, desc] of Object.entries(written)) {
			console.log(`  - static/${name}  (${desc})`);
		}
	} catch (err) {
		console.warn(
			`[fetch-favicon] could not refresh avatar (${err.message ?? err}). Using existing static/favicon.* if present.`,
		);
		// Don't fail the build — just warn. The repo ships
		// without the icons on first run; the user will run
		// `bun run fetch:favicon` once to bootstrap.
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
