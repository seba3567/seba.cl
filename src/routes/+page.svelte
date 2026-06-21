<script lang="ts">
	import { onMount } from 'svelte';
	import {
		GithubLogo,
		LinkedinLogo,
		EnvelopeSimple,
		ArrowUpRight,
		PhoneX,
	} from 'phosphor-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { revealChars, revealOnScroll, countUpOnVisible } from '$lib/animations';

	const AVATAR_URL = 'https://avatars.githubusercontent.com/u/44386561?v=4';

	const profile = {
		name: 'Sebastián Muñoz',
		handle: '@seba3567',
		location: 'Chile',
		tagline: 'Ingeniero en Informática.',
		intro:
			'Backend, datos, mobile, QA. Combino análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
	};

	const work = [
		{
			n: '01',
			title: 'AntiCallCL.',
			sub: 'Android app · Kotlin',
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
		{ label: 'In use', items: 'TypeScript · Django · SQL · Python', value: 4 },
		{
			label: 'In progress',
			items: 'Kotlin · Dart · Go · Ruby',
			value: 4,
		},
		{ label: 'Base', items: 'JavaScript · Lua · REST · Docker', value: 5 },
	];

	const contact = [
		{ label: 'GitHub', handle: '@seba3567', href: 'https://github.com/seba3567' },
		{
			label: 'LinkedIn',
			handle: 'in/seba3567',
			href: 'https://www.linkedin.com/in/seba3567',
		},
		{ label: 'Email', handle: 'seba3567.dev@gmail.com', href: 'mailto:seba3567.dev@gmail.com' },
	];

	function isInternal(href: string): boolean {
		return href.startsWith('/');
	}

	// Refs for animations
	let headerEl: HTMLElement | undefined = $state();
	let heroNameEl: HTMLElement | undefined = $state();
	let heroSubEl: HTMLElement | undefined = $state();
	let workSectionEl: HTMLElement | undefined = $state();
	let stackSectionEl: HTMLElement | undefined = $state();
	let contactSectionEl: HTMLElement | undefined = $state();
	const stackCountRefs: HTMLElement[] = $state([]);

	onMount(() => {
		const cleanups: Array<() => void> = [];

		// Hero name: dramatic char-by-char reveal with scale + bigger offset
		if (heroNameEl) {
			revealChars(heroNameEl, {
				staggerMs: 38,
				offsetY: 80,
				duration: 1100,
				delay: 200,
			});
		}

		// Hero subtitle + tags: fade up, longer duration
		if (heroSubEl) {
			cleanups.push(
				revealOnScroll(heroSubEl, {
					selector: '[data-reveal]',
					staggerMs: 120,
					offsetY: 24,
					duration: 900,
					once: true,
				}),
			);
		}

		// Work grid: more dramatic stagger with scale
		if (workSectionEl) {
			cleanups.push(
				revealOnScroll(workSectionEl, {
					selector: '[data-reveal-tile]',
					staggerMs: 70,
					offsetY: 40,
					duration: 900,
					once: true,
				}),
			);
		}

		// Stack counters
		if (stackSectionEl) {
			cleanups.push(
				revealOnScroll(stackSectionEl, {
					selector: '[data-reveal-block]',
					staggerMs: 140,
					offsetY: 32,
					duration: 900,
					once: true,
				}),
			);
			for (const el of stackCountRefs) {
				if (!el) continue;
				const final = Number(el.dataset.count ?? '0');
				countUpOnVisible(el, final, { duration: 1600, delay: 400 });
			}
		}

		// Contact cells
		if (contactSectionEl) {
			cleanups.push(
				revealOnScroll(contactSectionEl, {
					selector: '[data-reveal-cell]',
					staggerMs: 100,
					offsetY: 28,
					duration: 800,
					once: true,
				}),
			);
		}

		return () => {
			for (const c of cleanups) c();
		};
	});
</script>

<svelte:head>
	<title>Sebastián Muñoz. — @seba3567</title>
	<meta
		name="description"
		content="Sebastián Muñoz (@seba3567) — Ingeniero en Informática. Backend, datos, mobile, QA."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10" bind:this={headerEl}>
	<!-- ============= HERO ============= -->
	<header class="pt-24 pb-32 sm:pt-36 sm:pb-44">
		<div class="grid grid-cols-12 items-end gap-6">
			<div class="col-span-12 lg:col-span-9">
				<div class="flex items-center gap-3 font-mono text-xs text-neutral-500" data-reveal>
					<span class="relative flex size-1.5">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
						></span>
						<span class="relative inline-flex size-1.5 rounded-full bg-emerald-400"></span>
					</span>
					<span>{profile.handle} · {profile.location}</span>
				</div>

				<h1
					bind:this={heroNameEl}
					class="mt-10 text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					Sebastián<br />
					<span class="text-neutral-600">Muñoz.</span>
				</h1>

				<div
					bind:this={heroSubEl}
					class="mt-10 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
				>
					<p data-reveal>{profile.intro}</p>
					<div class="mt-6 flex flex-wrap items-center gap-2" data-reveal>
						<a
							href="https://github.com/seba3567"
							target="_blank"
							rel="noreferrer noopener"
							class="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-neutral-200 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
						>
							<GithubLogo size={12} weight="bold" />
							GitHub
							<ArrowUpRight
								size={10}
								weight="bold"
								class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
							/>
						</a>
						<Badge
							variant="outline"
							class="border-emerald-400/20 bg-emerald-500/5 px-2.5 py-0.5 text-[10px] font-normal text-emerald-300"
						>
							Open to collaborate
						</Badge>
					</div>
				</div>
			</div>

			<div
				class="col-span-12 flex items-center gap-5 lg:col-span-3 lg:flex-col lg:items-end"
				data-reveal
			>
				<Avatar.Root
					class="size-24 overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.04] hover:ring-violet-400/40 sm:size-32"
				>
					<Avatar.Image src={AVATAR_URL} alt={profile.name} class="rounded-2xl object-cover" />
					<Avatar.Fallback
						class="flex size-full items-center justify-center rounded-2xl bg-neutral-900 text-xl font-semibold text-neutral-500"
					>
						SM
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col gap-1 lg:items-end">
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Find me</p>
					<p class="font-mono text-xs text-neutral-300">{profile.handle}</p>
				</div>
			</div>
		</div>
	</header>

	<!-- ============= SELECTED WORK ============= -->
	<section id="work" bind:this={workSectionEl} class="scroll-mt-24 py-20 sm:py-28">
		<Separator class="mb-14 bg-white/5" />

		<div class="mb-14 flex items-end justify-between gap-6">
			<div data-reveal>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					01 — 08
				</Badge>
				<h2 class="mt-4 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
					Work.
				</h2>
			</div>
			<a
				href="/proyectos"
				class="group inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100"
				data-reveal
			>
				All projects
				<ArrowUpRight
					size={11}
					weight="bold"
					class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<div class="grid auto-rows-[180px] grid-cols-12 gap-3">
			{#each work as w (w.n)}
				<Card.Root
					data-reveal-tile
					data-slot="card"
					class="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border-white/5 bg-white/[0.015] p-0 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] {w
						.span}"
				>
					<a
						href={w.href}
						target={isInternal(w.href) ? undefined : '_blank'}
						rel={isInternal(w.href) ? undefined : 'noreferrer noopener'}
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
	</section>

	<!-- ============= STACK ============= -->
	<section id="stack" bind:this={stackSectionEl} class="scroll-mt-24 py-20 sm:py-28">
		<Separator class="mb-14 bg-white/5" />

		<div class="mb-14" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Stack
			</Badge>
			<h2 class="mt-4 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				What I use.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
			{#each stack as s, i (s.label)}
				<div data-reveal-block>
					<div class="flex items-baseline gap-3">
						<span
							bind:this={stackCountRefs[i]}
							data-count={i + 1}
							class="font-mono text-3xl font-semibold tracking-tight text-neutral-700"
						>
							0{i + 1}
						</span>
						<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
							{s.label}
						</p>
					</div>
					<p
						class="mt-5 text-balance text-2xl leading-tight tracking-[-0.02em] text-neutral-100 sm:text-3xl"
					>
						{s.items}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ============= CONTACT ============= -->
	<section bind:this={contactSectionEl} class="py-20 sm:py-28">
		<Separator class="mb-14 bg-white/5" />

		<div class="mb-14" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Contact
			</Badge>
			<h2 class="mt-4 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				Say hi.
			</h2>
		</div>

		<ul
			class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-3"
		>
			{#each contact as c (c.label)}
				<li class="bg-neutral-950" data-reveal-cell>
					<a
						href={c.href}
						target={isInternal(c.href) ? undefined : '_blank'}
						rel={isInternal(c.href) ? undefined : 'noreferrer noopener'}
						class="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]"
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
						{:else if c.label === 'LinkedIn'}
							<LinkedinLogo
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
		</ul>

		<p class="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} Sebastián Muñoz · seba3567.cl
		</p>
	</section>
</main>
