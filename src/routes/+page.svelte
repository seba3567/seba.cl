<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		GithubLogo,
		EnvelopeSimple,
		ArrowUpRight,
		PhoneX,
		Rocket,
		Stack,
		Cpu,
		DeviceMobile,
		Code,
		Database,
		Kanban,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import ChileFlag from '$lib/components/ChileFlag.svelte';
	import ContactDialog from '$lib/components/ContactDialog.svelte';
	import { animate, stagger } from 'animejs';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Contact dialog state. Email entry uses this instead of a
	// `mailto:` link, so the real address never ships to the client.
	let contactOpen = $state(false);

	const AVATAR_URL = 'https://avatars.githubusercontent.com/u/44386561?v=4';

	const profile = {
		name: 'Sebastián Muñoz',
		handle: '@seba3567',
		location: 'Chile',
		tagline: 'Ingeniero de Software y Datos.',
		intro:
			'Backend, datos, mobile, QA. Combino análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
	};

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
		// Email: la dirección real vive solo en el backend (CONTACT_TO).
		// El handle visible es genérico a propósito para no exponer
		// la casilla al bundle del cliente.
		{ label: 'Email', handle: 'Formulario seguro', href: '' },
	];

	// ----- Horizontal scroll state -----
	const SECTIONS = [
		{ id: 'hero', label: 'Inicio' },
		{ id: 'seleccion', label: 'Selección' },
		{ id: 'stack', label: 'Stack' },
		{ id: 'especialidades', label: 'Especialidades' },
		{ id: 'contacto', label: 'Contacto' },
	] as const;

	type SectionId = (typeof SECTIONS)[number]['id'];
	let trackEl: HTMLElement | undefined = $state();
	let activeSection: string = $state('hero');
	let mounted = $state(false);

	function scrollToSection(id: string) {
		const track = trackEl;
		if (!track) return;
		const el = document.getElementById(id);
		if (!el) return;
		track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: 'smooth' });
	}

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

		// Track active section via IntersectionObserver
		const obs = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
						activeSection = (entry.target as HTMLElement).id;
					}
				}
			},
			{ root: track, threshold: [0.5, 0.75] },
		);
		for (const s of SECTIONS) {
			const el = document.getElementById(s.id);
			if (el) obs.observe(el);
		}

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

		// Char-by-char reveal on the hero name (first text node only)
		const heroH1 = document.querySelector<HTMLElement>('#hero .panel-h1');
		if (heroH1) {
			// Walk only the first text node "Sebastián" — keep <br> and <span> intact
			const walker = document.createTreeWalker(heroH1, NodeFilter.SHOW_TEXT);
			const textNode = walker.nextNode() as Text | null;
			if (textNode && textNode.textContent) {
				const raw = textNode.textContent;
				const frag = document.createDocumentFragment();
				for (const ch of raw) {
					if (ch === ' ') {
						frag.appendChild(document.createTextNode(' '));
					} else {
						const span = document.createElement('span');
						span.textContent = ch;
						span.style.display = 'inline-block';
						span.style.opacity = '0';
						span.style.transform = 'translateY(40px)';
						span.style.willChange = 'transform, opacity';
						frag.appendChild(span);
					}
				}
				textNode.replaceWith(frag);
				const chars = heroH1.querySelectorAll<HTMLElement>('span');
				if (chars.length) {
					animate(chars, {
						opacity: [0, 1],
						translateY: [40, 0],
						delay: stagger(28, { start: 350 }),
						duration: 700,
						ease: 'out(4)',
					});
				}
			}
		}

		// Count-up on stat cards (intersection-triggered)
		const statCards = document.querySelectorAll<HTMLElement>('[data-stat-card]');
		const statObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const card = entry.target as HTMLElement;
					const counter = card.querySelector<HTMLElement>('[data-counter]');
					if (!counter) continue;
					const finalRaw = counter.dataset.final ?? '0';
					const isNumeric = /^\d+$/.test(finalRaw);
					if (!isNumeric) {
						// Non-numeric like "90+" — just snap to final with a tiny scale
						counter.textContent = finalRaw;
						animate(counter, {
							scale: [0.6, 1],
							opacity: [0, 1],
							duration: 600,
							ease: 'out(3)',
						});
					} else {
						const to = Number.parseInt(finalRaw, 10);
						const obj = { v: 0 };
						animate(obj, {
							v: to,
							duration: 1100,
							delay: 200,
							ease: 'out(4)',
							onUpdate: () => {
								counter.textContent = Math.round(obj.v).toString();
							},
							onComplete: () => {
								counter.textContent = String(to);
							},
						});
					}
					// Subtle scale-up on the whole card
					animate(card, {
						scale: [0.96, 1],
						opacity: [0.4, 1],
						duration: 800,
						ease: 'out(3)',
					});
					statObserver.unobserve(card);
				}
			},
			{ threshold: 0.4 },
		);
		statCards.forEach((c) => statObserver.observe(c));

		// Magnetic hover for primary CTAs
		const magneticEls = document.querySelectorAll<HTMLElement>('[data-magnetic]');
		const magneticCleanups: Array<() => void> = [];
		for (const el of magneticEls) {
			const strength = 8;
			const onMove = (e: MouseEvent) => {
				const rect = el.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;
				animate(el, {
					translateX: (x / rect.width) * strength,
					translateY: (y / rect.height) * strength,
					duration: 400,
					ease: 'out(3)',
				});
			};
			const onLeave = () => {
				animate(el, {
					translateX: 0,
					translateY: 0,
					duration: 600,
					ease: 'out(4)',
				});
			};
			el.addEventListener('mousemove', onMove);
			el.addEventListener('mouseleave', onLeave);
			magneticCleanups.push(() => {
				el.removeEventListener('mousemove', onMove);
				el.removeEventListener('mouseleave', onLeave);
			});
		}

		// Pulse on the active slide dot
		const dotObserver = new MutationObserver(() => {
			const activeDot = document.querySelector<HTMLElement>('.bg-mint-300.rounded-full');
			if (activeDot) {
				animate(activeDot, {
					scale: [1, 1.4, 1],
					opacity: [1, 0.6, 1],
					duration: 1200,
					ease: 'inOut(2)',
				});
			}
		});
		const dotContainer = document.querySelector('.fixed.inset-x-0.bottom-6');
		if (dotContainer) dotObserver.observe(dotContainer, { childList: true, subtree: true, attributes: true });

		return () => {
			track.removeEventListener('wheel', onWheel);
			obs.disconnect();
			statObserver.disconnect();
			dotObserver.disconnect();
			magneticCleanups.forEach((fn) => fn());
		};
	});

	function langColor(name: string | null): string {
		if (!name) return '#888';
		const map: Record<string, string> = {
			TypeScript: '#3178c6',
			JavaScript: '#f1e05a',
			Python: '#3572A5',
			Svelte: '#ff3e00',
			Kotlin: '#A97BFF',
			Dart: '#00B4AB',
			Go: '#00ADD8',
			Rust: '#dea584',
			HTML: '#e34c26',
			Java: '#b07219',
		};
		return map[name] ?? '#888';
	}
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
		<div
			class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14"
		>
			<!-- LEFT: name, intro, CTAs -->
			<div>
				<div class="flex flex-wrap items-center gap-2.5" data-panel-anim>
					<!-- Status: rounded rectangle with a live pulse dot -->
					<div
						class="inline-flex items-center gap-2 rounded-full border border-mint-400/25 bg-mint-500/[0.08] py-1 pl-2 pr-3"
					>
						<span class="relative flex size-2">
							<span
								class="absolute inset-0 animate-ping rounded-full bg-mint-400 opacity-60"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-mint-300"></span>
						</span>
						<span
							class="text-[11px] font-medium tracking-tight text-mint-200"
							>Disponible para colaborar</span
						>
					</div>

					<!-- Location: rounded rectangle with the actual Chile flag -->
					<div
						class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1.5 pr-3"
					>
						<ChileFlag size={16} />
						<span class="text-[11px] font-medium tracking-tight text-neutral-200"
							>{profile.location}</span
						>
					</div>
				</div>

				<h1
					class="panel-h1 mt-10 text-[clamp(3.5rem,10vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
					style="opacity: 0;"
				>
					Sebastián<br />
					<span class="text-neutral-600">Muñoz.</span>
				</h1>

				<p
					class="panel-h1 mt-8 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
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
						data-magnetic
						class="group inline-flex items-center gap-2 rounded-lg bg-mint-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-mint-500/30 transition-all duration-300 hover:scale-[1.02] hover:bg-mint-400 hover:shadow-mint-500/50"
					>
						<Rocket
							size={16}
							weight="fill"
							class="transition-transform duration-500 group-hover:-rotate-12 group-hover:translate-y-[-1px]"
						/>
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
						data-magnetic
						class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
					>
						<GithubLogo
							size={16}
							weight="fill"
							class="transition-transform duration-300 group-hover:rotate-[-8deg]"
						/>
						GitHub
					</a>
					<a
						href="mailto:seba3567.dev@gmail.com"
						data-magnetic
						class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
					>
						<EnvelopeSimple
							size={16}
							weight="fill"
							class="transition-transform duration-300 group-hover:-translate-y-0.5"
						/>
						Email
					</a>
				</div>
			</div>

			<!-- RIGHT: stats 2x2 (no clash with the name) -->
			<div class="grid grid-cols-2 gap-3" data-panel-anim>
				{#each [{ label: 'Lenguajes', value: '4', icon: Cpu }, { label: 'Repos', value: '90+', icon: Stack }, { label: 'Apps', value: '1', icon: DeviceMobile }, { label: 'Stack', value: '4', icon: Stack }] as stat (stat.label)}
					{@const Icon = stat.icon}
					<div
						data-stat-card
						class="glass group/stat flex items-center gap-3 rounded-2xl p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06]"
					>
						<div
							class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all duration-500 group-hover/stat:border-mint-400/40 group-hover/stat:bg-mint-500/10"
						>
							<Icon
								size={16}
								weight="duotone"
								class="text-neutral-300 transition-colors group-hover/stat:text-mint-300"
							/>
						</div>
						<div class="min-w-0">
							<div
								data-counter
								data-final={stat.value}
								class="font-mono text-xl font-bold text-neutral-50 sm:text-2xl"
							>
								0
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
						01 — {String(data.repos.length).padStart(2, '0')}
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

			<div class="grid auto-rows-[180px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.repos as r, i (r.id)}
					{@const featured = r.name === 'anticall_chile' || r.topics?.includes('app')}
					<a
						data-panel-anim
						data-grid-item
						href={r.html_url}
						target="_blank"
						rel="noreferrer noopener"
						class="group/repo relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
					>
						<div class="flex items-start justify-between">
							<span
								class="font-mono text-[11px] text-neutral-600 transition-colors group-hover/repo:text-neutral-400"
								>{String(i + 1).padStart(2, '0')}</span
							>
							<ArrowUpRight
								size={14}
								weight="bold"
								class="text-neutral-600 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
							/>
						</div>
						<div>
							<h3
								class="text-base font-semibold tracking-[-0.02em] text-neutral-100 sm:text-lg"
							>
								{r.name}
							</h3>
							{#if r.description}
								<p
									class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500"
								>
									{r.description}
								</p>
							{/if}
							<div class="mt-3 flex flex-wrap items-center gap-1.5">
								{#if r.language}
									<span
										class="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-1.5 py-0.5 text-[10px] font-normal text-neutral-300"
									>
										<span
											class="inline-block size-1.5 rounded-full"
											style="background-color: {langColor(r.language)}"
										></span>
										{r.language}
									</span>
								{/if}
								{#if r.stargazers_count > 0}
									<span
										class="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-500"
									>
										★ {r.stargazers_count}
									</span>
								{/if}
								{#if featured}
									<span
										class="ml-auto inline-flex items-center gap-1 rounded-md border border-mint-400/20 bg-mint-500/5 px-1.5 py-0.5 text-[9px] font-normal text-mint-300"
									>
										<PhoneX size={8} weight="duotone" />
										App
									</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
			{#if data.loadError}
				<p
					class="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-xs text-amber-200/80"
				>
					⚠ GitHub API unavailable ({data.loadError}). Showing fallback list.
				</p>
			{/if}
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
							class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-mint-400/40 group-hover:bg-mint-500/10"
						>
							<Icon
								size={20}
								weight="duotone"
								class="text-neutral-300 transition-colors group-hover:text-mint-300"
							/>
						</div>
						<h3 class="text-base font-semibold text-neutral-50">{spec.title}</h3>
						<ul class="flex flex-col gap-1.5">
							{#each spec.items as item (item)}
								<li class="flex items-start gap-2 text-sm text-neutral-300">
									<span class="mt-1.5 size-1 shrink-0 rounded-full bg-mint-400/60"></span>
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

			<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2">
				{#each contact as c (c.label)}
					<li class="flex list-none bg-neutral-950">
						{#if c.label === 'Email'}
							<!--
								Email: abre el form protegido (no expone mailto).
								La dirección real vive en el backend, no en el bundle.
							-->
							<button
								type="button"
								onclick={() => (contactOpen = true)}
								class="group flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/[0.03]"
							>
								<div>
									<p
										class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
									>
										{c.label}
									</p>
									<p class="mt-2 text-base text-neutral-100 sm:text-lg">
										{c.handle}
									</p>
									<p
										class="mt-1.5 font-mono text-[10px] tracking-wider text-mint-300/80"
									>
										Form protegido · no se publica la dirección
									</p>
								</div>
								<EnvelopeSimple
									size={18}
									weight="bold"
									class="shrink-0 text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint-300"
								/>
							</button>
						{:else}
							<a
								href={c.href}
								target="_blank"
								rel="noreferrer noopener"
								class="group flex w-full items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]"
							>
								<div>
									<p
										class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
									>
										{c.label}
									</p>
									<p class="mt-2 text-base text-neutral-100 sm:text-lg">
										{c.handle}
									</p>
								</div>
								<GithubLogo
									size={18}
									weight="bold"
									class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
								/>
							</a>
						{/if}
					</li>
				{/each}
			</div>

			<p class="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
				© {new Date().getFullYear()} · seba3567.cl
			</p>
		</div>
	</section>
</div>

<!-- Protected contact form (email never ships to the client) -->
<ContactDialog bind:open={contactOpen} />

<!-- Slide indicator: dots at the bottom-center of the viewport (vertical layout,
   not inside the horizontal track). Shows active panel + label. -->
<div class="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
	<GlassCard
		variant="strong"
		class="pointer-events-auto flex items-center gap-1 rounded-md px-2 py-1.5"
	>
		{#each SECTIONS as s (s.id)}
			<button
				type="button"
				onclick={() => scrollToSection(s.id)}
				aria-label={'Ir a ' + s.label}
				title={s.label}
				class="group/dot flex items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-white/5"
			>
				<span
					class="size-1.5 rounded-full transition-all duration-500 {s.id === activeSection
						? 'w-5 bg-mint-300'
						: 'bg-neutral-600 group-hover/dot:bg-neutral-400'}"
				></span>
				<span
					class="hidden font-mono text-[10px] uppercase tracking-wider text-neutral-400 transition-opacity duration-300 sm:inline {s.id ===
					activeSection
						? 'opacity-100'
						: 'opacity-0'}"
				>
					{s.label}
				</span>
			</button>
		{/each}
	</GlassCard>
</div>

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
