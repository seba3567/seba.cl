<script lang="ts">
	import { ArrowDown, Lightning, Stack, GithubLogo, ArrowUpRight, Cpu } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AntiCallCLFeatured from '$lib/components/AntiCallCLFeatured.svelte';
	import FeaturedProjects from '$lib/components/FeaturedProjects.svelte';
	import StatsBar from '$lib/components/StatsBar.svelte';
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

	const stack = [
		{ name: 'Svelte 5', detail: 'Runes, snippets, fine-grained reactivity' },
		{ name: 'Tailwind v4', detail: '@theme, @utility, zero-config' },
		{ name: 'shadcn-svelte', detail: 'Copy-paste UI sobre zinc' },
		{ name: 'TypeScript', detail: 'SvelteKit $types + tsgo' },
		{ name: 'Bun', detail: 'Runtime + lockfile' },
		{ name: 'Vite 8', detail: 'Build con adapter-auto' },
		{ name: 'BiomeJS', detail: 'Lint+format ultra-rápido' },
		{ name: 'Phosphor', detail: 'Iconos weight-aware' },
	];
</script>

<svelte:head>
	<title>seba3567.cl · Sebastián Muñoz</title>
	<meta
		name="description"
		content="Portafolio de Sebastián Muñoz · AntiCallCL (Android anti-spam), autoskills, frontend.skeleton, Svelte, Kotlin, Python, TypeScript."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-12 sm:pt-16">
	<!-- ============= HERO ============= -->
	<section class="relative pb-20 sm:pb-28">
		<div class="mx-auto max-w-3xl text-center">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral-300 backdrop-blur"
			>
				<span class="relative flex size-2">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
					></span>
					<span class="relative inline-flex size-2 rounded-full bg-emerald-400"></span>
				</span>
				<span>{data.stats.total} repos · {data.stats.stars} ★ en GitHub</span>
			</div>

			<h1
				class="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight text-neutral-50 sm:text-6xl md:text-7xl"
			>
				Proyectos de
				<span
					class="bg-gradient-to-br from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent"
				>
					Sebastián
				</span>
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg">
				Ingeniero en Informática. Construyo herramientas abiertas: un firewall anti-spam de
				llamadas para Android, un CLI que detecta tu stack e instala skills de IA, y el skeleton
				sobre el que corre este sitio.
			</p>

			<div class="mt-8 flex flex-wrap items-center justify-center gap-2">
				<a
					href="#proyectos"
					class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 hover:shadow-violet-500/40"
				>
					<Lightning size={16} weight="fill" />
					Ver proyectos
				</a>
				<a
					href="https://github.com/{data.username}"
					target="_blank"
					rel="noreferrer noopener"
					class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-neutral-100 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
				>
					<GithubLogo size={16} weight="bold" />
					@{data.username}
					<ArrowUpRight size={12} weight="bold" />
				</a>
			</div>
		</div>

		<div class="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
			{#each [{ label: 'Lenguajes', value: data.stats.languages.length, icon: Cpu }, { label: 'Repos publicos', value: data.stats.total, icon: Stack }, { label: 'Stars', value: data.stats.stars, icon: Lightning }, { label: 'Forks', value: data.stats.forks, icon: GithubLogo }] as stat (stat.label)}
				{@const Icon = stat.icon}
				<GlassCard class="flex items-center gap-3 p-4">
					<div
						class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
					>
						<Icon size={16} weight="duotone" class="text-neutral-300" />
					</div>
					<div class="min-w-0">
						<div class="font-mono text-xl font-bold text-neutral-50 sm:text-2xl">{stat.value}</div>
						<div class="truncate text-[10px] uppercase tracking-wider text-neutral-500">
							{stat.label}
						</div>
					</div>
				</GlassCard>
			{/each}
		</div>

		<div class="mt-10 flex justify-center">
			<a
				href="#proyectos"
				class="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
				aria-label="Bajar a proyectos"
			>
				<ArrowDown size={12} weight="bold" class="animate-bounce" />
			</a>
		</div>
	</section>

	<!-- ============= ANTI-CALL-CL HERO ============= -->
	{#if data.heroProject}
		<section id="proyectos" class="scroll-mt-24 pb-12">
			<SectionHeading
				eyebrow="Destacado · WIP"
				title="AntiCallCL"
				description="El proyecto principal: una app Android nativa que bloquea llamadas spam/telemarketing en tiempo real, con backend Python y base curada de prefijos chilenos."
			/>
			<div class="mt-8">
				<AntiCallCLFeatured project={data.heroProject} />
			</div>
		</section>
	{/if}

	<!-- ============= STATS BAR ============= -->
	<section class="py-8">
		<StatsBar stats={data.stats} />
		{#if data.loadError}
			<p
				class="mt-3 rounded-lg border border-amber-400/20 bg-amber-500/5 p-3 text-xs text-amber-200/80"
			>
				⚠ No se pudo conectar a la API de GitHub ({data.loadError}). Mostrando datos cacheados si
				los hay. La página sigue funcionando.
			</p>
		{/if}
	</section>

	<!-- ============= FEATURED PROJECTS ============= -->
	{#if data.featuredProjects.length}
		<section class="py-8">
			<SectionHeading
				eyebrow="Más proyectos"
				title="Curados y activos"
				description="Otros proyectos que mantengo o desarrollo activamente."
			/>
			<div class="mt-8">
				<FeaturedProjects projects={data.featuredProjects} />
			</div>
		</section>
	{/if}

	<!-- ============= ALL REPOS ============= -->
	<section id="todos" class="scroll-mt-24 py-8">
		<SectionHeading
			eyebrow="Catálogo vivo"
			title="Todos los repos"
			description="Fuente directa desde la API de GitHub. Buscá por nombre, filtrá por lenguaje o limitá a los destacados."
		>
			<a
				href="https://github.com/{data.username}?tab=repositories"
				target="_blank"
				rel="noreferrer noopener"
				class="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-100"
			>
				Ver todos en github.com
				<ArrowUpRight size={10} weight="bold" />
			</a>
		</SectionHeading>

		<div class="mt-6 space-y-4">
			<ProjectFilter
				bind:query
				bind:language
				bind:onlyFeatured
				languages={data.languages}
				totalCount={data.repos.length}
				filteredCount={filteredRepos.length}
			/>

			<ProjectGrid repos={filteredRepos} />
		</div>
	</section>

	<!-- ============= STACK ============= -->
	<section id="stack" class="scroll-mt-24 py-12">
		<SectionHeading
			eyebrow="Tech"
			title="Stack de este sitio"
			description="Lo que corre debajo del glassmorphism."
		/>

		<div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each stack as item (item.name)}
				<GlassCard class="p-4" hover>
					<div class="font-mono text-sm font-semibold text-neutral-100">{item.name}</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-400">{item.detail}</div>
				</GlassCard>
			{/each}
		</div>
	</section>
</main>
