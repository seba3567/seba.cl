<script lang="ts">
	import { animate, stagger } from 'animejs';

	function prefersReducedMotion(): boolean {
		if (typeof window === 'undefined' || !window.matchMedia) return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
	import { X, CaretLeft, CaretRight, DownloadSimple } from 'phosphor-svelte';
	import OptimizedPicture from './OptimizedPicture.svelte';

	type Props = {
		open: boolean;
		images: Array<{
			src: string; // base path without extension
			alt: string;
			caption?: string;
		}>;
		index: number;
		onClose: () => void;
	};

	let { open = $bindable(), images, index = $bindable(0), onClose }: Props = $props();

	const current = $derived(images[index] ?? images[0]);
	const hasPrev = $derived(index > 0);
	const hasNext = $derived(index < images.length - 1);

	let backdropEl: HTMLElement | undefined = $state();
	let imageWrapEl: HTMLElement | undefined = $state();
	let captionEl: HTMLElement | undefined = $state();

	// Lock body scroll while open
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Animate on open / on index change
	$effect(() => {
		if (!open) return;
		if (!imageWrapEl || !backdropEl || !captionEl) return;

		const reduce = prefersReducedMotion();

		// Backdrop fade
		animate(backdropEl, {
			opacity: [0, 1],
			duration: reduce ? 0 : 280,
			ease: 'out(3)',
		});

		// Image scale + fade (re-runs on index change because key changes)
		animate(imageWrapEl, {
			opacity: [0, 1],
			scale: [0.94, 1],
			duration: reduce ? 0 : 360,
			ease: 'out(4)',
		});

		// Caption / counter stagger
		const meta = captionEl.querySelectorAll<HTMLElement>('[data-meta]');
		if (meta.length) {
			animate(meta, {
				opacity: [0, 1],
				translateY: [10, 0],
				delay: stagger(reduce ? 0 : 60, { start: reduce ? 0 : 180 }),
				duration: reduce ? 0 : 360,
				ease: 'out(3)',
			});
		}
	});

	function next() {
		if (!hasNext) return;
		index = index + 1;
	}
	function prev() {
		if (!hasPrev) return;
		index = index - 1;
	}

	function handleKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') onClose();
		else if (e.key === 'ArrowRight') next();
		else if (e.key === 'ArrowLeft') prev();
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (open) {
			window.addEventListener('keydown', handleKey);
			return () => window.removeEventListener('keydown', handleKey);
		}
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}

	function handleDownload() {
		if (!current) return;
		const a = document.createElement('a');
		a.href = `${current.src}.jpg`;
		a.download = `${current.src.split('/').pop()}.jpg`;
		a.target = '_blank';
		a.click();
	}

	// Touch swipe
	let touchStartX = 0;
	let touchEndX = 0;
	function onTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}
	function onTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		const diff = touchEndX - touchStartX;
		if (Math.abs(diff) > 50) {
			if (diff < 0) next();
			else prev();
		}
	}
</script>

{#if open && current}
	<div
		bind:this={backdropEl}
		role="dialog"
		aria-modal="true"
		aria-label="Visor de imágenes"
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 p-4 backdrop-blur-2xl sm:p-8"
		style="opacity: 0; touch-action: pan-y;"
		onclick={handleBackdropClick}
		onkeydown={(e) => {
			if (e.key === 'Escape') onClose();
		}}
		ontouchstart={onTouchStart}
		ontouchend={onTouchEnd}
	>
		<!-- TOP BAR -->
		<div
			bind:this={captionEl}
			class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-4 sm:p-6"
		>
			<div data-meta class="pointer-events-auto flex items-center gap-2">
				<span
					class="rounded-full border border-white/10 bg-neutral-950/80 px-3 py-1 font-mono text-[11px] text-neutral-200 backdrop-blur"
				>
					{String(index + 1).padStart(2, '0')} <span class="text-neutral-600">/</span> {String(images.length).padStart(2, '0')}
				</span>
				{#if current.caption}
					<span
						class="hidden max-w-md truncate rounded-full border border-white/10 bg-neutral-950/80 px-3 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur sm:inline"
					>
						{current.caption}
					</span>
				{/if}
			</div>

			<div data-meta class="pointer-events-auto flex items-center gap-1.5">
				<button
					type="button"
					onclick={handleDownload}
					class="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 text-neutral-300 backdrop-blur transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label="Descargar imagen"
				>
					<DownloadSimple size={14} weight="bold" />
				</button>
				<button
					type="button"
					onclick={onClose}
					class="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 text-neutral-300 backdrop-blur transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label="Cerrar"
				>
					<X size={14} weight="bold" />
				</button>
			</div>
		</div>

		<!-- IMAGE -->
		<div
			bind:this={imageWrapEl}
			class="relative max-h-[80vh] w-full max-w-md"
			style="opacity: 0; transform: scale(0.94);"
		>
			<div
				class="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60"
			>
				<OptimizedPicture
					src={current.src}
					alt={current.alt}
					class="size-full object-cover"
					width={540}
					height={1200}
					loading="eager"
				/>
			</div>
		</div>

		<!-- BOTTOM NAV (dots) -->
		<div
			data-meta
			class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-1.5 p-4 sm:p-6"
		>
			{#each images as _, i (i)}
				<button
					type="button"
					onclick={() => (index = i)}
					aria-label={"Ir a imagen " + (i + 1)}
					class="pointer-events-auto size-1.5 rounded-full transition-all duration-300 {i === index
						? 'w-6 bg-neutral-200'
						: 'bg-neutral-600 hover:bg-neutral-400'}"
				></button>
			{/each}
		</div>

		<!-- SIDE ARROWS -->
		<button
			type="button"
			onclick={prev}
			disabled={!hasPrev}
			aria-label="Anterior"
			class="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 p-3 text-neutral-300 backdrop-blur transition-all hover:bg-white/10 hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 sm:inline-flex"
		>
			<CaretLeft size={18} weight="bold" />
		</button>
		<button
			type="button"
			onclick={next}
			disabled={!hasNext}
			aria-label="Siguiente"
			class="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 p-3 text-neutral-300 backdrop-blur transition-all hover:bg-white/10 hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 sm:inline-flex"
		>
			<CaretRight size={18} weight="bold" />
		</button>
	</div>
{/if}
