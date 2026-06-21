<script lang="ts">
import './layout.css';
import favicon from '$lib/assets/favicon.svg';
import BackgroundBlobs from '$lib/components/BackgroundBlobs.svelte';
import BackToTop from '$lib/components/BackToTop.svelte';
import SearchPanel from '$lib/components/SearchPanel.svelte';
import SiteHeader from '$lib/components/SiteHeader.svelte';

let { children } = $props();

// Origin used for absolute URLs in OG/Twitter cards. Falls back
// to the production domain in prod (and the Vite preview host
// in dev). Vite exposes VITE_*-style env vars but SvelteKit uses
// its own (we get the runtime URL from $app/stores or by deriving
// from location in the browser; SSR-side, env.PUBLIC_ORIGIN is
// the only reliable source).
const ORIGIN = 'https://seba3567.cl';
const OG_IMAGE = `${ORIGIN}/og.png`;
const DESCRIPTION =
	'Sebastián Muñoz — ingeniería, datos y mobile. Proyectos open source, apps y contacto.';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#0a0a0a" />
	<meta name="color-scheme" content="dark" />

	<!-- Open Graph (Facebook, LinkedIn, Slack, Discord, WhatsApp). -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="seba3567" />
	<meta property="og:title" content="seba3567.cl · Sebastián Muñoz" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="seba3567 — ingeniería, datos y mobile" />
	<meta property="og:locale" content="es_CL" />

	<!-- Twitter / X. The card is 'summary_large_image' so the OG
	     image is used; the alt text mirrors the OG image alt. -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="seba3567.cl · Sebastián Muñoz" />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content="seba3567 — ingeniería, datos y mobile" />

	<!-- Common meta. -->
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<!--
  Skip-to-content link: hidden until focused, then jumps keyboard users
  past the site header straight to <main>. WCAG 2.4.1 bypass blocks.
  The link sits OUTSIDE the BackgroundBlobs so it inherits a solid
  z-stack and works regardless of layout context.
-->
<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-mint-500 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:text-neutral-950 focus:shadow-2xl focus:shadow-mint-500/40 focus:outline-none"
>
	Saltar al contenido principal
</a>

<BackgroundBlobs />

<div class="relative z-10 flex min-h-screen flex-col">
	<SiteHeader />
	<main id="main" tabindex="-1" class="flex-1 outline-none">
		{@render children()}
	</main>
</div>

<SearchPanel />
<BackToTop />
