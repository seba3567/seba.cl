<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PhoneX,
		ArrowUpRight,
		Flask,
		Star,
		Lock,
		Sparkle,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
	import { revealOnScroll, revealChars } from '$lib/animations';

	const BETA_PROGRAM =
		'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
	const PLAY_STORE =
		'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
	const PRIVACY = 'https://seba3567.github.io/anticall_pages/';
	const APP_DETAIL = '/apps/anticall';
	const CONTACT_EMAIL = 'seba3567.dev@gmail.com';

	let titleEl: HTMLElement | undefined = $state();
	let listEl: HTMLElement | undefined = $state();
	let ctaEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (titleEl) {
			revealChars(titleEl, { staggerMs: 32, offsetY: 60, duration: 700, delay: 200 });
		}
		for (const sec of [listEl, ctaEl]) {
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
		content="Aplicaciones publicadas de Sebastián Muñoz · AntiCallCL (Android, beta abierta)."
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
			<a
				href="/proyectos"
				class="underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-neutral-100 hover:decoration-neutral-400">catálogo de GitHub</a
			>.
		</p>
	</header>

	<!-- ============= APPS LIST ============= -->
	<section bind:this={listEl} class="scroll-mt-24 py-8">
		<Separator class="mb-12 bg-white/5" />

		<div class="mb-12 flex items-end justify-between gap-6" data-reveal>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					01 — 01
				</Badge>
				<h2 class="mt-4 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					Published.
				</h2>
			</div>
			<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
				1 app · más en desarrollo
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4">
			<Card.Root
				data-reveal
				data-slot="card"
				class="group relative overflow-hidden rounded-2xl border-white/5 bg-white/[0.015] p-0 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
			>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-amber-500/5 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
				></div>

				<div class="relative grid grid-cols-12 items-center gap-6 p-6 sm:p-8">
					<!-- Icon -->
					<div class="col-span-12 sm:col-span-3 lg:col-span-2">
						<div class="flex items-center gap-4">
							<div
								class="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 ring-1 ring-violet-400/30"
							>
								<PhoneX size={28} weight="duotone" class="text-neutral-950" />
							</div>
							<div class="block sm:hidden">
								<Badge
									variant="outline"
									class="border-amber-400/20 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
								>
									Beta abierta
								</Badge>
							</div>
						</div>
					</div>

					<!-- Identity -->
					<div class="col-span-12 sm:col-span-9 lg:col-span-7">
						<div class="hidden items-center gap-2 sm:flex">
							<Badge
								variant="outline"
								class="border-amber-400/20 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-amber-300"
							>
								Beta abierta
							</Badge>
							<Badge
								variant="outline"
								class="border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-neutral-400"
							>
								Android 8+
							</Badge>
							<Badge
								variant="outline"
								class="border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-neutral-400"
							>
								Flutter · Kotlin
							</Badge>
						</div>

						<h3 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl">
							AntiCallCL.
						</h3>
						<p class="mt-2 max-w-xl text-balance text-sm text-neutral-400 sm:text-base">
							Gestor local de llamadas no deseadas. Filtra por prefijo, base curada chilena
							y la decisión queda en tu teléfono — sin nube, sin cuentas.
						</p>

						<div
							class="mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500 sm:flex"
						>
							<span>com.seba3567.anticall_chile</span>
							<span class="text-neutral-700">·</span>
							<span class="text-emerald-300">100% local</span>
						</div>
					</div>

					<!-- CTAs -->
					<div class="col-span-12 flex flex-wrap items-center gap-2 lg:col-span-3 lg:flex-col lg:items-stretch">
						<a
							href={APP_DETAIL}
							class="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40 lg:flex-none"
						>
							Ver app
							<ArrowUpRight
								size={12}
								weight="bold"
								class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
							/>
						</a>
						<a
							href={BETA_PROGRAM}
							target="_blank"
							rel="noreferrer noopener"
							class="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-400/20 bg-amber-500/5 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-500/15 lg:flex-none"
						>
							<Flask size={13} weight="fill" />
							Beta
						</a>
						<a
							href={PRIVACY}
							target="_blank"
							rel="noreferrer noopener"
							class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-neutral-300 transition-all hover:border-white/20 hover:bg-white/[0.08] lg:w-full"
						>
							<Lock size={12} weight="bold" />
							Privacidad
						</a>
					</div>
				</div>

				<!-- Mini gallery strip linking to detail page -->
				<div class="grid grid-cols-6 gap-1.5 border-t border-white/5 bg-neutral-950/30 p-3 sm:gap-2 sm:p-4">
					{#each [1, 2, 3, 4, 5, 6] as n (n)}
						<a
							href={APP_DETAIL}
							class="group/shot relative block aspect-[9/16] overflow-hidden rounded-lg border border-white/5 transition-all duration-500 hover:border-white/30"
						>
							<OptimizedPicture
								src="/apps/anticall/{n}"
								alt="AntiCallCL preview {n}"
								class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.04]"
								width={540}
								height={1200}
							/>
						</a>
					{/each}
				</div>
			</Card.Root>
		</div>
	</section>

	<!-- ============= CTA ============= -->
	<section bind:this={ctaEl} class="py-16 sm:py-20">
		<Separator class="mb-12 bg-white/5" />

		<div
			class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
			data-reveal
		>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-to-br from-violet-500/15 to-transparent blur-3xl"
			></div>
			<div class="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
				<div
					class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
				>
					<Star size={20} weight="duotone" class="text-amber-300" />
				</div>
				<div class="flex-1">
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						Más en camino
					</p>
					<h3 class="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
						¿Una app propia? Colaboremos.
					</h3>
					<p class="mt-2 text-sm text-neutral-400 sm:text-base">
						Si tenés una idea que necesita salir del repositorio y llegar a un APK, hablemos.
					</p>
				</div>
				<a
					href={`mailto:${CONTACT_EMAIL}`}
					class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all hover:border-white/20 hover:bg-white/[0.08]"
				>
					<Sparkle size={13} weight="duotone" class="text-violet-300" />
					Hablemos
					<ArrowUpRight
						size={12}
						weight="bold"
						class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					/>
				</a>
			</div>
		</div>
	</section>

	<footer class="border-t border-white/5 py-12">
		<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} · /apps · /proyectos · seba3567.cl
		</p>
	</footer>

	<SiteFooter />
</main>
