import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

/**
 * Generate a better placeholder logo for AntiCallCL.
 *
 * The real logo is a shield with the Chilean flag gradient
 * (white top, red bottom, blue canton with white star), a
 * crossed-out phone in the center, and the Chilean map outline.
 *
 * This SVG approximates that design so the site looks reasonable
 * until the user drops the real PNG at static/assets/icono.png.
 *
 * Run: bun run scripts/generate-placeholder-logo.ts
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Chilean flag gradient: blue canton top-left, white top, red bottom -->
    <linearGradient id="flag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#d52b1e"/>
      <stop offset="1" stop-color="#d52b1e"/>
    </linearGradient>
    <!-- Subtle shine overlay -->
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.12"/>
    </linearGradient>
  </defs>

  <!-- Shield body (rounded top, pointed bottom) -->
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

  <!-- Blue canton (top-left square) -->
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

  <!-- White 5-pointed star in the canton (centered around 132, 148) -->
  <polygon
    points="132,108 138.5,128 160,128 142.5,140 148,160 132,148 116,160 121.5,140 104,128 125.5,128"
    fill="#ffffff"
  />

  <!-- Crossed-out phone (centered around 256, 290) -->
  <g transform="translate(256 290)">
    <!-- Phone handset: tilted -->
    <g transform="rotate(-35)">
      <path
        d="M-60 -22
           Q-68 -22 -68 -14
           L-68 -2
           Q-68 6 -62 12
           Q-44 30 -22 42
           Q-12 48 -2 42
           L8 32
           Q14 26 8 20
           L-6 6
           Q-12 0 -18 6
           L-26 14
           Q-38 4 -46 -10
           L-40 -18
           Q-34 -24 -28 -18
           L-22 -12
           Q-16 -18 -10 -24
           Q-4 -28 -2 -24
           Q-60 -22 -60 -22 Z"
        fill="#b91c1c"
        stroke="#7f1d1d"
        stroke-width="1"
      />
    </g>
    <!-- Red X mark (cross) -->
    <g transform="translate(48 -36)">
      <rect x="-30" y="-6" width="60" height="12" rx="2" fill="#b91c1c" transform="rotate(45)"/>
      <rect x="-6" y="-30" width="12" height="60" rx="2" fill="#b91c1c" transform="rotate(45)"/>
    </g>
  </g>

  <!-- Chilean map outline (simplified) -->
  <g transform="translate(220 380) rotate(-12)">
    <path
      d="M0 0
         L8 -6
         L14 -10
         L18 -16
         L16 -22
         L20 -28
         L28 -34
         L36 -40
         L42 -48
         L50 -56
         L58 -62
         L64 -68
         L70 -72
         L76 -78
         L82 -82
         L88 -86
         L94 -88
         L100 -90
         L104 -94
         L108 -100
         L112 -108
         L116 -118
         L120 -128
         L124 -138
         L128 -148
         L130 -158
         L132 -168
         L134 -178
         L136 -188
         L138 -198
         L138 -208
         L136 -216
         L132 -222
         L126 -224
         L118 -222
         L108 -218
         L96 -212
         L82 -204
         L66 -194
         L48 -182
         L28 -168
         L8 -152
         L-12 -134
         L-30 -114
         L-46 -92
         L-58 -68
         L-66 -42
         L-68 -14
         L-64 12
         L-54 36
         L-40 56
         L-22 72
         L0 84
         L24 92
         L48 96
         L72 96
         L96 92
         L116 84
         L132 72
         L144 56
         L150 36
         L152 14
         L150 -8
         L146 -28
         L140 -46
         L132 -62
         L122 -76
         L110 -86
         L96 -92
         L80 -94
         L62 -92
         L44 -86
         L24 -76
         L4 -62
         L-16 -46
         L-34 -28
         L-50 -8"
      fill="rgba(255,255,255,0.6)"
      stroke="rgba(255,255,255,0.3)"
      stroke-width="0.5"
    />
  </g>

  <!-- Shine overlay -->
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

  <!-- Inner ring -->
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

await writeFile('static/assets/icono.png', buf);
console.log('placeholder icono.png generated (' + buf.length + ' bytes)');
