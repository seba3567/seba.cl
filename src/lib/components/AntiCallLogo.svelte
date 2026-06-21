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
		class="flex shrink-0 items-center justify-center rounded-2xl bg-mint-500 ring-1 ring-mint-400/30 {className}"
		style="width: {size}px; height: {size}px;"
		role="img"
		aria-label="AntiCallCL"
	>
		<PhoneX size={Math.round(size * 0.5)} weight="duotone" class="text-neutral-950" />
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
