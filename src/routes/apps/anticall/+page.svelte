<script lang="ts">
import { animate, stagger } from 'animejs';
import { onMount } from 'svelte';
import { t } from 'svelte-i18n';
import AboutPanel from '$lib/components/anticall/AboutPanel.svelte';
import BetaPanel from '$lib/components/anticall/BetaPanel.svelte';
import GalleryPanel from '$lib/components/anticall/GalleryPanel.svelte';
import HeroPanel from '$lib/components/anticall/HeroPanel.svelte';
import PrivacyPanel from '$lib/components/anticall/PrivacyPanel.svelte';
import ScreenshotPanel from '$lib/components/anticall/ScreenshotPanel.svelte';
import StackPanel from '$lib/components/anticall/StackPanel.svelte';
import Lightbox from '$lib/components/Lightbox.svelte';
import PanelDots from '$lib/components/PanelDots.svelte';
import PrivacyDialog from '$lib/components/PrivacyDialog.svelte';
import { galleryItems } from '$lib/data/anticall';

const pageTitle = $derived($t('anticall.metaTitle'));
const pageDescription = $derived($t('anticall.metaDescription'));

// ----- Horizontal scroll state -----
	const SECTION_KEYS = [
		{ id: 'hero', i18nKey: 'anticall.sections.hero' },
		{ id: 'screenshot', i18nKey: 'anticall.sections.screenshot' },
		{ id: 'about', i18nKey: 'anticall.sections.about' },
		{ id: 'gallery', i18nKey: 'anticall.sections.gallery' },
		{ id: 'stack', i18nKey: 'anticall.sections.stack' },
		{ id: 'privacy', i18nKey: 'anticall.sections.privacy' },
		{ id: 'beta', i18nKey: 'anticall.sections.beta' },
	] as const;

	// Resolve the i18n labels once on the client. PanelDots takes
	// plain strings (so it doesn't need to depend on svelte-i18n),
	// so we translate here and pass the resolved text.
	const SECTIONS = $derived(
		SECTION_KEYS.map((s) => ({ id: s.id, label: $t(s.i18nKey) })),
	);

let trackEl: HTMLElement | undefined = $state();
let activeSection: string = $state('hero');

let titleEl: HTMLElement | undefined = $state();
let lightboxOpen = $state(false);
let lightboxIndex = $state(0);
let privacyOpen = $state(false);

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

function openLightbox(i: number) {
	lightboxIndex = i;
	lightboxOpen = true;
}

onMount(() => {
	const track = trackEl;
	if (!track) return;

	// Map vertical wheel to horizontal scroll
	const onWheel = (e: WheelEvent) => {
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
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
	animate('[data-panel-anim]', {
		opacity: [0, 1],
		translateY: [20, 0],
		delay: stagger(60, { start: 200 }),
		duration: 600,
		ease: 'out(3)',
	});

	// Title: simple fade-in (no char split — those leave the
	// element invisible if the JS races with the initial paint)
	if (titleEl) {
		animate(titleEl, {
			opacity: [0, 1],
			translateY: [30, 0],
			duration: 800,
			delay: 100,
			ease: 'out(4)',
		});
	}

	// Privacy listener
	const onPrivacy = () => (privacyOpen = true);
	window.addEventListener('seba:privacy', onPrivacy as EventListener);

	return () => {
		track.removeEventListener('wheel', onWheel);
		obs.disconnect();
		window.removeEventListener('seba:privacy', onPrivacy as EventListener);
	};
});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<!-- Horizontal scroll track — h-screen locks the track to exactly
     one viewport so the body can't scroll past it into the next
     route's content. h-[100dvh] is the mobile-safe fallback for
     when the URL bar is showing. -->
<div
	id="anticall-track"
	bind:this={trackEl}
	class="anticall-horizontal relative h-screen w-screen overflow-hidden"
>
	<HeroPanel {titleEl} onOpenPrivacy={() => (privacyOpen = true)} />
	<ScreenshotPanel onOpenLightbox={openLightbox} />
	<AboutPanel />
	<GalleryPanel onOpenLightbox={openLightbox} />
	<StackPanel />
	<PrivacyPanel onOpenPrivacy={() => (privacyOpen = true)} />
	<BetaPanel />
</div>

<!-- Slide indicator: dots at the bottom-center of the viewport -->
<PanelDots sections={SECTIONS} activeId={activeSection} onSelect={scrollToSection} />

<style>
	/* Horizontal scroll track for the anticall page */
	:global(.anticall-horizontal) {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	:global(.anticall-horizontal::-webkit-scrollbar) {
		display: none;
	}
	:global(.anticall-horizontal .panel) {
		flex: 0 0 100vw;
		min-width: 100vw;
		height: 100vh;
		height: 100dvh; /* mobile-safe: accounts for browser chrome */
		scroll-snap-align: start;
		scroll-snap-stop: always;
		/* overflow:hidden so panel content never produces a vertical
		   scrollbar — the only scroll in the page is horizontal
		   between panels. If a panel's content is taller than 100vh
		   on a small screen it just gets clipped (acceptable for a
		   horizontal-scroll layout). */
		overflow: hidden;
		overscroll-behavior: contain;
		/* Belt-and-suspenders: hide the panel's scrollbar too in
		   case a future change re-enables overflow. */
		scrollbar-width: none;
	}
	:global(.anticall-horizontal .panel::-webkit-scrollbar) {
		display: none;
	}
</style>

<Lightbox
	bind:open={lightboxOpen}
	bind:index={lightboxIndex}
	images={galleryItems}
	onClose={() => (lightboxOpen = false)}
/>

<PrivacyDialog bind:open={privacyOpen} onOpenChange={(v) => (privacyOpen = v)} />
