<script lang="ts">
	import {
		ArrowUpRight,
		CloudArrowDown,
		Database,
		DeviceMobile,
		ShieldCheck,
		Stack,
		Wrench,
	} from 'phosphor-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import {
		AOSP_DEVICES_SOURCE,
		AOSP_TTL_MS,
		loadAospDevices,
		loadDeviceReleases,
		onAospChange,
		refreshAosp,
	} from '$lib/aosp-client';
	import { revealChars, revealOnScroll } from '$lib/animations';
	import { Badge } from '$lib/components/ui/badge';
	import type { Device, Release } from '$lib/types/aosp';

	const pageTitle = $derived($t('aosp.metaTitle'));
	const pageDescription = $derived($t('aosp.metaDescription'));

	let devices = $state<Device[]>([]);
	let snapshotUpdatedAt = $state<number>(0);
	let source = $state<string>(AOSP_DEVICES_SOURCE);

	// Per-device releases.
	let releasesBySlug = $state<Record<string, { roms: Release[]; kernels: Release[] }>>(
		{},
	);
	let loadingSlugs = $state<Set<string>>(new Set());

	const stats = $derived.by(() => {
		let roms = 0;
		let kernels = 0;
		for (const slug of Object.keys(releasesBySlug)) {
			roms += releasesBySlug[slug].roms.length;
			kernels += releasesBySlug[slug].kernels.length;
		}
		return {
			devices: devices.length,
			roms,
			kernels,
		};
	});

	let unsub: (() => void) | null = null;
	let heroH1: HTMLElement | undefined = $state();

	onMount(() => {
		void (async () => {
			const bundle = await loadAospDevices();
			devices = bundle.devices as Device[];
			source = bundle._about.source;
			snapshotUpdatedAt = Date.now();

			unsub = onAospChange((snap) => {
				devices = snap.bundle.devices as Device[];
				source = snap.bundle._about.source;
				snapshotUpdatedAt = snap.updatedAt;
				releasesBySlug = snap.releases as typeof releasesBySlug;
			});

			for (const d of devices) void loadReleasesFor(d);

			if (heroH1) {
				revealChars(heroH1, {
					staggerMs: 28,
					offsetY: 60,
					duration: 800,
					delay: 100,
				});
			}
			revealOnScroll(document.body, {
				selector: '[data-aosp-reveal]',
				staggerMs: 60,
				offsetY: 28,
				duration: 700,
			});
		})();
	});

	onDestroy(() => {
		if (unsub) unsub();
	});

	async function loadReleasesFor(d: Device) {
		if (loadingSlugs.has(d.slug)) return;
		if (!d.romRepo && !d.kernelRepo) return;
		loadingSlugs.add(d.slug);
		loadingSlugs = new Set(loadingSlugs);
		try {
			const data = await loadDeviceReleases({
				slug: d.slug,
				romRepo: d.romRepo ?? '',
				kernelRepo: d.kernelRepo ?? '',
			});
			releasesBySlug = {
				...releasesBySlug,
				[d.slug]: { roms: data.roms, kernels: data.kernels },
			};
		} finally {
			loadingSlugs.delete(d.slug);
			loadingSlugs = new Set(loadingSlugs);
		}
	}

	function openDevice(slug: string) {
		goto(`/aosp/${slug}`);
	}

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

	const lastRefreshLabel = $derived.by(() => {
		if (!snapshotUpdatedAt) return $t('aosp.refresh.justNow');
		const diff = Math.floor((Date.now() - snapshotUpdatedAt) / 60_000);
		if (diff < 1) return $t('aosp.refresh.justNow');
		if (diff === 1) return $t('aosp.refresh.oneMinAgo');
		return $t('aosp.refresh.minutesAgo', { values: { n: diff } });
	});

	async function onRefresh() {
		await refreshAosp();
		for (const d of devices) void loadReleasesFor(d);
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-16 pb-16 sm:px-10 sm:pt-28">
	<!-- ============ HERO ============ -->
	<header class="pb-8 sm:pb-12">
		<div class="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
			<Badge
				variant="outline"
				class="border-mint-400/25 bg-mint-500/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint-300"
			>
				<span class="relative flex size-1.5">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-60"
					></span>
					<span class="relative inline-flex size-1.5 rounded-full bg-mint-300"></span>
				</span>
				{$t('aosp.hero.status')}
			</Badge>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('aosp.hero.badge')}
			</Badge>
		</div>

		<h1
			bind:this={heroH1}
			class="text-balance text-[clamp(2.5rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
		>
			{$t('aosp.hero.title')}
		</h1>
		<p
			class="mt-5 max-w-2xl text-balance text-base leading-relaxed text-neutral-400 sm:mt-6 sm:text-lg"
		>
			{$t('aosp.hero.subtitle')}
		</p>

		<!-- Stats grid (always visible, even at 0) -->
		<div
			class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:mt-8 sm:grid-cols-4"
			data-aosp-reveal
		>
			<div class="bg-neutral-950 p-4">
				<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
					{$t('aosp.stats.devices')}
				</p>
				<p class="mt-1.5 font-mono text-2xl font-semibold text-neutral-50 sm:text-3xl">
					{stats.devices}
				</p>
			</div>
			<div class="bg-neutral-950 p-4">
				<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
					{$t('aosp.stats.roms')}
				</p>
				<p class="mt-1.5 font-mono text-2xl font-semibold text-mint-300 sm:text-3xl">
					{stats.roms}
				</p>
			</div>
			<div class="bg-neutral-950 p-4">
				<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
					{$t('aosp.stats.kernels')}
				</p>
				<p class="mt-1.5 font-mono text-2xl font-semibold text-amber-300 sm:text-3xl">
					{stats.kernels}
				</p>
			</div>
			<div class="bg-neutral-950 p-4">
				<p class="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
					{$t('aosp.stats.lastSync')}
				</p>
				<p class="mt-1.5 font-mono text-base font-semibold text-neutral-200 sm:text-lg">
					{lastRefreshLabel}
				</p>
			</div>
		</div>

		<!-- Source + refresh row -->
		<div
			class="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
		>
			<a
				href={source}
				target="_blank"
				rel="noreferrer noopener"
				class="group/src flex min-w-0 items-center gap-1.5 truncate transition-colors hover:text-mint-300"
				title={source}
			>
				<CloudArrowDown size={11} weight="duotone" class="shrink-0 text-mint-300" />
				<span class="truncate">{source.replace('https://', '')}</span>
				<ArrowUpRight
					size={9}
					weight="bold"
					class="shrink-0 opacity-0 transition-opacity group-hover/src:opacity-100"
				/>
			</a>
			<button
				type="button"
				onclick={onRefresh}
				aria-label={$t('aosp.refresh.button')}
				class="inline-flex shrink-0 items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-neutral-400 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-neutral-100"
			>
				<span class="size-1.5 rounded-full bg-mint-400"></span>
				{$t('aosp.refresh.button')}
			</button>
		</div>
	</header>

	<!-- ============ DEVICES GRID ============ -->
	{#if devices.length > 0}
		<section class="border-t border-white/5 py-8 sm:py-10" data-aosp-reveal>
			<div class="mb-6 flex items-end justify-between gap-6 sm:mb-8">
				<div>
					<p
						class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
					>
						{$t('aosp.devices.eyebrow')}
					</p>
					<h2
						class="mt-2 text-balance text-2xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-3xl"
					>
						{$t('aosp.devices.title')}
					</h2>
					<p class="mt-1.5 max-w-2xl text-sm text-neutral-500">
						{$t('aosp.devices.subtitle')}
					</p>
				</div>
				<span
					class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:inline"
				>
					{devices.length} {$t('aosp.devices.count')}
				</span>
			</div>

			<!--
			  Device cards. Each one is a link to /aosp/<slug>
			  so users get a real URL (shareable, back/forward,
			  SEO). The whole card is the click target.
			-->
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
				{#each devices as d (d.slug)}
					{@const rels = releasesBySlug[d.slug]}
					<a
						href={`/aosp/${d.slug}`}
						data-panel-anim
						class="group/dev relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] text-left transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
					>
						<div
							class="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01]"
						>
							{#if d.image}
								<img
									src={d.image}
									alt={d.name}
									loading="lazy"
									referrerpolicy="no-referrer"
									class="size-full object-cover opacity-90 transition-transform duration-700 group-hover/dev:scale-105"
								/>
							{:else}
								<div
									class="flex size-full items-center justify-center text-neutral-600"
								>
									<DeviceMobile size={32} weight="duotone" />
								</div>
							{/if}
							<div
								class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-950/60 to-transparent"
							></div>
							<div class="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
								<Badge
									variant="outline"
									class="border-white/10 bg-neutral-950/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider backdrop-blur {STATUS_TONE[
										d.status
									]}"
								>
									<span
										class="mr-1 inline-block size-1.5 rounded-full {STATUS_DOT[d.status]}"
									></span>
									{$t(`aosp.status.${d.status}`)}
								</Badge>
							</div>
							{#if d.codename}
								<div class="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3">
									<span
										class="rounded-md border border-white/10 bg-neutral-950/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-200 backdrop-blur"
									>
										{d.codename}
									</span>
								</div>
							{/if}
						</div>

						<div class="flex flex-1 flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-4">
							<h3
								class="text-sm font-semibold tracking-tight text-neutral-50 sm:text-base"
							>
								{d.name}
							</h3>
							<dl class="grid grid-cols-1 gap-1 text-[11px] text-neutral-500">
								{#if d.specs.processor}
									<div class="flex items-center gap-1.5">
										<Wrench
											size={11}
											weight="duotone"
											class="shrink-0 text-neutral-600"
										/>
										<dt class="sr-only">{$t('aosp.devices.specs.processor')}</dt>
										<dd class="truncate">{d.specs.processor}</dd>
									</div>
								{/if}
								{#if d.specs.display}
									<div class="flex items-center gap-1.5">
										<Stack
											size={11}
											weight="duotone"
											class="shrink-0 text-neutral-600"
										/>
										<dt class="sr-only">{$t('aosp.devices.specs.display')}</dt>
										<dd class="truncate">{d.specs.display}</dd>
									</div>
								{/if}
								{#if d.specs.ram}
									<div class="flex items-center gap-1.5">
										<ShieldCheck
											size={11}
											weight="duotone"
											class="shrink-0 text-neutral-600"
										/>
										<dt class="sr-only">{$t('aosp.devices.specs.ram')}</dt>
										<dd class="truncate">{d.specs.ram}</dd>
									</div>
								{/if}
							</dl>
							<!-- Soon badges for builds -->
							<div class="flex flex-wrap items-center gap-1.5">
								<span
									class="inline-flex items-center gap-1 rounded-md border border-mint-400/20 bg-mint-500/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint-300"
								>
									{$t('aosp.detail.romsSoon')}
								</span>
								<span
									class="inline-flex items-center gap-1 rounded-md border border-amber-400/20 bg-amber-500/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300"
								>
									{$t('aosp.detail.kernelsSoon')}
								</span>
							</div>
							<div
								class="mt-auto flex items-center justify-between border-t border-white/5 pt-2.5 sm:pt-3"
							>
								<span
									class="font-mono text-[10px] uppercase tracking-wider text-neutral-500"
								>
									{$t('aosp.devices.select')}
								</span>
								<ArrowUpRight
									size={12}
									weight="bold"
									class="text-neutral-500 transition-transform group-hover/dev:-translate-y-0.5 group-hover/dev:translate-x-0.5"
								/>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{:else}
		<section
			class="border-t border-white/5 py-12 sm:py-16"
			data-aosp-reveal
		>
			<div
				class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center sm:p-12"
			>
				<div
					class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-500"
				>
					<Database size={18} weight="duotone" />
				</div>
				<p class="text-sm text-neutral-300">{$t('aosp.devices.empty')}</p>
			</div>
		</section>
	{/if}
</main>
