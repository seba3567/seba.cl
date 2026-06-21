<script lang="ts">
import {
	ArrowUpRight,
	Code,
	Database,
	DeviceMobile,
	Flask,
	Lock,
	ShieldCheck,
} from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import AntiCallLogo from '$lib/components/AntiCallLogo.svelte';
import { Badge } from '$lib/components/ui/badge';
import { BETA_PROGRAM, PLAY_STORE } from '$lib/data/anticall';

type Props = {
	titleEl: HTMLElement | undefined;
	onOpenPrivacy: () => void;
};

let { titleEl, onOpenPrivacy }: Props = $props();
</script>

<section
	id="hero"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
>
	<div
		class="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.3fr_1fr]"
	>
		<!-- Left: title + intro + CTAs -->
		<div>
			<div class="flex items-center gap-3" data-panel-anim>
				<Badge
					variant="outline"
					class="border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300"
				>
					<span class="relative flex size-1.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60"
						></span>
						<span class="relative inline-flex size-1.5 rounded-full bg-amber-300"></span>
					</span>
					{$t('anticall.hero.beta')}
				</Badge>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-neutral-300"
				>
					<DeviceMobile size={10} weight="duotone" class="mr-1" />
					{$t('anticall.hero.android')}
				</Badge>
			</div>

			<h1
				bind:this={titleEl}
				class="mt-10 text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
			>
				{$t('anticall.hero.title')}<span class="text-neutral-600">.</span>
			</h1>

			<p class="mt-8 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl">
				{$t('anticall.hero.intro')}
			</p>

			<div class="mt-7 flex flex-wrap items-center gap-2" data-panel-anim>
				<a
					href={BETA_PROGRAM}
					target="_blank"
					rel="noreferrer noopener"
					class="group inline-flex items-center gap-2 rounded-lg bg-mint-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-mint-500/30 transition-all duration-300 hover:scale-[1.02] hover:bg-mint-400 hover:shadow-mint-500/50"
				>
					<Flask
						size={16}
						weight="fill"
						class="transition-transform duration-500 group-hover:-rotate-12"
					/>
					{$t('anticall.hero.joinBeta')}
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
					{$t('anticall.hero.playStore')}
				</a>
				<button
					type="button"
					onclick={onOpenPrivacy}
					class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-neutral-100 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
				>
					<Lock size={14} weight="bold" />
					{$t('anticall.hero.privacy')}
				</button>
			</div>
		</div>

		<!-- Right: logo + quick stats -->
		<div class="flex flex-col items-stretch gap-3" data-panel-anim>
			<!-- Big logo card: NO background, NO border, just the
			     glass + a generous p-12 for breathing room. The
			     3D-tilting logo is the visual anchor. -->
			<div class="glass flex flex-1 items-center justify-center rounded-2xl p-12">
				<AntiCallLogo
					size={220}
					class="drop-shadow-[0_16px_48px_rgba(16,185,129,0.22)]"
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
						<div class="truncate font-sans text-sm font-semibold text-neutral-50">Flutter</div>
						<div class="font-mono text-[9px] uppercase tracking-wider text-neutral-500">UI</div>
					</div>
				</div>
				<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
					<div
						class="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
					>
						<Code size={12} weight="duotone" class="text-neutral-300" />
					</div>
					<div class="min-w-0">
						<div class="truncate font-sans text-sm font-semibold text-neutral-50">Kotlin</div>
						<div class="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Nativo</div>
					</div>
				</div>
				<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
					<div
						class="flex size-7 shrink-0 items-center justify-center rounded-md border border-mint-400/30 bg-mint-500/10"
					>
						<ShieldCheck size={12} weight="duotone" class="text-mint-300" />
					</div>
					<div class="min-w-0">
						<div class="truncate font-sans text-sm font-semibold text-mint-300">100%</div>
						<div class="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Local</div>
					</div>
				</div>
				<div class="glass flex items-center gap-2.5 rounded-xl p-2.5">
					<div
						class="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5"
					>
						<Database size={12} weight="duotone" class="text-neutral-300" />
					</div>
					<div class="min-w-0">
						<div class="truncate font-sans text-sm font-semibold text-neutral-50">0</div>
						<div
							class="truncate font-mono text-[9px] uppercase tracking-wider text-neutral-500"
							title="Servidores"
						>
							Servers
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
