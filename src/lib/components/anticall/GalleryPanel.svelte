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

		<!-- max-h-[60vh] on the grid so the 6 phone screenshots
		     stay inside the 100vh panel. 9:16 aspect at small
		     widths would otherwise produce ~600px tall tiles. -->
		<div
			class="mx-auto grid w-full max-w-full grid-cols-2 content-center gap-3 overflow-hidden sm:grid-cols-3 lg:grid-cols-6"
			style="max-height: 60vh;"
		>
			{#each SCREENSHOTS as n, i (n)}
				<button
					type="button"
					onclick={() => onOpenLightbox(i)}
					data-panel-anim
					aria-label={$t('anticall.screenshot.ariaOpen', { values: { n } })}
					class="group/shot relative m-0 block aspect-[9/16] h-full max-h-full w-auto cursor-zoom-in overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] transition-all duration-500 hover:-translate-y-0.5 hover:border-mint-400/30 hover:bg-white/[0.04]"
				>
					<OptimizedPicture
						src="/apps/anticall/{n}"
						alt="AntiCallCL · pantalla {n}"
						class="size-full object-cover transition-transform duration-500 group-hover/shot:scale-[1.04]"
						width={540}
						height={1200}
					/>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 transition-opacity duration-500 group-hover/shot:opacity-100"
					></div>
					<span
						class="absolute right-2 bottom-2 rounded-md border border-white/10 bg-neutral-950/80 px-1.5 py-0.5 font-mono text-[9px] text-neutral-300 backdrop-blur"
					>
						{n}
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>
