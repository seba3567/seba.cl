<script lang="ts">
import type { Snippet } from 'svelte';

type Props = {
	src: string; // base path without extension, e.g. '/apps/anticall/1'
	alt: string;
	/** render density=2 variants (default true) */
	density?: 1 | 2;
	class?: string;
	loading?: 'eager' | 'lazy';
	decoding?: 'sync' | 'async' | 'auto';
	sizes?: string;
	width?: number;
	height?: number;
	children?: Snippet;
};

let {
	src,
	alt,
	density = 2,
	class: className = '',
	loading = 'lazy',
	decoding = 'async',
	sizes,
	width,
	height,
	children,
}: Props = $props();

const avif1 = $derived(`${src}.avif`);
const avif2 = $derived(`${src}@2x.avif`);
const webp1 = $derived(`${src}.webp`);
const webp2 = $derived(`${src}@2x.webp`);
const jpg = $derived(`${src}.jpg`);
</script>

<picture>
	<source
		srcset={density === 2 ? `${avif1} 1x, ${avif2} 2x` : avif1}
		type="image/avif"
		{sizes}
	/>
	<source
		srcset={density === 2 ? `${webp1} 1x, ${webp2} 2x` : webp1}
		type="image/webp"
		{sizes}
	/>
	<img
		src={jpg}
		{alt}
		{loading}
		{decoding}
		{width}
		{height}
		class={className}
	/>
	{#if children}{@render children()}{/if}
</picture>
