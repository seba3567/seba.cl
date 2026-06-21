<script lang="ts">
	/**
	 * AntiCallLogo — escudo de la app con efecto 3D.
	 *
	 * Estructura visual:
	 *   .logo-3d-wrap      → perspective(900px) para que los hijos
	 *                         se muevan en un espacio 3D real
	 *   .logo-3d           → el plano que contiene la imagen; rota
	 *                         según mouse-move (tilt) y respira
	 *                         en idle (rotateX ±3°)
	 *   .logo-3d-shine     → overlay radial con mix-blend que
	 *                         "barre" la superficie al mover el mouse
	 *
	 * Source: assets/iconos/anticall/icono.avif (workspace del user)
	 * Pipeline: predev/prebuild → bun run optimize:images genera
	 *   icono.avif + icono.webp + @2x en static/iconos/anticall/
	 *
	 * Fallback: si AVIF y WebP no existen (cold start), PhoneX en
	 * cuadrado mint con gradient + ring + shine — visualmente
	 * coherente con el resto de la UI.
	 */
	import { onMount } from 'svelte';
	import { PhoneX } from 'phosphor-svelte';
	import { animate } from 'animejs';

	type Props = {
		size?: number;
		class?: string;
	};
	let { size = 64, class: className = '' }: Props = $props();

	let fallback = $state(false);
	let wrapEl: HTMLDivElement | undefined = $state();
	let planeEl: HTMLDivElement | undefined = $state();
	let shineEl: HTMLDivElement | undefined = $state();

	// 3D tilt on mouse move (mouse-following parallax)
	function onMove(e: MouseEvent) {
		if (!planeEl || !wrapEl) return;
		const rect = wrapEl.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		const maxTilt = 14; // degrees
		animate(planeEl, {
			rotateX: -y * maxTilt * 2,
			rotateY: x * maxTilt * 2,
			duration: 350,
			ease: 'out(3)',
		});
		if (shineEl) {
			// Shine follows the mouse: 0%..100% across the plane
			shineEl.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.18) 0%, transparent 55%)`;
		}
	}
	function onLeave() {
		if (!planeEl) return;
		animate(planeEl, {
			rotateX: 0,
			rotateY: 0,
			duration: 600,
			ease: 'out(4)',
		});
		if (shineEl) {
			shineEl.style.background =
				'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 55%)';
		}
	}

	onMount(() => {
		if (!planeEl) return;
		// Entrance: scale 0.7 → 1 + rotateY -25 → 0
		animate(planeEl, {
			scale: [0.7, 1],
			rotateY: [-25, 0],
			opacity: [0, 1],
			duration: 800,
			ease: 'out(4)',
		});
		// Breathing: gentle rotateX oscillation while idle
		const breathing = animate(planeEl, {
			rotateX: [0, 4, 0, -2, 0],
			scale: [1, 1.015, 1, 0.99, 1],
			duration: 5000,
			ease: 'inOut(2)',
			loop: true,
		});
		return () => {
			try {
				breathing.revert();
			} catch {
				/* noop */
			}
		};
	});
</script>

{#if fallback}
	<div
		class="group/fb relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-mint-400/30 {className}"
		style="width: {size}px; height: {size}px; background: linear-gradient(135deg, rgb(110 231 183) 0%, rgb(16 185 129) 50%, rgb(5 150 105) 100%); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 0 0 1px rgb(16 185 129 / 0.1);"
		role="img"
		aria-label="AntiCallCL"
	>
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent"
		></span>
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-1 rounded-xl ring-1 ring-inset ring-white/10"
		></span>
		<PhoneX
			size={Math.round(size * 0.55)}
			weight="duotone"
			class="relative z-10 text-neutral-950 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
		/>
	</div>
{:else}
	<div
		bind:this={wrapEl}
		class="logo-3d-wrap {className}"
		style="width: {size}px; height: {size}px;"
		onmousemove={onMove}
		onmouseleave={onLeave}
		role="img"
		aria-label="AntiCallCL"
	>
		<div
			bind:this={planeEl}
			class="logo-3d relative size-full"
			style="transform-style: preserve-3d; will-change: transform;"
		>
			<!-- Shine overlay (radial gradient, follows mouse) -->
			<div
				bind:this={shineEl}
				class="logo-3d-shine pointer-events-none absolute inset-0 rounded-[inherit]"
				style="background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 55%); mix-blend-mode: overlay;"
			></div>

			<!-- The actual image -->
			<img
				src="/iconos/anticall/icono.avif"
				alt="AntiCallCL"
				class="size-full select-none object-contain drop-shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
				width={size}
				height={size}
				loading="lazy"
				draggable="false"
				onerror={(e) => {
					const img = e.currentTarget as HTMLImageElement;
					if (!img.dataset.triedWebp) {
						img.dataset.triedWebp = '1';
						img.src = '/iconos/anticall/icono.webp';
					} else {
						fallback = true;
					}
				}}
			/>
		</div>
	</div>
{/if}

<style>
	/* 3D perspective container — children rotate in real 3D space */
	:global(.logo-3d-wrap) {
		perspective: 900px;
	}
	:global(.logo-3d-wrap .logo-3d) {
		transition:
			filter 350ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 350ms cubic-bezier(0.22, 1, 0.36, 1);
		filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.15));
	}
	:global(.logo-3d-wrap:hover .logo-3d) {
		/* Hover: brighter green drop-shadow + a tiny scale-up via the
		     plane transform (we don't animate scale here because the
		     entrance/breathing anime.js loop owns it). */
		filter:
			drop-shadow(0 12px 28px rgba(16, 185, 129, 0.35))
			brightness(1.05);
	}
	:global(.logo-3d-wrap .logo-3d-shine) {
		transition: background 200ms ease-out;
		opacity: 0.6;
	}
	:global(.logo-3d-wrap:hover .logo-3d-shine) {
		opacity: 1;
	}
</style>
