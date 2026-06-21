<script lang="ts">
	import {
		ArrowLeft,
		ArrowUpRight,
		BatteryFull,
		Camera,
		ClockClockwise,
		Cpu,
		DeviceMobile,
		DownloadSimple,
		GithubLogo,
		Memory,
		Plus,
		Ruler,
		ShieldCheck,
		Stack,
		WarningCircle,
		WifiHigh,
	} from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { revealChars, revealOnScroll } from '$lib/animations';
	import { Badge } from '$lib/components/ui/badge';
	import type { Device, Release } from '$lib/types/aosp';
	import SoonPlaceholder from './SoonPlaceholder.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const device = $derived(data.device);
	const slug = $derived(data.slug);

	// Releases start empty. They'll be populated by the
	// client-side aosp-client when the user mounts the page
	// (or by a build-time load if we add one later). We use
	// $derived so the template re-runs when data changes.
	const releases = $derived(data.releases);

	const STATUS_TONE: Record<Device['status'], string> = {
		active: 'border-mint-400/30 bg-mint-500/10 text-mint-200',
		beta: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
		paused: 'border-neutral-400/30 bg-neutral-500/10 text-neutral-300',
		abandoned: 'border-rose-400/20 bg-rose-500/[0.06] text-rose-300/80',
		eol: 'border-neutral-400/20 bg-neutral-500/[0.06] text-neutral-500',
	};
	const STATUS_DOT: Record<Device['status'], string> = {
		active: 'bg-mint-400',
		beta: 'bg-amber-400',
		paused: 'bg-neutral-400',
		abandoned: 'bg-rose-400/60',
		eol: 'bg-neutral-600',
	};

	// Spec icon + label mapping. Anything not in this map gets
	// a generic "more" icon. The order here is the order
	// rendered in the specs table.
	const SPEC_META: Record<string, { icon: typeof Cpu; key: string }> = {
		display: { icon: DeviceMobile, key: 'aosp.detail.specs.display' },
		processor: { icon: Cpu, key: 'aosp.detail.specs.processor' },
		ram: { icon: Memory, key: 'aosp.detail.specs.ram' },
		storage: { icon: Memory, key: 'aosp.detail.specs.storage' },
		rearCamera: { icon: Camera, key: 'aosp.detail.specs.rearCamera' },
		frontCamera: { icon: Camera, key: 'aosp.detail.specs.frontCamera' },
		battery: { icon: BatteryFull, key: 'aosp.detail.specs.battery' },
		os: { icon: DeviceMobile, key: 'aosp.detail.specs.os' },
		dimensions: { icon: Ruler, key: 'aosp.detail.specs.dimensions' },
		weight: { icon: Ruler, key: 'aosp.detail.specs.weight' },
		connectivity: { icon: WifiHigh, key: 'aosp.detail.specs.connectivity' },
		waterResistance: {
			icon: ShieldCheck,
			key: 'aosp.detail.specs.waterResistance',
		},
		screenProtection: {
			icon: ShieldCheck,
			key: 'aosp.detail.specs.screenProtection',
		},
		extras: { icon: Plus, key: 'aosp.detail.specs.extras' },
	};

	const visibleSpecs = $derived(
		Object.entries(device.specs).filter(([_, v]) => v != null && v !== ''),
	);

	const pageTitle = $derived(
		`${device.name} · AOSP · seba3567.cl`,
	);
	const pageDescription = $derived(
		`${device.name} (${device.codename ?? device.slug}) — AOSP custom builds, kernels, specs and changelogs.`,
	);

	let heroH1: HTMLElement | undefined = $state();

	onMount(() => {
		// Hero reveal.
		if (heroH1) {
			revealChars(heroH1, {
				staggerMs: 24,
				offsetY: 50,
				duration: 800,
				delay: 80,
			});
		}
		revealOnScroll(document.body, {
			selector: '[data-detail-reveal]',
			staggerMs: 50,
			offsetY: 24,
			duration: 700,
		});
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-16 pb-16 sm:px-10 sm:pt-24">
	<!-- ============ BACK LINK ============ -->
	<div class="mb-6">
		<a
			href="/aosp"
			class="group/back inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:bg-white/[0.03] hover:text-neutral-200"
		>
			<ArrowLeft
				size={11}
				weight="bold"
				class="transition-transform group-hover/back:-translate-x-0.5"
			/>
			{$t('aosp.detail.backToList')}
		</a>
	</div>

	<!-- ============ HERO ============ -->
	<header class="pb-8 sm:pb-12">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
			<!--
			  Image / brand block. Falls back to a big icon
			  tile when the device has no image in the YAML.
			-->
			<div
				class="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01]"
			>
				{#if device.image}
					<img
						src={device.image}
						alt={device.name}
						loading="eager"
						referrerpolicy="no-referrer"
						class="size-full object-cover"
					/>
				{:else}
					<div
						class="flex size-full items-center justify-center text-neutral-600"
					>
						<DeviceMobile size={80} weight="duotone" />
					</div>
				{/if}
				<div
					class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neutral-950/40 via-transparent to-transparent"
				></div>
			</div>

			<div class="min-w-0">
				<div class="mb-3 flex flex-wrap items-center gap-2">
					<Badge
						variant="outline"
						class="px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider {STATUS_TONE[
							device.status
						]}"
					>
						<span
							class="mr-1 inline-block size-1.5 rounded-full {STATUS_DOT[device.status]}"
						></span>
						{$t(`aosp.status.${device.status}`)}
					</Badge>
					{#if device.codename}
						<Badge
							variant="outline"
							class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300"
						>
							{$t('aosp.detail.codename')}: {device.codename}
						</Badge>
					{/if}
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300"
					>
						/{device.slug}
					</Badge>
				</div>
				<h1
					bind:this={heroH1}
					class="text-balance text-[clamp(2.25rem,8vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					{device.name}
				</h1>
				<p
					class="mt-4 max-w-2xl text-balance text-base leading-relaxed text-neutral-400 sm:text-lg"
				>
					{$t('aosp.detail.tagline', {
						values: { name: device.name, codename: device.codename ?? device.slug },
					})}
				</p>
			</div>
		</div>
	</header>

	<!-- ============ SPECS TABLE ============ -->
	<section class="border-t border-white/5 py-8 sm:py-10">
		<div class="mb-6 flex items-center gap-2" data-detail-reveal>
			<h2
				class="text-balance text-xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-2xl"
			>
				{$t('aosp.detail.specsTitle')}
			</h2>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{visibleSpecs.length}
			</Badge>
		</div>
		<div
			class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-3"
		>
			{#each visibleSpecs as [key, value] (key)}
				{@const meta = SPEC_META[key]}
				{@const Icon = meta?.icon ?? Plus}
				<div
					class="flex items-start gap-3 bg-neutral-950 p-4"
					data-detail-reveal
				>
					<div
						class="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
					>
						<Icon size={14} weight="duotone" class="text-neutral-400" />
					</div>
					<div class="min-w-0 flex-1">
						<p
							class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500"
						>
							{meta ? $t(meta.key) : key}
						</p>
						<p class="mt-0.5 text-sm text-neutral-200">{value}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- ============ ROMs ============ -->
	<section class="border-t border-white/5 py-8 sm:py-10" data-detail-reveal>
		<div class="mb-6 flex items-center gap-2">
			<h2
				class="text-balance text-xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-2xl"
			>
				{$t('aosp.detail.romsTitle')}
			</h2>
			<Badge
				variant="outline"
				class="border-mint-400/20 bg-mint-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mint-300"
			>
				{$t('aosp.detail.romsKind')}
			</Badge>
		</div>
		<!--
		  The ROM list. When the GitHub repo has releases, those
		  show up here with proper download buttons. While there
		  are no releases yet (the current state), we show a
		  "soon" placeholder card so the user understands the
		  section's purpose and can link to the source repo.
		-->
		{#if releases.roms.length > 0}
			<div class="space-y-3">
				{#each releases.roms as r (r.tag)}
					<!--
					  Real release card. We only render the
					  download button if the release has at
					  least one asset; otherwise just show the
					  tag + body.
					-->
					<article
						class="rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04] sm:p-5"
					>
						<header class="mb-3 flex flex-wrap items-center justify-between gap-2">
							<div class="min-w-0">
								<h3 class="font-mono text-sm font-semibold text-neutral-50 sm:text-base">
									{r.tag}
								</h3>
								{#if r.name && r.name !== r.tag}
									<p class="mt-0.5 text-xs text-neutral-400">{r.name}</p>
								{/if}
							</div>
							{#if r.prerelease}
								<Badge
									variant="outline"
									class="border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-200"
								>
									{$t('aosp.release.prerelease')}
								</Badge>
							{/if}
						</header>
						{#if r.assets.length > 0}
							<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
								{#each r.assets as a (a.name)}
									<a
										href={a.url}
										target="_blank"
										rel="noreferrer noopener"
										class="group/dl flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:-translate-y-0.5 hover:border-mint-400/30 hover:bg-mint-500/[0.04]"
									>
										<div
											class="flex size-8 shrink-0 items-center justify-center rounded-md border border-mint-400/20 bg-mint-500/10"
										>
											<DownloadSimple
												size={13}
												weight="bold"
												class="text-mint-300"
											/>
										</div>
										<div class="min-w-0 flex-1">
											<p
												class="truncate text-xs font-semibold text-neutral-100 sm:text-sm"
											>
												{a.name}
											</p>
										</div>
										<ArrowUpRight
											size={12}
											weight="bold"
											class="shrink-0 text-neutral-500 transition-transform group-hover/dl:-translate-y-0.5 group-hover/dl:translate-x-0.5"
										/>
									</a>
								{/each}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{:else}
			<SoonPlaceholder
				kind="rom"
				repo={device.romRepo ?? `aosp-${device.slug}`}
			/>
		{/if}
	</section>

	<!-- ============ KERNELS ============ -->
	<section class="border-t border-white/5 py-8 sm:py-10" data-detail-reveal>
		<div class="mb-6 flex items-center gap-2">
			<h2
				class="text-balance text-xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-2xl"
			>
				{$t('aosp.detail.kernelsTitle')}
			</h2>
			<Badge
				variant="outline"
				class="border-amber-400/20 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300"
			>
				{$t('aosp.detail.kernelsKind')}
			</Badge>
		</div>
		{#if releases.kernels.length > 0}
			<div class="space-y-3">
				{#each releases.kernels as r (r.tag)}
					<article
						class="rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04] sm:p-5"
					>
						<header class="mb-3 flex flex-wrap items-center justify-between gap-2">
							<div class="min-w-0">
								<h3 class="font-mono text-sm font-semibold text-neutral-50 sm:text-base">
									{r.tag}
								</h3>
							</div>
							{#if r.prerelease}
								<Badge
									variant="outline"
									class="border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-200"
								>
									{$t('aosp.release.prerelease')}
								</Badge>
							{/if}
						</header>
						{#if r.assets.length > 0}
							<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
								{#each r.assets as a (a.name)}
									<a
										href={a.url}
										target="_blank"
										rel="noreferrer noopener"
										class="group/dl flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-amber-500/[0.04]"
									>
										<div
											class="flex size-8 shrink-0 items-center justify-center rounded-md border border-amber-400/20 bg-amber-500/10"
										>
											<DownloadSimple
												size={13}
												weight="bold"
												class="text-amber-300"
											/>
										</div>
										<div class="min-w-0 flex-1">
											<p
												class="truncate text-xs font-semibold text-neutral-100 sm:text-sm"
											>
												{a.name}
											</p>
										</div>
										<ArrowUpRight
											size={12}
											weight="bold"
											class="shrink-0 text-neutral-500 transition-transform group-hover/dl:-translate-y-0.5 group-hover/dl:translate-x-0.5"
										/>
									</a>
								{/each}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{:else}
			<SoonPlaceholder
				kind="kernel"
				repo={device.kernelRepo ?? `aosp-${device.slug}-kernel`}
			/>
		{/if}
	</section>

	<!-- ============ CHANGELOG ============ -->
	<section class="border-t border-white/5 py-8 sm:py-10" data-detail-reveal>
		<div class="mb-6 flex items-center gap-2">
			<h2
				class="text-balance text-xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-2xl"
			>
				{$t('aosp.detail.changelogTitle')}
			</h2>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('aosp.detail.changelogEmpty')}
			</Badge>
		</div>
		<div
			class="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center sm:p-10"
		>
			<div
				class="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-500"
			>
				<ClockClockwise size={18} weight="duotone" />
			</div>
			<p class="text-sm text-neutral-300">{$t('aosp.detail.changelogHint')}</p>
			<p class="mt-1 text-xs text-neutral-500">
				{$t('aosp.detail.changelogHintSub')}
			</p>
		</div>
	</section>

	<!-- ============ FOOTER NOTE ============ -->
	<div
		class="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber-400/15 bg-amber-500/[0.04] p-4 sm:flex-row sm:items-center sm:p-5"
	>
		<div class="flex items-start gap-3">
			<div
				class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-500/10"
			>
				<WarningCircle size={16} weight="duotone" class="text-amber-300" />
			</div>
			<div class="min-w-0">
				<p
					class="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-300/80"
				>
					{$t('aosp.detail.devStatusLabel')}
				</p>
				<p class="mt-0.5 text-sm font-semibold text-neutral-100">
					{$t('aosp.detail.devStatusTitle', {
						values: { status: $t(`aosp.status.${device.status}`) },
					})}
				</p>
				<p class="mt-0.5 text-xs text-neutral-400">
					{$t('aosp.detail.devStatusBody')}
				</p>
			</div>
		</div>
		<a
			href={`https://github.com/seba3567/${device.romRepo ?? `aosp-${device.slug}`}`}
			target="_blank"
			rel="noreferrer noopener"
			class="inline-flex items-center gap-2 self-stretch rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm font-semibold text-neutral-100 transition-all hover:border-white/20 hover:bg-white/[0.08] sm:self-auto"
		>
			<GithubLogo size={14} weight="duotone" />
			{$t('aosp.detail.devStatusButton')}
			<ArrowUpRight size={12} weight="bold" />
		</a>
	</div>
</main>

<!--
  The "soon" placeholder for an empty release list. Renders
  a single card that looks like a release but with the
  "Soon" badge in the place of the download button. The user
  can tap the GitHub link to see the source repo.
-->
