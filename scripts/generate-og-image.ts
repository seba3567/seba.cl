#!/usr/bin/env bun
/**
 * Generate static/og.png — the Open Graph card used when the site
 * is shared on Twitter, Slack, Discord, WhatsApp, etc.
 *
 * Spec: 1200x630 (the canonical OG image size). The card stays
 * legible at small sizes (Discord embeds ~500px wide).
 *
 * Design: matches the site's dark glass theme. Mint accent.
 * Uses sharp to composite text on a gradient background so it
 * stays a single PNG file under 200KB.
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT = join(process.cwd(), 'static', 'og.png');
const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<defs>
		<!-- Deep neutral base, almost black, like the site's background -->
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#0a0a0a"/>
			<stop offset="100%" stop-color="#101513"/>
		</linearGradient>

		<!-- Mint glow on the right (mirrors the aurora in BackgroundBlobs) -->
		<radialGradient id="glow" cx="0.78" cy="0.42" r="0.55">
			<stop offset="0%" stop-color="#34d399" stop-opacity="0.18"/>
			<stop offset="60%" stop-color="#10b981" stop-opacity="0.04"/>
			<stop offset="100%" stop-color="#000000" stop-opacity="0"/>
		</radialGradient>

		<!-- Subtle grid (like the noise/grid in BackgroundBlobs) -->
		<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
			<path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
		</pattern>

		<!-- Brand: large monospace wordmark, mint accent on the dot -->
		<linearGradient id="brandDot" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#6ee7b7"/>
			<stop offset="100%" stop-color="#34d399"/>
		</linearGradient>
	</defs>

	<!-- Base -->
	<rect width="${W}" height="${H}" fill="url(#bg)"/>
	<rect width="${W}" height="${H}" fill="url(#grid)"/>
	<rect width="${W}" height="${H}" fill="url(#glow)"/>

	<!-- Top-left: status pill (live / in development tone) -->
	<g transform="translate(80, 80)">
		<rect x="0" y="0" width="118" height="32" rx="999" fill="rgba(16,185,129,0.08)" stroke="rgba(110,231,183,0.22)" stroke-width="1"/>
		<circle cx="18" cy="16" r="3.5" fill="#6ee7b7"/>
		<circle cx="18" cy="16" r="6" fill="#34d399" opacity="0.3"/>
		<text x="34" y="21" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="500" fill="#86efac" letter-spacing="1.2">EN LÍNEA</text>
	</g>

	<!-- Brand: huge wordmark, mint dot -->
	<text x="80" y="350" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="148" font-weight="600" fill="#fafafa" letter-spacing="-5">seba3567</text>
	<text x="80" y="350" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="148" font-weight="600" fill="url(#brandDot)" letter-spacing="-5" dx="500">.</text>

	<!-- Tagline (below the wordmark) -->
	<text x="80" y="410" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="28" font-weight="400" fill="#a3a3a3" letter-spacing="-0.3">Ingeniería, datos y mobile. Sin humo.</text>

	<!-- Three feature chips (echo the home page stats) -->
	<g transform="translate(80, 480)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
		<g>
			<rect x="0" y="0" width="120" height="38" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
			<text x="60" y="24" text-anchor="middle" font-size="13" fill="#d4d4d4" letter-spacing="0.5">Backend</text>
		</g>
		<g transform="translate(132, 0)">
			<rect x="0" y="0" width="100" height="38" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
			<text x="50" y="24" text-anchor="middle" font-size="13" fill="#d4d4d4" letter-spacing="0.5">Datos</text>
		</g>
		<g transform="translate(244, 0)">
			<rect x="0" y="0" width="110" height="38" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
			<text x="55" y="24" text-anchor="middle" font-size="13" fill="#d4d4d4" letter-spacing="0.5">Mobile</text>
		</g>
		<g transform="translate(366, 0)">
			<rect x="0" y="0" width="80" height="38" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
			<text x="40" y="24" text-anchor="middle" font-size="13" fill="#d4d4d4" letter-spacing="0.5">QA</text>
		</g>
	</g>

	<!-- Footer: domain (bottom-right) -->
	<text x="${W - 80}" y="${H - 60}" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" font-weight="500" fill="#6b7280" letter-spacing="0.5">seba3567.cl</text>
</svg>
`;

const buf = await sharp(Buffer.from(svg))
	.resize(W, H)
	.png({ quality: 90, compressionLevel: 9 })
	.toBuffer();

await writeFile(OUT, buf);
console.log(`og.png written: ${OUT} (${(buf.length / 1024).toFixed(1)} KB)`);
