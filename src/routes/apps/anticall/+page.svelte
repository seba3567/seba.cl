<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowUpRight,
		Flask,
		ShieldCheck,
		Database,
		Eye,
		Lock,
		DeviceMobile,
		Code,
		Users,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import PrivacyDialog from '$lib/components/PrivacyDialog.svelte';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import AntiCallLogo from '$lib/components/AntiCallLogo.svelte';
	import { animate, stagger } from 'animejs';
	import { revealOnScroll } from '$lib/animations';

	const PLAY_STORE =
		'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const BETA_PROGRAM =
		'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
	const PRIVACY = 'https://seba3567.github.io/anticall_pages/';

	const screenshots = [1, 2, 3, 4, 5, 6];
	const featuredShot = 1;

	const galleryItems = screenshots.map((n) => ({
		src: `/apps/anticall/${n}`,
		alt: `AntiCallCL · pantalla ${n}`,
		caption: `Pantalla ${n} de ${screenshots.length}`,
	}));

	const aboutParagraphs = [
		'Anticall nació como respuesta al problema creciente de las llamadas no deseadas: empresas y servicios que llaman de forma repetida — a veces varias veces en pocas horas —, sumadas a nuevas formas de estafa y spam telefónico que afectan a miles de personas en Chile cada día.',
		'La aplicación permite filtrar y gestionar llamadas por prefijo, ayudando a identificar rangos de números usados para campañas de marketing o intentos sospechosos. Esto le da al usuario el control sobre su tiempo y su privacidad, reduciendo interrupciones y riesgos.',
		'Anticall no bloquea llamadas automáticamente ni accede a información personal: ofrece herramientas claras y útiles para que cada persona decida cómo manejar las llamadas entrantes.',
	];

	const features = [
		{
			icon: ShieldCheck,
			title: 'Filtrar por prefijo',
			body: 'Rangos de números identificables para marketing, telemarketing o intentos de estafa.',
		},
		{
			icon: Eye,
			title: 'Tú decides',
			body: 'No bloquea en automático. Te entrega la información y la decisión queda en tu lado.',
		},
		{
			icon: Database,
			title: 'Base curada CL',
			body: 'Lista de prefijos chilenos verificables, editables y exportables desde la app.',
		},
		{
			icon: Lock,
			title: '100% local',
			body: 'Sin cuentas, sin servidores, sin nube. Todo se procesa y guarda en tu teléfono.',
		},
	];

	const stackLayers = [
		{
			layer: 'UI',
			tech: 'Flutter',
			detail: 'Interfaz cross-platform, theming, navegación, formularios y estados.',
		},
		{
			layer: 'Nativo Android',
			tech: 'Kotlin',
			detail: 'CallScreeningService, contactos, permisos sensibles y persistencia local.',
		},
	];

	const privacyPoints = [
		'Tus listas y métricas viven solo en tu dispositivo',
		'La app opera sin registro, sin cuentas, sin nube',
		'Puedes borrar todo desde los ajustes en cualquier momento',
		'Al desinstalar se eliminan automáticamente todos los datos',
	];

	const betaPerks = [
		'Acceso anticipado antes del release público',
		'Canal directo con el equipo de desarrollo',
		'Ayuda a moldear el roadmap con tu feedback',
		'Prefijos actualizados con cada build',
	];

	// ----- Horizontal scroll state -----
	const SECTIONS = [
		{ id: 'hero', label: 'Inicio' },
		{ id: 'screenshot', label: 'Pantalla' },
		{ id: 'about', label: 'About' },
		{ id: 'gallery', label: 'Gallery' },
		{ id: 'stack', label: 'Stack' },
		{ id: 'privacy', label: 'Privacidad' },
		{ id: 'beta', label: 'Beta' },
	] as const;

	type SectionId = (typeof SECTIONS)[number]['id'];
	let trackEl: HTMLElement | undefined = $state();
	let activeSection: string = $state('hero');
	let mounted = $state(false);

	let titleEl: HTMLElement | undefined = $state();
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	let privacyOpen = $state(false);

	function scrollToSection(id: string) {
		const track = trackEl;
		if (!track) return;
		const el = document.getElementById(id);
		if (!el) return;
		track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: 'smooth' });
	}

	function openLightbox(i: number) {
		lightboxIndex = i;
		lightboxOpen = true;
	}

	function langColor(name: string | null): string {
		if (!name) return '#888';
		const map: Record<string, string> = {
			Dart: '#00B4AB',
			Kotlin: '#A97BFF',
		};
		return map[name] ?? '#888';
	}

	onMount(() => {
		mounted = true;
		const track = trackEl;
		if (!track) return;

		// Map vertical wheel to horizontal scroll
		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
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
		animate('[data-panel-anim]', {
			opacity: [0, 1],
			translateY: [20, 0],
			delay: stagger(60, { start: 200 }),
			duration: 600,
			ease: 'out(3)',
		});

		// Title: simple fade-in (no char split — those leave the
		// element invisible if the JS races with the initial paint)
		if (titleEl) {
			animate(titleEl, {
				opacity: [0, 1],
				translateY: [30, 0],
				duration: 800,
				delay: 100,
				ease: 'out(4)',
			});
		}

		// Privacy listener
		const onPrivacy = () => (privacyOpen = true);
		window.addEventListener('seba:privacy', onPrivacy as EventListener);

		return () => {
			track.removeEventListener('wheel', onWheel);
			obs.disconnect();
			window.removeEventListener('seba:privacy', onPrivacy as EventListener);
		};
	});
</script>

<svelte:head>
	<title>AntiCallCL · seba3567.cl</title>
	<meta
		name="description"
		content="AntiCallCL — gestor local de llamadas no deseadas para Android (Flutter + Kotlin). Filtra por prefijo, sin nube, sin cuentas. Beta abierta."
	/>
</svelte:head>

<!-- Location chip: centered below the navbar, prominent.
     Stays centered on every screen size (not pushed to a side
     where it gets lost). z-30 so it sits above the panel content
     but below the navbar (z-40). -->
<div
	class="pointer-events-none fixed inset-x-0 top-20 z-30 flex justify-center px-4"
>
	<div
		class="pointer-events-auto flex items-center gap-2 rounded-md border border-white/10 bg-neutral-950/80 px-3.5 py-1.5 font-mono text-[11px] backdrop-blur shadow-lg shadow-black/20"
	>
		<a
			href="/apps"
			class="text-neutral-500 transition-colors hover:text-neutral-200"
		>
			/apps
		</a>
		<span class="text-neutral-700">/</span>
		<span class="text-neutral-200">anticall</span>
	</div>
</div>

<!-- Horizontal scroll track -->
<div id="anticall-track" bind:this={trackEl} class="anticall-horizontal relative">
	<!-- ============= PANEL 1: HERO ============= -->
	<section
		id="hero"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
	>
		<div class="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
			<!-- Left: title + intro + CTAs -->
			<div>
				<div class="flex items-center gap-3" data-panel-anim>
					<Badge
						variant="outline"
						class="border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300"
					>
						<span class="relative flex size-1.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60"></span>
							<span class="relative inline-flex size-1.5 rounded-full bg-amber-300"></span>
						</span>
						Beta abierta
					</Badge>
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-neutral-300"
					>
						<DeviceMobile size={10} weight="duotone" class="mr-1" />
						Android 8+
					</Badge>
				</div>

				<h1
					bind:this={titleEl}
					class="mt-10 text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					AntiCallCL<span class="text-neutral-600">.</span>
				</h1>

				<p
					class="mt-8 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
				>
					Gestor de llamadas no deseadas para Android. Trabaja entera en tu teléfono, sin
					servidores ni cuentas. Tú decides qué hacer con cada llamada.
				</p>

				<div class="mt-7 flex flex-wrap items-center gap-2" data-panel-anim>
					<a
						href={BETA_PROGRAM}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-2 rounded-lg bg-mint-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-mint-500/30 transition-all duration-300 hover:scale-[1.02] hover:bg-mint-400 hover:shadow-mint-500/50"
					>
						<Flask size={16} weight="fill" class="transition-transform duration-500 group-hover:-rotate-12" />
						Unirme a la beta
						<ArrowUpRight
							size={12}
							weight="bold"
							class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</a>
					<a
						href={PLAY_STORE}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
					>
						<svg viewBox="0 0 24 24" class="size-3.5 fill-current" aria-hidden="true">
							<path
								d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333zm2.302-2.302L18.4 13.18l-3.013 1.745zm3.199-3.198-2.807-1.626L13.792 12l3.6 2.079 2.6-1.504a1 1 0 0 0 0-1.726zM5.864 2.658 16.8 9.99l-2.302 2.303z"
							/>
						</svg>
						Play Store
					</a>
					<button
						type="button"
						onclick={() => (privacyOpen = true)}
						class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
					>
						<Lock size={14} weight="bold" />
						Privacidad
					</button>
				</div>
			</div>

			<!-- Right: logo + quick stats -->
			<div class="flex flex-col items-stretch gap-3" data-panel-anim>
				<!-- Big logo card: el escudo manda visualmente -->
				<div
					class="glass flex flex-1 items-center justify-center rounded-2xl p-8"
				>
					<AntiCallLogo
						size={200}
						class="drop-shadow-[0_12px_40px_rgba(16,185,129,0.18)]"
					/>
				</div>

				<!-- Compact 2x2 stat grid below the logo (no overflow) -->
				<div class="grid grid-cols-2 gap-2">
					<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
						<div
							class="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
						>
							<DeviceMobile size={12} weight="duotone" class="text-neutral-300" />
						</div>
						<div class="min-w-0">
							<div class="truncate font-mono text-sm font-bold text-neutral-50">Flutter</div>
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">UI</div>
						</div>
					</div>
					<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
						<div
							class="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
						>
							<Code size={12} weight="duotone" class="text-neutral-300" />
						</div>
						<div class="min-w-0">
							<div class="truncate font-mono text-sm font-bold text-neutral-50">Kotlin</div>
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">Nativo</div>
						</div>
					</div>
					<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
						<div
							class="flex size-7 shrink-0 items-center justify-center rounded-md border border-mint-400/30 bg-mint-500/10"
						>
							<ShieldCheck size={12} weight="duotone" class="text-mint-300" />
						</div>
						<div class="min-w-0">
							<div class="truncate font-mono text-sm font-bold text-mint-300">100%</div>
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">Local</div>
						</div>
					</div>
					<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
						<div
							class="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
						>
							<Database size={12} weight="duotone" class="text-neutral-300" />
						</div>
						<div class="min-w-0">
							<div class="truncate font-mono text-sm font-bold text-neutral-50">0</div>
							<div class="text-[9px] uppercase tracking-wider text-neutral-500">Servidores</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ============= PANEL 2: SCREENSHOT ============= -->
	<section
		id="screenshot"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-8 flex items-end justify-between gap-6" data-panel-anim>
				<div>
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
					>
						01
					</Badge>
					<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
						Pantalla principal.
					</h2>
				</div>
				<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
					Click para ampliar
				</p>
			</div>

			<button
				type="button"
				onclick={() => openLightbox(featuredShot - 1)}
				data-panel-anim
				class="group relative mx-auto block max-w-md cursor-zoom-in"
				aria-label="Abrir pantalla {featuredShot} en el visor"
			>
				<div
					aria-hidden="true"
					class="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-mint-500/15 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
				></div>
				<div
					class="relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:scale-[1.02]"
				>
					<OptimizedPicture
						src="/apps/anticall/{featuredShot}"
						alt="AntiCallCL — pantalla principal"
						class="size-full object-cover"
						width={540}
						height={1200}
						loading="eager"
					/>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"
					></div>
				</div>
				<span
					class="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] text-neutral-300 backdrop-blur transition-colors group-hover:bg-white/10"
				>
					Click para ampliar
				</span>
			</button>
		</div>
	</section>

	<!-- ============= PANEL 3: ABOUT ============= -->
	<section
		id="about"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-10" data-panel-anim>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					02
				</Badge>
				<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					Qué es AntiCallCL.
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
				<div class="space-y-5 text-pretty text-base leading-relaxed text-neutral-300 lg:col-span-7">
					{#each aboutParagraphs as p, i (i)}
						<p data-panel-anim class="text-balance">{p}</p>
					{/each}
				</div>

				<aside class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
					{#each features as f, i (f.title)}
						{@const Icon = f.icon}
						<Card.Root
							data-slot="card"
							data-panel-anim
							class="group flex items-start gap-4 rounded-2xl border-white/5 bg-white/[0.015] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-mint-400/20 hover:bg-white/[0.04]"
						>
							<div class="flex shrink-0 items-center gap-3">
								<span
									class="font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400"
									>0{i + 1}</span
								>
								<div
									class="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-mint-400/40 group-hover:bg-mint-500/10"
								>
									<Icon
										size={16}
										weight="duotone"
										class="text-neutral-300 transition-colors group-hover:text-mint-300"
									/>
								</div>
							</div>
							<div class="min-w-0">
								<Card.Title class="text-sm font-semibold text-neutral-100">
									{f.title}
								</Card.Title>
								<Card.Description class="mt-1 text-xs leading-relaxed text-neutral-400">
									{f.body}
								</Card.Description>
							</div>
						</Card.Root>
					{/each}
				</aside>
			</div>
		</div>
	</section>

	<!-- ============= PANEL 4: GALLERY ============= -->
	<section
		id="gallery"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-8 flex items-end justify-between gap-6" data-panel-anim>
				<div>
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
					>
						03
					</Badge>
					<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
						Screenshots.
					</h2>
					<p class="mt-2 text-sm text-neutral-500">Click en cualquier imagen para abrir el visor.</p>
				</div>
				<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
					AVIF · WebP · JPG
				</p>
			</div>

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
				{#each screenshots as n, i (n)}
					<button
						type="button"
						onclick={() => openLightbox(i)}
						data-panel-anim
						aria-label="Abrir pantalla {n} en el visor"
						class="group/shot relative block aspect-[9/16] cursor-zoom-in overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:-translate-y-0.5 hover:border-mint-400/30 hover:bg-white/[0.04]"
					>
						<OptimizedPicture
							src="/apps/anticall/{n}"
							alt="AntiCallCL · pantalla {n}"
							class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.04]"
							width={540}
							height={1200}
						/>
						<div
							class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 transition-opacity duration-500 group-hover/shot:opacity-100"
						></div>
						<span
							class="absolute right-2 bottom-2 rounded-md border border-white/10 bg-neutral-950/80 px-1.5 py-0.5 font-mono text-[9px] text-neutral-300 backdrop-blur"
						>
							{n}
						</span>
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============= PANEL 5: STACK ============= -->
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
					04
				</Badge>
				<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					Cómo está hecho.
				</h2>
				<p class="mt-2 max-w-2xl text-sm text-neutral-500">
					La app corre 100% en el teléfono. Sin backend, sin servidores, sin cuentas.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2">
				{#each stackLayers as s (s.layer)}
					<div
						data-panel-anim
						class="group flex items-start justify-between gap-4 bg-neutral-950 p-6 transition-colors hover:bg-white/[0.02]"
					>
						<div class="min-w-0">
							<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
								{s.layer}
							</p>
							<p class="mt-3 text-xl text-neutral-100 sm:text-2xl">{s.tech}</p>
							<p class="mt-2 text-sm leading-relaxed text-neutral-400">{s.detail}</p>
						</div>
						<DeviceMobile
							size={18}
							weight="duotone"
							class="mt-1 shrink-0 text-neutral-600 transition-colors group-hover:text-mint-300"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============= PANEL 6: PRIVACY ============= -->
	<section
		id="privacy"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-10" data-panel-anim>
				<Badge
					variant="outline"
					class="border-mint-400/20 bg-mint-500/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mint-300"
				>
					05
				</Badge>
				<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					Sin nube, sin cuentas.
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2">
				{#each privacyPoints as p, i (i)}
					<div
						data-panel-anim
						class="flex items-start gap-3 bg-neutral-950 p-5"
					>
						<span class="font-mono text-[10px] text-neutral-600">0{i + 1}</span>
						<p class="text-sm leading-relaxed text-neutral-300">{p}</p>
					</div>
				{/each}
			</div>

			<div class="mt-6 flex flex-wrap items-center gap-3" data-panel-anim>
				<a
					href={PRIVACY}
					target="_blank"
					rel="noreferrer noopener"
					class="inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:text-neutral-100"
				>
					<Lock size={11} weight="bold" />
					Leer la política completa
					<ArrowUpRight size={10} weight="bold" />
				</a>
				<button
					type="button"
					onclick={() => (privacyOpen = true)}
					class="inline-flex items-center gap-1.5 rounded-md border border-mint-400/20 bg-mint-500/5 px-3 py-1.5 font-mono text-[11px] text-mint-200 transition-colors hover:bg-mint-500/15"
				>
					<ShieldCheck size={11} weight="bold" />
					Ver resumen interactivo
				</button>
			</div>
		</div>
	</section>

	<!-- ============= PANEL 7: BETA ============= -->
	<section
		id="beta"
		class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
	>
		<div
			class="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12"
			data-panel-anim
		>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-gradient-to-br from-mint-500/15 via-mint-500/5 to-transparent blur-3xl"
			></div>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-gradient-to-tr from-mint-500/10 to-transparent blur-3xl"
			></div>

			<div class="relative grid grid-cols-12 gap-6 lg:gap-10">
				<div class="col-span-12 lg:col-span-7">
					<Badge
						variant="outline"
						class="border-amber-400/30 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
					>
						<span class="relative flex size-1.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
							<span class="relative inline-flex size-1.5 rounded-full bg-amber-400"></span>
						</span>
						Beta abierta
					</Badge>

					<h2
						class="mt-6 text-balance text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl"
					>
						Únete al programa beta.
					</h2>
					<p class="mt-4 max-w-xl text-balance text-base text-neutral-400 sm:text-lg">
						Probá las últimas builds antes del release público. Tu feedback ayuda a definir
						el roadmap.
					</p>

					<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
						{#each betaPerks as perk (perk)}
							<li
								data-panel-anim
								class="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-neutral-300"
							>
								<Users size={14} weight="duotone" class="mt-0.5 shrink-0 text-amber-300" />
								<span>{perk}</span>
							</li>
						{/each}
					</ul>

					<div class="mt-7 flex flex-wrap gap-2">
						<a
							href={BETA_PROGRAM}
							target="_blank"
							rel="noreferrer noopener"
							class="group inline-flex items-center gap-2 rounded-lg bg-mint-500 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-mint-500/30 transition-all duration-300 hover:scale-[1.02] hover:bg-mint-400 hover:shadow-mint-500/50"
						>
							<Flask size={15} weight="fill" />
							Unirme a la beta
							<ArrowUpRight
								size={12}
								weight="bold"
								class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
							/>
						</a>
						<a
							href={PLAY_STORE}
							target="_blank"
							rel="noreferrer noopener"
							class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-neutral-200 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
						>
							Ver en Play Store
							<ArrowUpRight
								size={11}
								weight="bold"
								class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- Slide indicator: dots at the bottom-center of the viewport -->
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
	/* Horizontal scroll track for the anticall page */
	:global(.anticall-horizontal) {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	:global(.anticall-horizontal::-webkit-scrollbar) {
		display: none;
	}
	:global(.anticall-horizontal .panel) {
		flex: 0 0 100vw;
		min-width: 100vw;
		height: 100vh;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>

<Lightbox
	bind:open={lightboxOpen}
	bind:index={lightboxIndex}
	images={galleryItems}
	onClose={() => (lightboxOpen = false)}
/>

<PrivacyDialog bind:open={privacyOpen} onOpenChange={(v) => (privacyOpen = v)} />
