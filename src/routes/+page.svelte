<script lang="ts">
	import {
		GithubLogo,
		LinkedinLogo,
		EnvelopeSimple,
		ArrowUpRight,
	} from 'phosphor-svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	const AVATAR_URL = 'https://avatars.githubusercontent.com/u/44386561?v=4';

	const profile = {
		name: 'Sebastián Muñoz',
		handle: '@seba3567',
		location: 'Chile',
		tagline: 'Ingeniero en Informática.',
		intro:
			'Backend, datos, mobile, QA. Combino análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
	};

	const work = [
		{
			n: '01',
			title: 'AntiCallCL.',
			sub: 'Android · Kotlin · Python',
			accent: 'violet',
			href: 'https://github.com/seba3567/anticall_pages',
			span: 'col-span-12 lg:col-span-7 row-span-2',
		},
		{
			n: '02',
			title: 'autoskills.',
			sub: 'TypeScript · CLI',
			accent: 'cyan',
			href: 'https://github.com/seba3567/autoskills',
			span: 'col-span-6 lg:col-span-5',
		},
		{
			n: '03',
			title: 'frontend.skeleton.',
			sub: 'Svelte 5 · Tailwind v4',
			accent: 'amber',
			href: 'https://github.com/seba3567/frontend.skeleton',
			span: 'col-span-6 lg:col-span-3',
		},
		{
			n: '04',
			title: 'telefonia_ido.',
			sub: 'Python · REST',
			accent: 'sky',
			href: 'https://github.com/seba3567/telefonia_ido',
			span: 'col-span-6 lg:col-span-2',
		},
		{
			n: '05',
			title: 'Svelte advanced.',
			sub: 'Svelte · TS',
			accent: 'emerald',
			href: 'https://github.com/seba3567/Svelte-avanced-components',
			span: 'col-span-6 lg:col-span-5',
		},
		{
			n: '06',
			title: 'seba.cl.',
			sub: 'este sitio',
			accent: 'fuchsia',
			href: '/proyectos',
			span: 'col-span-6 lg:col-span-3',
		},
		{
			n: '07',
			title: 'seba_flutter_skeleton.',
			sub: 'Dart · Flutter',
			accent: 'rose',
			href: 'https://github.com/seba3567/seba_flutter_skeleton',
			span: 'col-span-6 lg:col-span-2',
		},
		{
			n: '08',
			title: 'PROYECTO-OPS.',
			sub: 'TypeScript',
			accent: 'cyan',
			href: 'https://github.com/seba3567/PROYECTO-OPS',
			span: 'col-span-6 lg:col-span-2',
		},
	];

	const stack = [
		{ label: 'In use', items: 'TypeScript · Django · SQL · Python' },
		{ label: 'In progress', items: 'Kotlin · Dart · Go · Ruby' },
		{ label: 'Base', items: 'JavaScript · Lua · REST · Docker' },
	];

	const contact = [
		{ label: 'GitHub', handle: '@seba3567', href: 'https://github.com/seba3567' },
		{
			label: 'LinkedIn',
			handle: 'in/seba3567',
			href: 'https://www.linkedin.com/in/seba3567',
		},
		{ label: 'Email', handle: 'seba3567.dev@gmail.com', href: 'mailto:seba3567.dev@gmail.com' },
	];

	function isInternal(href: string): boolean {
		return href.startsWith('/');
	}
</script>

<svelte:head>
	<title>Sebastián Muñoz. — @seba3567</title>
	<meta
		name="description"
		content="Sebastián Muñoz (@seba3567) — Ingeniero en Informática. Backend, datos, mobile, QA."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-6xl flex-1 px-6 sm:px-10">
	<!-- ============= HERO ============= -->
	<header class="pt-24 pb-32 sm:pt-36 sm:pb-44">
		<div class="grid grid-cols-12 items-end gap-6">
			<div class="col-span-12 lg:col-span-9">
				<p class="flex items-center gap-3 font-mono text-xs text-neutral-500">
					<span class="size-1.5 rounded-full bg-emerald-400"></span>
					<span>{profile.handle} · {profile.location}</span>
				</p>

				<h1
					class="mt-10 text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-50"
				>
					Sebastián<br />
					<span class="text-neutral-600">Muñoz.</span>
				</h1>

				<p
					class="mt-10 max-w-xl text-balance text-lg leading-relaxed text-neutral-400 sm:text-xl"
				>
					{profile.intro}
				</p>
			</div>

			<div class="col-span-12 flex items-center gap-5 lg:col-span-3 lg:flex-col lg:items-end">
				<Avatar.Root
					class="size-24 overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 sm:size-32"
				>
					<Avatar.Image src={AVATAR_URL} alt={profile.name} class="rounded-2xl object-cover" />
					<Avatar.Fallback
						class="flex size-full items-center justify-center rounded-2xl bg-neutral-900 text-xl font-semibold text-neutral-500"
					>
						SM
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col gap-1 lg:items-end">
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Find me</p>
					<a
						href="https://github.com/seba3567"
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-neutral-50"
					>
						GitHub
						<ArrowUpRight
							size={11}
							weight="bold"
							class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						/>
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- ============= SELECTED WORK ============= -->
	<section id="work" class="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
		<div class="mb-14 flex items-end justify-between gap-6">
			<div>
				<p class="font-mono text-xs text-neutral-500">01 — 08</p>
				<h2
					class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl"
				>
					Work.
				</h2>
			</div>
			<a
				href="/proyectos"
				class="group inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100"
			>
				All projects
				<ArrowUpRight
					size={11}
					weight="bold"
					class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<div class="grid auto-rows-[180px] grid-cols-12 gap-3">
			{#each work as w (w.n)}
				<a
					href={w.href}
					target={isInternal(w.href) ? undefined : '_blank'}
					rel={isInternal(w.href) ? undefined : 'noreferrer noopener'}
					class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] p-5 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04] {w.span}"
				>
					<div class="relative flex items-start justify-between">
						<span class="font-mono text-[11px] text-neutral-600 transition-colors group-hover:text-neutral-400"
							>{w.n}</span
						>
						<ArrowUpRight
							size={14}
							weight="bold"
							class="text-neutral-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
						/>
					</div>
					<div class="relative">
						<div
							class="font-semibold tracking-[-0.02em] text-neutral-100 sm:text-lg md:text-xl"
						>
							{w.title}
						</div>
						<div class="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
							{w.sub}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- ============= STACK ============= -->
	<section id="stack" class="scroll-mt-24 border-t border-white/5 py-20 sm:py-28">
		<div class="mb-14">
			<p class="font-mono text-xs text-neutral-500">Stack</p>
			<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				What I use.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
			{#each stack as s (s.label)}
				<div>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						{s.label}
					</p>
					<p
						class="mt-5 text-balance text-2xl leading-tight tracking-[-0.02em] text-neutral-100 sm:text-3xl"
					>
						{s.items}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ============= CONTACT ============= -->
	<section class="border-t border-white/5 py-20 sm:py-28">
		<div class="mb-14">
			<p class="font-mono text-xs text-neutral-500">Contact</p>
			<h2 class="mt-3 text-5xl font-semibold tracking-[-0.03em] text-neutral-50 sm:text-6xl">
				Say hi.
			</h2>
		</div>

		<ul class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-3">
			{#each contact as c (c.label)}
				<li class="bg-neutral-950">
					<a
						href={c.href}
						target={isInternal(c.href) ? undefined : '_blank'}
						rel={isInternal(c.href) ? undefined : 'noreferrer noopener'}
						class="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]"
					>
						<div>
							<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
								{c.label}
							</p>
							<p class="mt-2 text-base text-neutral-100 sm:text-lg">{c.handle}</p>
						</div>
						{#if c.label === 'GitHub'}
							<GithubLogo
								size={18}
								weight="bold"
								class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
							/>
						{:else if c.label === 'LinkedIn'}
							<LinkedinLogo
								size={18}
								weight="bold"
								class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
							/>
						{:else}
							<EnvelopeSimple
								size={18}
								weight="bold"
								class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
							/>
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		<p class="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
			© {new Date().getFullYear()} Sebastián Muñoz · seba3567.cl
		</p>
	</section>
</main>
