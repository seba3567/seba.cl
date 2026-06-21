<script lang="ts">
	import {
		ArrowUpRight,
		CloudArrowDown,
		Database,
		Download,
		ShieldCheck,
		Stack,
		Wrench,
	} from 'phosphor-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import {
		AOSP_TTL_MS,
		loadAospDevices,
		loadDeviceReleases,
		onAospChange,
		refreshAosp,
	} from '$lib/aosp-client';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import type { Device, Release } from '$lib/types/aosp';

	const pageTitle = $derived($t('aosp.metaTitle'));
	const pageDescription = $derived($t('aosp.metaDescription'));

	// Devices start from the bundled JSON so SSR / first paint
	// are instant. After hydration, the client swaps in the
	// freshest data from the YAML via loadAospDevices().
	let devices = $state<Device[]>([]);
	let snapshotUpdatedAt = $state<number>(0);
	let source = $state<string>('');

	// Per-device releases (GitHub Releases for the ROM and the
	// kernel repos). Keyed by device slug. Missing = not loaded
	// yet (we don't show a loading spinner — the section is
	// just absent until the data arrives, which is fast).
	let releasesBySlug = $state<Record<string, { roms: Release[]; kernels: Release[] }>>({});
	let loadingSlugs = $state<Set<string>>(new Set());

	let unsub: (() => void) | null = null;

	onMount(() => {
		// Load the bundled devices + the latest cached snapshot
		// synchronously. Then trigger a fresh fetch in the
		// background — by the time the user scrolls down, the
		// fresh data is usually already in the page.
		void (async () => {
			const bundle = await loadAospDevices();
			devices = bundle.devices as Device[];
			source = bundle._about.source;
			snapshotUpdatedAt = Date.now();

			// Restore selection from the URL hash so a deep link
			// (e.g. seba3567.cl/aosp#panther) keeps working.
			const applyHash = () => {
				const raw = window.location.hash.replace(/^#/, '');
				if (!raw) return;
				const slug = decodeURIComponent(raw);
				if (devices.some((d) => d.slug === slug)) selectedSlug = slug;
			};
			applyHash();
			window.addEventListener('hashchange', applyHash);

			// Subscribe to the snapshot. When the device YAML
			// refreshes (or new devices arrive), we update the
			// list. When per-device releases load, we merge them
			// in. The page is reactive — the UI updates on its own.
			unsub = onAospChange((snap) => {
				devices = snap.bundle.devices as Device[];
				source = snap.bundle._about.source;
				snapshotUpdatedAt = snap.updatedAt;
				releasesBySlug = snap.releases as typeof releasesBySlug;
			});

			// Eagerly load releases for all devices so the detail
			// panel has data when the user taps a card. On mobile
			// this matters more: users expect to tap → see, not
			// tap → wait.
			for (const d of devices) {
				void loadReleasesFor(d);
			}
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
		const data = await loadDeviceReleases({
			slug: d.slug,
			romRepo: d.romRepo ?? '',
			kernelRepo: d.kernelRepo ?? '',
		});
		releasesBySlug = {
			...releasesBySlug,
			[d.slug]: { roms: data.roms, kernels: data.kernels },
		};
		loadingSlugs.delete(d.slug);
		loadingSlugs = new Set(loadingSlugs);
	}

	// ----- selection (URL hash) -----
	let selectedSlug = $state<string | null>(null);

	const selectedDevice = $derived(
		selectedSlug ? (devices.find((d) => d.slug === selectedSlug) ?? null) : null,
	);

	const selectedReleases = $derived(
		selectedSlug ? (releasesBySlug[selectedSlug] ?? null) : null,
	);

	function selectDevice(slug: string) {
		selectedSlug = slug;
		history.replaceState(null, '', `#${slug}`);
		// On desktop scroll into view; on mobile the user is
		// already at the bottom of the card list, so a no-op.
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(min-width: 768px)').matches) {
			document
				.getElementById('aosp-device-detail')
				?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// ----- i18n tones -----
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

	// ----- helpers -----
	function fmtBytes(n: number) {
		if (n < 1024) return `${n} B`;
		if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
		if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
		return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
	}

	function fmtDate(iso: string) {
		try {
			return new Date(iso).toISOString().slice(0, 10);
		} catch {
			return iso;
		}
	}

	function fmtRelative(iso: string) {
		const then = new Date(iso).getTime();
		const now = Date.now();
		const diff = Math.max(0, now - then);
		const days = Math.floor(diff / 86_400_000);
		if (days === 0) return $t('aosp.release.today');
		if (days === 1) return $t('aosp.release.yesterday');
		if (days < 30) return $t('aosp.release.daysAgo', { values: { n: days } });
		if (days < 365) {
			const months = Math.floor(days / 30);
			return $t('aosp.release.monthsAgo', { values: { n: months } });
		}
		const years = Math.floor(days / 365);
		return $t('aosp.release.yearsAgo', { values: { n: years } });
	}

	const lastRefreshLabel = $derived.by(() => {
		if (!snapshotUpdatedAt) return '';
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

<main class="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-20 pb-16 sm:px-10 sm:pt-32">
	<!-- ============ HERO ============ -->
	<header class="pb-10 sm:pb-14">
		<div class="mb-5 flex flex-wrap items-center gap-2">
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
			class="text-balance text-[clamp(2.5rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
		>
			{$t('aosp.hero.title')}
		</h1>
		<p
			class="mt-5 max-w-2xl text-balance text-base leading-relaxed text-neutral-400 sm:mt-6 sm:text-lg"
		>
			{$t('aosp.hero.subtitle')}
		</p>

		<div
			class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
		>
			<div class="flex flex-wrap items-center gap-3">
				<span class="flex items-center gap-1.5">
					<CloudArrowDown size={11} weight="duotone" class="text-mint-300" />
					{source.replace('https://', '')}
				</span>
				<span class="text-neutral-700">·</span>
				<span>{$t('aosp.hero.dataSource')}</span>
			</div>
			<button
				type="button"
				onclick={onRefresh}
				class="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-neutral-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-neutral-100"
				aria-label={$t('aosp.refresh.button')}
			>
				{lastRefreshLabel || $t('aosp.refresh.justNow')}
			</button>
		</div>
	</header>

	<!-- ============ DEVICE GRID ============ -->
	<section class="border-t border-white/5 py-8 sm:py-10">
		<div class="mb-6 flex items-end justify-between gap-6 sm:mb-8">
			<div>
				<h2
					class="text-balance text-2xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-3xl"
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

		{#if devices.length === 0}
			<p
				class="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center text-sm text-neutral-500"
			>
				{$t('aosp.devices.empty')}
			</p>
		{:else}
			<!-- Mobile: 1 col, tablet: 2 cols, desktop: 3 cols.
			     The button is the whole card so the touch target
			     is the entire tile (no tiny < 44px hot spots). -->
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
				{#each devices as d (d.slug)}
					{@const isSelected = d.slug === selectedSlug}
					{@const rels = releasesBySlug[d.slug]}
					<button
						type="button"
						onclick={() => selectDevice(d.slug)}
						aria-pressed={isSelected}
						class="group/dev flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white/[0.015] text-left transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/[0.04] {isSelected
							? 'border-mint-400/40 bg-mint-500/[0.04] shadow-2xl shadow-mint-500/10'
							: 'border-white/5 hover:border-white/20'}"
					>
						<!-- Image -->
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
								<div class="flex size-full items-center justify-center text-neutral-600">
									<Database size={32} weight="duotone" />
								</div>
							{/if}
							<!-- Status pill (top-right) -->
							<div class="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
								<Badge
									variant="outline"
									class="border-white/10 bg-neutral-950/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider backdrop-blur {STATUS_TONE[d.status]}"
								>
									<span class="mr-1 inline-block size-1.5 rounded-full {STATUS_DOT[d.status]}"></span>
									{$t(`aosp.status.${d.status}`)}
								</Badge>
							</div>
							<!-- Codename (bottom-left) -->
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

						<!-- Body -->
						<div class="flex flex-1 flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-4">
							<h3 class="text-sm font-semibold tracking-tight text-neutral-50 sm:text-base">
								{d.name}
							</h3>
							<dl class="grid grid-cols-1 gap-1 text-[11px] text-neutral-500">
								{#if d.specs.processor}
									<div class="flex items-center gap-1.5">
										<Wrench size={11} weight="duotone" class="shrink-0 text-neutral-600" />
										<dt class="sr-only">{$t('aosp.devices.specs.processor')}</dt>
										<dd class="truncate">{d.specs.processor}</dd>
									</div>
								{/if}
								{#if d.specs.display}
									<div class="flex items-center gap-1.5">
										<Stack size={11} weight="duotone" class="shrink-0 text-neutral-600" />
										<dt class="sr-only">{$t('aosp.devices.specs.display')}</dt>
										<dd class="truncate">{d.specs.display}</dd>
									</div>
								{/if}
								{#if d.specs.ram}
									<div class="flex items-center gap-1.5">
										<ShieldCheck size={11} weight="duotone" class="shrink-0 text-neutral-600" />
										<dt class="sr-only">{$t('aosp.devices.specs.ram')}</dt>
										<dd class="truncate">{d.specs.ram}</dd>
									</div>
								{/if}
							</dl>
							<!-- Build count badge (only if we have releases) -->
							{#if rels && (rels.roms.length > 0 || rels.kernels.length > 0)}
								<div class="flex flex-wrap items-center gap-1.5">
									{#if rels.roms.length > 0}
										<span
											class="inline-flex items-center gap-1 rounded-md border border-mint-400/20 bg-mint-500/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint-300"
										>
											{rels.roms.length} ROM
										</span>
									{/if}
									{#if rels.kernels.length > 0}
										<span
											class="inline-flex items-center gap-1 rounded-md border border-amber-400/20 bg-amber-500/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300"
										>
											{rels.kernels.length} KERNEL
										</span>
									{/if}
								</div>
							{/if}
							<div
								class="mt-auto flex items-center justify-between border-t border-white/5 pt-2.5 sm:pt-3"
							>
								<span class="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
									{isSelected ? $t('aosp.devices.selectedLabel') : $t('aosp.devices.select')}
								</span>
								<ArrowUpRight
									size={12}
									weight="bold"
									class="text-neutral-500 transition-transform group-hover/dev:-translate-y-0.5 group-hover/dev:translate-x-0.5 {isSelected
										? 'text-mint-300'
										: ''}"
								/>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<!-- ============ SELECTED DEVICE DETAIL ============ -->
	{#if selectedDevice}
		{@const dev = selectedDevice}
		<section id="aosp-device-detail" class="border-t border-white/5 py-8 sm:py-14">
			<!-- Device hero (compact) -->
			<div class="mb-8 grid grid-cols-1 gap-6 sm:mb-10 sm:gap-8 lg:grid-cols-[1.1fr_1fr]">
				<div class="min-w-0">
					<div class="mb-3 flex flex-wrap items-center gap-2">
						<Badge
							variant="outline"
							class="px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider {STATUS_TONE[dev.status]}"
						>
							<span class="mr-1 inline-block size-1.5 rounded-full {STATUS_DOT[dev.status]}"></span>
							{$t(`aosp.status.${dev.status}`)}
						</Badge>
						{#if dev.codename}
							<Badge
								variant="outline"
								class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300"
							>
								{$t('aosp.devices.codename')}: {dev.codename}
							</Badge>
						{/if}
					</div>
					<h2
						class="text-balance text-2xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-3xl"
					>
						{dev.name}
					</h2>
				</div>
				{#if dev.image}
					<div
						class="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
					>
						<img
							src={dev.image}
							alt={dev.name}
							loading="lazy"
							referrerpolicy="no-referrer"
							class="size-full object-cover"
						/>
					</div>
				{/if}
			</div>

			<!-- Specs table — 1 col on mobile, 2 on sm+ -->
			<div
				class="mb-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:mb-10 sm:grid-cols-2"
			>
				{#each Object.entries(dev.specs).filter(([_, v]) => v) as [key, value] (key)}
					<div class="bg-neutral-950 p-4">
						<dt class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
							{$t(`aosp.devices.specs.${key}`)}
						</dt>
						<dd class="mt-1.5 text-sm text-neutral-200">{value}</dd>
					</div>
				{/each}
			</div>

			<!-- ROMs list -->
			<div class="mb-3 flex items-center gap-2">
				<h3
					class="text-balance text-lg font-semibold tracking-[-0.02em] text-neutral-50 sm:text-xl"
				>
					{$t('aosp.roms.title')}
				</h3>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('aosp.roms.kind')}
				</Badge>
			</div>

			{#if !selectedReleases}
				<Card.Root class="rounded-2xl border-white/5 bg-white/[0.02] p-6 text-center sm:p-8">
					<p class="text-sm text-neutral-300">{$t('aosp.roms.loading')}</p>
				</Card.Root>
			{:else if selectedReleases.roms.length === 0}
				<Card.Root class="rounded-2xl border-white/5 bg-white/[0.02] p-6 text-center sm:p-8">
					<p class="text-sm text-neutral-300">{$t('aosp.roms.noneYet')}</p>
					<p class="mt-2 text-xs text-neutral-500">
						{$t('aosp.roms.noneYetHint', {
							values: { repo: dev.romRepo ?? `aosp-${dev.slug}` },
						})}
					</p>
				</Card.Root>
			{:else}
				<div class="space-y-3">
					{#each selectedReleases.roms as r (r.tag)}
						<article
							class="rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04] sm:p-5"
						>
							<div class="mb-3 flex flex-wrap items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<div class="mb-1 flex flex-wrap items-center gap-2">
										<span
											class="font-mono text-sm font-semibold text-neutral-50 sm:text-base"
										>
											{r.tag}
										</span>
										{#if r.prerelease}
											<Badge
												variant="outline"
												class="border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-200"
											>
												{$t('aosp.release.prerelease')}
											</Badge>
										{/if}
									</div>
									{#if r.name && r.name !== r.tag}
										<p class="text-xs text-neutral-400">{r.name}</p>
									{/if}
									<p class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
										{fmtDate(r.publishedAt)} · {fmtRelative(r.publishedAt)}
									</p>
								</div>
							</div>

							<!-- Assets (downloads) -->
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
												<Download size={13} weight="bold" class="text-mint-300" />
											</div>
											<div class="min-w-0 flex-1">
												<p class="truncate text-xs font-semibold text-neutral-100 sm:text-sm">
													{a.name}
												</p>
												<p
													class="font-mono text-[9px] uppercase tracking-wider text-neutral-500"
												>
													{fmtBytes(a.size)} · {a.downloadCount} ↓
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

							<!-- SHA-256 -->
							{#if r.sha256}
								<details
									class="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 font-mono text-[11px] text-neutral-500"
								>
									<summary
										class="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-200"
									>
										SHA-256
									</summary>
									<code class="mt-2 block break-all text-neutral-300">{r.sha256}</code>
								</details>
							{/if}

							<!-- Release body -->
							{#if r.body}
								<pre
									class="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-neutral-950/40 p-3 font-mono text-[11px] leading-relaxed text-neutral-400"
								>{r.body}</pre>
							{/if}
						</article>
					{/each}
				</div>
			{/if}

			<!-- KERNELS list -->
			<div class="mt-10 mb-3 flex items-center gap-2 sm:mt-14">
				<h3
					class="text-balance text-lg font-semibold tracking-[-0.02em] text-neutral-50 sm:text-xl"
				>
					{$t('aosp.kernels.title')}
				</h3>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('aosp.kernels.kind')}
				</Badge>
			</div>

			{#if !selectedReleases}
				<Card.Root class="rounded-2xl border-white/5 bg-white/[0.02] p-6 text-center sm:p-8">
					<p class="text-sm text-neutral-300">{$t('aosp.kernels.loading')}</p>
				</Card.Root>
			{:else if selectedReleases.kernels.length === 0}
				<Card.Root class="rounded-2xl border-white/5 bg-white/[0.02] p-6 text-center sm:p-8">
					<p class="text-sm text-neutral-300">{$t('aosp.kernels.noneYet')}</p>
					<p class="mt-2 text-xs text-neutral-500">
						{$t('aosp.kernels.noneYetHint', {
							values: { repo: dev.kernelRepo ?? `aosp-${dev.slug}-kernel` },
						})}
					</p>
				</Card.Root>
			{:else}
				<div class="space-y-3">
					{#each selectedReleases.kernels as r (r.tag)}
						<article
							class="rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04] sm:p-5"
						>
							<div class="mb-3 flex flex-wrap items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<div class="mb-1 flex flex-wrap items-center gap-2">
										<span
											class="font-mono text-sm font-semibold text-neutral-50 sm:text-base"
										>
											{r.tag}
										</span>
										{#if r.prerelease}
											<Badge
												variant="outline"
												class="border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-200"
											>
												{$t('aosp.release.prerelease')}
											</Badge>
										{/if}
									</div>
									{#if r.name && r.name !== r.tag}
										<p class="text-xs text-neutral-400">{r.name}</p>
									{/if}
									<p class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
										{fmtDate(r.publishedAt)} · {fmtRelative(r.publishedAt)}
									</p>
								</div>
							</div>

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
												<Download size={13} weight="bold" class="text-amber-300" />
											</div>
											<div class="min-w-0 flex-1">
												<p class="truncate text-xs font-semibold text-neutral-100 sm:text-sm">
													{a.name}
												</p>
												<p
													class="font-mono text-[9px] uppercase tracking-wider text-neutral-500"
												>
													{fmtBytes(a.size)} · {a.downloadCount} ↓
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

							{#if r.sha256}
								<details
									class="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 font-mono text-[11px] text-neutral-500"
								>
									<summary
										class="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-200"
									>
										SHA-256
									</summary>
									<code class="mt-2 block break-all text-neutral-300">{r.sha256}</code>
								</details>
							{/if}

							{#if r.body}
								<pre
									class="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-neutral-950/40 p-3 font-mono text-[11px] leading-relaxed text-neutral-400"
								>{r.body}</pre>
							{/if}
						</article>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</main>
