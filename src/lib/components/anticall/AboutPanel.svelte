<script lang="ts">
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import * as Card from '$lib/components/ui/card';
import { aboutParagraphKeys, features } from '$lib/data/anticall';
</script>

<section
	id="about"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10" data-panel-anim>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('anticall.about.badge')}
				</Badge>
				<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					{$t('anticall.about.title')}
				</h2>
		</div>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
			<div class="space-y-5 text-pretty text-base leading-relaxed text-neutral-300 lg:col-span-7">
				{#each aboutParagraphKeys as key, i (i)}
					<p data-panel-anim class="text-balance">{$t(`anticall.about.paragraphs.${key}`)}</p>
				{/each}
			</div>

			<aside class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
				{#each features as f, i (f.titleKey)}
					{@const Icon = f.icon}
					<Card.Root
						data-slot="card"
						data-panel-anim
						class="group flex items-start gap-4 rounded-2xl border-white/5 bg-white/[0.015] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-mint-400/20 hover:bg-white/[0.04]"
					>
						<div class="flex shrink-0 items-center gap-3">
							<span
								class="font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-neutral-400"
								>0{i + 1}</span
							>
							<div
								class="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-mint-400/40 group-hover:bg-mint-500/10"
							>
								<Icon
									size={16}
									weight="duotone"
									class="text-neutral-300 transition-colors group-hover:text-mint-300"
								/>
							</div>
						</div>
						<div class="min-w-0">
							<Card.Title class="text-sm font-semibold text-neutral-100">
								{$t(`anticall.about.features.${f.titleKey}.title`)}
							</Card.Title>
							<Card.Description class="mt-1 text-xs leading-relaxed text-neutral-400">
								{$t(`anticall.about.features.${f.bodyKey}.body`)}
							</Card.Description>
						</div>
					</Card.Root>
				{/each}
			</aside>
		</div>
	</div>
</section>
