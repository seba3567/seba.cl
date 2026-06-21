<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		ArrowDown,
		GithubLogo,
		EnvelopeSimple,
		ArrowUpRight,
		PhoneX,
		Lightning,
		Stack,
		Cpu,
		DeviceMobile,
		Star,
		Code,
		Database,
		Kanban,
		Books,
		Target,
		GraduationCap,
		Handshake,
		Users,
		ShieldCheck,
		Eye,
		Lock,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import { animate, stagger } from 'animejs';

	const AVATAR_URL = 'https://avatars.githubusercontent.com/u/44386561?v=4';

	const profile = {
		name: 'Sebastián Muñoz',
		handle: '@seba3567',
		location: 'Chile',
		tagline: 'Ingeniero de Software y Datos.',
		intro:
			'Backend, datos, mobile, QA. Combino análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
	};

	const work = [
		{
			n: '01',
			title: 'AntiCallCL.',
			sub: 'App Android · Kotlin',
			tags: ['Kotlin', 'Android', 'Play Store'],
			href: '/apps/anticall',
			span: 'col-span-12 lg:col-span-7 row-span-2',
			featured: true,
		},
		{
			n: '02',
			title: 'autoskills.',
			sub: 'TypeScript · CLI',
			tags: ['TS', 'Node', 'NPM'],
			href: 'https://github.com/seba3567/autoskills',
			span: 'col-span-6 lg:col-span-5',
		},
		{
			n: '03',
			title: 'frontend.skeleton.',
			sub: 'Svelte 5 · Tailwind v4',
			tags: ['Svelte', 'Bun'],
			href: 'https://github.com/seba3567/frontend.skeleton',
			span: 'col-span-6 lg:col-span-3',
		},
		{
			n: '04',
			title: 'telefonia_ido.',
			sub: 'Python · REST',
			tags: ['Python', 'SQL'],
			href: 'https://github.com/seba3567/telefonia_ido',
			span: 'col-span-6 lg:col-span-2',
		},
		{
			n: '05',
			title: 'Svelte advanced.',
			sub: 'Svelte · TS',
			tags: ['Svelte', 'TS'],
			href: 'https://github.com/seba3567/Svelte-avanced-components',
			span: 'col-span-6 lg:col-span-5',
		},
		{
			n: '06',
			title: 'seba.cl.',
			sub: 'este sitio',
			tags: ['Svelte', 'Tailwind'],
			href: '/proyectos',
			span: 'col-span-6 lg:col-span-3',
		},
		{
			n: '07',
			title: 'seba_flutter_skeleton.',
			sub: 'Dart · Flutter',
			tags: ['Dart'],
			href: 'https://github.com/seba3567/seba_flutter_skeleton',
			span: 'col-span-6 lg:col-span-2',
		},
		{
			n: '08',
			title: 'PROYECTO-OPS.',
			sub: 'TypeScript',
			tags: ['TS'],
			href: 'https://github.com/seba3567/PROYECTO-OPS',
			span: 'col-span-6 lg:col-span-2',
		},
	];

	const stack = [
		{ label: 'En uso', items: 'TypeScript · Django · SQL · Python', value: 4 },
		{
			label: 'En progreso',
			items: 'Kotlin · Dart · Go · Ruby',
			value: 4,
		},
		{ label: 'Base', items: 'JavaScript · Lua · REST · Docker', value: 5 },
	];

	const specialties = [
		{
			icon: Database,
			title: 'Ciencia de Datos',
			items: [
				'Inteligencia de Negocios',
				'Modelado y análisis de datos',
				'Visualización y storytelling con datos',
				'Análisis estadístico aplicado',
			],
		},
		{
			icon: Code,
			title: 'Desarrollo de Software',
			items: [
				'Diseño de arquitectura backend',
				'APIs robustas y mantenibles',
				'Aseguramiento de calidad y testing',
				'Versionado y colaboración técnica',
			],
		},
		{
			icon: Kanban,
			title: 'Gestión Técnica',
			items: [
				'Trabajo ágil (Scrum/Kanban)',
				'Levantamiento y refinamiento de requerimientos',
				'Documentación técnica clara',
				'Enfoque en mejora continua',
			],
		},
	];

	const contact = [
		{ label: 'GitHub', handle: '@seba3567', href: 'https://github.com/seba3567' },
		{ label: 'Email', handle: 'seba3567.dev@gmail.com', href: 'mailto:seba3567.dev@gmail.com' },
	];

	const INTRANET = 'https://intranet.seba3567.cl/';

	// ----- Horizontal scroll state -----
	let trackEl: HTMLElement | undefined = $state();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const track = trackEl;
		if (!track) return;

		// Map vertical wheel to horizontal scroll
		const onWheel = (e: WheelEvent) => {
			// If user is on touchpad with explicit horizontal scroll, let it through
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			// Vertical wheel → horizontal
			e.preventDefault();
			const step = e.deltaY === 0 ? e.deltaX : e.deltaY;
			track.scrollBy({ left: step, behavior: 'auto' });
		};
		track.addEventListener('wheel', onWheel, { passive: false });

		// Entrance animations
		animate('.panel-h1', {
			opacity: [0, 1],
			translateY: [60, 0],
			duration: 900,
			ease: 'out(4)',
			delay: 200,
		});
		animate('[data-panel-anim]', {
			opacity: [0, 1],
			translateX: [-30, 0],
			delay: stagger(80, { start: 400 }),
			duration: 700,
			ease: 'out(3)',
		});

		return () => {
			track.removeEventListener('wheel', onWheel);
		};
	});
</script>

<svelte:head>
	<title>seba3567.cl · Sebastián Muñoz</title>
	<meta
		name="description"
		content="Sebastián Muñoz (@seba3567) — Ingeniero en Informática. Backend, datos, mobile, QA. Proyectos, apps y contacto."
	/>
</svelte:head>

<!-- Horizontal scroll track -->
<div id="home-track" bind:this={trackEl} class="home-horizontal relative">
	<!-- Panel 1: Hero -->
	<section
		id="hero"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="flex items-center gap-3" data-panel-anim>
				<Badge
					variant="outline"
					class="border-violet-400/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300"
				>
					<span class="size-1.5 rounded-full bg-violet-300"></span>
					Disponible para colaborar
				</Badge>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-neutral-300"
				>
					<DeviceMobile size={10} weight="duotone" class="mr-1" />
					{profile.location}
				</Badge>
			</div>

			<h1
				class="panel-h1 mt-10 text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				style="opacity: 0;"
			>
				Sebastián<br />
				<span class="text-neutral-600">Muñoz.</span>
			</h1>

			<p
				class="panel-h1 mt-8 max-w-2xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
				style="opacity: 0;"
			>
				{profile.intro}
			</p>

			<div
				class="panel-h1 mt-7 flex flex-wrap items-center gap-2"
				style="opacity: 0;"
			>
				<a
					href="/apps"
					class="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40"
				>
					<Lightning size={16} weight="fill" />
					Ver apps
					<ArrowUpRight
						size={12}
						weight="bold"
						class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					/>
				</a>
				<a
					href="https://github.com/seba3567"
					target="_blank"
					rel="noreferrer noopener"
					class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
				>
					<GithubLogo size={14} weight="bold" />
					GitHub
				</a>
				<a
					href="mailto:seba3567.dev@gmail.com"
					class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
				>
					<EnvelopeSimple size={14} weight="bold" />
					Email
				</a>
			</div>

			<!-- Stats strip -->
			<div class="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
				{#each [{ label: 'Lenguajes', value: '4', icon: Cpu }, { label: 'Repos', value: '90+', icon: Stack }, { label: 'Apps', value: '1', icon: DeviceMobile }, { label: 'Stack', value: '4', icon: Lightning }] as stat (stat.label)}
					{@const Icon = stat.icon}
					<div
						data-panel-anim
						class="glass flex items-center gap-3 rounded-2xl p-4"
					>
						<div
							class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
						>
							<Icon size={16} weight="duotone" class="text-neutral-300" />
						</div>
						<div class="min-w-0">
							<div class="font-mono text-xl font-bold text-neutral-50 sm:text-2xl">
								{stat.value}
							</div>
							<div class="truncate text-[10px] uppercase tracking-wider text-neutral-500">
								{stat.label}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============= PANEL 2: SELECCIÓN ============= -->
	<section
		id="seleccion"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-10 flex items-end justify-between gap-6">
				<div data-panel-anim>
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
					>
						01 — 08
					</Badge>
					<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
						Selección.
					</h2>
				</div>
				<a
					href="/proyectos"
					data-panel-anim
					class="group hidden items-center gap-1.5 font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100 sm:inline-flex"
				>
					Ver todos
					<ArrowUpRight
						size={11}
						weight="bold"
						class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					/>
				</a>
			</div>

			<div class="grid auto-rows-[170px] grid-cols-12 gap-3">
				{#each work as w (w.n)}
					<Card.Root
						data-panel-anim
						data-slot="card"
						class="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border-white/5 bg-white/[0.015] p-0 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04] {w
							.span}"
					>
						<a
							href={w.href}
							target={w.href.startsWith('/') ? undefined : '_blank'}
							rel={w.href.startsWith('/') ? undefined : 'noreferrer noopener'}
							class="flex h-full flex-col justify-between p-5"
						>
							<div class="flex items-start justify-between">
								<span
									class="font-mono text-[11px] text-neutral-600 transition-colors group-hover:text-neutral-400"
									>{w.n}</span
								>
								<ArrowUpRight
									size={14}
									weight="bold"
									class="text-neutral-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
								/>
							</div>
							<div>
								<Card.Title
									class="text-base font-semibold tracking-[-0.02em] text-neutral-100 sm:text-lg md:text-xl"
								>
									{w.title}
								</Card.Title>
								<Card.Description class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
									{w.sub}
								</Card.Description>
								<div class="mt-2.5 flex flex-wrap items-center gap-1">
									{#each w.tags as t (t)}
										<Badge
											variant="outline"
											class="border-white/5 bg-white/[0.02] px-1.5 py-0 text-[9px] font-normal text-neutral-500"
										>
											{t}
										</Badge>
									{/each}
									{#if w.featured}
										<Badge
											variant="outline"
											class="ml-auto border-violet-400/20 bg-violet-500/5 px-1.5 py-0 text-[9px] font-normal text-violet-300"
										>
											<PhoneX size={8} weight="duotone" data-icon="inline-start" />
											App
										</Badge>
									{/if}
								</div>
							</div>
						</a>
					</Card.Root>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============= PANEL 3: STACK ============= -->
	<section
		id="stack"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-10" data-panel-anim>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					Stack
				</Badge>
				<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
					Lo que uso.
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
				{#each stack as s (s.label)}
					<div data-panel-anim>
						<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
							{s.label}
						</p>
						<p
							class="mt-5 text-balance text-2xl leading-tight tracking-[-0.02em] text-neutral-100 sm:text-3xl"
						>
							{s.items}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============= PANEL 4: ESPECIALIDADES ============= -->
	<section
		id="especialidades"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-10" data-panel-anim>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					Especialidades
				</Badge>
				<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
					En qué me especializo.
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each specialties as spec (spec.title)}
					{@const Icon = spec.icon}
					<Card.Root
						data-panel-anim
						data-slot="card"
						class="group flex h-full flex-col gap-4 rounded-2xl border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
					>
						<div
							class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-violet-400/40 group-hover:bg-violet-500/10"
						>
							<Icon
								size={20}
								weight="duotone"
								class="text-neutral-300 transition-colors group-hover:text-violet-300"
							/>
						</div>
						<h3 class="text-base font-semibold text-neutral-50">{spec.title}</h3>
						<ul class="flex flex-col gap-1.5">
							{#each spec.items as item (item)}
								<li class="flex items-start gap-2 text-sm text-neutral-300">
									<span class="mt-1.5 size-1 shrink-0 rounded-full bg-violet-400/60"></span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</Card.Root>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============= PANEL 5: CONTACTO ============= -->
	<section
		id="contacto"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-10" data-panel-anim>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					Contacto
				</Badge>
				<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
					Escríbeme.
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-3">
				{#each contact as c (c.label)}
					<li class="flex list-none bg-neutral-950">
						<a
							href={c.href}
							target={c.href.startsWith('/') || c.href.startsWith('mailto:') ? undefined : '_blank'}
							rel={c.href.startsWith('/') || c.href.startsWith('mailto:') ? undefined : 'noreferrer noopener'}
							class="group flex w-full items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]"
						>
							<div>
								<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
									{c.label}
								</p>
								<p class="mt-2 text-base text-neutral-100 sm:text-lg">{c.handle}</p>
							</div>
							{#if c.label === 'GitHub'}
								<GithubLogo
									size={18}
									weight="bold"
									class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
								/>
							{:else}
								<EnvelopeSimple
									size={18}
									weight="bold"
									class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
								/>
							{/if}
						</a>
					</li>
				{/each}
				<li class="flex list-none bg-neutral-950">
					<a
						href={INTRANET}
						target="_blank"
						rel="noreferrer noopener"
						class="group flex w-full items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]"
					>
						<div>
							<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
								Intranet
							</p>
							<p class="mt-2 text-base text-neutral-100 sm:text-lg">intranet.seba3567.cl</p>
						</div>
						<ArrowUpRight
							size={18}
							weight="bold"
							class="text-violet-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</a>
				</li>
			</div>

			<p class="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
				© {new Date().getFullYear()} · seba3567.cl
			</p>
		</div>
	</section>
</div>

<!-- Slide indicator removed: clean horizontal scroll without UI overlay. -->

<style>
	/* Horizontal scroll track for the home page */
	:global(.home-horizontal) {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		height: 100vh;
		scroll-padding: 0;
	}
	:global(.home-horizontal::-webkit-scrollbar) {
		display: none;
	}
	:global(.home-horizontal .panel) {
		flex: 0 0 100vw;
		min-width: 100vw;
		height: 100vh;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>
