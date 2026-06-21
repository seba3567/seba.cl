import { getCachedTopRepos } from '$lib/server/github';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const GITHUB_USER = 'seba3567';
	const TOP_N = 8;

	// getCachedTopRepos: always returns from cache. If cache is fresh,
	// zero work. If stale, returns stale and refreshes in background.
	// If no cache, blocks on the first fetch.
	const repos = await getCachedTopRepos(GITHUB_USER, TOP_N);

	setHeaders({
		// CDN can cache for an hour; stale-while-revalidate tolerates
		// up to 24h. Server-side cache (15min TTL) is the real gate.
		'cache-control':
			'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
	});

	return {
		username: GITHUB_USER,
		repos,
	};
};
