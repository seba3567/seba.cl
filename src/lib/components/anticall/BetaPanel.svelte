<script lang="ts">
import { ArrowUpRight, Flask, Users } from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import { BETA_PROGRAM, betaPerkKeys, PLAY_STORE } from '$lib/data/anticall';
</script>

<section
	id="beta"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
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
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
						></span>
						<span class="relative inline-flex size-1.5 rounded-full bg-amber-400"></span>
					</span>
					{$t('anticall.beta.badge')}
				</Badge>

				<h2
					class="mt-6 text-balance text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl"
				>
					{$t('anticall.beta.title')}
				</h2>
				<p class="mt-4 max-w-xl text-balance text-base text-neutral-400 sm:text-lg">
					{$t('anticall.beta.intro')}
				</p>

				<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each betaPerkKeys as perkKey (perkKey)}
						<li
							data-panel-anim
							class="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-neutral-300"
						>
							<Users size={14} weight="duotone" class="mt-0.5 shrink-0 text-amber-300" />
							<span>{$t(`anticall.beta.perks.${perkKey}`)}</span>
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
						{$t('anticall.beta.joinBeta')}
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
						{$t('anticall.beta.viewPlay')}
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
