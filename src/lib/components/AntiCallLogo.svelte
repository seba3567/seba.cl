<script lang="ts">
	/**
	 * AntiCallLogo — escudo de la app con fallback al PhoneX de Phosphor.
	 *
	 * Source: static/assets/icono.png
	 * Pipeline: scripts/optimize-images.mjs genera icono.avif + icono@2x.avif
	 * + icono.webp + icono@2x.webp (NUNCA JPG) en build/prebuild.
	 *
	 * Comportamiento:
	 * 1. <img src=icono.avif> renderiza
	 * 2. onerror → swap a icono.webp
	 * 3. Si WebP tampoco → flag fallback=true → PhoneX mint
	 */
	import { PhoneX } from 'phosphor-svelte';

	type Props = {
		size?: number;
		class?: string;
	};
	let { size = 64, class: className = '' }: Props = $props();

	let fallback = $state(false);
</script>

{#if fallback}
	<div
		class="group/fb relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-mint-400/30 {className}"
		style="width: {size}px; height: {size}px; background: linear-gradient(135deg, rgb(110 231 183) 0%, rgb(16 185 129) 50%, rgb(5 150 105) 100%); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 0 0 1px rgb(16 185 129 / 0.1);"
		role="img"
		aria-label="AntiCallCL"
	>
		<!-- Inner highlight (top) -->
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent"
		></span>
		<!-- Subtle inner ring -->
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-1 rounded-xl ring-1 ring-inset ring-white/10"
		></span>
		<PhoneX
			size={Math.round(size * 0.55)}
			weight="duotone"
			class="relative z-10 text-neutral-950 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
		/>
	</div>
{:else}
	<img
		src="/assets/icono.avif"
		alt="AntiCallCL"
		class="shrink-0 {className}"
		width={size}
		height={size}
		loading="lazy"
		onerror={(e) => {
			const img = e.currentTarget as HTMLImageElement;
			if (!img.dataset.triedWebp) {
				img.dataset.triedWebp = '1';
				img.src = '/assets/icono.webp';
			} else {
				fallback = true;
			}
		}}
	/>
{/if}
