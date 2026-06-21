<script lang="ts">
import { t } from 'svelte-i18n';
import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
import { Badge } from '$lib/components/ui/badge';
import { FEATURED_SCREENSHOT } from '$lib/data/anticall';

type Props = {
	onOpenLightbox: (index: number) => void;
};

let { onOpenLightbox }: Props = $props();
</script>

<section
	id="screenshot"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-8 flex items-end justify-between gap-6" data-panel-anim>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('anticall.screenshot.badge')}
				</Badge>
				<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					{$t('anticall.screenshot.title')}
				</h2>
			</div>
			<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
				{$t('anticall.screenshot.hint')}
			</p>
		</div>

		<button
			type="button"
			onclick={() => onOpenLightbox(FEATURED_SCREENSHOT - 1)}
			data-panel-anim
			class="group relative mx-auto block max-w-md cursor-zoom-in"
			aria-label={$t('anticall.screenshot.ariaOpen', { values: { n: FEATURED_SCREENSHOT } })}
		>
			<div
				aria-hidden="true"
				class="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-mint-500/15 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
			></div>
			<div
				class="relative mx-auto aspect-[9/16] max-h-[60vh] w-auto overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:scale-[1.02]"
			>
				<OptimizedPicture
					src="/apps/anticall/{FEATURED_SCREENSHOT}"
					alt={$t('anticall.screenshot.mainAlt')}
					class="size-full object-cover"
					width={540}
					height={1200}
					loading="eager"
				/>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"
				></div>
			</div>
			<span
				class="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] text-neutral-300 backdrop-blur transition-colors group-hover:bg-white/10"
			>
				{$t('anticall.screenshot.hint')}
			</span>
		</button>
	</div>
</section>
