<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowDown,
		GithubLogo,
		LinkedinLogo,
		EnvelopeSimple,
		ArrowUpRight,
		Target,
		GraduationCap,
		Handshake,
		Books,
		Code,
		Database,
		Kanban,
		Brain,
		Gear,
		Lightning,
		MapTrifold,
		Sparkle,
	} from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Avatar from '$lib/components/ui/avatar';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	const AVATAR_URL = 'https://avatars.githubusercontent.com/u/44386561?v=4';

	const profile = {
		name: 'Sebastián Muñoz',
		handle: '@seba3567',
		tagline: 'Ingeniero de Software y Datos',
		roles: [
			'Software Engineering',
			'Data Analytics & BI',
			'Backend Architecture',
			'Clean Code + Business Impact',
		],
		intro:
			'Ingeniero en Informática orientado a resultados de negocio, combinando análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
		introShort: 'Backend · Datos · Mobile · Calidad',
		location: 'Chile · Remote-friendly',
		education: 'Ingeniería en Informática',
		specialization: 'Ciencia de Datos, Backend y QA',
		languages: ['Español (nativo)', 'Inglés (intermedio-alto)'],
		valueProps: [
			'Entregables claros: documentación, código mantenible y criterios de calidad definidos.',
			'Comunicación activa: avances visibles, riesgos identificados y decisiones técnicas justificadas.',
			'Enfoque en impacto: priorización por valor de negocio y mejora continua basada en métricas.',
		],
	};

	const stackLevels = [
		{
			level: 'Intermedio (en uso activo)',
			accent: 'emerald',
			items: ['TypeScript', 'Django', 'SQL', 'Python'],
		},
		{
			level: 'En progreso (foco actual)',
			accent: 'cyan',
			items: ['Kotlin', 'Dart (Flutter)', 'Go', 'Ruby'],
		},
		{
			level: 'Base funcional',
			accent: 'amber',
			items: ['JavaScript', 'Lua', 'APIs REST', 'Docker', 'GitHub'],
		},
	] as const;

	const areas = [
		'Backend: diseño de APIs, estructura de proyectos y buenas prácticas de mantenibilidad.',
		'Datos: modelado, análisis estadístico y apoyo a decisiones con BI.',
		'Calidad: testing, documentación técnica y mejora continua.',
	];

	const specialties = [
		{
			icon: Database,
			title: 'Ciencia de Datos',
			items: [
				'Inteligencia de Negocios',
				'Modelado y análisis de datos',
				'Visualización y storytelling con datos',
				'Análisis estadístico aplicado',
			],
		},
		{
			icon: Code,
			title: 'Desarrollo de Software',
			items: [
				'Diseño de arquitectura backend',
				'APIs robustas y mantenibles',
				'Aseguramiento de calidad y testing',
				'Versionado y colaboración técnica',
			],
		},
		{
			icon: Kanban,
			title: 'Gestión Técnica',
			items: [
				'Trabajo ágil (Scrum/Kanban)',
				'Levantamiento y refinamiento de requerimientos',
				'Documentación técnica clara',
				'Enfoque en mejora continua',
			],
		},
	] as const;

	const method = [
		{ key: 'A', label: 'Descubrimiento' },
		{ key: 'B', label: 'Diseño' },
		{ key: 'C', label: 'Implementación' },
		{ key: 'D', label: 'Testing' },
		{ key: 'E', label: 'Medición' },
		{ key: 'F', label: 'Iteración' },
	] as const;

	const collaboration = [
		'Ingeniería de datos y automatización de reportes.',
		'Backend con APIs escalables.',
		'Optimización de procesos técnicos con foco en impacto de negocio.',
	];

	const accentMap: Record<(typeof stackLevels)[number]['accent'], string> = {
		emerald: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
		cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300',
		amber: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
	};

	let typed = $state('');
	let roleIndex = $state(0);
	let charIndex = $state(0);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const tick = () => {
			const role = profile.roles[roleIndex];
			if (charIndex < role.length) {
				typed = role.slice(0, charIndex + 1);
				charIndex += 1;
				setTimeout(tick, 60);
			} else {
				setTimeout(() => {
					roleIndex = (roleIndex + 1) % profile.roles.length;
					charIndex = 0;
					typed = '';
					setTimeout(tick, 400);
				}, 1800);
			}
		};
		setTimeout(tick, 600);
	});
</script>

<svelte:head>
	<title>seba3567.cl · Sebastián Muñoz · Ingeniero de Software y Datos</title>
	<meta
		name="description"
		content="Sebastián Muñoz (@seba3567) — Ingeniero en Informática. Backend, datos, mobile, QA. Construye AntiCallCL, autoskills y frontend.skeleton."
	/>
</svelte:head>

<main class="relative mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-12 sm:pt-20">
	<!-- ============= HERO ============= -->
	<section class="relative pb-16 sm:pb-24">
		<div class="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
			<div class="space-y-6">
				<div class="flex items-center gap-2">
					<Badge
						variant="outline"
						class="border-violet-400/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300"
					>
						<span class="size-1.5 rounded-full bg-violet-300"></span>
						Open to collaborate
					</Badge>
					<Badge
						variant="outline"
						class="border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-neutral-300"
					>
						<MapTrifold size={10} weight="duotone" class="mr-1" />
						{profile.location}
					</Badge>
				</div>

				<div class="space-y-3">
					<h1
						class="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-neutral-50 sm:text-5xl md:text-6xl"
					>
						Sebastián
						<span
							class="block bg-gradient-to-br from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent"
						>
							Muñoz
						</span>
					</h1>
					<p class="font-mono text-sm text-neutral-500">
						{profile.handle} · {profile.tagline}
					</p>
				</div>

				<div
					class="font-mono inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-neutral-200"
				>
					<Sparkle size={14} weight="fill" class="text-violet-300" />
					<span class="min-w-[14ch]">{typed || ' '}</span>
					<span class="ml-0.5 inline-block h-4 w-px animate-pulse bg-neutral-300"></span>
				</div>

				<p class="max-w-xl text-pretty text-base leading-relaxed text-neutral-300">
					{profile.intro}
				</p>

				<div class="flex flex-wrap gap-2">
					<a
						href="/proyectos"
						class="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] hover:shadow-violet-500/40"
					>
						<Lightning size={16} weight="fill" />
						Ver proyectos
						<ArrowUpRight
							size={12}
							weight="bold"
							class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</a>
					<a
						href="https://github.com/seba3567"
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-neutral-100 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
					>
						<GithubLogo size={16} weight="bold" />
						GitHub
					</a>
					<a
						href="https://www.linkedin.com/in/seba3567"
						target="_blank"
						rel="noreferrer noopener"
						class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-neutral-100 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
					>
						<LinkedinLogo size={16} weight="bold" />
						LinkedIn
					</a>
					<a
						href="mailto:seba3567.dev@gmail.com"
						class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-neutral-100 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
					>
						<EnvelopeSimple size={16} weight="bold" />
						Email
					</a>
				</div>
			</div>

			<GlassCard variant="strong" hover class="group relative overflow-hidden p-5">
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl transition-opacity duration-500 group-hover:opacity-100"
				></div>
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<Avatar.Root
							class="size-12 rounded-2xl border border-white/15 bg-white/5 p-0 ring-2 ring-violet-400/20 transition-all group-hover:ring-violet-400/40"
						>
							<Avatar.Image src={AVATAR_URL} alt={profile.name} class="rounded-xl" />
							<Avatar.Fallback
								class="flex size-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 text-sm font-bold text-neutral-950"
							>
								SM
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<div class="truncate text-sm font-semibold text-neutral-100">
								{profile.name}
							</div>
							<div class="truncate font-mono text-[11px] text-neutral-500">
								{profile.handle} · {profile.education}
							</div>
						</div>
					</div>

					<Separator class="bg-white/5" />

					<dl class="space-y-2.5 text-xs">
						<div class="flex items-start gap-2">
							<GraduationCap size={14} weight="duotone" class="mt-0.5 shrink-0 text-cyan-300" />
							<div>
								<dt class="text-[10px] uppercase tracking-wider text-neutral-500">Formación</dt>
								<dd class="text-neutral-200">{profile.education}</dd>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Target size={14} weight="duotone" class="mt-0.5 shrink-0 text-fuchsia-300" />
							<div>
								<dt class="text-[10px] uppercase tracking-wider text-neutral-500">
									Especialización
								</dt>
								<dd class="text-neutral-200">{profile.specialization}</dd>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Books size={14} weight="duotone" class="mt-0.5 shrink-0 text-amber-300" />
							<div>
								<dt class="text-[10px] uppercase tracking-wider text-neutral-500">Idiomas</dt>
								<dd class="text-neutral-200">{profile.languages.join(' · ')}</dd>
							</div>
						</div>
					</dl>

					<Separator class="bg-white/5" />

					<div class="flex flex-wrap gap-1.5">
						{#each areas as area (area)}
							{@const label = area.split(':')[0]}
							<Badge
								variant="outline"
								class="border-white/10 bg-white/[0.03] text-[10px] font-normal text-neutral-300"
							>
								{label}
							</Badge>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>

		<div class="mt-12 flex justify-center">
			<a
				href="#valor"
				class="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
				aria-label="Bajar"
			>
				<ArrowDown size={12} weight="bold" class="animate-bounce" />
			</a>
		</div>
	</section>

	<!-- ============= PROPUESTA DE VALOR ============= -->
	<section id="valor" class="scroll-mt-24 py-12">
		<SectionHeading
			eyebrow="Propuesta de valor"
			title="Qué podés esperar de mi trabajo"
			description="Cómo traduzco requerimientos en entregables medibles."
		/>

		<div class="mt-8 grid gap-3 sm:grid-cols-3">
			{#each profile.valueProps as text, i (i)}
				<GlassCard hover class="group flex h-full flex-col gap-3 p-5">
					<div
						class="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs text-neutral-300 transition-colors group-hover:border-violet-400/40 group-hover:bg-violet-500/10 group-hover:text-violet-300"
					>
						0{i + 1}
					</div>
					<p class="text-sm leading-relaxed text-neutral-300">{text}</p>
				</GlassCard>
			{/each}
		</div>
	</section>

	<!-- ============= STACK PRINCIPAL ============= -->
	<section id="stack" class="scroll-mt-24 py-12">
		<SectionHeading
			eyebrow="Stack"
			title="Stack principal"
			description="Perfil en crecimiento: base técnica amplia y especialización progresiva en backend, mobile y analítica."
		/>

		<div class="mt-8 grid gap-4 lg:grid-cols-3">
			{#each stackLevels as level (level.level)}
				<Card.Root
					class="group relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-violet-500/10"
				>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br {accentMap[
							level.accent
						]
							.replace('bg-', 'from-')
							.replace('text-', 'to-')
							.replace('/10', '/30')} to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
					></div>
					<Card.Header class="relative">
						<Badge
							variant="outline"
							class="self-start border {accentMap[level.accent]} px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
						>
							{level.level}
						</Badge>
					</Card.Header>
					<Card.Content class="relative flex flex-wrap gap-1.5">
						{#each level.items as item (item)}
							<span
								class="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-xs text-neutral-200 transition-colors hover:border-white/15 hover:bg-white/5"
							>
								{item}
							</span>
						{/each}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- ============= SELECTED WORK ============= -->
	<section id="work" class="scroll-mt-24 py-12">
		<SectionHeading
			eyebrow="Selected work"
			title="Proyectos destacados."
			description="Una muestra curada — entrá a /proyectos para ver los 90+ repos."
		>
			<a
				href="/proyectos"
				class="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-100"
			>
				Ver todos
				<ArrowUpRight size={10} weight="bold" />
			</a>
		</SectionHeading>

		<div class="mt-8 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-4">
			{#each [{ title: 'AntiCallCL', sub: 'Android · Kotlin', accent: 'violet', n: '01', href: 'https://github.com/seba3567/anticall_pages', span: 'col-span-2 row-span-2' }, { title: 'autoskills', sub: 'TS · CLI', accent: 'cyan', n: '02', href: 'https://github.com/seba3567/autoskills', span: '' }, { title: 'frontend.skeleton', sub: 'Svelte 5', accent: 'amber', n: '03', href: 'https://github.com/seba3567/frontend.skeleton', span: '' }, { title: 'telefonia_ido', sub: 'Python', accent: 'sky', n: '04', href: 'https://github.com/seba3567/telefonia_ido', span: 'col-span-2' }, { title: 'Svelte advanced', sub: 'Svelte 5', accent: 'emerald', n: '05', href: 'https://github.com/seba3567/Svelte-avanced-components', span: '' }, { title: 'seba.cl', sub: 'este sitio', accent: 'fuchsia', n: '06', href: '/proyectos', span: '' }] as w (w.n)}
				{@const accent =
					w.accent === 'violet' ? { ring: 'ring-violet-400/30', text: 'text-violet-300', bg: 'from-violet-500/20' } :
					w.accent === 'cyan' ? { ring: 'ring-cyan-400/30', text: 'text-cyan-300', bg: 'from-cyan-500/20' } :
					w.accent === 'amber' ? { ring: 'ring-amber-400/30', text: 'text-amber-300', bg: 'from-amber-500/20' } :
					w.accent === 'sky' ? { ring: 'ring-sky-400/30', text: 'text-sky-300', bg: 'from-sky-500/20' } :
					w.accent === 'emerald' ? { ring: 'ring-emerald-400/30', text: 'text-emerald-300', bg: 'from-emerald-500/20' } :
					{ ring: 'ring-fuchsia-400/30', text: 'text-fuchsia-300', bg: 'from-fuchsia-500/20' }}
				<a
					href={w.href}
					target={w.href.startsWith('/') ? undefined : '_blank'}
					rel={w.href.startsWith('/') ? undefined : 'noreferrer noopener'}
					class="group glass glass-hover relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 ring-1 {accent.ring} {w.span}"
				>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br {accent.bg} to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
					></div>
					<div class="relative flex items-start justify-between">
						<span class="font-mono text-[10px] text-neutral-500">{w.n}</span>
						<ArrowUpRight
							size={12}
							weight="bold"
							class="text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-200"
						/>
					</div>
					<div class="relative">
						<div class="font-mono text-base font-semibold text-neutral-50 sm:text-lg">
							{w.title}
						</div>
						<div class="mt-0.5 font-mono text-[10px] uppercase tracking-wider {accent.text}">
							{w.sub}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- ============= ESPECIALIDADES ============= -->
	<section class="py-12">
		<SectionHeading
			eyebrow="Especialidades"
			title="🧩 En qué me especializo"
			description="Tres ejes donde aporto valor concreto."
		/>

		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each specialties as spec (spec.title)}
				{@const Icon = spec.icon}
				<GlassCard hover class="group flex h-full flex-col gap-4 p-5">
					<div
						class="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:border-violet-400/40 group-hover:bg-violet-500/10"
					>
						<Icon
							size={20}
							weight="duotone"
							class="text-neutral-300 transition-colors group-hover:text-violet-300"
						/>
					</div>
					<div>
						<h3 class="text-base font-semibold text-neutral-50">{spec.title}</h3>
					</div>
					<ul class="flex flex-col gap-1.5">
						{#each spec.items as item (item)}
							<li class="flex items-start gap-2 text-sm text-neutral-300">
								<span class="mt-1.5 size-1 shrink-0 rounded-full bg-violet-400/60"></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</GlassCard>
			{/each}
		</div>
	</section>

	<!-- ============= MÉTODO DE TRABAJO ============= -->
	<section class="py-12">
		<SectionHeading
			eyebrow="Método"
			title="Cómo trabajo"
			description="Ciclo iterativo de mejora continua."
		/>

		<GlassCard variant="strong" class="mt-8 overflow-x-auto p-6">
			<div class="flex items-center justify-between gap-2 min-w-[640px]">
				{#each method as step, i (step.key)}
					{@const isLast = i === method.length - 1}
					<div class="flex items-center gap-2">
						<div class="flex flex-col items-center gap-1.5">
							<div
								class="flex size-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-amber-500/10 font-mono text-sm font-bold text-neutral-100 transition-all hover:scale-110 hover:border-violet-400/40"
							>
								{step.key}
							</div>
							<div class="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
								{step.label}
							</div>
						</div>
						{#if !isLast}
							<ArrowUpRight size={14} weight="bold" class="text-neutral-600" />
						{/if}
					</div>
				{/each}
			</div>
		</GlassCard>
	</section>

	<!-- ============= COLABORACIÓN ============= -->
	<section class="py-12">
		<SectionHeading
			eyebrow="🤝 Colaboración"
			title="Estoy abierto a colaborar"
			description="Si te interesa alguno de estos temas, escribime por GitHub o email."
		/>

		<GlassCard variant="strong" hover class="mt-8 grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
			<ul class="flex flex-col gap-2">
				{#each collaboration as item (item)}
					<li class="flex items-start gap-2.5 text-sm text-neutral-300">
						<Handshake size={16} weight="duotone" class="mt-0.5 shrink-0 text-amber-300" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
			<div class="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
				<a
					href="https://github.com/seba3567"
					target="_blank"
					rel="noreferrer noopener"
					class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-neutral-100 transition-all hover:border-white/20 hover:bg-white/10"
				>
					<GithubLogo size={16} weight="bold" />
					GitHub
				</a>
				<a
					href="mailto:seba3567.dev@gmail.com"
					class="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-100 transition-all hover:border-violet-400/50 hover:bg-violet-500/20"
				>
					<EnvelopeSimple size={16} weight="bold" />
					Email
				</a>
			</div>
		</GlassCard>
	</section>
</main>
