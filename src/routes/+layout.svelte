<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import favicon from '$lib/assets/favicon.svg';
	import BackgroundBlobs from '$lib/components/BackgroundBlobs.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { resolveInitialLocale, setupI18n } from '$lib/i18n';
	import { locale as localeStore } from 'svelte-i18n';
	import { switchLocale } from '$lib/i18n/locale.svelte';

	let { children } = $props();

	// i18n must be initialized BEFORE any $t() is rendered, so it
	// has to run at the top of the script (server + client), not
	// inside onMount. The setup function is idempotent — calling
	// it here on the server gets the default locale, and on the
	// client we switch to the persisted one after hydration.
	setupI18n();

	onMount(() => {
		// After hydration, switch to the persisted / navigator
		// preference. SSR uses the default locale (es). Read from
		// localStorage directly here — the current $locale value
		// is still 'es' on the first tick.
		void switchLocale(resolveInitialLocale());
	});

	// Keep <html lang> in sync with the active locale. We can't
	// put <html> inside <svelte:head> (the browser parser hoists
	// it out and Svelte 5's hydration walker trips on it with
	// "Illegal invocation" — the DOM node's prototype chain gets
	// reshuffled by the parser). So we set the attribute on the
	// real documentElement after hydration, via a $effect that
	// tracks svelte-i18n's $locale store.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const current = currentLocaleFromStore();
		document.documentElement.lang = current ?? 'es';
	});

	function currentLocaleFromStore(): string | null {
		// Synchronous read of svelte-i18n's $locale without
		// pulling in the locale.svelte.ts module (avoids a
		// separate subscribe/unsubscribe pair when this runs
		// inside an $effect).
		let value: string | null = null;
		const unsub = localeStore.subscribe((v) => {
			value = v ?? null;
		});
		unsub();
		return value;
	}

	// Origin used for absolute URLs in OG/Twitter cards. Static
	// since the site is deployed at a fixed domain.
	const ORIGIN = 'https://seba3567.cl';
	const OG_IMAGE = `${ORIGIN}/og.png`;

	// Derived reactive values for the meta tags. The first
	// read returns the default ('es') on the server; after
	// hydration the client updates it.
	const description = $derived($t('home.metaDescription'));
	const ogAlt = $derived($t('common.home') + ' — seba3567');
</script>

	<svelte:head>
		<link rel="icon" href={favicon} />
		<link rel="manifest" href="/manifest.webmanifest" />
		<meta name="theme-color" content="#0a0a0a" />
		<meta name="color-scheme" content="dark" />
		<!-- The lang attribute on <html> is set in app.html (static,
		     defaults to 'es'). A $effect above keeps it in sync with
		     the active locale on the client. -->

		<!-- Open Graph (Facebook, LinkedIn, Slack, Discord, WhatsApp). -->
		<meta property="og:type" content="website" />
	<meta property="og:site_name" content="seba3567" />
	<meta property="og:title" content={$t('home.metaTitle')} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={ogAlt} />
	<meta property="og:locale" content="es_CL" />

	<!-- Twitter / X. -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$t('home.metaTitle')} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content={ogAlt} />

	<!-- Common meta. -->
	<meta name="description" content={description} />
</svelte:head>

<!--
  Skip-to-content link. The label is set by the i18n store; it
  lives OUTSIDE the BackgroundBlobs so it inherits a solid z-stack.
-->
<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-mint-500 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:text-neutral-950 focus:shadow-2xl focus:shadow-mint-500/40 focus:outline-none"
>
	{$t('common.saltarContenido')}
</a>

<BackgroundBlobs />

<div class="relative z-10 flex min-h-screen flex-col">
	<SiteHeader>
		<LanguageSwitcher />
	</SiteHeader>
	<main id="main" tabindex="-1" class="flex-1 outline-none">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<BackToTop />
