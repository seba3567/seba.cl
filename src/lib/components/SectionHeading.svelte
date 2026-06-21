<script lang="ts">
import type { Snippet } from 'svelte';

type Props = {
	eyebrow?: string;
	title: string;
	description?: string;
	align?: 'left' | 'center';
	children?: Snippet;
};

let { eyebrow, title, description, align = 'left', children }: Props = $props();
</script>

<div class="space-y-3 {align === 'center' ? 'text-center' : ''}">
	{#if eyebrow}
		<div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
			<span class="size-1.5 rounded-full bg-gradient-to-r from-mint-400 to-mint-400"></span>
			{eyebrow}
		</div>
	{/if}
	<h2
		class="text-balance text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl"
	>
		{title}
	</h2>
	{#if description}
		<p class="max-w-2xl text-pretty text-sm leading-relaxed text-neutral-400 sm:text-base {align === 'center' ? 'mx-auto' : ''}">
			{description}
		</p>
	{/if}
	{#if children}
		<div>{@render children()}</div>
	{/if}
</div>
