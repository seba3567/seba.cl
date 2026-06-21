<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, ArrowUpRight, Warning, MagnifyingGlass } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? 'Algo se rompió del lado del servidor.');
	const stack = $derived((page.error as Error & { stack?: string } | null)?.stack);

	function isNotFound(): boolean {
		return status === 404;
	}
</script>

<svelte:head>
	<title>{status} · seba3567</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[80vh] items-center justify-center px-6 py-24">
	<div class="w-full max-w-xl">
		<!-- Status pill -->
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-full border border-mint-400/20 bg-mint-500/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mint-300"
		>
			<span class="relative flex size-1.5">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75"
				></span>
				<span class="relative inline-flex size-1.5 rounded-full bg-mint-400"></span>
			</span>
			Error {status}
		</div>

		<!-- Big status code + headline -->
		<div
			class="text-balance font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50 text-7xl sm:text-8xl md:text-9xl"
		>
			{status}
		</div>
		<h1
			class="mt-4 text-balance text-2xl font-semibold tracking-[-0.02em] text-neutral-100 sm:text-3xl"
		>
			{#if isNotFound()}
				Esta página no existe.
			{:else}
				Algo se rompió.
			{/if}
		</h1>
		<p class="mt-3 max-w-md text-sm text-neutral-400 sm:text-base">
			{#if isNotFound()}
				La ruta que pediste no está en este sitio. Revisá la URL, o volvé al inicio
				y usá la búsqueda (Ctrl/⌘ + K) para encontrar lo que buscás.
			{:else}
				{message}
			{/if}
		</p>

		<!-- Actions -->
		<div class="mt-10 flex flex-wrap items-center gap-3">
			<Button onclick={() => history.back()} variant="outline" size="sm">
				<ArrowLeft size={14} weight="bold" data-icon="inline-start" />
				Volver
			</Button>
			<Button onclick={() => (location.href = '/')} size="sm">
				Inicio
				<ArrowUpRight size={14} weight="bold" data-icon="inline-end" />
			</Button>
			<Button onclick={() => window.dispatchEvent(new CustomEvent('seba:open-search'))} variant="ghost" size="sm">
				<MagnifyingGlass size={14} weight="bold" data-icon="inline-start" />
				Buscar
			</Button>
		</div>

		<!-- Dev-only error details -->
		{#if !isNotFound() && stack}
			<details
				class="mt-12 rounded-lg border border-white/5 bg-neutral-950/40 p-4 font-mono text-xs text-neutral-500"
			>
				<summary class="cursor-pointer select-none text-neutral-400 hover:text-neutral-200">
					<Warning size={12} weight="bold" class="-mt-0.5 mr-1.5 inline" />
					Stack trace (dev)
				</summary>
				<pre class="mt-3 overflow-x-auto whitespace-pre-wrap break-words">{stack}</pre>
			</details>
		{/if}
	</div>
</div>
