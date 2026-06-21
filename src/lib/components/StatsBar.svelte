<script lang="ts" module>
const LANG_COLORS: Record<string, string> = {
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
	Default: '#888888',
};

export function langColor(name: string): string {
	return LANG_COLORS[name] ?? LANG_COLORS.Default;
}
</script>

<script lang="ts">
	import { Star, GitFork, Folder, Code } from 'phosphor-svelte';
	import type { RepoStats } from '$lib/server/github';
	import GlassCard from './GlassCard.svelte';

	type Props = { stats: RepoStats };
	let { stats }: Props = $props();

	const topLangs = $derived(stats.languages.slice(0, 6));
	const totalBytes = $derived(topLangs.reduce((s, l) => s + l.bytes, 0) || 1);

	function fmtBytes(b: number): string {
		if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
		if (b > 1024) return `${(b / 1024).toFixed(0)} KB`;
		return `${b} B`;
	}
</script>

<GlassCard variant="strong" class="overflow-hidden p-0">
	<div class="grid grid-cols-2 divide-x divide-white/5 sm:grid-cols-4">
		<div class="p-5">
			<div class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
				<Folder size={12} weight="duotone" />
				Repos
			</div>
			<div class="mt-1 font-mono text-2xl font-bold text-neutral-50">{stats.total}</div>
		</div>
		<div class="p-5">
			<div class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
				<Star size={12} weight="duotone" class="text-amber-300" />
				Stars
			</div>
			<div class="mt-1 font-mono text-2xl font-bold text-neutral-50">{stats.stars}</div>
		</div>
		<div class="p-5">
			<div class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
				<GitFork size={12} weight="duotone" />
				Forks
			</div>
			<div class="mt-1 font-mono text-2xl font-bold text-neutral-50">{stats.forks}</div>
		</div>
		<div class="p-5">
			<div class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
				<Code size={12} weight="duotone" />
				Lenguajes
			</div>
			<div class="mt-1 font-mono text-2xl font-bold text-neutral-50">{stats.languages.length}</div>
		</div>
	</div>

	{#if topLangs.length}
		<div class="border-t border-white/5 px-5 py-4">
			<div class="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500">
				<span>Top languages</span>
				<span class="font-mono">{fmtBytes(totalBytes)}</span>
			</div>
			<div class="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
				{#each topLangs as lang (lang.name)}
					{@const width = (lang.bytes / totalBytes) * 100}
					<div
						class="h-full"
						style="width: {width}%; background-color: {langColor(lang.name)}; opacity: 0.85;"
						title="{lang.name}: {width.toFixed(1)}%"
					></div>
				{/each}
			</div>
			<div class="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
				{#each topLangs as lang (lang.name)}
					<div class="flex items-center gap-1.5 text-[11px] text-neutral-400">
						<span
							class="inline-block size-2 rounded-full"
							style="background-color: {langColor(lang.name)}"
						></span>
						<span class="text-neutral-300">{lang.name}</span>
						<span class="font-mono text-neutral-500">{lang.count}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</GlassCard>
