// Static copy and structure for the home page. Lives in
// src/lib/data/ so each panel component can import the slice
// it needs and the parent `+page.svelte` stays thin.

import { Code, Database, Kanban } from 'phosphor-svelte';
import type { Component } from 'svelte';

export const profile = {
	name: 'Sebastián Muñoz',
	handle: '@seba3567',
	location: 'Chile',
	tagline: 'Ingeniero de Software y Datos.',
	intro:
		'Backend, datos, mobile, QA. Combino análisis de datos, arquitectura backend y calidad de software para convertir requerimientos en soluciones mantenibles y medibles.',
};

export const stack = [
	{ labelKey: 'inUse', items: 'TypeScript · Django · SQL · Python' },
	{
		labelKey: 'learning',
		items: 'Kotlin · Dart · Go · Ruby',
	},
	{ labelKey: 'base', items: 'JavaScript · Lua · REST · Docker' },
] as const;

type PhosphorIcon = Component<{
	size?: number;
	weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
	class?: string;
}>;

export const specialties: ReadonlyArray<{
	icon: PhosphorIcon;
	titleKey: string;
	items: ReadonlyArray<string>;
}> = [
	{
		icon: Database,
		titleKey: 'data',
		items: ['BI', 'data-modeling', 'visualization', 'statistics'],
	},
	{
		icon: Code,
		titleKey: 'software',
		items: ['backend', 'apis', 'qa', 'versioning'],
	},
	{
		icon: Kanban,
		titleKey: 'management',
		items: ['agile', 'requirements', 'docs', 'kaizen'],
	},
] as const;

// Visible in the Contacto panel. Email uses `href: ''` so the
// template renders a <button> instead of an <a> — the form
// opens the protected ContactDialog. The real address lives
// only in the backend (CONTACT_TO) and never ships to the
// client bundle.
export const contact = [
	{
		kind: 'github' as const,
		handle: '@seba3567',
		href: 'https://github.com/seba3567',
	},
	{ kind: 'email' as const, handle: '', href: '' },
] as const;
