<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PhoneX,
		ArrowUpRight,
		GithubLogo,
		Sparkle,
		Flask,
		ShieldCheck,
		Database,
		Code,
		Users,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import { revealOnScroll, revealChars } from '$lib/animations';

	const PLAY_STORE =
		'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const BETA_PROGRAM =
		'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
	const GITHUB_LANDING = 'https://github.com/seba3567/anticall_pages';
	const GITHUB_TELEFONIA = 'https://github.com/seba3567/telefonia_ido';

	const screenshots = [1, 2, 3, 4, 5, 6];
	const featuredShot = 1;

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
			icon: Database,
			title: 'Base curada CL',
			body: 'Lista comunitaria de números reportados + prefijos chilenos verificados.',
		},
		{
			icon: Code,
			title: 'Open source',
			body: 'Repos públicos: `anticall_pages` (landing) + `telefonia_ido` (backend).',
		},
		{
			icon: Users,
			title: 'Tú decides',
			body: 'No bloquea solo. Te entrega la información y la decisión queda en tu lado.',
		},
	];

	const betaPerks = [
		'Acceso anticipado a nuevas versiones antes del release público',
		'Canal directo de feedback con el equipo de desarrollo',
		'Lista de prefijos actualizada en tiempo real',
		'Tu opinión pesa en el roadmap de la app',
	];

	let titleEl: HTMLElement | undefined = $state();
	let featuredEl: HTMLElement | undefined = $state();
	let aboutEl: HTMLElement | undefined = $state();
	let galleryEl: HTMLElement | undefined = $state();
	let betaEl: HTMLElement | undefined = $state();
	let stackEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (titleEl) {
			revealChars(titleEl, { staggerMs: 32, offsetY: 60, duration: 700, delay: 200 });
		}
		for (const sec of [featuredEl, aboutEl, galleryEl, betaEl, stackEl]) {
			if (sec) {
				revealOnScroll(sec, { selector: '[data-reveal]', staggerMs: 70, offsetY: 24, duration: 700 });
			}
		}
	});
</script>

<svelte:head>
	<title>Apps · seba3567.cl</title>
	<meta
		name="description"
		content="Aplicaciones publicadas de Sebastián Muñoz · AntiCallCL (Android, beta abierta) y más."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<!-- ============= HERO ============= -->
	<header class="pt-24 pb-16 sm:pt-32 sm:pb-24">
		<p class="font-mono text-xs text-neutral-500">/ apps · published software</p>
		<h1
			bind:this={titleEl}
			class="mt-8 text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
		>
			Apps<span class="text-neutral-600">.</span>
		</h1>
		<p class="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl">
			Software que se descarga, se abre y se usa. Cosas distintas del
			<a href="/proyectos" class="underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-neutral-100 hover:decoration-neutral-400">catálogo de GitHub</a>.
		</p>
	</header>

	<!-- ============= FEATURED: AntiCallCL ============= -->
	<section bind:this={featuredEl} class="scroll-mt-24 py-12 sm:py-16">
		<Separator class="mb-12 bg-white/5" />

		<div class="grid grid-cols-12 items-start gap-8 lg:gap-10" data-reveal>
			<!-- LEFT: app identity -->
			<div class="col-span-12 lg:col-span-5 lg:sticky lg:top-28">
				<div class="flex items-center gap-3">
					<div
						class="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 ring-1 ring-violet-400/30"
					>
						<PhoneX size={22} weight="duotone" class="text-neutral-950" />
					</div>
					<div>
						<Badge
							variant="outline"
							class="border-amber-400/20 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
						>
							Beta abierta
						</Badge>
					</div>
				</div>

				<h2 class="mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					AntiCallCL<span class="text-neutral-600">.</span>
				</h2>

				<p class="mt-4 text-balance text-base text-neutral-400 sm:text-lg">
					Gestor de llamadas no deseadas para Android. Filtra por prefijo, identifica spam
					chileno y decide tú qué hacer con cada llamada.
				</p>

				<dl class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Estado</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-amber-300">Beta abierta</dd>
					</div>
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Plataforma</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-neutral-100">Android 8+</dd>
					</div>
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Stack</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-neutral-100">Kotlin · Python</dd>
					</div>
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Privacidad</dt>
						<dd class="mt-2 font-mono text-sm font-semibold text-emerald-300">No tracking</dd>
					</div>
				</dl>

				<div class="mt-6 flex flex-wrap gap-2">
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
					<a
						href={GITHUB_LANDING}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
					>
						<GithubLogo size={14} weight="bold" />
						GitHub
					</a>
				</div>

				<p class="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
					package: <span class="text-neutral-400">com.seba3567.anticall_chile</span>
				</p>
			</div>

			<!-- RIGHT: featured screenshot + secondary -->
			<div class="col-span-12 lg:col-span-7">
				<div class="relative" data-reveal>
					<div
						class="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-amber-500/5 opacity-60 blur-2xl"
					></div>
					<div
						class="relative mx-auto aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60"
					>
						<OptimizedPicture
							src="/apps/anticall/{featuredShot}"
							alt="AntiCallCL — pantalla principal"
							class="size-full object-cover"
							width={540}
							height={1200}
							loading="eager"
						/>
					</div>
					<div
						class="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 h-1.5 w-20 rounded-full bg-white/20 blur-md"
					></div>
				</div>
			</div>
		</div>
	</section>

	<!-- ============= ABOUT (Spanish content) ============= -->
	<section bind:this={aboutEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-10" data-reveal>
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
			</div>
			<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
				AVIF · WebP · JPG · 1x & 2x
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{#each screenshots as n (n)}
				<a
					href={PLAY_STORE}
					target="_blank"
					rel="noreferrer noopener"
					data-reveal
					class="group/shot relative block aspect-[9/16] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04]"
				>
					<OptimizedPicture
						src="/apps/anticall/{n}"
						alt="AntiCallCL screenshot {n}"
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
				</a>
			{/each}
		</div>
	</section>

	<!-- ============= JOIN BETA ============= -->
	<section bind:this={betaEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]" data-reveal>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
			></div>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-gradient-to-tr from-amber-500/15 via-violet-500/5 to-transparent blur-3xl"
			></div>

			<div class="relative grid grid-cols-12 gap-6 p-8 sm:p-12 lg:gap-10">
				<div class="col-span-12 lg:col-span-7">
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
						AntiCallCL está en desarrollo activo. Los testers beta acceden antes, reportan
						prefijos nuevos y moldean el roadmap.
					</p>

					<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
						{#each betaPerks as perk, i (i)}
							<li
								data-reveal
								class="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-neutral-300"
							>
								<Sparkle size={14} weight="duotone" class="mt-0.5 shrink-0 text-amber-300" />
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

				<div class="col-span-12 lg:col-span-5">
					<div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
						<div class="bg-neutral-950 p-5">
							<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
								Testers activos
							</p>
							<p class="mt-2 font-mono text-3xl font-semibold text-neutral-50">120+</p>
						</div>
						<div class="bg-neutral-950 p-5">
							<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
								Prefijos CL
							</p>
							<p class="mt-2 font-mono text-3xl font-semibold text-neutral-50">1.2k</p>
						</div>
						<div class="bg-neutral-950 p-5">
							<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
								Llamadas filtradas
							</p>
							<p class="mt-2 font-mono text-3xl font-semibold text-neutral-50">8.5k</p>
						</div>
						<div class="bg-neutral-950 p-5">
							<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
								Versión
							</p>
							<p class="mt-2 font-mono text-3xl font-semibold text-neutral-50">0.4.2</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ============= STACK & REPOS ============= -->
	<section bind:this={stackEl} class="scroll-mt-24 py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-10" data-reveal>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				Stack & repos
			</Badge>
			<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				Cómo está hecho.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
			<a
				href={GITHUB_LANDING}
				target="_blank"
				rel="noreferrer noopener"
				data-reveal
				class="group/repo flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
			>
				<div>
					<div class="text-base font-semibold text-neutral-100">anticall_pages.</div>
					<div class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
						Landing estática del producto
					</div>
				</div>
				<ArrowUpRight
					size={14}
					weight="bold"
					class="text-neutral-500 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
				/>
			</a>
			<a
				href={GITHUB_TELEFONIA}
				target="_blank"
				rel="noreferrer noopener"
				data-reveal
				class="group/repo flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
			>
				<div>
					<div class="text-base font-semibold text-neutral-100">telefonia_ido.</div>
					<div class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
						Backend Python · prefijos
					</div>
				</div>
				<ArrowUpRight
					size={14}
					weight="bold"
					class="text-neutral-500 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
				/>
			</a>
			<a
				href="https://github.com/seba3567"
				target="_blank"
				rel="noreferrer noopener"
				data-reveal
				class="group/repo flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
			>
				<div>
					<div class="text-base font-semibold text-neutral-100">@seba3567</div>
					<div class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
						Más proyectos en el catálogo
					</div>
				</div>
				<ArrowUpRight
					size={14}
					weight="bold"
					class="text-neutral-500 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
				/>
			</a>
		</div>
	</section>

	<footer class="border-t border-white/5 py-12">
		<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} · /apps · /proyectos · seba3567.cl
		</p>
	</footer>
</main>
