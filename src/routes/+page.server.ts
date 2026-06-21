import type { PageServerLoad } from './$types';
import { fetchPublicRepos, computeStats, type RepoStats } from '$lib/server/github';
import { featuredProjects } from '$lib/data/featured';
import type { PublicRepo } from '$lib/server/github';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const GITHUB_USER = 'seba3567';

	let repos: PublicRepo[] = [];
	let stats: RepoStats = { total: 0, stars: 0, forks: 0, languages: [], topics: [] };
	let loadError: string | null = null;

	try {
		repos = await fetchPublicRepos(GITHUB_USER);
		stats = computeStats(repos);
	} catch (err) {
		loadError = err instanceof Error ? err.message : 'Unknown GitHub API error';
		console.error('[seba3567.cl] GitHub load failed:', loadError);
	}

	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
	});

	const languages = [...new Set(repos.map((r) => r.language).filter(Boolean) as string[])].sort();

	return {
		username: GITHUB_USER,
		repos,
		stats,
		languages,
		featuredProjects: featuredProjects.filter((p) => !p.hero),
		heroProject: featuredProjects.find((p) => p.hero) ?? null,
		loadError,
		loadedAt: new Date().toISOString(),
	};
};
