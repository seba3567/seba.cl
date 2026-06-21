import type { PageServerLoad } from './$types';
import { fetchPublicRepos, type PublicRepo } from '$lib/server/github';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const GITHUB_USER = 'seba3567';

	let repos: PublicRepo[] = [];
	let loadError: string | null = null;

	try {
		// Only need the top N for the home Selección panel; cap to 20 most recent
		const all = await fetchPublicRepos(GITHUB_USER);
		repos = all
			.filter((r) => !r.archived && !r.fork)
			.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
			.slice(0, 8);
	} catch (err) {
		loadError = err instanceof Error ? err.message : 'Unknown GitHub API error';
		console.error('[seba3567.cl] GitHub load failed (home):', loadError);
	}

	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
	});

	return {
		username: GITHUB_USER,
		repos,
		loadError,
	};
};
