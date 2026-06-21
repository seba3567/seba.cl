<script lang="ts" module>
const LANG_COLOR: Record<string, string> = {
	TypeScript: '#3178c6',
	JavaScript: '#f1e05a',
	Python: '#3572A5',
	Svelte: '#ff3e00',
	'C#': '#178600',
	Java: '#b07219',
	Kotlin: '#A97BFF',
	Dart: '#00B4AB',
	Go: '#00ADD8',
	Rust: '#dea584',
	HTML: '#e34c26',
	CSS: '#563d7c',
	Shell: '#89e051',
	Lua: '#000080',
	Batchfile: '#C1F12E',
	'C++': '#f34b7d',
	C: '#555555',
	Ruby: '#701516',
	Makefile: '#427819',
};
</script>

<script lang="ts">
	import { Star, GitFork, GithubLogo, ArrowUpRight, Link, PushPin } from 'phosphor-svelte';
	import type { PublicRepo } from '$lib/server/github';
	import { featuredProjects } from '$lib/data/featured';
	import GlassCard from './GlassCard.svelte';

	type Props = { repo: PublicRepo; isFeatured?: boolean };
	let { repo, isFeatured = false }: Props = $props();

	const updated = $derived(formatRelative(repo.pushed_at));
	const ownerLogin = $derived(repo.full_name.split('/')[0] ?? 'seba3567');

	function formatRelative(iso: string): string {
		const d = new Date(iso);
		const diff = Date.now() - d.getTime();
		const day = 86_400_000;
		if (diff < day) return 'hoy';
		if (diff < day * 7) return `hace ${Math.floor(diff / day)}d`;
		if (diff < day * 30) return `hace ${Math.floor(diff / (day * 7))}sem`;
		if (diff < day * 365) return `hace ${Math.floor(diff / (day * 30))}m`;
		return `hace ${Math.floor(diff / (day * 365))}a`;
	}

	const featuredMeta = $derived(featuredProjects.find((p) => p.relatedRepos?.includes(repo.name)));
	const accentClass = $derived(featuredMeta ? featuredAccent(featuredMeta.accent) : '');

	function featuredAccent(accent: string): string {
		const map: Record<string, string> = {
			mint: 'ring-mint-400/20',
			amber: 'ring-amber-400/20',
			rose: 'ring-rose-400/20',
		};
		return map[accent] ?? '';
	}
</script>

<GlassCard
	hover
	class="group relative flex h-full flex-col gap-3 p-4 ring-1 ring-white/[0.04] {isFeatured
		? 'border-mint-400/30'
		: ''} {accentClass}"
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex min-w-0 items-center gap-2">
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
			>
				<GithubLogo size={14} weight="duotone" class="text-neutral-300" />
			</div>
			<div class="min-w-0">
				<a
					href={repo.html_url}
					target="_blank"
					rel="noreferrer noopener"
					class="block truncate text-sm font-semibold text-neutral-50 transition-colors group-hover:text-mint-300"
					title={repo.full_name}
				>
					{repo.name}
				</a>
				<p class="font-mono text-[10px] text-neutral-500">@{ownerLogin}</p>
			</div>
		</div>

		{#if isFeatured}
			<span
				class="inline-flex shrink-0 items-center gap-1 rounded-full border border-mint-400/30 bg-mint-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-mint-300"
			>
				<PushPin size={9} weight="fill" />
				featured
			</span>
		{/if}
	</div>

	{#if repo.description}
		<p class="line-clamp-2 text-[12.5px] leading-relaxed text-neutral-400">
			{repo.description}
		</p>
	{:else}
		<p class="italic text-[12.5px] text-neutral-500">Sin descripción.</p>
	{/if}

	{#if repo.topics.length}
		<div class="flex flex-wrap gap-1">
			{#each repo.topics.slice(0, 3) as topic (topic)}
				<span
					class="rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-neutral-400"
				>
					{topic}
				</span>
			{/each}
		</div>
	{/if}

	<div class="mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3">
		<div class="flex min-w-0 items-center gap-2.5 text-[11px] text-neutral-500">
			{#if repo.language}
				<span class="flex items-center gap-1">
					<span
						class="inline-block size-2 shrink-0 rounded-full"
						style="background-color: {LANG_COLOR[repo.language] ?? '#888'}"
					></span>
					<span class="truncate text-neutral-400">{repo.language}</span>
				</span>
			{/if}
			<span class="flex items-center gap-0.5" title="{repo.stargazers_count} stars">
				<Star
					size={11}
					weight={repo.stargazers_count > 0 ? 'fill' : 'regular'}
					class="text-amber-300"
				/>
				<span class="font-mono">{repo.stargazers_count}</span>
			</span>
			<span class="flex items-center gap-0.5" title="{repo.forks_count} forks">
				<GitFork size={11} weight="regular" />
				<span class="font-mono">{repo.forks_count}</span>
			</span>
		</div>

		<div class="flex items-center gap-1">
			{#if repo.homepage}
				<a
					href={repo.homepage}
					target="_blank"
					rel="noreferrer noopener"
					class="rounded p-1 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100"
					title="Homepage"
				>
					<Link size={12} weight="bold" />
				</a>
			{/if}
			<a
				href={repo.html_url}
				target="_blank"
				rel="noreferrer noopener"
				class="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-neutral-200 transition-all hover:border-white/20 hover:bg-white/10"
			>
				Ver
				<ArrowUpRight size={10} weight="bold" />
			</a>
		</div>
	</div>

	<span class="absolute right-3 top-3 font-mono text-[9px] text-neutral-600">{updated}</span>
</GlassCard>
