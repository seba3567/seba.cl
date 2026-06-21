import type { PageServerLoad } from './$types';
import { fetchTopRepos, type GitHubRepo } from '$lib/server/github';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const GITHUB_USER = 'seba3567';
	const TOP_N = 8;

	let repos: GitHubRepo[] = [];
	let loadError: string | null = null;

	try {
		// Single API call (vs 1 + N for languages). Cooldown of 5min
		// enforced inside github.ts means at most 1 req/5min total
		// across the whole module — safe for the 60/h unauth limit.
		repos = await fetchTopRepos(GITHUB_USER, TOP_N);
	} catch (err) {
		const msg = err instanceof Error ? err.message : 'Unknown GitHub API error';
		loadError = msg;
		console.error('[seba3567.cl] GitHub load failed (home):', msg);
	}

	setHeaders({
		// CDN can cache for an hour; stale-while-revalidate tolerates
		// up to 24h. Server-side cooldown (5min) is the real gate.
		'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
	});

	return {
		username: GITHUB_USER,
		repos,
		loadError,
	};
};
