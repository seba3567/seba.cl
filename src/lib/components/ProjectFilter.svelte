<script lang="ts">
import { Funnel, MagnifyingGlass, X } from 'phosphor-svelte';
import GlassCard from './GlassCard.svelte';

type Props = {
	query: string;
	language: string | null;
	languages: string[];
	onlyFeatured: boolean;
	totalCount: number;
	filteredCount: number;
};
let {
	query = $bindable(''),
	language = $bindable(null),
	languages,
	onlyFeatured = $bindable(false),
	totalCount,
	filteredCount,
}: Props = $props();

function clear() {
	query = '';
	language = null;
	onlyFeatured = false;
}
</script>

<GlassCard variant="strong" class="space-y-4 p-4 sm:p-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<div
			class="relative flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-colors focus-within:border-white/20 focus-within:bg-white/[0.07]"
		>
			<MagnifyingGlass size={16} weight="bold" class="text-neutral-400" />
			<input
				type="search"
				placeholder="Buscar proyectos por nombre o descripción…"
				bind:value={query}
				class="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
			/>
			{#if query}
				<button
					type="button"
					onclick={() => (query = '')}
					class="rounded p-0.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label="Limpiar búsqueda"
				>
					<X size={12} weight="bold" />
				</button>
			{/if}
		</div>

		<label
			class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10"
		>
			<input
				type="checkbox"
				bind:checked={onlyFeatured}
				class="size-3.5 cursor-pointer rounded border-white/20 bg-neutral-900 accent-mint-500"
			/>
			Solo featured
		</label>
	</div>

	<div class="flex items-center gap-2 overflow-x-auto pb-1">
		<Funnel size={14} weight="duotone" class="shrink-0 text-neutral-500" />
		<button
			type="button"
			onclick={() => (language = null)}
			class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors {language ===
			null
				? 'border-white/20 bg-white/10 text-neutral-100'
				: 'border-white/5 bg-white/[0.02] text-neutral-400 hover:border-white/10 hover:text-neutral-200'}"
		>
			Todos
		</button>
		{#each languages as lang (lang)}
			<button
				type="button"
				onclick={() => (language = language === lang ? null : lang)}
				class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors {language ===
				lang
					? 'border-white/20 bg-white/10 text-neutral-100'
					: 'border-white/5 bg-white/[0.02] text-neutral-400 hover:border-white/10 hover:text-neutral-200'}"
			>
				{lang}
			</button>
		{/each}
	</div>

	<div class="flex items-center justify-between text-[11px] text-neutral-500">
		<span>
			Mostrando <span class="font-mono text-neutral-300">{filteredCount}</span> de
			<span class="font-mono text-neutral-300">{totalCount}</span>
		</span>
		{#if query || language || onlyFeatured}
			<button
				type="button"
				onclick={clear}
				class="inline-flex items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-100"
			>
				<X size={10} weight="bold" />
				Limpiar filtros
			</button>
		{/if}
	</div>
</GlassCard>
