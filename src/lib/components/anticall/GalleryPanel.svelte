<script lang="ts">
import { t } from 'svelte-i18n';
import OptimizedPicture from '$lib/components/OptimizedPicture.svelte';
import { Badge } from '$lib/components/ui/badge';
import { SCREENSHOTS } from '$lib/data/anticall';

type Props = {
	onOpenLightbox: (index: number) => void;
};

let { onOpenLightbox }: Props = $props();
</script>

<section
	id="gallery"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-8 flex items-end justify-between gap-6" data-panel-anim>
			<div>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('anticall.gallery.badge')}
				</Badge>
				<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
					{$t('anticall.gallery.title')}
				</h2>
				<p class="mt-2 text-sm text-neutral-500">{$t('anticall.gallery.subtitle')}</p>
			</div>
			<p class="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:block">
				{$t('anticall.gallery.format')}
			</p>
		</div>

		<!--
		  3 columns × 2 rows. The previous layout used 6 columns
		  which crushed each phone to ~80px wide on common
		  viewports. 3 columns gives each phone a comfortable
		  ~250-300px and keeps the 9:16 aspect readable. The
		  max-h-[58vh] makes sure the row never spills past the
		  panel's 100vh.
		-->
		<div
			class="mx-auto grid w-full max-w-full grid-cols-3 content-center gap-4 overflow-hidden px-2"
			style="max-height: 58vh;"
		>
			{#each SCREENSHOTS as n, i (n)}
				<button
					type="button"
					onclick={() => onOpenLightbox(i)}
					data-panel-anim
					aria-label={$t('anticall.screenshot.ariaOpen', { values: { n } })}
					class="group/shot relative m-0 block aspect-[9/16] h-full max-h-full w-auto cursor-zoom-in overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:-translate-y-1 hover:border-mint-400/30 hover:bg-white/[0.04]"
				>
					<OptimizedPicture
						src="/apps/anticall/{n}"
						alt={$t('anticall.screenshot.thumbAlt', { values: { n } })}
						class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.04]"
						width={540}
						height={1200}
					/>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent opacity-0 transition-opacity duration-500 group-hover/shot:opacity-100"
					></div>
					<span
						class="absolute right-2 bottom-2 rounded-md border border-white/10 bg-neutral-950/80 px-2 py-0.5 font-mono text-[10px] text-neutral-200 backdrop-blur"
					>
						{n}/{SCREENSHOTS.length}
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>
