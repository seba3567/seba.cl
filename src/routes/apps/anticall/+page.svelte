<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PhoneX,
		ArrowUpRight,
		Flask,
		ShieldCheck,
		Database,
		Code,
		Users,
		DeviceMobile,
		Lock,
		Eye,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import PrivacyDialog from '$lib/components/PrivacyDialog.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { revealOnScroll, revealChars } from '$lib/animations';

	const PLAY_STORE =
		'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const BETA_PROGRAM =
		'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
	const PRIVACY =
		'https://seba3567.github.io/anticall_pages/';
	const CONTACT_EMAIL = 'seba3567.dev@gmail.com';

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

	let titleEl: HTMLElement | undefined = $state();
	let featuredEl: HTMLElement | undefined = $state();
	let aboutEl: HTMLElement | undefined = $state();
	let galleryEl: HTMLElement | undefined = $state();
	let stackEl: HTMLElement | undefined = $state();
	let privacyEl: HTMLElement | undefined = $state();
	let betaEl: HTMLElement | undefined = $state();

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	let privacyOpen = $state(false);

	function openLightbox(i: number) {
		lightboxIndex = i;
		lightboxOpen = true;
	}

	onMount(() => {
		if (titleEl) {
			revealChars(titleEl, { staggerMs: 32, offsetY: 60, duration: 700, delay: 200 });
		}
		for (const sec of [featuredEl, aboutEl, galleryEl, stackEl, privacyEl, betaEl]) {
			if (sec) {
				revealOnScroll(sec, { selector: '[data-reveal]', staggerMs: 70, offsetY: 24, duration: 700 });
			}
		}
		// Listen for cross-page privacy requests (e.g. from CommandPalette)
		const onPrivacy = () => (privacyOpen = true);
		window.addEventListener('seba:privacy', onPrivacy as EventListener);
		return () => window.removeEventListener('seba:privacy', onPrivacy as EventListener);
	});
</script>

<svelte:head>
	<title>AntiCallCL · seba3567.cl</title>
	<meta
		name="description"
		content="AntiCallCL — gestor local de llamadas no deseadas para Android (Flutter + Kotlin). Filtra por prefijo, sin nube, sin cuentas. Beta abierta."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<!-- ============= HERO ============= -->
	<header class="pt-20 pb-16 sm:pt-28 sm:pb-20">
		<div class="flex items-center gap-2 font-mono text-xs text-neutral-500">
			<a href="/apps" class="transition-colors hover:text-neutral-300">/ apps</a>
			<span class="text-neutral-700">/</span>
			<span class="text-neutral-300">anticall</span>
		</div>

		<div class="mt-10 grid grid-cols-12 items-end gap-6">
			<div class="col-span-12 lg:col-span-9">
				<div class="flex items-center gap-4">
					<div
						class="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 ring-1 ring-violet-400/30"
					>
						<PhoneX size={26} weight="duotone" class="text-neutral-950" />
					</div>
					<Badge
						variant="outline"
						class="border-amber-400/20 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
					>
						<span class="relative flex size-1.5">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
							></span>
							<span class="relative inline-flex size-1.5 rounded-full bg-amber-400"></span>
						</span>
						Beta abierta
					</Badge>
				</div>

				<h1
					bind:this={titleEl}
					class="mt-8 text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					AntiCallCL<span class="text-neutral-600">.</span>
				</h1>

				<p class="mt-6 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl">
					Gestor de llamadas no deseadas para Android. Trabaja entera en tu teléfono, sin
					servidores ni cuentas. Tú decides qué hacer con cada llamada.
				</p>

				<div class="mt-7 flex flex-wrap items-center gap-2">
					<a
						href={BETA_PROGRAM}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40"
					>
						<Flask size={14} weight="fill" />
						Unirme a la beta
						<ArrowUpRight
							size={11}
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

			<div class="col-span-12 lg:col-span-3" data-reveal>
				<dl class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">UI</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-neutral-100">Flutter</dd>
					</div>
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Nativo</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-neutral-100">Kotlin</dd>
					</div>
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Plataforma</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-neutral-100">Android 8+</dd>
					</div>
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Procesamiento</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-emerald-300">100% local</dd>
					</div>
				</dl>
			</div>
		</div>
	</header>

	<!-- ============= FEATURED SCREENSHOT ============= -->
	<section bind:this={featuredEl} class="scroll-mt-24 py-8 sm:py-12">
		<Separator class="mb-12 bg-white/5" />

		<button
			type="button"
			onclick={() => openLightbox(featuredShot - 1)}
			data-reveal
			class="group relative mx-auto block max-w-md cursor-zoom-in"
			aria-label="Abrir pantalla {featuredShot} en el visor"
		>
			<div
				aria-hidden="true"
				class="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/5 to-amber-500/5 opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
			></div>
			<div
				class="relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:scale-[1.01]"
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
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 h-1.5 w-20 rounded-full bg-white/20 blur-md"
			></div>
			<span
				class="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] text-neutral-300 backdrop-blur transition-colors group-hover:bg-white/10"
			>
				Click para ampliar
			</span>
		</button>
	</section>

	<!-- ============= ABOUT (Spanish) ============= -->
	<section bind:this={aboutEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-12" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				About
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				Qué es AntiCallCL.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
			<div class="space-y-5 text-pretty text-base leading-relaxed text-neutral-300 lg:col-span-7">
				{#each aboutParagraphs as p, i (i)}
					<p data-reveal class="text-balance">
						{p}
					</p>
				{/each}
			</div>

			<aside class="space-y-3 lg:col-span-5" data-reveal>
				{#each features as f, i (f.title)}
					{@const Icon = f.icon}
					<Card.Root
						data-slot="card"
						class="group flex items-start gap-4 rounded-2xl border-white/5 bg-white/[0.015] p-4 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]"
					>
						<div class="flex shrink-0 items-center gap-3">
							<span
								class="font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400"
								>0{i + 1}</span
							>
							<div
								class="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-violet-400/40 group-hover:bg-violet-500/10"
							>
								<Icon
									size={16}
									weight="duotone"
									class="text-neutral-300 transition-colors group-hover:text-violet-300"
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
	</section>

	<!-- ============= GALLERY ============= -->
	<section bind:this={galleryEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-10 flex items-end justify-between gap-6" data-reveal>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					Gallery
				</Badge>
				<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					Screenshots.
				</h2>
				<p class="mt-2 text-sm text-neutral-500">
					Click en cualquier imagen para abrir el visor.
				</p>
			</div>
			<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
				AVIF · WebP · JPG · 1x & 2x
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{#each screenshots as n, i (n)}
				<button
					type="button"
					onclick={() => openLightbox(i)}
					data-reveal
					aria-label="Abrir pantalla {n} en el visor"
					class="group/shot relative block aspect-[9/16] cursor-zoom-in overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04]"
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
	</section>

	<!-- ============= STACK ============= -->
	<section bind:this={stackEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-10" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Stack
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				Cómo está hecho.
			</h2>
			<p class="mt-2 max-w-2xl text-sm text-neutral-500">
				La app corre 100% en el teléfono. Sin backend, sin servidores, sin cuentas.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2">
			{#each stackLayers as s (s.layer)}
				<div
					data-reveal
					class="group flex items-start justify-between gap-4 bg-neutral-950 p-6 transition-colors hover:bg-white/[0.02]"
				>
					<div class="min-w-0">
						<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
							{s.layer}
						</p>
						<p class="mt-3 text-xl text-neutral-100 sm:text-2xl">{s.tech}</p>
						<p class="mt-2 text-sm leading-relaxed text-neutral-400">
							{s.detail}
						</p>
					</div>
					<DeviceMobile
						size={18}
						weight="duotone"
						class="mt-1 shrink-0 text-neutral-600 transition-colors group-hover:text-violet-300"
					/>
				</div>
			{/each}
		</div>
	</section>

	<!-- ============= PRIVACY ============= -->
	<section bind:this={privacyEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-10" data-reveal>
			<Badge
				variant="outline"
				class="border-emerald-400/20 bg-emerald-500/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300"
			>
				Privacidad
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				Sin nube, sin cuentas.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2">
			{#each privacyPoints as p, i (i)}
				<div
					data-reveal
					class="flex items-start gap-3 bg-neutral-950 p-5"
				>
					<span
						class="font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400"
						>0{i + 1}</span
					>
					<p class="text-sm leading-relaxed text-neutral-300">{p}</p>
				</div>
			{/each}
		</div>

		<a
			href={PRIVACY}
			target="_blank"
			rel="noreferrer noopener"
			class="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:text-neutral-100"
		>
			<Lock size={11} weight="bold" />
			Leer la política de privacidad completa
			<ArrowUpRight
				size={10}
				weight="bold"
				class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
			/>
		</a>
	</section>

	<!-- ============= JOIN BETA ============= -->
	<section bind:this={betaEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div
			class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
			data-reveal
		>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
			></div>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-gradient-to-tr from-amber-500/15 via-violet-500/5 to-transparent blur-3xl"
			></div>

			<div class="relative grid grid-cols-12 gap-6 p-8 sm:p-12 lg:gap-10">
				<div class="col-span-12 lg:col-span-8">
					<Badge
						variant="outline"
						class="border-amber-400/30 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
					>
						<span class="relative flex size-1.5">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
							></span>
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
								data-reveal
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
							class="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/40"
						>
							<Flask size={15} weight="fill" />
							Unirme a la beta — Google Play
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

				<div class="col-span-12 lg:col-span-4">
					<div
						class="relative h-full overflow-hidden rounded-2xl border border-white/5 bg-neutral-950 p-6"
					>
						<div
							aria-hidden="true"
							class="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-gradient-to-br from-violet-500/15 to-transparent blur-2xl"
						></div>
						<div class="relative space-y-4">
							<div class="flex items-center gap-2">
								<Code size={14} weight="duotone" class="text-violet-300" />
								<p
									class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
								>
									Contacto
								</p>
							</div>
							<p class="text-sm text-neutral-300">
								¿Dudas, sugerencias o quieres reportar un número?
							</p>
							<a
								href={`mailto:${CONTACT_EMAIL}`}
								class="group inline-flex items-center gap-1.5 break-all font-mono text-xs text-neutral-200 transition-colors hover:text-violet-300"
							>
								{CONTACT_EMAIL}
								<ArrowUpRight
									size={10}
									weight="bold"
									class="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<footer class="border-t border-white/5 py-12">
		<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} · AntiCallCL · Flutter + Kotlin · seba3567.cl
		</p>
	</footer>

	<SiteFooter />
</main>

<Lightbox
	bind:open={lightboxOpen}
	bind:index={lightboxIndex}
	images={galleryItems}
	onClose={() => (lightboxOpen = false)}
/>

<PrivacyDialog bind:open={privacyOpen} onOpenChange={(v) => (privacyOpen = v)} />
	onClose={() => (lightboxOpen = false)}
/>
