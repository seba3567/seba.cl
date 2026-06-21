<script lang="ts">
/**
 * Chile flag — stylised for the dark theme.
 *
 * - Top half: white
 * - Bottom half: red
 * - Top-left canton: blue with a 5-pointed white star
 *
 * The canton and star are kept slightly desaturated so the flag
 * blends with the dark UI instead of looking like a bright sticker.
 */
type Props = {
	size?: number;
	class?: string;
};
let { size = 18, class: className = '' }: Props = $props();
</script>

<svg
	viewBox="0 0 30 20"
	width={size}
	height={(size * 20) / 30}
	role="img"
	aria-label="Bandera de Chile"
	class="rounded-sm ring-1 ring-white/10 {className}"
>
	<!-- Bottom half (red) -->
	<rect y="10" width="30" height="10" fill="#d52b1e" />
	<!-- Top half (white) -->
	<rect width="30" height="10" fill="#f5f5f4" />
	<!-- Canton (blue square, top-left) -->
	<rect width="12" height="10" fill="#0a3a8c" />
	<!-- 5-pointed star (white, centred in the canton) -->
	<polygon
		points="6,2.5 6.95,4.9 9.5,4.9 7.4,6.4 8.1,8.8 6,7.3 3.9,8.8 4.6,6.4 2.5,4.9 5.05,4.9"
		fill="#f5f5f4"
	/>
</svg>
