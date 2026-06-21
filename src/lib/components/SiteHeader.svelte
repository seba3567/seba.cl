<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		GithubLogo,
		List,
		MagnifyingGlass,
		BracketsCurly,
		Stack,
		DeviceMobile,
		Folder,
		Flask,
		ShieldCheck,
		Storefront,
		Tabs,
	} from 'phosphor-svelte';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { animate } from 'animejs';
	import SearchPanel from './SearchPanel.svelte';

	type Props = {
		username?: string;
		repoCount?: number;
	};
	let { username = 'seba3567', repoCount = 0 }: Props = $props();

	const currentPath = $derived(page.url?.pathname ?? '/');
	const isHome = $derived(currentPath === '/');
	const isProjects = $derived(currentPath.startsWith('/proyectos'));
	const isApps = $derived(currentPath.startsWith('/apps'));

	let searchOpen = $state(false);
	let mobileOpen = $state(false);
	let searchTriggerEl: HTMLButtonElement | undefined = $state();

	type NavGroup = {
		trigger: string;
		href: string;
		match: (path: string) => boolean;
		items: Array<{ title: string; href: string; description: string; icon: typeof ShieldCheck }>;
	};

	const navGroups: NavGroup[] = [
		{
			trigger: 'Apps',
			href: '/apps',
			match: (p) => p.startsWith('/apps'),
			items: [
				{
					title: 'Catálogo',
					href: '/apps',
					description: 'Apps publicadas y en beta',
					icon: DeviceMobile,
				},
				{
					title: 'AntiCallCL',
					href: '/apps/anticall',
					description: 'Gestor de llamadas no deseadas · Android',
					icon: ShieldCheck,
				},
				{
					title: 'Unirme a la beta',
					href: 'https://play.google.com/apps/testing/com.seba3567.anticall_chile',
					description: 'Programa de testing en Google Play',
					icon: Flask,
				},
				{
					title: 'Play Store',
					href: 'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile',
					description: 'Instalar o actualizar',
					icon: Storefront,
				},
			],
		},
		{
			trigger: 'Work',
			href: '/proyectos',
			match: (p) => p.startsWith('/proyectos'),
			items: [
				{
					title: 'Todos los repos',
					href: '/proyectos',
					description: 'Catálogo vivo desde la API de GitHub',
					icon: Folder,
				},
				{
					title: 'GitHub · @seba3567',
					href: 'https://github.com/seba3567',
					description: 'Perfil completo + repos',
					icon: GithubLogo,
				},
			{
				title: 'Sección Stack',
				href: '/#stack',
				description: 'Tecnologías que uso (home)',
				icon: Stack,
			},
			],
		},
	];

	function isActive(href: string): boolean {
		return currentPath === href;
	}
	function isExternal(href: string): boolean {
		return /^https?:|^mailto:/.test(href);
	}

	// Scroll progress removed (BackToTop + horizontal scroll handle this now)
	onMount(() => {

		// Listen for global "open search" events from anywhere
		const onOpenSearch = () => (searchOpen = true);
		window.addEventListener('seba:open-search', onOpenSearch as EventListener);

		// '/' opens search globally
		const onKey = (e: KeyboardEvent) => {
			const t = e.target;
			const isTyping =
				t instanceof HTMLElement &&
				(t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
			if (e.key === '/' && !searchOpen && !isTyping) {
				e.preventDefault();
				searchOpen = true;
			}
		};
		window.addEventListener('keydown', onKey);

		// Tiny pulse on the search button to draw attention
		let pulseTimer: ReturnType<typeof setTimeout> | null = null;
		const triggerPulse = () => {
			if (!searchTriggerEl) return;
			pulseTimer = setTimeout(() => {
				if (searchTriggerEl && !searchOpen) {
					animate(searchTriggerEl, {
						scale: [1, 1.04, 1],
						duration: 600,
						ease: 'inOut(2)',
					});
				}
			}, 1500);
		};
		triggerPulse();

		return () => {
			window.removeEventListener('seba:open-search', onOpenSearch as EventListener);
			window.removeEventListener('keydown', onKey);
			if (pulseTimer) clearTimeout(pulseTimer);
		};
	});

	function scrollToSection(e: MouseEvent, id: string) {
		// If we're on the home page, intercept the click and horizontal-scroll
		// the home track. Otherwise let the link navigate normally.
		if (typeof window === 'undefined') return;
		const onHome = window.location.pathname === '/';
		const target = document.getElementById(id);
		if (!onHome || !target) return;
		e.preventDefault();
		const track = document.getElementById('home-track');
		if (!track) return;
		const left = target.offsetLeft - track.offsetLeft;
		track.scrollTo({ left, behavior: 'smooth' });
	}
</script>

<!-- Scroll progress bar removed: replaced by BackToTop button + horizontal scroll. -->

<header class="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
	<div
		class="glass-liquid flex items-center justify-between gap-2 rounded-xl px-3 py-2 sm:gap-3 sm:px-4"
	>
		<!-- Brand -->
		<a
			href="/"
			class="group flex items-center gap-2.5 rounded-md px-1 py-1 transition-opacity hover:opacity-90"
			aria-label="Inicio"
		>
			<div
				class="relative flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/90 via-fuchsia-500/80 to-amber-500/70 shadow-md ring-1 ring-white/10"
			>
				<BracketsCurly size={14} weight="bold" class="text-neutral-950" />
			</div>
			<div class="hidden flex-col leading-tight sm:flex">
				<span class="text-sm font-semibold tracking-tight text-neutral-50">seba3567</span>
				<span class="font-mono text-[10px] text-neutral-500">
					/ {isHome ? 'inicio' : isApps ? 'apps' : isProjects ? 'proyectos' : 'sitio'}
				</span>
			</div>
		</a>

		<!-- Desktop nav -->
		<NavigationMenu.Root class="hidden md:flex">
			<NavigationMenu.List class="gap-0.5">
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href="/"
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-all {isActive('/')
							? 'bg-white/10 text-neutral-50'
							: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
					>
						Inicio
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				{#each navGroups as group (group.trigger)}
					<NavigationMenu.Item>
						<NavigationMenu.Trigger
							class="rounded-md bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-neutral-100 data-[popup-open]:bg-white/5 data-[popup-open]:text-neutral-100"
						>
							{group.trigger}
						</NavigationMenu.Trigger>
						<NavigationMenu.Content class="glass-liquid-static !mt-3 w-[420px] rounded-2xl !p-2">
							<ul class="grid gap-0.5">
								{#each group.items as item (item.href)}
									{@const Icon = item.icon}
									<li>
										<NavigationMenu.Link
											href={item.href}
											target={isExternal(item.href) ? '_blank' : undefined}
											rel={isExternal(item.href) ? 'noreferrer noopener' : undefined}
											class="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
										>
											<div
												class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
											>
												<Icon size={14} weight="duotone" class="text-neutral-300" />
											</div>
											<div class="min-w-0">
												<div class="text-sm font-semibold text-neutral-100">
													{item.title}
												</div>
												<p class="mt-0.5 truncate text-xs text-neutral-500">
													{item.description}
												</p>
											</div>
										</NavigationMenu.Link>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<!-- Right cluster: search + GitHub + mobile menu -->
		<div class="flex items-center gap-2">
			<button
				bind:this={searchTriggerEl}
				type="button"
				onclick={() => (searchOpen = true)}
				aria-label="Buscar"
				class="hidden items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 sm:inline-flex"
			>
				<MagnifyingGlass size={12} weight="bold" />
				<span class="font-mono">Buscar…</span>
				<kbd
					class="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-[9px] text-neutral-500"
				>/</kbd>
			</button>

			<a
				href="https://github.com/{username}"
				target="_blank"
				rel="noreferrer noopener"
				aria-label="GitHub @{username}"
				class="group/gh hidden size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-neutral-300 transition-all hover:scale-110 hover:border-white/25 hover:bg-white/10 hover:text-neutral-100 sm:inline-flex"
			>
				<GithubLogo size={16} weight="fill" class="transition-transform group-hover/gh:rotate-[-6deg]" />
			</a>
			<a
				href="https://intranet.seba3567.cl/"
				target="_blank"
				rel="noreferrer noopener"
				aria-label="Intranet"
				title="Abrir intranet.seba3567.cl en nueva pestaña"
				class="hidden size-9 items-center justify-center rounded-md border border-violet-400/20 bg-violet-500/5 text-violet-300 transition-all hover:scale-110 hover:border-violet-400/40 hover:bg-violet-500/15 sm:inline-flex"
			>
				<Tabs size={16} weight="bold" />
			</a>

			<Sheet.Root bind:open={mobileOpen}>
				<Sheet.Trigger
					class="inline-flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 md:hidden"
					aria-label="Menú"
				>
					<List size={14} weight="bold" />
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-72 gap-0 p-0">
					<Sheet.Header class="border-b border-white/5 p-5">
						<Sheet.Title class="text-sm font-mono">/ seba3567</Sheet.Title>
						<Sheet.Description class="text-xs text-neutral-500">seba3567.cl</Sheet.Description>
					</Sheet.Header>
					<nav class="flex flex-col p-2">
						<button
							type="button"
							onclick={() => {
								mobileOpen = false;
								searchOpen = true;
							}}
							class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-neutral-100"
						>
							<MagnifyingGlass size={14} weight="bold" />
							Buscar…
							<kbd
								class="ml-auto rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-[9px] text-neutral-500"
								>/</kbd>
						</button>
						<div class="my-2">
							<Separator class="bg-white/5" />
						</div>
						<a
							href="/"
							onclick={() => (mobileOpen = false)}
							class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive('/')
								? 'bg-white/10 text-neutral-50'
								: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
						>
							Inicio
						</a>
						{#each navGroups as group (group.trigger)}
							<div class="mt-3">
								<p
									class="px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500"
								>
									{group.trigger}
								</p>
								<a
									href={group.href}
									onclick={() => (mobileOpen = false)}
									class="mt-1 block rounded-lg px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
								>
									Ver todo
								</a>
								{#each group.items as item (item.href)}
									<a
										href={item.href}
										target={isExternal(item.href) ? '_blank' : undefined}
										rel={isExternal(item.href) ? 'noreferrer noopener' : undefined}
										onclick={() => (mobileOpen = false)}
										class="block rounded-lg px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
									>
										· {item.title}
									</a>
								{/each}
							</div>
						{/each}
					</nav>
					<div class="absolute inset-x-0 bottom-0 border-t border-white/5 p-4">
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
	</div>
</header>

<SearchPanel />