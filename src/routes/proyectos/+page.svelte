<script lang="ts">
	import { ArrowUpRight, GithubLogo } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import ProjectFilter from '$lib/components/ProjectFilter.svelte';
	import ProjectGrid from '$lib/components/ProjectGrid.svelte';

	let { data }: { data: PageData } = $props();

	let query = $state('');
	let language = $state<string | null>(null);
	let onlyFeatured = $state(false);

	const featuredSlugs = $derived(
		new Set(data.featuredProjects.flatMap((p) => p.relatedRepos ?? [p.slug])),
	);

	const filteredRepos = $derived(
		data.repos.filter((r) => {
			if (onlyFeatured && !featuredSlugs.has(r.name)) return false;
			if (language && r.language !== language) return false;
			if (query) {
				const q = query.toLowerCase();
				const haystack = `${r.name} ${r.description ?? ''} ${r.topics.join(' ')}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			return true;
		}),
	);

	const stats = $derived([
		{ value: data.stats.total, label: 'repos' },
		{ value: data.stats.stars, label: 'stars' },
		{ value: data.stats.languages.length, label: 'languages' },
	]);
</script>

<svelte:head>
	<title>Proyectos · seba3567.cl</title>
	<meta
		name="description"
		content="Repositorios de Sebastián Muñoz · fuente directa desde la API de GitHub."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<header class="pt-24 pb-20 sm:pt-36 sm:pb-28">
		<div class="grid grid-cols-12 items-end gap-6">
			<div class="col-span-12 lg:col-span-8">
				<p class="font-mono text-xs text-neutral-500">
					/{data.username} · live from GitHub API
				</p>
				<h1
					class="mt-10 text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					All<br />
					<span class="text-neutral-600">projects.</span>
				</h1>
			</div>
			<div class="col-span-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 lg:col-span-4">
				{#each stats as s, i (s.label)}
					<div class="bg-neutral-950 p-5">
						<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
							{s.label}
						</p>
						<p class="mt-3 font-mono text-2xl font-semibold text-neutral-50 sm:text-3xl">
							{s.value}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</header>

	<section class="border-t border-white/5 py-12">
		<div class="mb-8 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="font-mono text-xs text-neutral-500">Catalog</p>
				<h2
					class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl"
				>
					Filter & search.
				</h2>
			</div>
			<a
				href="https://github.com/{data.username}?tab=repositories"
				target="_blank"
				rel="noreferrer noopener"
				class="group inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100"
			>
				<GithubLogo size={12} weight="bold" />
				Open on GitHub
				<ArrowUpRight
					size={10}
					weight="bold"
					class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<ProjectFilter
			bind:query
			bind:language
			bind:onlyFeatured
			languages={data.languages}
			totalCount={data.repos.length}
			filteredCount={filteredRepos.length}
		/>

		<div class="mt-8">
			<ProjectGrid repos={filteredRepos} />
		</div>

		{#if data.loadError}
			<p
				class="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-xs text-amber-200/80"
			>
				⚠ GitHub API unavailable ({data.loadError}). Mostrando datos cacheados si los hay.
			</p>
		{/if}
	</section>

	<footer class="border-t border-white/5 py-12">
		<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			{filteredRepos.length} / {data.repos.length} shown · @{data.username}
		</p>
	</footer>
</main>
