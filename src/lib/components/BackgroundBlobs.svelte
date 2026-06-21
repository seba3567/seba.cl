<script lang="ts">
/**
 * Modern minimal background:
 * - Pure dark base (neutral-950)
 * - Subtle aurora gradient (low opacity, no heavy blur)
 * - Subtle grid pattern with radial mask
 * - Subtle noise texture for film grain
 *
 * No big colorful blobs: the user asked for something more modern and less
 * "electric blur". The aurora is a soft radial gradient (not blur-3xl on a
 * solid color) so it reads as ambient light, not a glow.
 */
</script>

<div
	aria-hidden="true"
	class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950"
>
	<!-- Soft aurora: two radial gradients composing a low-contrast mesh -->
	<div
		class="absolute inset-0"
		style="background:
			radial-gradient(ellipse 80% 50% at 15% -10%, rgba(139, 92, 246, 0.10), transparent 60%),
			radial-gradient(ellipse 70% 50% at 85% 110%, rgba(245, 158, 11, 0.06), transparent 60%),
			radial-gradient(ellipse 60% 40% at 50% 50%, rgba(56, 189, 248, 0.03), transparent 70%);"
	></div>

	<!-- Grid: very subtle, masked so it fades at edges -->
	<div
		class="absolute inset-0"
		style="background-image:
			linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
			background-size: 56px 56px;
			mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 85%);
			-webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 85%);"
	></div>

	<!-- Noise texture (SVG turbulence, very low opacity, mix-blend-overlay) -->
	<div
		class="absolute inset-0 opacity-[0.035] mix-blend-overlay"
		style="background-image: url(&quot;data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>&quot;);"
	></div>

	<!-- Top + bottom vignette: pulls focus to center, hides panel edges -->
	<div
		class="absolute inset-x-0 top-0 h-32"
		style="background: linear-gradient(to bottom, rgba(10, 10, 10, 0.6), transparent);"
	></div>
	<div
		class="absolute inset-x-0 bottom-0 h-32"
		style="background: linear-gradient(to top, rgba(10, 10, 10, 0.4), transparent);"
	></div>
</div>
