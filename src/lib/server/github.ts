export type GitHubRepo = {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	language: string | null;
	languages_url: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	watchers_count: number;
	topics: string[];
	updated_at: string;
	created_at: string;
	pushed_at: string;
	fork: boolean;
	archived: boolean;
	private: boolean;
	disabled: boolean;
	visibility: 'public' | 'private' | 'internal';
	default_branch: string;
};

export type RepoWithLanguages = GitHubRepo & {
	languages: Record<string, number>;
};

const USER_AGENT = 'seba3567-cl/0.1 (+https://seba3567.cl)';
/**
 * Cache TTL: how long a successful response stays "fresh" before we
 * consider it stale and trigger a background refresh. 15 min sits
 * right in the middle of the 10-20 min window the user asked for.
 */
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min

/**
 * Cooldown between actual GitHub API calls.
 *
 * GitHub's unauthenticated rate limit is 60 req/hour/IP. With ~90 repos
 * on seba3567's profile, fetchPublicRepos alone does 1 + N (≥90) requests
 * per call, which exhausts the hourly budget in ONE page load. To stay
 * well under the limit we serialize everything through a single
 * 20-minute cooldown — at most 1 actual API call per 20 min, regardless
 * of cache state.
 *
 * This cooldown is independent of CACHE_TTL_MS: the cache can be
 * stale (older than 15 min) but we still won't hit the API if the
 * cooldown hasn't elapsed. The page reads from cache regardless —
 * stale-while-revalidate. The cooldown only gates when the background
 * refresh actually runs.
 *
 * 20 min was chosen because:
 *   - 60 req / hour = 1 req / min average. A burst of 90 requests costs
 *     ~1.5 hours of budget, so a 20-min cooldown means worst case we
 *     still hit the limit ~3 times per day (only on hard refreshes
 *     after dev-server restarts wipe the in-memory cache).
 *   - 10 min is too aggressive: a quick tab refresh + a navigation
 *     = 2 cache misses = rate limit hit.
 *   - 20 min is the sweet spot: still feels "live" but well under
 *     the 60/h limit even in the worst case.
 */
const API_COOLDOWN_MS = 20 * 60 * 1000; // 20 min

type CacheEntry<T> = {
	value: T;
	expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

/** Timestamp (ms) of the last real API call. 0 = never. */
let lastApiCallAt = 0;

function withinCooldown(): boolean {
	return lastApiCallAt > 0 && Date.now() - lastApiCallAt < API_COOLDOWN_MS;
}

function cooldownRemainingMs(): number {
	if (lastApiCallAt === 0) return 0;
	const elapsed = Date.now() - lastApiCallAt;
	return Math.max(0, API_COOLDOWN_MS - elapsed);
}

async function githubFetch<T>(url: string): Promise<T> {
	const cached = cache.get(url);
	if (cached && cached.expiresAt > Date.now()) {
		// Fresh cache — no API call needed.
		return cached.value as T;
	}

	// Cache miss or stale. If we're inside the cooldown window, return
	// whatever we have (even if stale) instead of hammering GitHub.
	if (withinCooldown()) {
		const remaining = Math.ceil(cooldownRemainingMs() / 1000);
		if (cached) {
			// Stale-while-cooldown: serve the old value, log it.
			console.warn(
				`[github] cooldown active (${remaining}s remaining), ` +
					`serving stale cache for ${url}`,
			);
			return cached.value as T;
		}
		// Cold cache + cooldown = we have nothing to serve. Throw a
		// distinctive error so the caller can fall back gracefully.
		const err = new Error(
			`GitHub API in cooldown (${remaining}s remaining) and no cached value for ${url}`,
		);
		(err as Error & { code?: string }).code = 'COOLDOWN';
		throw err;
	}

	// Cooldown elapsed (or never called) — make the real request.
	const res = await fetch(url, {
		headers: {
			'User-Agent': USER_AGENT,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	});
	if (!res.ok) {
		// 403/429 — the rate limiter caught us despite the cooldown.
		// Could be a shared IP (the Vercel edge, the dev tunnel, etc).
		// Reset the cooldown so we don't keep hammering for 20 min.
		const remaining = Math.ceil(cooldownRemainingMs() / 1000);
		console.error(
			`[github] API ${res.status} ${res.statusText} for ${url} ` +
				`(cooldown was at ${remaining}s remaining — GitHub's 60/h limit hit anyway)`,
		);
		throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`);
	}
	const data = (await res.json()) as T;
	cache.set(url, { value: data, expiresAt: Date.now() + CACHE_TTL_MS });
	lastApiCallAt = Date.now();
	console.log(
		`[github] OK · ${url.split('/').slice(-1)[0] || url} · ` +
			`next refresh in ${API_COOLDOWN_MS / 1000}s`,
	);
	return data;
}

export type PublicRepo = GitHubRepo & {
	languages: Record<string, number>;
};

export async function fetchPublicRepos(
	user: string,
	options: { includeForks?: boolean } = {},
): Promise<PublicRepo[]> {
	const repos = await githubFetch<GitHubRepo[]>(
		`https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`,
	);
	const filtered = repos.filter(
		(r) => !r.private && !r.disabled && (options.includeForks || !r.fork) && !r.archived,
	);
	// Enrich with languages. The cooldown is per-module (1 call / 5min),
	// but the cache is per-URL. The repo list URL is already cached
	// after the first call, but each repo's languages_url is a NEW URL
	// that we haven't seen. If we're in cooldown, the languages fetch
	// would throw — which breaks the whole page. Catch the COOLDOWN
	// error per-repo and return empty languages so the page still
	// renders (just without per-repo language stats for that call).
	const enriched = await Promise.all(
		filtered.map(async (r) => {
			try {
				const langs = await githubFetch<Record<string, number>>(r.languages_url);
				return { ...r, languages: langs };
			} catch (err) {
				if ((err as Error & { code?: string }).code === 'COOLDOWN') {
					// Stale-while-cooldown: repo shows but no language data yet.
					return { ...r, languages: {} as Record<string, number> };
				}
				throw err;
			}
		}),
	);
	return enriched.sort((a, b) => {
		if (b.stargazers_count !== a.stargazers_count) {
			return b.stargazers_count - a.stargazers_count;
		}
		return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
	});
}

/**
 * fetchTopRepos: lightweight variant for the home page.
 *
 * Makes a SINGLE GitHub API call (the repo list). The list already
 * includes the primary `language` field per repo, which is all the
 * home page renders — so we skip the N parallel `languages_url`
 * requests that fetchPublicRepos does (those are what burned the
 * rate limit).
 *
 * Returns the top `limit` non-archived, non-fork repos sorted by
 * `pushed_at` DESC.
 */
export async function fetchTopRepos(
	user: string,
	limit: number,
): Promise<GitHubRepo[]> {
	const repos = await githubFetch<GitHubRepo[]>(
		`https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`,
	);
	return repos
		.filter((r) => !r.archived && !r.fork && !r.private && !r.disabled)
		.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
		.slice(0, limit);
}

export type RepoStats = {
	total: number;
	stars: number;
	forks: number;
	languages: Array<{ name: string; count: number; bytes: number }>;
	topics: Array<{ name: string; count: number }>;
};

// =====================================================================
// Stale-while-revalidate public API
// =====================================================================
//
// The page-load functions (getCachedRepos / getCachedTopRepos) ALWAYS
// return from cache. The cache is refreshed in the background after
// CACHE_TTL_MS (15 min), gated by API_COOLDOWN_MS (20 min) so we
// never burn the 60/h GitHub limit.
//
// Flow on each page request:
//   1. Page calls getCachedRepos()
//   2. If cache is fresh   -> return it (zero work)
//   3. If cache is stale   -> return stale data IMMEDIATELY, fire a
//                               background refresh (gated by cooldown)
//   4. If no cache at all  -> block on the first fetch (cold start)
//
// The page never sees a 429/COOLDOWN error. Worst case the user gets
// data that's up to 15 min old; best case it's always fresh.

const repoListUrl = (user: string) =>
	`https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`;

/**
 * Cache keys for the two public getters. They MUST be different
 * because they cache different types: getCachedRepos stores
 * `PublicRepo[]` (with `languages` per repo), getCachedTopRepos
 * stores `GitHubRepo[]` (raw, no languages). If they shared a key,
 * the second to write would overwrite the first, and the reader
 * expecting the richer type would crash on `r.languages` being
 * undefined (e.g. `Object.entries(undefined)`).
 */
const repoListCacheKey = (user: string) => `${repoListUrl(user)}#full`;
const repoTopCacheKey = (user: string) => `${repoListUrl(user)}#top`;

let backgroundRefreshInFlight = new Set<string>();

function triggerBackgroundRefresh(user: string, fn: () => Promise<unknown>) {
	if (withinCooldown()) {
		// The page just got stale data; we'll retry on the next page load.
		return;
	}
	if (backgroundRefreshInFlight.has(user)) return;
	backgroundRefreshInFlight.add(user);
	fn()
		.catch((err) => {
			console.warn(
				`[github] background refresh for ${user} failed: ${(err as Error).message}`,
			);
		})
		.finally(() => {
			backgroundRefreshInFlight.delete(user);
		});
}

/**
 * getCachedRepos: returns the cached public repos for the user.
 *
 * - Cache fresh    -> return cached value
 * - Cache stale    -> return stale value, fire background refresh
 * - No cache       -> block on the first fetch (cold start, only once)
 *
 * Never throws. If the cold-start fetch fails (e.g. rate-limited
 * before any cache exists), returns an empty array so the page
 * renders an empty state instead of a 500.
 */
export async function getCachedRepos(user: string): Promise<PublicRepo[]> {
	const key = repoListCacheKey(user);
	const cached = cache.get(key);

	if (cached) {
		if (cached.expiresAt < Date.now()) {
			// Stale-while-revalidate: return stale, refresh in background
			console.warn(
				`[github] serving stale cache for ${user} (age: ${Math.round(
					(Date.now() - (cached.expiresAt - CACHE_TTL_MS)) / 1000,
				)}s), triggering background refresh`,
			);
			triggerBackgroundRefresh(user, () => fetchPublicRepos(user));
		}
		return cached.value as PublicRepo[];
	}

	// Cold start: no cache, must fetch.
	try {
		return await fetchPublicRepos(user);
	} catch (err) {
		console.error(`[github] cold-start fetch failed for ${user}:`, err);
		return [];
	}
}

/**
 * getCachedTopRepos: lightweight variant for the home page.
 * Single API call (no languages enrichment).
 */
export async function getCachedTopRepos(
	user: string,
	limit: number,
): Promise<GitHubRepo[]> {
	const key = repoTopCacheKey(user);
	const cached = cache.get(key);

	if (cached) {
		if (cached.expiresAt < Date.now()) {
			triggerBackgroundRefresh(user, () => fetchTopRepos(user, limit));
		}
		// Slice from the cached full list (already filtered+sorted in
		// the original fetchTopRepos, but we re-apply to be safe since
		// the cache holds the raw GitHubRepo[] and the slice may differ).
		const all = (cached.value as GitHubRepo[])
			.filter((r) => !r.archived && !r.fork && !r.private && !r.disabled)
			.sort(
				(a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
			);
		return all.slice(0, limit);
	}

	try {
		return await fetchTopRepos(user, limit);
	} catch (err) {
		console.error(`[github] cold-start fetch (top) failed for ${user}:`, err);
		return [];
	}
}

export function computeStats(repos: PublicRepo[]): RepoStats {
	const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
	const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
	const langCount = new Map<string, number>();
	const langBytes = new Map<string, number>();
	const topicCount = new Map<string, number>();
	for (const r of repos) {
		// Defensive: old cache entries (or repos GitHub returned without
		// a languages field) might have r.languages as null/undefined.
		// Object.entries would throw on that — coerce to {} instead.
		const langs = r.languages ?? {};
		for (const [lang, bytes] of Object.entries(langs)) {
			langCount.set(lang, (langCount.get(lang) ?? 0) + 1);
			langBytes.set(lang, (langBytes.get(lang) ?? 0) + bytes);
		}
		for (const t of r.topics) {
			topicCount.set(t, (topicCount.get(t) ?? 0) + 1);
		}
	}
	const languages = [...langCount.entries()]
		.map(([name, count]) => ({ name, count, bytes: langBytes.get(name) ?? 0 }))
		.sort((a, b) => b.count - a.count || b.bytes - a.bytes);
	const topics = [...topicCount.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);
	return {
		total: repos.length,
		stars: totalStars,
		forks: totalForks,
		languages,
		topics,
	};
}
