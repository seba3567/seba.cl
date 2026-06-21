<script lang="ts">
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import * as Card from '$lib/components/ui/card';
import { specialties } from '$lib/data/profile';
</script>

<section
	id="especialidades"
	class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10" data-panel-anim>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('home.specialties.badge')}
			</Badge>
			<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				{$t('home.specialties.title')}
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each specialties as spec (spec.titleKey)}
				{@const Icon = spec.icon}
				<Card.Root
					data-panel-anim
					data-slot="card"
					class="group flex h-full flex-col gap-4 rounded-2xl border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
				>
					<div
						class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-mint-400/40 group-hover:bg-mint-500/10"
					>
						<Icon
							size={20}
							weight="duotone"
							class="text-neutral-300 transition-colors group-hover:text-mint-300"
						/>
					</div>
					<h3 class="text-base font-semibold text-neutral-50">
						{$t(`home.specialties.groups.${spec.titleKey}.title`)}
					</h3>
					<ul class="flex flex-col gap-1.5">
						{#each spec.items as itemKey (itemKey)}
							<li class="flex items-start gap-2 text-sm text-neutral-300">
								<span class="mt-1.5 size-1 shrink-0 rounded-full bg-mint-400/60"></span>
								<span>{$t(`home.specialties.itemLabels.${itemKey}`)}</span>
							</li>
						{/each}
					</ul>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>
