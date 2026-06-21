<script lang="ts">
import { animate, stagger, utils } from 'animejs';
import { CaretLeft, CaretRight } from 'phosphor-svelte';
import { onMount, type Snippet } from 'svelte';

type Props = {
	children: Snippet;
	/** Width of each child for the scroll-snap layout. */
	itemWidth?: string; // e.g. '320px', 'min(85vw, 320px)'
	/** Gap between items. */
	gap?: string;
	/** Show progress dots. */
	showDots?: boolean;
	/** Show side arrow buttons. */
	showArrows?: boolean;
	/** Show fade-mask edges (left+right). */
	showFade?: boolean;
	/** Stagger animation offset (px) and stagger ms. */
	revealOffset?: number;
	revealStagger?: number;
	revealDuration?: number;
	/** Optional accessible label. */
	ariaLabel?: string;
	class?: string;
};

let {
	children,
	itemWidth = 'min(85vw, 320px)',
	gap = '1rem',
	showDots = true,
	showArrows = true,
	showFade = true,
	revealOffset = 60,
	revealStagger = 70,
	revealDuration = 700,
	ariaLabel = 'Horizontal scroller',
	class: className = '',
}: Props = $props();

let scrollerEl: HTMLElement | undefined = $state();
let items: HTMLElement[] = $state([]);
let progress = $state(0);
let canScrollLeft = $state(false);
let canScrollRight = $state(true);

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Track scroll position for dots and arrow states
function updateScrollState() {
	if (!scrollerEl) return;
	const { scrollLeft, scrollWidth, clientWidth } = scrollerEl;
	const max = scrollWidth - clientWidth;
	progress = max > 0 ? scrollLeft / max : 0;
	canScrollLeft = scrollLeft > 4;
	canScrollRight = scrollLeft < max - 4;
}

function scrollBy(direction: -1 | 1) {
	if (!scrollerEl) return;
	const amount = scrollerEl.clientWidth * 0.85;
	scrollerEl.scrollBy({ left: direction * amount, behavior: 'smooth' });
}

// Drag-to-scroll (mouse / touch)
let isDown = false;
let startX = 0;
let startScrollLeft = 0;
let dragged = false;

function onPointerDown(e: PointerEvent) {
	if (!scrollerEl) return;
	isDown = true;
	dragged = false;
	startX = e.clientX;
	startScrollLeft = scrollerEl.scrollLeft;
	scrollerEl.setPointerCapture(e.pointerId);
	scrollerEl.style.cursor = 'grabbing';
	scrollerEl.style.userSelect = 'none';
}
function onPointerMove(e: PointerEvent) {
	if (!isDown || !scrollerEl) return;
	const dx = e.clientX - startX;
	if (Math.abs(dx) > 3) dragged = true;
	scrollerEl.scrollLeft = startScrollLeft - dx;
}
function onPointerUp(e: PointerEvent) {
	if (!scrollerEl) return;
	isDown = false;
	scrollerEl.releasePointerCapture(e.pointerId);
	scrollerEl.style.cursor = '';
	scrollerEl.style.userSelect = '';
}
function onClickCapture(e: MouseEvent) {
	// Prevent link clicks when user dragged
	if (dragged) {
		e.preventDefault();
		e.stopPropagation();
		dragged = false;
	}
}

// Anime.js entrance: stagger fade-up as items enter the scroller
onMount(() => {
	if (!scrollerEl) return;
	updateScrollState();
	scrollerEl.addEventListener('scroll', updateScrollState, { passive: true });
	window.addEventListener('resize', updateScrollState);

	const reduce = prefersReducedMotion();
	if (reduce) {
		for (const el of items) {
			el.style.opacity = '1';
			el.style.transform = 'none';
		}
		return;
	}

	// Set initial state
	for (const el of items) {
		el.style.opacity = '0';
		el.style.transform = `translateX(-${revealOffset}px)`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					animate(items, {
						opacity: [0, 1],
						translateX: [-revealOffset, 0],
						delay: stagger(revealStagger),
						duration: revealDuration,
						ease: 'out(4)',
					});
					observer.disconnect();
				}
			}
		},
		{ threshold: 0.1 },
	);
	observer.observe(scrollerEl);

	return () => {
		observer.disconnect();
		scrollerEl?.removeEventListener('scroll', updateScrollState);
		window.removeEventListener('resize', updateScrollState);
	};
});

// Capture child refs via a snippet ref helper
export function registerItem(el: HTMLElement) {
	if (el && !items.includes(el)) items = [...items, el];
}
</script>

<div class="relative {className}">
	<!-- Fade masks -->
	{#if showFade}
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-950 to-transparent transition-opacity duration-300 {canScrollLeft
				? 'opacity-100'
				: 'opacity-0'}"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-950 to-transparent transition-opacity duration-300 {canScrollRight
				? 'opacity-100'
				: 'opacity-0'}"
		></div>
	{/if}

	<!-- Side arrows -->
	{#if showArrows}
		<button
			type="button"
			onclick={() => scrollBy(-1)}
			disabled={!canScrollLeft}
			aria-label="Anterior"
			class="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 p-2.5 text-neutral-300 backdrop-blur transition-all hover:bg-white/10 hover:text-neutral-100 disabled:pointer-events-none disabled:opacity-0 sm:inline-flex"
		>
			<CaretLeft size={16} weight="bold" />
		</button>
		<button
			type="button"
			onclick={() => scrollBy(1)}
			disabled={!canScrollRight}
			aria-label="Siguiente"
			class="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 p-2.5 text-neutral-300 backdrop-blur transition-all hover:bg-white/10 hover:text-neutral-100 disabled:pointer-events-none disabled:opacity-0 sm:inline-flex"
		>
			<CaretRight size={16} weight="bold" />
		</button>
	{/if}

	<!-- Scroller -->
	<div
		bind:this={scrollerEl}
		role="region"
		aria-label={ariaLabel}
		class="scroll-x-row flex overflow-x-auto overflow-y-visible pb-4"
		style="gap: {gap}; scroll-snap-type: x mandatory; scroll-padding: 0 1.5rem; -webkit-overflow-scrolling: touch;"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onclickcapture={onClickCapture}
	>
		{@render children()}
	</div>

	<!-- Progress dots/line -->
	{#if showDots && items.length > 1}
		<div class="mt-6 flex items-center justify-center gap-1.5">
			{#each items as _, i (i)}
				<button
					type="button"
					onclick={() => {
						if (!scrollerEl || !items[i]) return;
						items[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
					}}
					aria-label={"Ir a item " + (i + 1)}
					class="size-1.5 rounded-full bg-white/15 transition-all duration-300 hover:bg-white/40"
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	:global(.scroll-x-row) {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	:global(.scroll-x-row::-webkit-scrollbar) {
		display: none;
	}
	:global(.scroll-x-row > *) {
		flex: 0 0 auto;
		scroll-snap-align: start;
	}
</style>
