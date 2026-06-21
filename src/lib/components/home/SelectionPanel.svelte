<script lang="ts">
import { ArrowUpRight, PhoneX } from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import type { GitHubRepo } from '$lib/server/github';
import { langColor } from '$lib/utils/langColor';

type Props = {
	repos: GitHubRepo[];
};

let { repos }: Props = $props();
</script>

<section
	id="seleccion"
	class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10 flex items-end justify-between gap-6">
			<div data-panel-anim>
				<Badge
					variant="outline"
					class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
				>
					{$t('home.selection.badge', { values: { count: String(repos.length).padStart(2, '0') } })}
				</Badge>
				<h2
					class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl"
				>
					{$t('home.selection.title')}
				</h2>
			</div>
			<a
				href="/proyectos"
				data-panel-anim
				class="group hidden items-center gap-1.5 font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100 sm:inline-flex"
			>
				{$t('home.selection.viewAll')}
				<ArrowUpRight
					size={11}
					weight="bold"
					class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<div class="grid auto-rows-[180px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each repos as r, i (r.id)}
				{@const featured = r.name === 'anticall_chile' || r.topics?.includes('app')}
				<a
					data-panel-anim
					data-grid-item
					href={r.html_url}
					target="_blank"
					rel="noreferrer noopener"
					class="group/repo relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
				>
					<div class="flex items-start justify-between">
						<span
							class="font-mono text-[11px] text-neutral-600 transition-colors group-hover/repo:text-neutral-400"
							>{String(i + 1).padStart(2, '0')}</span
						>
						<ArrowUpRight
							size={14}
							weight="bold"
							class="text-neutral-600 transition-all group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:text-neutral-200"
						/>
					</div>
					<div>
						<h3
							class="text-base font-semibold tracking-[-0.02em] text-neutral-100 sm:text-lg"
						>
							{r.name}
						</h3>
						{#if r.description}
							<p class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500">
								{r.description}
							</p>
						{/if}
						<div class="mt-3 flex flex-wrap items-center gap-1.5">
							{#if r.language}
								<span
									class="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-1.5 py-0.5 text-[10px] font-normal text-neutral-300"
								>
									<span
										class="inline-block size-1.5 rounded-full"
										style="background-color: {langColor(r.language)}"
									></span>
									{r.language}
								</span>
							{/if}
							{#if r.stargazers_count > 0}
								<span class="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-500">
									★ {r.stargazers_count}
								</span>
							{/if}
							{#if featured}
								<span
									class="ml-auto inline-flex items-center gap-1 rounded-md border border-mint-400/20 bg-mint-500/5 px-1.5 py-0.5 text-[9px] font-normal text-mint-300"
								>
									<PhoneX size={8} weight="duotone" />
									{$t('home.selection.featuredTag')}
								</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
