<script lang="ts">
import {
	ArrowUpRight,
	Code,
	Cube,
	Database,
	Flame,
	Gear,
	GithubLogo,
	PhoneX,
	Sparkle,
} from 'phosphor-svelte';
import type { FeaturedProject } from '$lib/data/featured';
import { ACCENT_CLASSES, STATUS_LABELS } from '$lib/data/featured';
import GlassCard from './GlassCard.svelte';

type Props = { projects: FeaturedProject[] };
let { projects }: Props = $props();

const ICON_MAP = {
	'phone-shield': PhoneX,
	sparkle: Sparkle,
	code: Code,
	gear: Gear,
	database: Database,
	flame: Flame,
	cube: Cube,
} as const;
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each projects as project (project.slug)}
		{@const Icon = ICON_MAP[project.icon]}
		{@const accent = ACCENT_CLASSES[project.accent]}
		{@const status = STATUS_LABELS[project.status]}
		<GlassCard hover class="group relative flex flex-col gap-4 p-5">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 -right-20 size-40 rounded-full {accent.bg
					.replace('bg-', 'bg-gradient-to-br from-')
					.replace('/10', '/30')} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
			></div>

			<div class="flex items-start justify-between">
				<div
					class="flex size-10 items-center justify-center rounded-lg {accent.bg} {accent.border} border ring-1 {accent.ring}"
				>
					<Icon size={20} weight="duotone" class={accent.text} />
				</div>
				<span
					class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider {status.color}"
				>
					<span class="size-1 rounded-full bg-current"></span>
					{status.label}
				</span>
			</div>

			<div class="space-y-1.5">
				<h3 class="text-base font-semibold text-neutral-50">{project.name}</h3>
				<p class="line-clamp-2 text-xs text-neutral-400">{project.tagline}</p>
			</div>

			<p class="line-clamp-3 text-[13px] leading-relaxed text-neutral-300">
				{project.description}
			</p>

			<div class="flex flex-wrap gap-1.5">
				{#each project.stack.slice(0, 4) as tech (tech)}
					<span
						class="rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-neutral-400"
					>
						{tech}
					</span>
				{/each}
				{#if project.stack.length > 4}
					<span
						class="rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-neutral-500"
					>
						+{project.stack.length - 4}
					</span>
				{/if}
			</div>

			<div class="mt-auto flex items-center gap-2 border-t border-white/5 pt-3">
				{#if project.links.github}
					<a
						href={project.links.github}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-100"
					>
						<GithubLogo size={12} weight="bold" />
						Repo
					</a>
				{/if}
				{#if project.links.demo}
					<a
						href={project.links.demo}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-100"
					>
						Demo
						<ArrowUpRight size={10} weight="bold" />
					</a>
				{/if}
				{#if project.links.docs}
					<a
						href={project.links.docs}
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-100"
					>
						Docs
						<ArrowUpRight size={10} weight="bold" />
					</a>
				{/if}
			</div>
		</GlassCard>
	{/each}
</div>
