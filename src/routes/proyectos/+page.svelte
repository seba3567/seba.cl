<script lang="ts">
import { ArrowUpRight, GithubLogo, X } from 'phosphor-svelte';
import { onMount } from 'svelte';
import { t } from 'svelte-i18n';
import { revealChars, revealOnScroll } from '$lib/animations';
import SiteFooter from '$lib/components/SiteFooter.svelte';
import { Badge } from '$lib/components/ui/badge';
import * as Progress from '$lib/components/ui/progress';
import { Separator } from '$lib/components/ui/separator';
import * as Tabs from '$lib/components/ui/tabs';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

const pageTitle = $derived($t('proyectos.metaTitle'));
const pageDescription = $derived($t('proyectos.metaDescription'));

let query = $state('');
let language = $state<string | null>(null);
let onlyFeatured = $state(false);
let statusTab = $state<'all' | 'live' | 'wip' | 'archived'>('all');

const featuredSlugs = $derived(
	new Set(data.featuredProjects.flatMap((p) => p.relatedRepos ?? [p.slug])),
);

// Status inferred from archive flag + pushed_at age
function statusOf(
	repo: (typeof data.repos)[number],
): 'live' | 'wip' | 'archived' {
	if (repo.archived) return 'archived';
	const days = (Date.now() - new Date(repo.pushed_at).getTime()) / 86_400_000;
	return days < 365 ? 'wip' : 'live';
}

const counts = $derived.by(() => {
	const c = { all: data.repos.length, live: 0, wip: 0, archived: 0 };
	for (const r of data.repos) c[statusOf(r)]++;
	return c;
});

const filteredRepos = $derived(
	data.repos.filter((r) => {
		if (onlyFeatured && !featuredSlugs.has(r.name)) return false;
		if (language && r.language !== language) return false;
		if (statusTab !== 'all' && statusOf(r) !== statusTab) return false;
		if (query) {
			const q = query.toLowerCase();
			const haystack =
				`${r.name} ${r.description ?? ''} ${r.topics.join(' ')}`.toLowerCase();
			if (!haystack.includes(q)) return false;
		}
		return true;
	}),
);

const stats = $derived([
	{ value: data.stats.total, label: $t('proyectos.stats.repos') },
	{ value: data.stats.stars, label: $t('proyectos.stats.stars') },
	{ value: data.stats.languages.length, label: $t('proyectos.stats.languages') },
]);

const featured3 = $derived(data.repos.slice(0, 3));

const tabs = [
	{ value: 'all', labelKey: 'all' },
	{ value: 'live', labelKey: 'live' },
	{ value: 'wip', labelKey: 'wip' },
	{ value: 'archived', labelKey: 'archived' },
] as const;

let titleEl: HTMLElement | undefined = $state();

onMount(() => {
	if (titleEl) {
		revealChars(titleEl, {
			staggerMs: 38,
			offsetY: 80,
			duration: 1100,
			delay: 200,
		});
	}
	revealOnScroll(document.body, {
		selector: '[data-reveal-tab]',
		staggerMs: 80,
		offsetY: 28,
		duration: 800,
	});
});

$effect(() => {
	// when tab/query changes, animate the new grid items
	void statusTab;
	void query;
	void language;
	void onlyFeatured;
	// small defer so the DOM updates first
	setTimeout(() => {
		revealOnScroll(document.body, {
			selector: '[data-grid-item]',
			staggerMs: 25,
			offsetY: 18,
			duration: 500,
			once: false,
		});
	}, 50);
});

function langColor(name: string | null): string {
	if (!name) return '#888';
	const map: Record<string, string> = {
		TypeScript: '#3178c6',
		JavaScript: '#f1e05a',
		Python: '#3572A5',
		Svelte: '#ff3e00',
		Kotlin: '#A97BFF',
		Dart: '#00B4AB',
		Go: '#00ADD8',
		Rust: '#dea584',
		HTML: '#e34c26',
		Java: '#b07219',
	};
	return map[name] ?? '#888';
}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<header class="pt-24 pb-12 sm:pt-36 sm:pb-16">
		<div class="grid grid-cols-12 items-end gap-6">
			<div class="col-span-12 lg:col-span-8">
				<!-- Path breadcrumb (seba3567/proyectos) lives in the
				     SiteHeader. This header keeps the data-source note
				     (live from GitHub API) + the big title. -->
				<p class="font-mono text-xs text-neutral-500">{$t('proyectos.dataSource')}</p>
				<h1
					bind:this={titleEl}
					class="mt-10 text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					{$t('proyectos.heroTitlePrimary')}<br />
					<span class="text-neutral-600">{$t('proyectos.heroTitleSecondary')}</span>
				</h1>
			</div>
			<div
				class="col-span-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 lg:col-span-4"
				data-reveal-tab
			>
				{#each stats as s (s.label)}
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

	<!-- Featured strip: top 3 with AVIF thumb -->
	{#if featured3.length}
		<section class="pb-10" data-reveal-tab>
			<div class="mb-5 flex items-end justify-between gap-6">
				<div>
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
					>
						{$t('proyectos.featuredBadge')}
					</Badge>
				</div>
				<a
					href="https://github.com/{data.username}?tab=repositories"
					target="_blank"
					rel="noreferrer noopener"
					class="group inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100"
				>
					<GithubLogo size={12} weight="bold" />
					{$t('proyectos.openOnGithub')}
					<ArrowUpRight
						size={10}
						weight="bold"
						class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					/>
				</a>
			</div>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
				{#each featured3 as r, i (r.id)}
					<a
						data-grid-item
						href={r.html_url}
						target="_blank"
						rel="noreferrer noopener"
						class="group/feat relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] p-3 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
					>
						<div
							class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
						>
							<GithubLogo size={18} weight="duotone" class="text-neutral-300" />
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="font-mono text-[10px] text-neutral-600">0{i + 1}</span>
								<p class="truncate text-sm font-semibold text-neutral-100">{r.name}</p>
							</div>
							<p class="mt-0.5 truncate font-mono text-[10px] text-neutral-500">
								{r.description ?? `${r.language ?? 'code'} · @seba3567`}
							</p>
						</div>
						<ArrowUpRight
							size={14}
							weight="bold"
							class="shrink-0 text-neutral-500 transition-all group-hover/feat:-translate-y-0.5 group-hover/feat:translate-x-0.5 group-hover/feat:text-neutral-200"
						/>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<section class="border-t border-white/5 py-10">
		<div class="mb-6 flex flex-wrap items-end justify-between gap-4" data-reveal-tab>
			<div>
				<p class="font-mono text-xs text-neutral-500">{$t('proyectos.subtitle')}</p>
				<h2
					class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl"
				>
					{$t('proyectos.filterTitle')}
				</h2>
			</div>
		</div>

		<Tabs.Root bind:value={statusTab} class="mb-6">
			<Tabs.List
				class="inline-flex h-auto flex-wrap gap-1 rounded-2xl border border-white/5 bg-white/[0.02] p-1"
			>
				<Tabs.Trigger
					value="all"
					class="rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all data-[state=active]:bg-white/10 data-[state=active]:text-neutral-50 hover:text-neutral-200"
				>
					{$t('proyectos.filters.all')} <span class="ml-1 font-mono text-[10px] text-neutral-500">{counts.all}</span>
				</Tabs.Trigger>
				<Tabs.Trigger
					value="live"
					class="rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all data-[state=active]:bg-mint-500/10 data-[state=active]:text-mint-200 hover:text-neutral-200"
				>
					{$t('proyectos.filters.live')} <span class="ml-1 font-mono text-[10px] text-neutral-500">{counts.live}</span>
				</Tabs.Trigger>
				<Tabs.Trigger
					value="wip"
					class="rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-200 hover:text-neutral-200"
				>
					{$t('proyectos.filters.wip')} <span class="ml-1 font-mono text-[10px] text-neutral-500">{counts.wip}</span>
				</Tabs.Trigger>
				<Tabs.Trigger
					value="archived"
					class="rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all data-[state=active]:bg-neutral-500/10 data-[state=active]:text-neutral-300 hover:text-neutral-200"
				>
					{$t('proyectos.filters.archived')} <span class="ml-1 font-mono text-[10px] text-neutral-500">{counts.archived}</span>
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>

		<!-- Search + lang filter (chips) -->
		<div class="mb-6 flex flex-col gap-3">
			<div
				class="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-white/20"
			>
				<svg
					class="size-4 shrink-0 text-neutral-500"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
				>
					<circle cx="11" cy="11" r="7" />
					<path d="m21 21-3.5-3.5" stroke-linecap="round" />
				</svg>
				<input
					type="search"
					bind:value={query}
					placeholder={$t('proyectos.searchPlaceholder')}
					class="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
				/>
			</div>

			<!-- Language chips -->
			<div class="flex flex-wrap items-center gap-1.5">
				<span
					class="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
					>{$t('proyectos.languageFilter')}</span
				>
				<button
					type="button"
					onclick={() => (language = null)}
					class="group/lang inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all {language ===
					null
						? 'border-mint-400/40 bg-mint-500/10 text-mint-200'
						: 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-neutral-200'}"
				>
					{$t('proyectos.languageAll')}
					<span
						class="font-mono text-[9px] {language === null
							? 'text-mint-300/70'
							: 'text-neutral-500'}"
						>{counts.all}</span
					>
				</button>
				{#each data.languages as lang (lang)}
					{@const langCount = data.repos.filter((r) => r.language === lang).length}
					<button
						type="button"
						onclick={() => (language = language === lang ? null : lang)}
						class="group/lang inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all {language ===
						lang
							? 'border-mint-400/40 bg-mint-500/10 text-mint-200'
							: 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-neutral-200'}"
					>
						<span
							class="inline-block size-1.5 rounded-full transition-transform group-hover/lang:scale-125"
							style="background-color: {langColor(lang)}"
						></span>
						{lang}
						<span
							class="font-mono text-[9px] {language === lang
								? 'text-mint-300/70'
								: 'text-neutral-500'}"
							>{langCount}</span
						>
					</button>
				{/each}
			</div>

			<!-- Active filter chips + clear -->
			{#if language || query || statusTab !== 'all'}
				<div class="flex flex-wrap items-center gap-1.5">
					<span
						class="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
						>{$t('proyectos.filters.active')}</span
					>
					{#if statusTab !== 'all'}
						<button
							type="button"
							onclick={() => (statusTab = 'all')}
							class="inline-flex items-center gap-1 rounded-full border border-mint-400/30 bg-mint-500/10 px-2.5 py-1 text-[11px] font-medium text-mint-200 transition-colors hover:bg-mint-500/20"
						>
							{tabs.find((t) => t.value === statusTab)?.labelKey
						? $t(`proyectos.filters.${tabs.find((t) => t.value === statusTab)?.labelKey}`)
						: ''}
							<X size={10} weight="bold" />
						</button>
					{/if}
					{#if language}
						<button
							type="button"
							onclick={() => (language = null)}
							class="inline-flex items-center gap-1 rounded-full border border-mint-400/30 bg-mint-500/10 px-2.5 py-1 text-[11px] font-medium text-mint-200 transition-colors hover:bg-mint-500/20"
						>
							<span
								class="inline-block size-1.5 rounded-full"
								style="background-color: {langColor(language)}"
							></span>
							{language}
							<X size={10} weight="bold" />
						</button>
					{/if}
					{#if query}
						<button
							type="button"
							onclick={() => (query = '')}
							class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200 transition-colors hover:bg-amber-500/20"
						>
							“{query}”
							<X size={10} weight="bold" />
						</button>
					{/if}
					<button
						type="button"
						onclick={() => {
							language = null;
							query = '';
							statusTab = 'all';
							onlyFeatured = false;
						}}
						class="ml-1 font-mono text-[10px] text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-200 hover:underline"
					>
						{$t('proyectos.filters.clear')}
					</button>
				</div>
			{/if}
		</div>

		<!-- Match indicator (Progress bar) -->
		<div class="mb-4 flex items-center gap-3">
			<Progress.Root
				value={(filteredRepos.length / Math.max(1, data.repos.length)) * 100}
				class="h-1 flex-1 bg-white/5"
			/>
			<span class="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
				{$t('proyectos.resultsCount', { values: { count: filteredRepos.length, total: data.repos.length } })}
			</span>
		</div>

		<!-- Grid -->
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredRepos as r (r.id)}
				<a
					data-grid-item
					href={r.html_url}
					target="_blank"
					rel="noreferrer noopener"
					class="group/repo flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
				>
					<div class="flex items-start justify-between gap-2">
						<div class="flex min-w-0 items-center gap-2">
							<div
								class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
							>
								<GithubLogo size={14} weight="duotone" class="text-neutral-300" />
							</div>
							<div class="min-w-0">
								<p class="truncate text-sm font-semibold text-neutral-100">
									{r.name}
								</p>
								<p class="font-mono text-[10px] text-neutral-500">
									@{r.full_name.split('/')[0]}
								</p>
							</div>
						</div>
						<ArrowUpRight
							size={14}
							weight="bold"
							class="shrink-0 text-neutral-500 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
						/>
					</div>

					{#if r.description}
						<p class="line-clamp-2 text-xs leading-relaxed text-neutral-400">
							{r.description}
						</p>
					{/if}

					<div class="mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3">
						<div class="flex items-center gap-2 text-[10px] text-neutral-500">
							{#if r.language}
								<span class="flex items-center gap-1">
									<span
										class="inline-block size-1.5 rounded-full"
										style="background-color: {langColor(r.language)}"
									></span>
									{r.language}
								</span>
							{/if}
							<span>★ {r.stargazers_count}</span>
							<span>⑂ {r.forks_count}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		{#if filteredRepos.length === 0}
			<div
				class="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-12 text-center"
			>
				<p class="text-sm text-neutral-500">
					{$t('proyectos.emptyFiltered')}
				</p>
			</div>
		{/if}
	</section>

	<footer class="border-t border-white/5 py-10">
		<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			{$t('proyectos.shownCount', { values: { count: filteredRepos.length, total: data.repos.length, username: data.username } })}
		</p>
	</footer>

	<SiteFooter />
</main>
