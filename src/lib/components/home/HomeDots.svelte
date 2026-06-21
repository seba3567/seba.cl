<script lang="ts">
import { animate } from 'animejs';
import { tick } from 'svelte';
import GlassCard from '$lib/components/GlassCard.svelte';

type Section = { id: string; label: string };

type Props = {
	sections: ReadonlyArray<Section>;
	activeId: string;
	onSelect: (id: string) => void;
};

let { sections, activeId, onSelect }: Props = $props();

// Pulse the new active dot whenever activeId changes. The old
// MutationObserver approach in +page.svelte watched the whole
// dot container and re-queried the DOM on every change — it
// fired on hover, focus, and any other attribute churn, not
// just on the active-section transition. Watching the prop
// directly is cheaper AND correct.
$effect(() => {
	// Touch the reactive value so the effect re-runs.
	activeId;
	void tick().then(() => {
		const dot = document.querySelector<HTMLElement>(
			`[data-section-dot="${activeId}"]`,
		);
		if (!dot) return;
		animate(dot, {
			scale: [1, 1.4, 1],
			opacity: [1, 0.6, 1],
			duration: 1200,
			ease: 'inOut(2)',
		});
	});
});
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
	<GlassCard
		variant="strong"
		class="pointer-events-auto flex items-center gap-1 rounded-md px-2 py-1.5"
	>
		{#each sections as s (s.id)}
			<button
				type="button"
				onclick={() => onSelect(s.id)}
				aria-label={'Ir a ' + s.label}
				title={s.label}
				class="group/dot flex items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-white/5"
			>
				<span
					data-section-dot={s.id}
					class="size-1.5 rounded-full transition-all duration-500 {s.id === activeId
						? 'w-5 bg-mint-300'
						: 'bg-neutral-600 group-hover/dot:bg-neutral-400'}"
				></span>
				<span
					class="hidden font-mono text-[10px] uppercase tracking-wider text-neutral-400 transition-opacity duration-300 sm:inline {s.id ===
					activeId
						? 'opacity-100'
						: 'opacity-0'}"
				>
					{s.label}
				</span>
			</button>
		{/each}
	</GlassCard>
</div>
