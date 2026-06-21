<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BackgroundBlobs from '$lib/components/BackgroundBlobs.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SearchPanel from '$lib/components/SearchPanel.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<BackgroundBlobs />

<div class="relative z-10 flex min-h-screen flex-col">
	<SiteHeader />
	{@render children()}
</div>

<SearchPanel />
<BackToTop />
