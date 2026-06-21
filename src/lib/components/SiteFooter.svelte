<script lang="ts">
	import { GithubLogo, EnvelopeSimple, ArrowUpRight } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import GlassCard from './GlassCard.svelte';

	const INTRANET = 'https://intranet.seba3567.cl/';
	const EMAIL = 'mailto:seba3567.dev@gmail.com';
	const GITHUB = 'https://github.com/seba3567';
</script>

<footer class="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 pb-8">
	<GlassCard variant="strong" class="rounded-xl px-6 py-6 sm:px-8 sm:py-7">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div class="flex items-center gap-4">
				<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">/</span>
				<p class="text-sm text-neutral-300">
					Sebastián Muñoz · <span class="text-neutral-500">@seba3567</span>
				</p>
			</div>
			<div class="flex items-center gap-3 text-neutral-400">
				<a
					href={GITHUB}
					target="_blank"
					rel="noreferrer noopener"
					aria-label="GitHub"
					class="rounded p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
				>
					<GithubLogo size={16} weight="bold" />
				</a>
				<a
					href={EMAIL}
					aria-label="Email"
					class="rounded p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
				>
					<EnvelopeSimple size={16} weight="bold" />
				</a>
			</div>
		</div>
	</GlassCard>

	<!-- Intranet CTA -->
	<div class="mt-4">
		<Button
			href={INTRANET}
			target="_blank"
			rel="noreferrer noopener"
			class="group h-auto w-full justify-between gap-3 rounded-md border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-amber-500/5 px-5 py-4 backdrop-blur transition-all hover:border-violet-400/40 hover:from-violet-500/20 sm:px-6"
		>
			<div class="flex items-center gap-3">
			<div
				class="flex size-9 items-center justify-center rounded border border-violet-400/20 bg-violet-500/10"
			>
					<span class="font-mono text-xs font-semibold text-violet-300">i</span>
				</div>
				<div class="text-left">
					<p class="text-sm font-semibold text-neutral-100">Intranet seba3567</p>
					<p class="text-[11px] text-neutral-500">intranet.seba3567.cl</p>
				</div>
			</div>
			<ArrowUpRight
				size={16}
				weight="bold"
				class="text-violet-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
			/>
		</Button>
	</div>

	<p class="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
		© {new Date().getFullYear()} · seba3567.cl
	</p>
</footer>
