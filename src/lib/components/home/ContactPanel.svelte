<script lang="ts">
import { EnvelopeSimple, GithubLogo } from 'phosphor-svelte';
import { t } from 'svelte-i18n';
import { Badge } from '$lib/components/ui/badge';
import { contact } from '$lib/data/profile';

type Props = {
	onEmailClick: () => void;
};

let { onEmailClick }: Props = $props();
</script>

<section
	id="contacto"
	class="panel relative flex min-h-screen w-screen flex-col justify-center px-6 pt-16 sm:px-12 lg:px-20"
>
	<div class="mx-auto w-full max-w-5xl">
		<div class="mb-10" data-panel-anim>
			<Badge
				variant="outline"
				class="border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
			>
				{$t('home.contact.badge')}
			</Badge>
			<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				{$t('home.contact.title')}
			</h2>
		</div>

		<div
			class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2"
		>
			{#each contact as c (c.kind)}
				<li class="flex list-none bg-neutral-950">
					{#if c.kind === 'email'}
						<!--
							Email: abre el form protegido (no expone mailto).
							La dirección real vive en el backend, no en el bundle.
						-->
						<button
							type="button"
							onclick={onEmailClick}
							class="group flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/[0.03]"
						>
							<div>
								<p
									class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
								>
									{$t('home.contact.emailLabel')}
								</p>
								<p class="mt-2 text-base text-neutral-100 sm:text-lg">
									{$t('home.contact.emailHandle')}
								</p>
								<p class="mt-1.5 font-mono text-[10px] tracking-wider text-mint-300/80">
									{$t('home.contact.emailNote')}
								</p>
							</div>
							<EnvelopeSimple
								size={18}
								weight="bold"
								class="shrink-0 text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint-300"
							/>
						</button>
					{:else}
						<a
							href={c.href}
							target="_blank"
							rel="noreferrer noopener"
							class="group flex w-full items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]"
						>
							<div>
								<p
									class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500"
								>
									{$t('home.contact.githubLabel')}
								</p>
								<p class="mt-2 text-base text-neutral-100 sm:text-lg">
									{$t('home.contact.githubHandle')}
								</p>
							</div>
							<GithubLogo
								size={18}
								weight="bold"
								class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
							/>
						</a>
					{/if}
				</li>
			{/each}
		</div>

		<p class="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			{$t('common.year', { values: { year: new Date().getFullYear() } })}
		</p>
	</div>
</section>
