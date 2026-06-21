<script lang="ts">
	import { ArrowUpRight, EnvelopeSimple, GithubLogo } from 'phosphor-svelte';
	import { t } from 'svelte-i18n';
	import { page } from '$app/state';
	import GlassCard from './GlassCard.svelte';

	const INTRANET = 'https://intranet.seba3567.cl/';
	const EMAIL = 'mailto:seba3567.dev@gmail.com';
	const GITHUB = 'https://github.com/seba3567';

	// The intranet CTA only shows on non-home pages — per AGENTS.md
	// it has to "pass desapercibida" (not draw attention). On the
	// home page it lives only in the SearchPanel, not in the footer.
	const showIntranetCta = $derived(page.url?.pathname !== '/');

	const year = new Date().getFullYear();
</script>

<footer class="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 pb-8">
	<!--
	  Single horizontal bar:
	  - Left:  brand handle + socials (compact)
	  - Right: discreet slogan. On non-home pages the slogan
	           area also hosts a tiny text-link to the intranet,
	           so it never draws attention (passes desapercibida
	           per AGENTS.md).
	-->
	<GlassCard variant="strong" class="rounded-xl px-6 py-5 sm:px-7 sm:py-5">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<!-- Left: brand + socials -->
			<div class="flex items-center gap-4">
				<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">/</span>
				<p class="text-sm text-neutral-300">
					Sebastián Muñoz · <span class="text-neutral-500">@seba3567</span>
				</p>
				<div class="ml-2 flex items-center gap-1 text-neutral-400">
					<a
						href={GITHUB}
						target="_blank"
						rel="noreferrer noopener"
						aria-label="GitHub"
						class="rounded p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
					>
						<GithubLogo size={14} weight="bold" />
					</a>
					<a
						href={EMAIL}
						aria-label="Email"
						class="rounded p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
					>
						<EnvelopeSimple size={14} weight="bold" />
					</a>
				</div>
			</div>

			<!-- Right: discreet slogan. On non-home pages the slogan
			     area also has a tiny text-link to the intranet (no
			     card, no mint accent) so it passes desapercibida
			     per AGENTS.md. -->
			<div class="flex items-center gap-2 text-[11px] text-neutral-500">
				<span class="font-mono uppercase tracking-[0.18em]">
					{$t('footer.copyright', { values: { year } })}
				</span>
				{#if showIntranetCta}
					<span class="text-neutral-700">·</span>
					<a
						href={INTRANET}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:bg-white/[0.03] hover:text-neutral-300"
					>
						{$t('footer.intranet')}
						<ArrowUpRight
							size={10}
							weight="bold"
							class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</a>
				{/if}
			</div>
		</div>
	</GlassCard>
</footer>
