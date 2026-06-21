<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Fuse from 'fuse.js';
	import {
		MagnifyingGlass,
		ArrowRight,
		House,
		DeviceMobile,
		Folder,
		Lock,
		GithubLogo,
		ShieldCheck,
		ArrowUpRight,
		Globe,
		X,
	} from 'phosphor-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { animate, stagger, utils } from 'animejs';

	type SearchItem = {
		id: string;
		title: string;
		subtitle: string;
		href: string;
		group: 'Página' | 'App' | 'Repo' | 'Externo';
		keywords: string[];
		external?: boolean;
		icon: typeof House;
	};

	const BETA = 'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
	const PLAY = 'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const PRIVACY = 'https://seba3567.github.io/anticall_pages/';
	const GITHUB = 'https://github.com/seba3567';
	const PROJECTS_GH = 'https://github.com/seba3567?tab=repositories';

	const PAGE_ITEMS: SearchItem[] = [
		{
			id: 'page-home',
			title: 'Inicio',
			subtitle: 'Perfil + proyectos destacados',
			href: '/',
			group: 'Página',
			keywords: ['home', 'inicio', 'index', 'perfil', 'bio', 'sebastian', 'seba'],
			icon: House,
		},
		{
			id: 'page-apps',
			title: 'Apps',
			subtitle: 'Catálogo de aplicaciones publicadas',
			href: '/apps',
			group: 'Página',
			keywords: ['apps', 'aplicaciones', 'catalogo'],
			icon: DeviceMobile,
		},
		{
			id: 'page-anticall',
			title: 'AntiCallCL',
			subtitle: 'Gestor de llamadas no deseadas · Android',
			href: '/apps/anticall',
			group: 'App',
			keywords: ['anticall', 'android', 'llamadas', 'spam', 'telefono', 'app'],
			icon: ShieldCheck,
		},
		{
			id: 'page-proyectos',
			title: 'Proyectos',
			subtitle: 'Catálogo vivo desde la API de GitHub',
			href: '/proyectos',
			group: 'Página',
			keywords: ['proyectos', 'work', 'github', 'repos', 'repositorio', 'portfolio'],
			icon: Folder,
		},
	];

	const EXTERNAL_ITEMS: SearchItem[] = [
		{
			id: 'ext-beta',
			title: 'Unirme a la beta (AntiCallCL)',
			subtitle: 'Google Play · early access',
			href: BETA,
			group: 'Externo',
			keywords: ['beta', 'testing', 'anticall', 'play store'],
			external: true,
			icon: ShieldCheck,
		},
		{
			id: 'ext-play',
			title: 'Play Store · AntiCallCL',
			subtitle: 'Instalar o actualizar',
			href: PLAY,
			group: 'Externo',
			keywords: ['play', 'store', 'instalar', 'android', 'anticall'],
			external: true,
			icon: DeviceMobile,
		},
		{
			id: 'ext-privacy',
			title: 'Política de privacidad',
			subtitle: 'Página canónica (seba3567.github.io)',
			href: PRIVACY,
			group: 'Externo',
			keywords: ['privacidad', 'privacy', 'policy', 'datos', 'anticall', 'terminos'],
			external: true,
			icon: Lock,
		},
		{
			id: 'ext-github',
			title: 'GitHub · @seba3567',
			subtitle: 'Perfil completo + repos',
			href: GITHUB,
			group: 'Externo',
			keywords: ['github', 'repos', 'code', 'codigo', 'perfil'],
			external: true,
			icon: GithubLogo,
		},
		{
			id: 'ext-projects-gh',
			title: 'Proyectos en GitHub (web)',
			subtitle: 'Lista completa de repositorios',
			href: PROJECTS_GH,
			group: 'Externo',
			keywords: ['repos', 'repositorios', 'lista', 'github', 'todos'],
			external: true,
			icon: Folder,
		},
		{
			id: 'ext-intranet',
			title: 'Intranet seba3567',
			subtitle: 'intranet.seba3567.cl',
			href: 'https://intranet.seba3567.cl/',
			group: 'Externo',
			keywords: ['intranet', 'panel', 'admin', 'privado'],
			external: true,
			icon: Globe,
		},
	];

	const HOME = PAGE_ITEMS.concat(EXTERNAL_ITEMS);

	const fuseHome = new Fuse(HOME, {
		keys: [
			{ name: 'title', weight: 0.5 },
			{ name: 'subtitle', weight: 0.2 },
			{ name: 'keywords', weight: 0.3 },
		],
		threshold: 0.4,
		ignoreLocation: true,
		includeScore: true,
	});

	let repoFuse: Fuse<{ id: string; title: string; subtitle: string; href: string; keywords: string[] }> | null = null;
	const REPO_INDEX_URL = 'https://api.github.com/users/seba3567/repos?per_page=100&sort=updated';

	type RepoHit = {
		id: string;
		title: string;
		subtitle: string;
		href: string;
		keywords: string[];
	};

	async function loadRepoIndex() {
		if (repoFuse) return;
		try {
			const res = await fetch(REPO_INDEX_URL, {
				headers: { Accept: 'application/vnd.github+json' },
			});
			if (!res.ok) return;
			const repos = (await res.json()) as Array<{
				id: number;
				name: string;
				full_name: string;
				description: string | null;
				html_url: string;
				topics?: string[];
				language: string | null;
			}>;
			const items: RepoHit[] = repos
				.filter((r) => !r.name.endsWith('.github.io'))
				.map((r) => ({
					id: String(r.id),
					title: r.name,
					subtitle: r.description ?? `${r.language ?? 'code'} · @seba3567`,
					href: r.html_url,
					keywords: [
						...(r.topics ?? []),
						r.language ?? '',
						'github',
						'repo',
						'codigo',
					].filter(Boolean),
				}));
			repoFuse = new Fuse(items, {
				keys: [
					{ name: 'title', weight: 0.6 },
					{ name: 'subtitle', weight: 0.2 },
					{ name: 'keywords', weight: 0.2 },
				],
				threshold: 0.4,
				ignoreLocation: true,
			});
		} catch {
			// ignore — repo search is best-effort
		}
	}

	let open = $state(false);
	let query = $state('');
	let inputEl: HTMLInputElement | undefined = $state();
	let listEl: HTMLElement | undefined = $state();

	const homeResults = $derived.by(() => {
		const q = query.trim();
		if (!q) return HOME.map((item) => ({ item, score: 0 })).slice(0, 6);
		return fuseHome.search(q, { limit: 6 });
	});

	const repoResults = $derived.by(() => {
		const q = query.trim();
		if (!q || !repoFuse) return [] as Array<{ item: RepoHit; score: number }>;
		// Only show repos when query looks "code-like" (no need to search repos for 'inicio')
		if (q.length < 2) return [];
		return repoFuse.search(q, { limit: 8 });
	});

	const flat = $derived(
		[
			...homeResults.map((r) => ({ ...r, kind: 'home' as const })),
			...repoResults.map((r) => ({ ...r, kind: 'repo' as const })),
		].slice(0, 10),
	);
	let selectedIndex = $state(0);

	$effect(() => {
		if (selectedIndex >= flat.length) selectedIndex = 0;
	});

	$effect(() => {
		if (open) {
			query = '';
			selectedIndex = 0;
			loadRepoIndex();
			setTimeout(() => inputEl?.focus(), 60);
		}
	});

	function prefersReducedMotion(): boolean {
		if (typeof window === 'undefined' || !window.matchMedia) return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	// Stagger results in with animejs when query/results change
	$effect(() => {
		if (!open || !listEl) return;
		const reduce = prefersReducedMotion();
		const items = listEl.querySelectorAll<HTMLElement>('[data-result]');
		if (!items.length) return;
		animate(items, {
			opacity: [0, 1],
			translateY: [12, 0],
			delay: stagger(reduce ? 0 : 35, { start: reduce ? 0 : 60 }),
			duration: reduce ? 0 : 360,
			ease: 'out(3)',
		});
	});

	function run(item: SearchItem) {
		open = false;
		queueMicrotask(() => {
			if (item.external) {
				window.open(item.href, '_blank', 'noopener,noreferrer');
			} else {
				goto(item.href);
			}
		});
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, flat.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const r = flat[selectedIndex];
			if (r) run(r.item as SearchItem);
		}
	}

	// Open with /
	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			const t = e.target;
			const isTyping =
				t instanceof HTMLElement &&
				(t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
			if (e.key === '/' && !open && !isTyping) {
				e.preventDefault();
				open = true;
			}
			if (e.key === 'Escape' && open) open = false;
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
		/>
		<Dialog.Content
			class="glass-liquid-static fixed left-1/2 top-[10%] z-50 max-h-[80vh] w-[min(96vw,680px)] -translate-x-1/2 overflow-hidden rounded-3xl shadow-2xl shadow-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<!-- Search input -->
			<div class="flex items-center gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
				<MagnifyingGlass size={18} weight="bold" class="text-neutral-500" />
				<input
					bind:this={inputEl}
					bind:value={query}
					onkeydown={handleKey}
					placeholder="Buscar páginas, apps, repositorios…"
					class="w-full bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
					autocomplete="off"
					spellcheck="false"
				/>
				<Dialog.Close
					class="inline-flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label="Cerrar"
				>
					<X size={12} weight="bold" />
				</Dialog.Close>
			</div>

			<!-- Results -->
			<div bind:this={listEl} class="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
				{#if flat.length === 0}
					<div class="px-4 py-12 text-center">
						<p class="text-sm text-neutral-500">
							{#if query.trim()}
								Sin resultados para "{query}"
							{:else}
								Empezá a escribir para buscar…
							{/if}
						</p>
					</div>
				{:else}
					<div class="space-y-1">
						{#each flat as r, i (r.item.id + (r.kind ?? ''))}
							{@const item = r.item as SearchItem}
							{@const Icon = item.icon}
							<button
								type="button"
								data-result
								onmouseenter={() => (selectedIndex = i)}
								onclick={() => run(item)}
								class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors {i === selectedIndex
									? 'bg-white/[0.07] text-neutral-50'
									: 'text-neutral-300 hover:bg-white/[0.03]'}"
							>
								<div
									class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
								>
									<Icon
										size={15}
										weight="duotone"
										class={i === selectedIndex ? 'text-violet-300' : 'text-neutral-400'}
									/>
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<p class="truncate text-sm font-medium">{item.title}</p>
										<span
											class="shrink-0 rounded-full border border-white/10 bg-white/5 px-1.5 py-0 font-mono text-[9px] uppercase tracking-wider text-neutral-500"
										>
											{item.group}
										</span>
									</div>
									<p class="mt-0.5 truncate font-mono text-[10px] text-neutral-500">
										{item.subtitle}
									</p>
								</div>
								{#if item.external}
									<ArrowUpRight
										size={12}
										weight="bold"
										class="shrink-0 text-neutral-500"
									/>
								{:else}
									<ArrowRight
										size={12}
										weight="bold"
										class="shrink-0 text-neutral-500 transition-opacity {i === selectedIndex
											? 'opacity-100'
											: 'opacity-0'}"
									/>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div
				class="flex items-center justify-between gap-2 border-t border-white/5 bg-white/[0.02] px-5 py-2.5"
			>
				<div class="flex items-center gap-3 font-mono text-[10px] text-neutral-500">
					<span class="flex items-center gap-1">
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">↑</kbd>
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">↓</kbd>
						navegar
					</span>
					<span class="flex items-center gap-1">
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
						ir
					</span>
					<span class="flex items-center gap-1">
						<kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5">/</kbd>
						abrir con teclado
					</span>
				</div>
				<span class="font-mono text-[10px] text-neutral-600">Fuse.js</span>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
