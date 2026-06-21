<script lang="ts">
import { onMount, type Snippet } from 'svelte';
import { startMarquee } from '$lib/animations';

type Props = {
	children: Snippet;
	/** Speed in px/sec, or omit to use duration. */
	speed?: number;
	/** Time for a full loop in ms. Used if `speed` is not set. */
	duration?: number;
	/** Reverse direction. */
	reverse?: boolean;
	/** Pause on hover. */
	pauseOnHover?: boolean;
	/** Vertical gap between rows (px). */
	gap?: number;
	class?: string;
};

let {
	children,
	speed,
	duration = 35000,
	reverse = false,
	pauseOnHover = true,
	gap = 0,
	class: className = '',
}: Props = $props();

let trackEl: HTMLElement | undefined = $state();

// Compute duration from speed (px/sec) over half a track
// so the loop appears seamless
let effectiveDuration = $derived(duration);
$effect(() => {
	if (speed && trackEl) {
		const halfWidth = trackEl.scrollWidth / 2;
		if (halfWidth > 0)
			effectiveDuration = Math.round((halfWidth / speed) * 1000);
	}
});

onMount(() => {
	if (!trackEl) return;
	const cleanup = startMarquee(trackEl, {
		duration: effectiveDuration,
		reverse,
		pauseOnHover,
	});
	return cleanup;
});
</script>

<div
	class="relative w-full overflow-hidden {className}"
	style="mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);"
>
	<div
		bind:this={trackEl}
		class="flex w-max"
		style="gap: {gap}px; will-change: transform;"
	>
		<!-- First copy -->
		<div class="flex shrink-0 items-center" style="gap: {gap}px;">
			{@render children()}
		</div>
		<!-- Second copy (for seamless loop) -->
		<div class="flex shrink-0 items-center" style="gap: {gap}px;" aria-hidden="true">
			{@render children()}
		</div>
	</div>
</div>
