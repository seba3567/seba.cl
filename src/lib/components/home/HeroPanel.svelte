<script lang="ts">
import {
	ArrowUpRight,
	Cpu,
	DeviceMobile,
	EnvelopeSimple,
	GithubLogo,
	Rocket,
	Stack,
} from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import ChileFlag from '$lib/components/ChileFlag.svelte';

// Hero panel — left: name + intro + CTAs, right: 2x2 stat
// grid. The data-stat-card / data-magnetic / panel-h1
// attributes are queried by the parent's onMount to wire
// entrance animations, count-up, and magnetic hover.

type Stat = {
	label: string;
	value: string;
	icon: typeof Cpu;
};

const stats: Stat[] = [
	{ label: 'languages', value: '4', icon: Cpu },
	{ label: 'repos', value: '90+', icon: Stack },
	{ label: 'apps', value: '1', icon: DeviceMobile },
	{ label: 'stack', value: '4', icon: Stack },
];
</script>

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
						<span class="absolute inset-0 animate-ping rounded-full bg-mint-400 opacity-60"
						></span>
						<span class="relative inline-flex size-2 rounded-full bg-mint-300"></span>
					</span>
					<span class="text-[11px] font-medium tracking-tight text-mint-200"
						>{$t('home.hero.status')}</span
					>
				</div>

				<!-- Location: rounded rectangle with the actual Chile flag -->
				<div
					class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1.5 pr-3"
				>
					<ChileFlag size={16} />
					<span class="text-[11px] font-medium tracking-tight text-neutral-200"
						>{$t('home.hero.location')}</span
					>
				</div>
			</div>

			<h1
				class="panel-h1 mt-10 text-[clamp(3.5rem,10vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				style="opacity: 0;"
			>
				{$t('home.hero.nameFirst')}<br />
				<span class="text-neutral-600">{$t('home.hero.nameLast')}</span>
			</h1>

			<p
				class="panel-h1 mt-8 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
				style="opacity: 0;"
			>
				{$t('home.hero.intro')}
			</p>

			<div class="panel-h1 mt-7 flex flex-wrap items-center gap-2" style="opacity: 0;">
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
					{$t('home.hero.viewApps')}
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
					{$t('home.hero.github')}
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
					{$t('home.hero.email')}
				</a>
			</div>
		</div>

		<!-- RIGHT: stats 2x2 (no clash with the name) -->
		<div class="grid grid-cols-2 gap-3" data-panel-anim>
			{#each stats as stat (stat.label)}
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
							{$t(`home.hero.stats.${stat.label}`)}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
