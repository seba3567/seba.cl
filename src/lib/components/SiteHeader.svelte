<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		GithubLogo,
		List,
		MagnifyingGlass,
		Stack,
		DeviceMobile,
		Folder,
		Flask,
		ShieldCheck,
		Storefront,
		Tabs,
		CaretDown,
		ArrowUpRight,
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
	let avatarEl: HTMLDivElement | undefined = $state();
	let avatarWrapEl: HTMLDivElement | undefined = $state();

	type NavGroup = {
		trigger: string;
		href: string;
		match: (path: string) => boolean;
		items: Array<{ title: string; href: string; description: string; icon: typeof ShieldCheck; tag?: string }>;
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
					tag: 'App',
				},
				{
					title: 'Unirme a la beta',
					href: 'https://play.google.com/apps/testing/com.seba3567.anticall_chile',
					description: 'Programa de testing en Google Play',
					icon: Flask,
					tag: 'Beta',
				},
				{
					title: 'Play Store',
					href: 'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile',
					description: 'Instalar o actualizar',
					icon: Storefront,
					tag: 'Externo',
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

		// 3D avatar: entrance (scale + rotateY) + hover tilt
		let avatarCleanups: Array<() => void> = [];
		const aEl = avatarEl;
		const wEl = avatarWrapEl;
		if (aEl) {
			animate(aEl, {
				scale: [0.4, 1],
				rotateY: [-90, 0],
				opacity: [0, 1],
				duration: 900,
				ease: 'out(4)',
				delay: 200,
			});

			// Subtle continuous "breathing" tilt so the 3D feels alive
			const breathe = animate(aEl, {
				rotateX: [0, 4, 0, -2, 0],
				duration: 6000,
				ease: 'inOut(2)',
				loop: true,
			});
			avatarCleanups.push(() => {
				try {
					breathe.revert();
				} catch {
					/* noop */
				}
			});

			// Hover tilt (more pronounced)
			if (wEl) {
				const onEnter = () => {
					animate(aEl, {
						rotateY: 18,
						rotateX: 10,
						scale: 1.06,
						duration: 500,
						ease: 'out(3)',
					});
				};
				const onLeave = () => {
					animate(aEl, {
						rotateY: 0,
						rotateX: 0,
						scale: 1,
						duration: 700,
						ease: 'out(4)',
					});
				};
				wEl.addEventListener('mouseenter', onEnter);
				wEl.addEventListener('mouseleave', onLeave);
				avatarCleanups.push(() => {
					wEl.removeEventListener('mouseenter', onEnter);
					wEl.removeEventListener('mouseleave', onLeave);
				});
			}
		}

		return () => {
			window.removeEventListener('seba:open-search', onOpenSearch as EventListener);
			window.removeEventListener('keydown', onKey);
			if (pulseTimer) clearTimeout(pulseTimer);
			avatarCleanups.forEach((fn) => fn());
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
		<!-- Brand: GitHub avatar in a 3D card with emerald accent -->
		<a
			href="/"
			class="group flex items-center gap-2.5 rounded-md px-1 py-1 transition-opacity hover:opacity-90"
			aria-label="Inicio"
		>
			<div bind:this={avatarWrapEl} class="avatar-3d-wrap">
				<div
					bind:this={avatarEl}
					class="avatar-3d relative flex size-9 items-center justify-center overflow-hidden rounded-md bg-emerald-500 ring-1 ring-emerald-400/30"
				>
					<img
						src="https://avatars.githubusercontent.com/u/44386561?v=4"
						alt="Sebastián Muñoz"
						class="size-full object-cover"
						loading="eager"
						decoding="async"
					/>
					<span
						class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-transparent to-emerald-300/10 mix-blend-overlay"
					></span>
					<span
						class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-md"
					></span>
				</div>
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

				<NavigationMenu.Item>
					<NavigationMenu.Link
						href="/proyectos"
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-all {isProjects
							? 'bg-white/10 text-neutral-50'
							: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
					>
						Proyectos
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				{#each navGroups as group (group.trigger)}
					<NavigationMenu.Item>
						<NavigationMenu.Trigger
							class="group/trigger inline-flex items-center gap-1 rounded-md bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-neutral-100 data-[popup-open]:bg-white/5 data-[popup-open]:text-neutral-100"
						>
							{group.trigger}
							<CaretDown
								size={10}
								weight="bold"
								class="text-neutral-500 transition-transform duration-300 group-data-[popup-open]/trigger:rotate-180 group-data-[popup-open]/trigger:text-neutral-200"
							/>
						</NavigationMenu.Trigger>
						<NavigationMenu.Content
							class="glass-liquid-static !mt-3 w-[460px] rounded-2xl !p-2 data-[motion=from-start]:animate-none data-[motion=from-end]:animate-none data-[motion=to-start]:animate-none data-[motion=to-end]:animate-none"
						>
							<!-- Header: visual label + secondary action -->
							<div
								class="flex items-center justify-between border-b border-white/5 px-3 pb-2 pt-1.5"
							>
								<p
									class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
								>
									{group.trigger} · {group.items.length}
								</p>
								<a
									href={group.href}
									onclick={() => (searchOpen = false)}
									class="group/seeall inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:text-neutral-100"
								>
									Ver todo
									<ArrowUpRight
										size={10}
										weight="bold"
										class="transition-transform group-hover/seeall:-translate-y-0.5 group-hover/seeall:translate-x-0.5"
									/>
								</a>
							</div>

							<!-- Items: 2-col grid, generous padding, circular icon container -->
							<ul class="grid grid-cols-1 gap-1 p-1.5">
								{#each group.items as item (item.href)}
									{@const Icon = item.icon}
									<li>
										<NavigationMenu.Link
											href={item.href}
											target={isExternal(item.href) ? '_blank' : undefined}
											rel={isExternal(item.href) ? 'noreferrer noopener' : undefined}
											class="group/item flex items-center gap-3.5 rounded-xl p-3 transition-all hover:bg-white/[0.04] hover:ring-1 hover:ring-white/10"
										>
											<div
												class="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition-all group-hover/item:scale-105 group-hover/item:border-emerald-400/30 group-hover/item:from-emerald-500/10 group-hover/item:to-emerald-500/[0.02]"
											>
												<Icon
													size={16}
													weight="duotone"
													class="text-neutral-300 transition-colors group-hover/item:text-emerald-300"
												/>
											</div>
											<div class="min-w-0 flex-1">
												<div class="flex items-center gap-2">
													<span
														class="truncate text-sm font-semibold text-neutral-100"
														>{item.title}</span
													>
													{#if item.tag}
														<span
															class="shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0 font-mono text-[9px] uppercase tracking-wider text-neutral-400"
														>
															{item.tag}
														</span>
													{/if}
												</div>
												<p class="mt-0.5 truncate text-xs text-neutral-500">
													{item.description}
												</p>
											</div>
											{#if isExternal(item.href)}
												<ArrowUpRight
													size={12}
													weight="bold"
													class="shrink-0 text-neutral-500 transition-all group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-neutral-200"
												/>
											{:else}
												<ArrowUpRight
													size={12}
													weight="bold"
													class="shrink-0 text-neutral-600 transition-all group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-neutral-200"
												/>
											{/if}
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
						<a
							href="/proyectos"
							onclick={() => (mobileOpen = false)}
							class="mt-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors {isProjects
								? 'bg-white/10 text-neutral-50'
								: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-100'}"
						>
							Proyectos
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

<style>
	/* ===== 3D avatar card =====
	   Wraps the GitHub profile image in a tilted 3D surface.
	   anime.js drives the entrance + hover tilt; CSS gives the
	   perspective container and the multi-layer green-tinted
	   shadow that creates the depth illusion. */
	:global(.avatar-3d-wrap) {
		perspective: 500px;
	}
	:global(.avatar-3d) {
		transform-style: preserve-3d;
		will-change: transform, box-shadow;
		box-shadow:
			0 1px 2px rgb(0 0 0 / 0.5),
			0 4px 8px rgb(0 0 0 / 0.35),
			0 10px 20px rgb(16 185 129 / 0.25),
			0 0 0 1px rgb(16 185 129 / 0.15);
		transition: box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(.avatar-3d-wrap:hover .avatar-3d) {
		box-shadow:
			0 2px 4px rgb(0 0 0 / 0.55),
			0 8px 16px rgb(0 0 0 / 0.45),
			0 18px 36px rgb(16 185 129 / 0.4),
			0 0 0 1px rgb(16 185 129 / 0.3);
	}
</style>