export type ProjectStatus =
	| 'live'
	| 'active'
	| 'wip'
	| 'archived'
	| 'experimental';

export type ProjectAccent = 'mint' | 'amber' | 'rose';

export type FeaturedProject = {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	status: ProjectStatus;
	stack: string[];
	links: { github?: string; demo?: string; docs?: string; store?: string };
	highlights?: string[];
	relatedRepos?: string[];
	accent: ProjectAccent;
	icon:
		| 'phone-shield'
		| 'sparkle'
		| 'code'
		| 'gear'
		| 'flame'
		| 'database'
		| 'cube';
	hero?: boolean;
};

export const featuredProjects: FeaturedProject[] = [
	{
		slug: 'autoskills',
		name: '@seba3567/autoskills',
		tagline: 'CLI que autodetecta tu stack e instala skills de IA',
		description:
			'Fork custom del `autoskills` de midudev. Escanea `package.json`, gradle, `pubspec.yaml` y estructura del proyecto, detecta 85+ tecnologías y combos, e instala skills de IA optimizadas para Claude Code, Cursor y Copilot. Este sitio lo usa.',
		status: 'live',
		stack: ['TypeScript', 'Node.js', 'NPM'],
		links: {
			github: 'https://github.com/seba3567/autoskills',
			docs: 'https://www.npmjs.com/package/@seba3567/autoskills',
		},
		highlights: [
			'Detección automática de 85+ tecnologías',
			'Combos: Next + Supabase, Svelte + shadcn, etc.',
			'Genera `CLAUDE.md` automáticamente',
		],
		accent: 'mint',
		icon: 'sparkle',
	},
	{
		slug: 'frontend-skeleton',
		name: 'frontend.skeleton',
		tagline: 'Skeleton Svelte 5 + Tailwind v4 + shadcn-svelte',
		description:
			'El esqueleto base sobre el que corre este sitio. Svelte 5 con Runes activado por defecto, Tailwind v4 con `@theme`, shadcn-svelte (zinc), Phosphor, BiomeJS y Bun. Pensado para empezar proyectos sin tomar decisiones repetitivas.',
		status: 'live',
		stack: ['Svelte 5', 'Tailwind v4', 'shadcn-svelte', 'Bun', 'TypeScript'],
		links: {
			github: 'https://github.com/seba3567/frontend.skeleton',
		},
		highlights: [
			'Svelte 5 Runes + SvelteKit 2',
			'BiomeJS para lint+format ultra-rápido',
			'Glassmorphism-ready (este sitio es la prueba)',
		],
		accent: 'mint',
		icon: 'code',
	},
	{
		slug: 'svelte-advanced-components',
		name: 'Svelte Advanced Components',
		tagline: 'Colección de componentes Svelte 5 avanzados',
		description:
			'Componentes reutilizables y patrones avanzados específicos de Svelte 5: animaciones declarativas, virtual lists, forms con Runes, drag & drop, etc.',
		status: 'active',
		stack: ['Svelte', 'TypeScript'],
		links: {
			github: 'https://github.com/seba3567/Svelte-avanced-components',
		},
		highlights: ['Patrones idiomáticos Svelte 5', 'Sin dependencias de UI'],
		accent: 'mint',
		icon: 'gear',
	},
	{
		slug: 'telefonia-ido',
		name: 'telefonia_ido',
		tagline: 'Backend Python para análisis de telefonía',
		description:
			'Servicios en Python para analizar, clasificar y reportar llamadas. Sirve como backend de datos para AntiCallCL y como dataset de prefijos/spam.',
		status: 'active',
		stack: ['Python', 'Flask/FastAPI', 'SQL'],
		links: {
			github: 'https://github.com/seba3567/telefonia_ido',
		},
		highlights: ['API REST para validar números', 'Reportes de prefijos spam'],
		accent: 'mint',
		icon: 'database',
	},
	{
		slug: 'proyecto-ops',
		name: 'PROYECTO-OPS',
		tagline: 'Plataforma interna de operaciones',
		description:
			'Sistema de gestión de operaciones, tareas y métricas con stack TypeScript. Tableros, runbooks y bitácoras para operación técnica.',
		status: 'wip',
		stack: ['TypeScript'],
		links: {
			github: 'https://github.com/seba3567/PROYECTO-OPS',
		},
		highlights: ['Runbooks vivos', 'Bitácora de incidentes'],
		accent: 'amber',
		icon: 'flame',
	},
	{
		slug: 'seba-flutter-skeleton',
		name: 'seba_flutter_skeleton',
		tagline: 'Skeleton base para apps Flutter',
		description:
			'Arranque rápido para proyectos Flutter: routing, theming, i18n, CI para build Android/iOS. Pensado como contraparte mobile del frontend.skeleton.',
		status: 'active',
		stack: ['Dart', 'Flutter'],
		links: {
			github: 'https://github.com/seba3567/seba_flutter_skeleton',
		},
		highlights: [
			'CI para build Android + iOS',
			'Theming y routing preconfigurados',
		],
		accent: 'mint',
		icon: 'cube',
	},
];

/**
 * Accent → Tailwind class map.
 * Only three accents remain: mint (primary), amber (wip), rose (archived).
 * Everything else is mint — the project uses a single pastel-green palette.
 */
export const ACCENT_CLASSES: Record<
	ProjectAccent,
	{ ring: string; text: string; bg: string; border: string; glow: string }
> = {
	mint: {
		ring: 'ring-mint-400/30',
		text: 'text-mint-200',
		bg: 'bg-mint-500/10',
		border: 'border-mint-400/20',
		glow: 'shadow-[0_0_60px_-15px_rgba(52,211,153,0.45)]',
	},
	amber: {
		ring: 'ring-amber-400/30',
		text: 'text-amber-200',
		bg: 'bg-amber-500/10',
		border: 'border-amber-400/20',
		glow: 'shadow-[0_0_60px_-15px_rgba(252,211,77,0.45)]',
	},
	rose: {
		ring: 'ring-rose-400/30',
		text: 'text-rose-200',
		bg: 'bg-rose-500/10',
		border: 'border-rose-400/20',
		glow: 'shadow-[0_0_60px_-15px_rgba(251,113,133,0.45)]',
	},
};

export const STATUS_LABELS: Record<
	ProjectStatus,
	{ label: string; color: string }
> = {
	live: {
		label: 'Live',
		color: 'text-mint-200 bg-mint-500/10 border-mint-400/20',
	},
	active: {
		label: 'Active',
		color: 'text-mint-200 bg-mint-500/10 border-mint-400/20',
	},
	wip: {
		label: 'WIP',
		color: 'text-amber-200 bg-amber-500/10 border-amber-400/20',
	},
	experimental: {
		label: 'Experimental',
		color: 'text-mint-200 bg-mint-500/10 border-mint-400/20',
	},
	archived: {
		label: 'Archived',
		color: 'text-neutral-400 bg-neutral-500/10 border-neutral-400/20',
	},
};
