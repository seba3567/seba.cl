<script lang="ts">
import { DeviceMobile } from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import { stackLayers } from '$lib/data/anticall';
</script>

<section
	id="stack"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10" data-panel-anim>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('anticall.stack.badge')}
			</Badge>
			<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				{$t('anticall.stack.title')}
			</h2>
			<p class="mt-2 max-w-2xl text-sm text-neutral-500">
				{$t('anticall.stack.subtitle')}
			</p>
		</div>

		<div
			class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2"
		>
			{#each stackLayers as s (s.layerKey)}
				<div
					data-panel-anim
					class="group flex items-start justify-between gap-4 bg-neutral-950 p-6 transition-colors hover:bg-white/[0.02]"
				>
					<div class="min-w-0">
						<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
							{$t(`anticall.stack.layers.${s.layerKey}`)}
						</p>
						<p class="mt-3 text-xl text-neutral-100 sm:text-2xl">{s.tech}</p>
						<p class="mt-2 text-sm leading-relaxed text-neutral-400">
							{$t(`anticall.stack.details.${s.detailKey}`)}
						</p>
					</div>
					<DeviceMobile
						size={18}
						weight="duotone"
						class="mt-1 shrink-0 text-neutral-600 transition-colors group-hover:text-mint-300"
					/>
				</div>
			{/each}
		</div>
	</div>
</section>
