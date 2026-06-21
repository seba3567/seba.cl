import { featuredProjects } from '$lib/data/featured';
import { computeStats, getCachedRepos } from '$lib/server/github';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const GITHUB_USER = 'seba3567';

	// getCachedRepos: ALWAYS returns from cache. If cache is fresh, zero
	// work. If stale, returns stale data immediately and fires a
	// background refresh. If no cache, blocks on the first fetch.
	// Never throws — if the cold-start fetch fails, returns [].
	const repos = await getCachedRepos(GITHUB_USER);
	const stats = computeStats(repos);

	setHeaders({
		'cache-control':
			'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
	});

	const languages = [
		...new Set(repos.map((r) => r.language).filter(Boolean) as string[]),
	].sort();

	return {
		username: GITHUB_USER,
		repos,
		stats,
		languages,
		featuredProjects: featuredProjects.filter((p) => !p.hero),
		heroProject: featuredProjects.find((p) => p.hero) ?? null,
		loadedAt: new Date().toISOString(),
	};
};
