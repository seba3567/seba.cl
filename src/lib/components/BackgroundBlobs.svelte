<script lang="ts">
	// Subtle minimal blobs - just two muted gradients
	const blobs = [
		{
			color: 'from-violet-900/15 via-transparent to-transparent',
			size: 'w-[600px] h-[600px]',
			position: 'top-[-10%] left-[-5%]',
			speed: 'animate-blob-slow',
		},
		{
			color: 'from-neutral-700/10 via-transparent to-transparent',
			size: 'w-[500px] h-[500px]',
			position: 'bottom-[-10%] right-[-5%]',
			speed: 'animate-blob',
		},
	] as const;
</script>

<div
	aria-hidden="true"
	class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950"
>
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.04),transparent_60%)]"
	></div>

	{#each blobs as blob (blob.position)}
		<div
			class="{blob.position} {blob.size} {blob.speed} absolute rounded-full bg-gradient-to-br {blob.color} blur-3xl opacity-50"
		></div>
	{/each}

	<div
		class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
	></div>
</div>
