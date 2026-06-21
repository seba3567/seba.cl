<script lang="ts">
	import { GithubLogo, Lightning } from 'phosphor-svelte';
	import GlassCard from './GlassCard.svelte';

	type Props = {
		username?: string;
		repoCount?: number;
	};

	let { username = 'seba3567', repoCount = 0 }: Props = $props();
</script>

<header class="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
	<GlassCard variant="strong" class="flex items-center justify-between px-4 py-3">
		<a href="/" class="group flex items-center gap-2.5">
			<div
				class="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 shadow-lg"
			>
				<Lightning size={18} weight="fill" class="text-neutral-950" />
				<span
					class="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 opacity-50 blur-md transition-opacity group-hover:opacity-80"
				></span>
			</div>
			<div class="flex flex-col leading-tight">
				<span class="text-sm font-semibold tracking-tight text-neutral-50">seba3567.cl</span>
				<span class="font-mono text-[10px] text-neutral-500">/ proyectos</span>
			</div>
		</a>

		<nav class="hidden items-center gap-1 sm:flex">
			<a
				href="#proyectos"
				class="rounded-md px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-neutral-100"
			>
				Proyectos
			</a>
			<a
				href="#stack"
				class="rounded-md px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-neutral-100"
			>
				Stack
			</a>
			<a
				href="#todos"
				class="rounded-md px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-neutral-100"
			>
				Todos
			</a>
		</nav>

		<a
			href="https://github.com/{username}"
			target="_blank"
			rel="noreferrer noopener"
			class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-neutral-200 transition-all hover:border-white/20 hover:bg-white/10"
		>
			<GithubLogo size={16} weight="bold" />
			<span class="hidden sm:inline">@{username}</span>
			<span class="text-[10px] text-neutral-500">({repoCount})</span>
		</a>
	</GlassCard>
</header>
