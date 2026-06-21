<script lang="ts">
	import { GithubLogo, LinkedinLogo, EnvelopeSimple } from 'phosphor-svelte';
	import GlassCard from './GlassCard.svelte';
</script>

<footer class="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 pb-8">
	<GlassCard variant="strong" class="px-6 py-6 sm:px-8 sm:py-7">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div class="flex items-center gap-4">
				<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">/</span>
				<p class="text-sm text-neutral-300">
					Sebastián Muñoz · <span class="text-neutral-500">@seba3567</span>
				</p>
			</div>
			<div class="flex items-center gap-3 text-neutral-400">
				<a
					href="https://github.com/seba3567"
					target="_blank"
					rel="noreferrer noopener"
					aria-label="GitHub"
					class="rounded-md p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
				>
					<GithubLogo size={16} weight="bold" />
				</a>
				<a
					href="https://www.linkedin.com/in/seba3567"
					target="_blank"
					rel="noreferrer noopener"
					aria-label="LinkedIn"
					class="rounded-md p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
				>
					<LinkedinLogo size={16} weight="bold" />
				</a>
				<a
					href="mailto:seba3567.dev@gmail.com"
					aria-label="Email"
					class="rounded-md p-1.5 transition-colors hover:bg-white/5 hover:text-neutral-100"
				>
					<EnvelopeSimple size={16} weight="bold" />
				</a>
			</div>
		</div>
	</GlassCard>
</footer>
