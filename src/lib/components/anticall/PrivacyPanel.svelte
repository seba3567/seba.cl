<script lang="ts">
import { ArrowUpRight, Lock, ShieldCheck } from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import { PRIVACY_URL, privacyPointKeys } from '$lib/data/anticall';

type Props = {
	onOpenPrivacy: () => void;
};

let { onOpenPrivacy }: Props = $props();
</script>

<section
	id="privacy"
	class="panel relative flex h-full w-screen flex-col justify-center px-6 pt-20 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10" data-panel-anim>
			<Badge
				variant="outline"
				class="border-mint-400/20 bg-mint-500/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mint-300"
			>
				{$t('anticall.privacy.badge')}
			</Badge>
			<h2 class="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-5xl">
				{$t('anticall.privacy.title')}
			</h2>
		</div>

		<div
			class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2"
		>
			{#each privacyPointKeys as key, i (i)}
				<div data-panel-anim class="flex items-start gap-3 bg-neutral-950 p-5">
					<span class="font-mono text-[10px] text-neutral-600">0{i + 1}</span>
					<p class="text-sm leading-relaxed text-neutral-300">{$t(`anticall.privacy.points.${key}`)}</p>
				</div>
			{/each}
		</div>

		<div class="mt-6 flex flex-wrap items-center gap-3" data-panel-anim>
			<a
				href={PRIVACY_URL}
				target="_blank"
				rel="noreferrer noopener"
				class="inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:text-neutral-100"
			>
				<Lock size={11} weight="bold" />
				{$t('anticall.privacy.readPolicy')}
				<ArrowUpRight size={10} weight="bold" />
			</a>
			<button
				type="button"
				onclick={onOpenPrivacy}
				class="inline-flex items-center gap-1.5 rounded-md border border-mint-400/20 bg-mint-500/5 px-3 py-1.5 font-mono text-[11px] text-mint-200 transition-colors hover:bg-mint-500/15"
			>
				<ShieldCheck size={11} weight="bold" />
				{$t('anticall.privacy.viewSummary')}
			</button>
		</div>
	</div>
</section>
