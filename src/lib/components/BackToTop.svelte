<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'animejs';
	import { ArrowUp } from 'phosphor-svelte';

	let visible = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const onScroll = () => {
			const h = document.documentElement;
			visible = h.scrollTop > 320;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function backToTop() {
		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
	}

	$effect(() => {
		if (!mounted) return;
		const el = document.getElementById('back-to-top');
		if (!el) return;
		if (visible) {
			animate(el, {
				opacity: [0, 1],
				scale: [0.6, 1],
				duration: 280,
				ease: 'out(3)',
			});
		} else {
			animate(el, {
				opacity: [1, 0],
				scale: [1, 0.6],
				duration: 200,
				ease: 'out(2)',
			});
		}
	});
</script>

<button
	id="back-to-top"
	type="button"
	onclick={backToTop}
	aria-label="Volver arriba"
	class="glass-liquid fixed bottom-6 right-6 z-50 inline-flex size-12 items-center justify-center rounded-full text-neutral-100 shadow-2xl shadow-black/60"
	style="opacity: 0; pointer-events: {visible ? 'auto' : 'none'};"
>
	<ArrowUp size={18} weight="bold" />
</button>
