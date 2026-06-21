<script lang="ts">
import { animate, stagger } from 'animejs';
import { onMount } from 'svelte';
import ContactDialog from '$lib/components/ContactDialog.svelte';
import ContactPanel from '$lib/components/home/ContactPanel.svelte';
import HeroPanel from '$lib/components/home/HeroPanel.svelte';
import HomeDots from '$lib/components/home/HomeDots.svelte';
import SelectionPanel from '$lib/components/home/SelectionPanel.svelte';
import SpecialtiesPanel from '$lib/components/home/SpecialtiesPanel.svelte';
import StackPanel from '$lib/components/home/StackPanel.svelte';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

// Contact dialog state. Email entry uses this instead of a
// `mailto:` link, so the real address never ships to the client.
let contactOpen = $state(false);

// ----- Horizontal scroll state -----
const SECTIONS = [
	{ id: 'hero', label: 'Inicio' },
	{ id: 'seleccion', label: 'Selección' },
	{ id: 'stack', label: 'Stack' },
	{ id: 'especialidades', label: 'Especialidades' },
	{ id: 'contacto', label: 'Contacto' },
] as const;

let trackEl: HTMLElement | undefined = $state();
let activeSection: string = $state('hero');

function scrollToSection(id: string) {
	const track = trackEl;
	if (!track) return;
	const el = document.getElementById(id);
	if (!el) return;
	track.scrollTo({
		left: el.offsetLeft - track.offsetLeft,
		behavior: 'smooth',
	});
}

onMount(() => {
	const track = trackEl;
	if (!track) return;

	// Map vertical wheel to horizontal scroll
	const onWheel = (e: WheelEvent) => {
		// If user is on touchpad with explicit horizontal scroll, let it through
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
		// Vertical wheel → horizontal
		e.preventDefault();
		const step = e.deltaY === 0 ? e.deltaX : e.deltaY;
		track.scrollBy({ left: step, behavior: 'auto' });
	};
	track.addEventListener('wheel', onWheel, { passive: false });

	// Track active section via IntersectionObserver
	const obs = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
					activeSection = (entry.target as HTMLElement).id;
				}
			}
		},
		{ root: track, threshold: [0.5, 0.75] },
	);
	for (const s of SECTIONS) {
		const el = document.getElementById(s.id);
		if (el) obs.observe(el);
	}

	// Entrance animations
	animate('.panel-h1', {
		opacity: [0, 1],
		translateY: [60, 0],
		duration: 900,
		ease: 'out(4)',
		delay: 200,
	});
	animate('[data-panel-anim]', {
		opacity: [0, 1],
		translateX: [-30, 0],
		delay: stagger(80, { start: 400 }),
		duration: 700,
		ease: 'out(3)',
	});

	// Char-by-char reveal on the hero name (first text node only)
	const heroH1 = document.querySelector<HTMLElement>('#hero .panel-h1');
	if (heroH1) {
		// Walk only the first text node "Sebastián" — keep <br> and <span> intact
		const walker = document.createTreeWalker(heroH1, NodeFilter.SHOW_TEXT);
		const textNode = walker.nextNode() as Text | null;
		if (textNode?.textContent) {
			const raw = textNode.textContent;
			const frag = document.createDocumentFragment();
			for (const ch of raw) {
				if (ch === ' ') {
					frag.appendChild(document.createTextNode(' '));
				} else {
					const span = document.createElement('span');
					span.textContent = ch;
					span.style.display = 'inline-block';
					span.style.opacity = '0';
					span.style.transform = 'translateY(40px)';
					span.style.willChange = 'transform, opacity';
					frag.appendChild(span);
				}
			}
			textNode.replaceWith(frag);
			const chars = heroH1.querySelectorAll<HTMLElement>('span');
			if (chars.length) {
				animate(chars, {
					opacity: [0, 1],
					translateY: [40, 0],
					delay: stagger(28, { start: 350 }),
					duration: 700,
					ease: 'out(4)',
				});
			}
		}
	}

	// Count-up on stat cards (intersection-triggered)
	const statCards = document.querySelectorAll<HTMLElement>('[data-stat-card]');
	const statObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const card = entry.target as HTMLElement;
				const counter = card.querySelector<HTMLElement>('[data-counter]');
				if (!counter) continue;
				const finalRaw = counter.dataset.final ?? '0';
				const isNumeric = /^\d+$/.test(finalRaw);
				if (!isNumeric) {
					// Non-numeric like "90+" — just snap to final with a tiny scale
					counter.textContent = finalRaw;
					animate(counter, {
						scale: [0.6, 1],
						opacity: [0, 1],
						duration: 600,
						ease: 'out(3)',
					});
				} else {
					const to = Number.parseInt(finalRaw, 10);
					const obj = { v: 0 };
					animate(obj, {
						v: to,
						duration: 1100,
						delay: 200,
						ease: 'out(4)',
						onUpdate: () => {
							counter.textContent = Math.round(obj.v).toString();
						},
						onComplete: () => {
							counter.textContent = String(to);
						},
					});
				}
				// Subtle scale-up on the whole card
				animate(card, {
					scale: [0.96, 1],
					opacity: [0.4, 1],
					duration: 800,
					ease: 'out(3)',
				});
				statObserver.unobserve(card);
			}
		},
		{ threshold: 0.4 },
	);
	statCards.forEach((c) => {
		statObserver.observe(c);
	});

	// Magnetic hover for primary CTAs
	const magneticEls = document.querySelectorAll<HTMLElement>('[data-magnetic]');
	const magneticCleanups: Array<() => void> = [];
	for (const el of magneticEls) {
		const strength = 8;
		const onMove = (e: MouseEvent) => {
			const rect = el.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;
			animate(el, {
				translateX: (x / rect.width) * strength,
				translateY: (y / rect.height) * strength,
				duration: 400,
				ease: 'out(3)',
			});
		};
		const onLeave = () => {
			animate(el, {
				translateX: 0,
				translateY: 0,
				duration: 600,
				ease: 'out(4)',
			});
		};
		el.addEventListener('mousemove', onMove);
		el.addEventListener('mouseleave', onLeave);
		magneticCleanups.push(() => {
			el.removeEventListener('mousemove', onMove);
			el.removeEventListener('mouseleave', onLeave);
		});
	}

	// Pulse on the active slide dot is handled by HomeDots.svelte
	// via a $effect on the activeId prop — the previous
	// MutationObserver approach watched the whole dot container
	// and re-queried on every attribute change (hover, focus,
	// etc.) which is both wasteful and slightly wrong.

	return () => {
		track.removeEventListener('wheel', onWheel);
		obs.disconnect();
		statObserver.disconnect();
		magneticCleanups.forEach((fn) => {
			fn();
		});
	};
});
</script>

<svelte:head>
	<title>seba3567.cl · Sebastián Muñoz</title>
	<meta
		name="description"
		content="Sebastián Muñoz (@seba3567) — Ingeniero en Informática. Backend, datos, mobile, QA. Proyectos, apps y contacto."
	/>
</svelte:head>

<!-- Horizontal scroll track -->
<div id="home-track" bind:this={trackEl} class="home-horizontal relative">
	<HeroPanel />
	<SelectionPanel repos={data.repos} />
	<StackPanel />
	<SpecialtiesPanel />
	<ContactPanel onEmailClick={() => (contactOpen = true)} />
</div>

<!-- Protected contact form (email never ships to the client) -->
<ContactDialog bind:open={contactOpen} />

<!-- Slide indicator: dots at the bottom-center of the viewport (vertical layout,
   not inside the horizontal track). Shows active panel + label. -->
<HomeDots sections={SECTIONS} activeId={activeSection} onSelect={scrollToSection} />

<style>
	/* Horizontal scroll track for the home page */
	:global(.home-horizontal) {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		height: 100vh;
		scroll-padding: 0;
	}
	:global(.home-horizontal::-webkit-scrollbar) {
		display: none;
	}
	:global(.home-horizontal .panel) {
		flex: 0 0 100vw;
		min-width: 100vw;
		height: 100vh;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>
