<script lang="ts">
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import { stack } from '$lib/data/profile';
</script>

<section
	id="stack"
	class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10" data-panel-anim>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('home.stack.badge')}
			</Badge>
			<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				{$t('home.stack.title')}
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
			{#each stack as s (s.labelKey)}
				<div data-panel-anim>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						{$t(`home.stack.groups.${s.labelKey}`)}
					</p>
					<p
						class="mt-5 text-balance text-2xl leading-tight tracking-[-0.02em] text-neutral-100 sm:text-3xl"
					>
						{s.items}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
