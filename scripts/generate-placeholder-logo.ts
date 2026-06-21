import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

/**
 * Generate a placeholder logo for AntiCallCL.
 *
 * The real logo lives at assets/iconos/anticall/icono.avif (user's
 * workspace). The optimize pipeline in scripts/optimize-images.mjs
 * walks static/ recursively, so when the user copies that AVIF into
 * static/iconos/anticall/icono.avif, the AVIF stays as-is and sharp
 * generates the WebP + @2x variants automatically.
 *
 * This SVG placeholder approximates the real design so the site looks
 * reasonable until the user drops the real file.
 *
 * Run: bun run scripts/generate-placeholder-logo.ts
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="flag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#d52b1e"/>
      <stop offset="1" stop-color="#d52b1e"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <path
    d="M256 32
       L456 96
       Q456 100 456 104
       L456 264
       Q456 392 256 480
       Q56 392 56 264
       L56 104
       Q56 100 56 96 Z"
    fill="url(#flag)"
    stroke="rgba(255,255,255,0.18)"
    stroke-width="2"
  />
  <path
    d="M56 96
       Q56 100 56 104
       L56 208
       L208 208
       L208 96
       Q208 92 208 88
       L64 88
       Q60 88 56 92
       Q56 96 56 96 Z"
    fill="#0a3a8c"
  />
  <polygon
    points="132,108 138.5,128 160,128 142.5,140 148,160 132,148 116,160 121.5,140 104,128 125.5,128"
    fill="#ffffff"
  />
  <g transform="translate(256 290)">
    <circle r="55" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
    <path d="M0 -55 Q-8 -45 -8 -38" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <path
    d="M256 32
       L456 96
       Q456 100 456 104
       L456 264
       Q456 392 256 480
       Q56 392 56 264
       L56 104
       Q56 100 56 96 Z"
    fill="url(#shine)"
  />
  <path
    d="M256 40
       L448 102
       L448 264
       Q448 386 256 470
       Q64 386 64 264
       L64 102 Z"
    fill="none"
    stroke="rgba(255,255,255,0.12)"
    stroke-width="1.5"
  />
</svg>`;

const buf = await sharp(Buffer.from(svg))
	.resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.png()
	.toBuffer();

await writeFile('static/iconos/anticall/icono.png', buf);
console.log('placeholder icono.png generated (' + buf.length + ' bytes)');
