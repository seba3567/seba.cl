// Static copy and structure for the AntiCallCL showcase page
// (/apps/anticall). Lives in src/lib/data/ so each panel
// component can import the slice it needs and the parent
// +page.svelte stays thin.

export const PLAY_STORE =
	'https://play.google.com/store/apps/details?id=com.seba3567.anticall_chile&hl=en-US';
export const BETA_PROGRAM =
	'https://play.google.com/apps/testing/com.seba3567.anticall_chile';
export const PRIVACY_URL = 'https://seba3567.github.io/anticall_pages/';

// The 6 phone screenshots in /static/apps/anticall/{N}.{jpg,webp,avif}.
// 1 is featured in the hero phone mockup; 1..6 show in the gallery
// panel and the lightbox.
export const SCREENSHOTS = [1, 2, 3, 4, 5, 6] as const;
export const FEATURED_SCREENSHOT = 1;

export const galleryItems = SCREENSHOTS.map((n) => ({
	src: `/apps/anticall/${n}`,
	alt: `AntiCallCL · pantalla ${n}`,
	caption: `Pantalla ${n} de ${SCREENSHOTS.length}`,
}));

export const aboutParagraphKeys = ['origin', 'filter', 'choice'] as const;

import { Database, Eye, Lock, ShieldCheck } from 'phosphor-svelte';

export const features: ReadonlyArray<{
	icon: typeof ShieldCheck;
	titleKey: string;
	bodyKey: string;
}> = [
	{ icon: ShieldCheck, titleKey: 'filter', bodyKey: 'filter' },
	{ icon: Eye, titleKey: 'choice', bodyKey: 'choice' },
	{ icon: Database, titleKey: 'curated', bodyKey: 'curated' },
	{ icon: Lock, titleKey: 'local', bodyKey: 'local' },
] as const;

export const stackLayers: ReadonlyArray<{
	layerKey: string;
	tech: string;
	detailKey: string;
}> = [
	{ layerKey: 'ui', tech: 'Flutter', detailKey: 'ui' },
	{ layerKey: 'native', tech: 'Kotlin', detailKey: 'native' },
] as const;

export const privacyPointKeys = [
	'local',
	'noAccount',
	'wipe',
	'uninstall',
] as const;
export const betaPerkKeys = [
	'early',
	'channel',
	'feedback',
	'updates',
] as const;
