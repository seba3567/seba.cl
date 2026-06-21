<script lang="ts">
	import { page } from '$app/state';
	import { GithubLogo, List } from 'phosphor-svelte';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import GlassCard from './GlassCard.svelte';

	type Props = {
		username?: string;
		repoCount?: number;
	};

	let { username = 'seba3567', repoCount = 0 }: Props = $props();

	const currentPath = $derived(page.url?.pathname ?? '/');
	const isHome = $derived(currentPath === '/');
	const isProjects = $derived(currentPath.startsWith('/proyectos'));

	type NavItem = {
		href: string;
		label: string;
		match?: (path: string) => boolean;
		description?: string;
	};

	const items: {
		label: string;
		href?: string;
		match?: (path: string) => boolean;
		submenu?: NavItem[];
	}[] = [
		{ label: 'Index', href: '/', match: (p) => p === '/' },
		{
			label: 'Work',
			href: '/proyectos',
			match: (p) => p.startsWith('/proyectos'),
		},
	];

	function isActive(item: { match?: (path: string) => boolean; href?: string }): boolean {
		if (item.match) return item.match(currentPath);
		return false;
	}
</script>

<header class="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
	<GlassCard variant="strong" class="flex items-center justify-between gap-3 rounded-full px-4 py-2">
		<a href="/" class="group flex items-center gap-2 px-1 py-1 transition-opacity hover:opacity-80">
			<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">/</span>
			<span class="font-mono text-xs font-semibold text-neutral-100">seba3567</span>
		</a>

		<NavigationMenu.Root class="hidden md:flex">
			<NavigationMenu.List class="gap-1">
				{#each items as item (item.label)}
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href={item.href}
							class="rounded-full px-3 py-1.5 text-xs font-medium transition-all {isActive(item)
								? 'bg-white/10 text-neutral-50'
								: 'text-neutral-400 hover:bg-white/5 hover:text-neutral-100'}"
						>
							{item.label}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<div class="flex items-center gap-2">
			<a
				href="https://github.com/{username}"
				target="_blank"
				rel="noreferrer noopener"
				class="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:border-white/20 hover:bg-white/10 sm:inline-flex"
			>
				<GithubLogo size={12} weight="bold" />
				<span class="font-mono">@</span>
			</a>

			<Sheet.Root>
				<Sheet.Trigger
					class="inline-flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 md:hidden"
				>
					<List size={14} weight="bold" />
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-72 gap-0 p-0">
					<Sheet.Header class="border-b border-white/5 p-5">
						<Sheet.Title class="text-sm font-mono">/ seba3567</Sheet.Title>
						<Sheet.Description class="text-xs text-neutral-500">seba3567.cl</Sheet.Description>
					</Sheet.Header>
					<nav class="flex flex-col p-2">
						{#each items as item (item.label)}
							<a
								href={item.href}
								class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive(
									item,
								)
									? 'bg-white/10 text-neutral-50'
									: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
							>
								{item.label}
							</a>
						{/each}
					</nav>
					<Separator class="bg-white/5" />
					<div class="p-4">
						<Button
							href="https://github.com/{username}"
							target="_blank"
							rel="noreferrer noopener"
							variant="outline"
							class="w-full justify-center"
						>
							<GithubLogo size={12} weight="bold" data-icon="inline-start" />
							@{username}
						</Button>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</GlassCard>
</header>
