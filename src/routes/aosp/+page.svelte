<script lang="ts">
import {
	ArrowUpRight,
	Database,
	ShieldCheck,
	Stack,
	Wrench,
} from 'phosphor-svelte';
import { onMount } from 'svelte';
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import buildsData from '$lib/data/aosp/builds.json';
import devicesData from '$lib/data/aosp/devices.json';
import kernelsData from '$lib/data/aosp/kernels.json';
import type { Build, ChangeLogEntry, Device, Kernel } from '$lib/types/aosp';

const devices: Device[] = (devicesData as { devices: Device[] }).devices;
const builds: Build[] = (buildsData as { builds: Build[] }).builds;
const kernels: Kernel[] = (kernelsData as { kernels: Kernel[] }).kernels;

// Selected device, derived from the URL hash so the choice
// is shareable. The hash is fine for this — the page is
// SPA-style and we don't want a real server roundtrip just
// to remember which device the user was looking at.
let selectedSlug = $state<string | null>(null);

onMount(() => {
	// Restore the device from the URL hash, then listen for
	// hashchange (the device cards below set the hash on
	// click).
	const apply = () => {
		const raw = window.location.hash.replace(/^#/, '');
		if (!raw) return;
		const slug = decodeURIComponent(raw);
		if (devices.some((d) => d.slug === slug)) selectedSlug = slug;
	};
	apply();
	window.addEventListener('hashchange', apply);
	return () => window.removeEventListener('hashchange', apply);
});

function selectDevice(slug: string) {
	selectedSlug = slug;
	// Update the hash without scrolling the page.
	history.replaceState(null, '', `#${slug}`);
	const el = document.getElementById('aosp-device-detail');
	if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const selectedDevice = $derived(
	selectedSlug ? (devices.find((d) => d.slug === selectedSlug) ?? null) : null,
);

const deviceBuilds = $derived(
	selectedDevice
		? builds
				.filter((b) => b.codename === selectedDevice.slug)
				.sort((a, b) => b.date.localeCompare(a.date))
		: [],
);
const latestBuild = $derived(deviceBuilds[0] ?? null);

// Visual changelog grouping: by section, then by type.
// Render order is curated (boot -> kernel -> security ->
// system -> ui -> build -> networking -> misc) so each
// release reads top-to-bottom in a predictable order.
const SECTION_ORDER: Build['changelog'][number]['section'][] = [
	'boot',
	'kernel',
	'security',
	'system',
	'ui',
	'build',
	'networking',
	'misc',
];

const TYPE_ORDER: Build['changelog'][number]['type'][] = [
	'added',
	'improved',
	'fixed',
	'removed',
];

const TYPE_TONE: Record<ChangeLogEntry['type'], string> = {
	added: 'border-mint-400/30 bg-mint-500/10 text-mint-200',
	improved: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
	fixed: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
	removed: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
};

const TYPE_DOT: Record<ChangeLogEntry['type'], string> = {
	added: 'bg-mint-400',
	improved: 'bg-sky-400',
	fixed: 'bg-amber-400',
	removed: 'bg-rose-400',
};

const STATUS_TONE: Record<Device['status'], string> = {
	active: 'border-mint-400/30 bg-mint-500/10 text-mint-200',
	beta: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
	paused: 'border-neutral-400/30 bg-neutral-500/10 text-neutral-300',
	abandoned: 'border-rose-400/20 bg-rose-500/[0.06] text-rose-300/80',
	eol: 'border-neutral-400/20 bg-neutral-500/[0.06] text-neutral-500',
};

// Group + sort the latest build's changelog for the panel.
const groupedChangelog = $derived.by(() => {
	if (!latestBuild) return [];
	const bySection: Record<string, ChangeLogEntry[]> = {};
	for (const entry of latestBuild.changelog) {
		const bucket = bySection[entry.section] ?? [];
		bucket.push(entry);
		bySection[entry.section] = bucket;
	}
	// Sort entries within a section by type order, keep stable
	// within type. Sort sections by the curated SECTION_ORDER.
	return SECTION_ORDER.filter((s) => bySection[s]).map((section) => ({
		section,
		entries: bySection[section]
			.slice()
			.sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)),
	}));
});
</script>

<svelte:head>
	<title>{$t('aosp.metaTitle')}</title>
	<meta name="description" content={$t('aosp.metaDescription')} />
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-16 sm:px-10 sm:pt-36">
	<!-- ============ HERO ============ -->
	<header class="pb-12 sm:pb-16">
		<div class="mb-6 flex flex-wrap items-center gap-3" data-reveal-tab>
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
			class="text-balance text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
		>
			{$t('aosp.hero.title')}
		</h1>
		<p
			class="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
		>
			{$t('aosp.hero.subtitle')}
		</p>
		<p class="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			{$t('aosp.hero.dataSource')}
		</p>
	</header>

	<!-- ============ DEVICE GRID ============ -->
	<section class="border-t border-white/5 py-10">
		<div class="mb-8 flex items-end justify-between gap-6">
			<div>
				<h2
					class="text-balance text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl"
				>
					{$t('aosp.devices.title')}
				</h2>
				<p class="mt-2 max-w-2xl text-sm text-neutral-500">
					{$t('aosp.devices.subtitle')}
				</p>
			</div>
		</div>

		{#if devices.length === 0}
			<p class="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center text-sm text-neutral-500">
				{$t('aosp.devices.empty')}
			</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each devices as d (d.slug)}
					{@const isSelected = d.slug === selectedSlug}
					<button
						type="button"
						onclick={() => selectDevice(d.slug)}
						aria-pressed={isSelected}
						class="group/dev flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.015] text-left transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/[0.04] {isSelected
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
							<div class="absolute right-3 top-3">
								<Badge
									variant="outline"
									class="border-white/10 bg-neutral-950/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider backdrop-blur {STATUS_TONE[d.status]}"
								>
									{$t(`aosp.status.${d.status}`)}
								</Badge>
							</div>
							<!-- Codename (bottom-left) -->
							{#if d.codename}
								<div class="absolute bottom-3 left-3">
									<span
										class="rounded-md border border-white/10 bg-neutral-950/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-200 backdrop-blur"
									>
										{d.codename}
									</span>
								</div>
							{/if}
						</div>

						<!-- Body -->
						<div class="flex flex-1 flex-col gap-3 p-4">
							<h3 class="text-base font-semibold tracking-tight text-neutral-50">
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
							<div class="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
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
		<section id="aosp-device-detail" class="border-t border-white/5 py-12 sm:py-16">
			<!-- Device hero (compact) -->
			<div class="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
				<div>
					<div class="mb-4 flex flex-wrap items-center gap-2">
						<Badge
							variant="outline"
							class="px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider {STATUS_TONE[dev.status]}"
						>
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
						class="text-balance text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl"
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

			<!-- Specs table -->
			<div
				class="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2"
			>
				{#each Object.entries(dev.specs).filter(([_, v]) => v) as [key, value] (key)}
					<div class="bg-neutral-950 p-4">
						<dt
							class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
						>
							{$t(`aosp.devices.specs.${key}`)}
						</dt>
						<dd class="mt-1.5 text-sm text-neutral-200">{value}</dd>
					</div>
				{/each}
			</div>

			<!-- Latest build card -->
			<div class="mb-4 flex items-center gap-2">
				<h3
					class="text-balance text-xl font-semibold tracking-[-0.02em] text-neutral-50 sm:text-2xl"
				>
					{$t('aosp.build.latest')}
				</h3>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('aosp.build.title')}
				</Badge>
			</div>

			{#if !latestBuild}
				<Card.Root
					class="rounded-2xl border-white/5 bg-white/[0.02] p-8 text-center"
				>
					<p class="text-sm text-neutral-300">{$t('aosp.build.noneYet')}</p>
					<p class="mt-2 text-xs text-neutral-500">{$t('aosp.build.noneYetHint')}</p>
				</Card.Root>
			{:else}
				{@const b = latestBuild}
				<div class="space-y-8">
					<!-- Build meta -->
					<div
						class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-4"
					>
						<div class="bg-neutral-950 p-4">
							<dt
								class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
							>
								{$t('aosp.build.version')}
							</dt>
							<dd class="mt-1.5 font-mono text-sm font-semibold text-neutral-100">
								{b.version}
							</dd>
						</div>
						<div class="bg-neutral-950 p-4">
							<dt
								class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
							>
								{$t('aosp.build.date')}
							</dt>
							<dd class="mt-1.5 font-mono text-sm text-neutral-100">{b.date}</dd>
						</div>
						<div class="bg-neutral-950 p-4">
							<dt
								class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
							>
								{$t('aosp.build.android')}
							</dt>
							<dd class="mt-1.5 font-mono text-sm text-neutral-100">AOSP {b.android}</dd>
						</div>
						<div class="bg-neutral-950 p-4">
							<dt
								class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
							>
								{$t('aosp.build.securityPatch')}
							</dt>
							<dd class="mt-1.5 font-mono text-sm text-neutral-100">{b.securityPatch}</dd>
						</div>
					</div>

					<!-- Downloads -->
					{#if b.downloads.length}
						<div>
							<h4
								class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400"
							>
								{$t('aosp.build.downloads')}
							</h4>
							<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
								{#each b.downloads as dl (dl.name)}
									<a
										href={dl.url}
										target="_blank"
										rel="noreferrer noopener"
										class="group/dl flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
									>
										<div
											class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-mint-400/20 bg-mint-500/10"
										>
											<ArrowUpRight
												size={16}
												weight="bold"
												class="text-mint-300 transition-transform group-hover/dl:-translate-y-0.5 group-hover/dl:translate-x-0.5"
											/>
										</div>
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-semibold text-neutral-100">
												{dl.name}
											</p>
											{#if dl.size}
												<p
													class="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500"
												>
													{$t('aosp.build.size')}: {dl.size}
												</p>
											{/if}
										</div>
									</a>
								{/each}
							</div>
							{#if b.downloads.some((d) => d.sha256)}
								<details
									class="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 font-mono text-[11px] text-neutral-500"
								>
									<summary class="cursor-pointer text-neutral-400 hover:text-neutral-200">
										{$t('aosp.build.sha256')}
									</summary>
									<div class="mt-2 space-y-1">
										{#each b.downloads.filter((d) => d.sha256) as dl (dl.name)}
											<div class="flex items-start gap-2">
												<span class="shrink-0 text-neutral-600">{dl.name}:</span>
												<code class="break-all text-neutral-300">{dl.sha256}</code>
											</div>
										{/each}
									</div>
								</details>
							{/if}
						</div>
					{/if}

					<!-- Notes -->
					{#if b.notes}
						<div
							class="rounded-2xl border border-amber-400/20 bg-amber-500/[0.04] p-4 text-sm text-amber-100/90"
						>
							<p class="mb-1 font-mono text-[10px] uppercase tracking-wider text-amber-300/80">
								{$t('aosp.build.notes')}
							</p>
							<p class="leading-relaxed">{b.notes}</p>
						</div>
					{/if}

					<!-- Visual changelog -->
					<div>
						<h4
							class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400"
						>
							{$t('aosp.build.changelog')}
						</h4>
						{#if b.changelog.length === 0}
							<p class="text-sm text-neutral-500">{$t('aosp.build.noChangelog')}</p>
						{:else}
							<div class="space-y-6">
								{#each groupedChangelog as group (group.section)}
									<div>
										<h5
											class="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
										>
											{$t(`aosp.build.sections.${group.section}`)}
										</h5>
										<ul class="space-y-1.5">
											{#each group.entries as entry, i (i)}
												<li
													class="flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm {TYPE_TONE[entry.type]}"
												>
													<span
														class="mt-1.5 size-1.5 shrink-0 rounded-full {TYPE_DOT[entry.type]}"
														aria-hidden="true"
													></span>
													<div class="min-w-0 flex-1">
														<span
															class="font-mono text-[9px] uppercase tracking-wider opacity-80"
														>
															{$t(`aosp.build.${entry.type}`)}
														</span>
														<p class="leading-relaxed">{entry.text}</p>
													</div>
												</li>
											{/each}
										</ul>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</section>
	{/if}

	<!-- ============ KERNELS SECTION ============ -->
	<section class="border-t border-white/5 py-10">
		<div class="mb-8 flex items-end justify-between gap-6">
			<div>
				<h2
					class="text-balance text-3xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-4xl"
				>
					{$t('aosp.kernels.title')}
				</h2>
				<p class="mt-2 max-w-2xl text-sm text-neutral-500">
					{$t('aosp.kernels.subtitle')}
				</p>
			</div>
		</div>

		{#if kernels.length === 0}
			<div
				class="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center"
			>
				<p class="text-sm text-neutral-300">{$t('aosp.kernels.noneYet')}</p>
				<p class="mt-1 text-xs text-neutral-500">{$t('aosp.kernels.noneYetHint')}</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each kernels as k (k.name)}
					<article
						class="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5"
					>
						<div class="flex items-start justify-between gap-3">
							<div>
								<h3 class="text-base font-semibold text-neutral-50">{k.name}</h3>
								<p class="mt-1 text-xs text-neutral-500">{k.tagline}</p>
							</div>
							<Badge
								variant="outline"
								class="shrink-0 border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-400"
							>
								{k.version}
							</Badge>
						</div>
						<dl
							class="grid grid-cols-2 gap-2 border-t border-white/5 pt-3 font-mono text-[10px] uppercase tracking-wider"
						>
							<div>
								<dt class="text-neutral-500">{$t('aosp.kernels.target')}</dt>
								<dd class="mt-0.5 text-neutral-300">{k.target}</dd>
							</div>
							<div>
								<dt class="text-neutral-500">{$t('aosp.kernels.version')}</dt>
								<dd class="mt-0.5 text-neutral-300">{k.version}</dd>
							</div>
						</dl>
						<div class="flex flex-wrap gap-2">
							<Button href={k.download} target="_blank" rel="noreferrer noopener" size="sm">
								{$t('aosp.kernels.download')}
								<ArrowUpRight
									size={11}
									weight="bold"
									data-icon="inline-end"
									class="ml-1.5"
								/>
							</Button>
							<Button href={k.source} target="_blank" rel="noreferrer noopener" variant="outline" size="sm">
								{$t('aosp.kernels.source')}
								<ArrowUpRight
									size={11}
									weight="bold"
									data-icon="inline-end"
									class="ml-1.5"
								/>
							</Button>
						</div>
						{#if k.notes}
							<p class="text-xs text-neutral-500">{k.notes}</p>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</section>
</main>
