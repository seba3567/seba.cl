<script lang="ts">
	import { ArrowUpRight, GithubLogo, Stack } from 'phosphor-svelte';
	import { t } from 'svelte-i18n';
	import { Badge } from '$lib/components/ui/badge';

	type Props = {
		/** rom or kernel — drives the icon color + copy */
		kind: 'rom' | 'kernel';
		/** The GitHub repo path (e.g. `aosp-panther`) — used
		 *  for the "soon" hint and the source link. */
		repo: string;
	};

	let { kind, repo }: Props = $props();
</script>

<article
	class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center sm:p-10"
>
	<div
		class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 {kind === 'rom'
			? 'text-mint-300'
			: 'text-amber-300'}"
	>
		<Stack size={18} weight="duotone" />
	</div>
	<div>
		<p class="text-sm font-semibold text-neutral-200">
			{kind === 'rom'
				? $t('aosp.detail.romsSoonTitle')
				: $t('aosp.detail.kernelsSoonTitle')}
		</p>
		<p class="mt-1 max-w-md text-xs text-neutral-500">
			{kind === 'rom'
				? $t('aosp.detail.romsSoonBody', { values: { repo } })
				: $t('aosp.detail.kernelsSoonBody', { values: { repo } })}
		</p>
	</div>
	<div class="mt-2 flex flex-wrap items-center justify-center gap-2">
		<Badge
			variant="outline"
			class="border-white/10 bg-neutral-950/80 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-400"
		>
			<span
				class="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-neutral-500"
			></span>
			{$t('aosp.detail.comingSoon')}
		</Badge>
		<a
			href={`https://github.com/seba3567/${repo}`}
			target="_blank"
			rel="noreferrer noopener"
			class="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-neutral-100"
		>
			<GithubLogo size={11} weight="bold" />
			{repo}
			<ArrowUpRight size={9} weight="bold" />
		</a>
	</div>
</article>
