<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '$lib/utils.js';

type Variant = 'soft' | 'strong' | 'subtle';
type Props = HTMLAttributes<HTMLElement> & {
	variant?: Variant;
	hover?: boolean;
	glow?: string;
	accent?: string;
	glowBorder?: boolean;
	as?: 'div' | 'article' | 'section' | 'aside';
	class?: string;
	children?: Snippet;
};

let {
	variant = 'soft',
	hover = false,
	glow = '',
	accent = '',
	glowBorder = false,
	as = 'div',
	class: className = '',
	children,
	...rest
}: Props = $props();

const baseClass = $derived(
	cn(
		'rounded-2xl',
		variant === 'soft' && 'glass',
		variant === 'strong' && 'glass-strong',
		variant === 'subtle' && 'glass',
		hover && 'glass-hover glass-tap cursor-default',
		glowBorder && 'glass-glow',
		glow,
		accent,
		className,
	),
);
</script>

<svelte:element this={as} class={baseClass} {...rest}>
	{@render children?.()}
</svelte:element>
