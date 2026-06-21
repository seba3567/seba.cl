<script lang="ts">
	import { Heart, GithubLogo, LinkedinLogo, EnvelopeSimple } from 'phosphor-svelte';
	import GlassCard from './GlassCard.svelte';
</script>

<footer class="relative z-10 mx-auto mt-24 w-full max-w-6xl px-4 pb-10">
	<GlassCard variant="strong" class="px-6 py-8 sm:px-10">
		<div class="grid gap-8 sm:grid-cols-3">
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<div
						class="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500"
					>
						<Heart size={14} weight="fill" class="text-neutral-950" />
					</div>
					<span class="text-sm font-semibold text-neutral-100">Sebastián Muñoz</span>
				</div>
				<p class="text-sm leading-relaxed text-neutral-400">
					Ingeniero en Informática · Backend, datos y mobile. Construyendo herramientas
					abiertas desde Chile.
				</p>
			</div>

			<div class="space-y-2">
				<h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Sitio</h3>
				<ul class="space-y-1.5 text-sm text-neutral-300">
					<li><a href="#proyectos" class="hover:text-neutral-100">Proyectos destacados</a></li>
					<li><a href="#todos" class="hover:text-neutral-100">Todos los repos</a></li>
					<li>
						<a
							href="https://intranet.seba.cl"
							class="hover:text-neutral-100"
							target="_blank"
							rel="noreferrer noopener">intranet.seba.cl</a
						>
					</li>
				</ul>
			</div>

			<div class="space-y-2">
				<h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Conectar</h3>
				<ul class="space-y-1.5 text-sm text-neutral-300">
					<li>
						<a
							href="https://github.com/seba3567"
							target="_blank"
							rel="noreferrer noopener"
							class="inline-flex items-center gap-2 hover:text-neutral-100"
						>
							<GithubLogo size={14} weight="bold" />
							github.com/seba3567
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/seba3567"
							target="_blank"
							rel="noreferrer noopener"
							class="inline-flex items-center gap-2 hover:text-neutral-100"
						>
							<LinkedinLogo size={14} weight="bold" />
							LinkedIn
						</a>
					</li>
					<li>
						<a
							href="mailto:seba3567.dev@gmail.com"
							class="inline-flex items-center gap-2 hover:text-neutral-100"
						>
							<EnvelopeSimple size={14} weight="bold" />
							seba3567.dev@gmail.com
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-xs text-neutral-500 sm:flex-row"
		>
			<p>
				© {new Date().getFullYear()} Sebastián Muñoz · Construido con Svelte 5 + Tailwind v4
			</p>
			<p class="font-mono">seba3567.cl · intranet.seba.cl</p>
		</div>
	</GlassCard>
</footer>
