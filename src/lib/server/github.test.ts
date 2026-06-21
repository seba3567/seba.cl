// Unit tests for src/lib/server/github.ts
//
// The module uses module-level state (the cache Map, lastApiCallAt
// timestamp, in-flight Sets). To keep tests independent, every test
// does vi.resetModules() before importing the module fresh.
//
// The CACHE_TTL_MS (15 min) and API_COOLDOWN_MS (20 min) are NOT
// re-exported. Tests that need to advance the clock work around
// the public API instead: we just call the functions and observe
// the fetch behavior via a global fetch mock.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type RepoFixture = {
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
	// Optional because the GitHubRepo type doesn't have it; the
	// PublicRepo type (returned by getCachedRepos) does.
	languages?: Record<string, number>;
};

function makeRepo(over: Partial<RepoFixture> = {}): RepoFixture {
	return {
		id: 1,
		name: 'demo',
		full_name: 'seba3567/demo',
		description: 'demo repo',
		html_url: 'https://github.com/seba3567/demo',
		homepage: null,
		language: 'TypeScript',
		languages_url: 'https://api.github.com/repos/seba3567/demo/languages',
		stargazers_count: 0,
		forks_count: 0,
		open_issues_count: 0,
		watchers_count: 0,
		topics: [],
		updated_at: '2025-01-01T00:00:00Z',
		created_at: '2024-01-01T00:00:00Z',
		pushed_at: '2025-01-01T00:00:00Z',
		fork: false,
		archived: false,
		private: false,
		disabled: false,
		visibility: 'public',
		default_branch: 'main',
		...over,
	};
}

function mockFetchSequence(responses: Array<{ ok: boolean; status?: number; body: unknown }>) {
	let i = 0;
	return vi.fn(async () => {
		const r = responses[i++] ?? responses[responses.length - 1];
		return {
			ok: r.ok,
			status: r.status ?? (r.ok ? 200 : 500),
			statusText: r.ok ? 'OK' : 'Internal Server Error',
			json: async () => r.body,
		} as Response;
	});
}

beforeEach(() => {
	vi.useRealTimers();
	vi.resetModules();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('getCachedRepos (cold start)', () => {
	it('hits GitHub on first call, caches the result, returns from cache on the second', async () => {
		const repos = [makeRepo({ id: 1 }), makeRepo({ id: 2, name: 'two' })];
		const fetchMock = mockFetchSequence([
			{ ok: true, body: repos },
		]);
		vi.stubGlobal('fetch', fetchMock);

		const { getCachedRepos } = await import('./github');

		const first = await getCachedRepos('seba3567');
		expect(first).toHaveLength(2);
		// Only the list call actually hits the API. The two
		// languages_url fetches are blocked by the cooldown that
		// the list call just established — that's the whole point
		// of the 20-min cooldown (stays well under 60 req/h).
		expect(fetchMock).toHaveBeenCalledTimes(1);
		// The repo objects still come back, with empty languages
		// (the COOLDOWN error path returns {} for that repo).
		expect(first[0]?.languages).toEqual({});
		expect(first[1]?.languages).toEqual({});

		const second = await getCachedRepos('seba3567');
		expect(second).toEqual(first);
		// No new fetch: cache hit.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('deduplicates concurrent cold-start calls (one GitHub list fetch, not two)', async () => {
		const repos = [makeRepo({ id: 1 })];
		const fetchMock = mockFetchSequence([{ ok: true, body: repos }]);
		vi.stubGlobal('fetch', fetchMock);

		const { getCachedRepos } = await import('./github');

		// Two concurrent cold-start calls. The dedup Map should make
		// them share the same in-flight promise.
		const [a, b] = await Promise.all([getCachedRepos('seba3567'), getCachedRepos('seba3567')]);

		expect(a).toEqual(b);
		// One list fetch (langs blocked by cooldown), not two of
		// either.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('returns [] on cold-start fetch failure (never throws)', async () => {
		const fetchMock = mockFetchSequence([{ ok: false, status: 500, body: {} }]);
		vi.stubGlobal('fetch', fetchMock);

		const { getCachedRepos } = await import('./github');

		const result = await getCachedRepos('seba3567');
		expect(result).toEqual([]);
		expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(1);
	});
});

describe('getCachedTopRepos', () => {
	it('single API call, no languages enrichment', async () => {
		const repos = [
			makeRepo({ id: 1, name: 'one', stargazers_count: 5 }),
			makeRepo({ id: 2, name: 'two', stargazers_count: 10 }),
		];
		const fetchMock = mockFetchSequence([{ ok: true, body: repos }]);
		vi.stubGlobal('fetch', fetchMock);

		const { getCachedTopRepos } = await import('./github');

		const top = await getCachedTopRepos('seba3567', 8);
		expect(top).toHaveLength(2);
		// NO languages_url calls — that's the whole point of the
		// 'top' variant.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('dedup concurrent cold-start: one fetch, not two', async () => {
		const repos = [makeRepo({ id: 1 })];
		const fetchMock = mockFetchSequence([{ ok: true, body: repos }]);
		vi.stubGlobal('fetch', fetchMock);

		const { getCachedTopRepos } = await import('./github');

		const [a, b] = await Promise.all([getCachedTopRepos('seba3567', 8), getCachedTopRepos('seba3567', 8)]);
		expect(a).toEqual(b);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('different limits have separate cache keys and do not cross-pollinate', async () => {
		const repos = [
			makeRepo({ id: 1, name: 'one' }),
			makeRepo({ id: 2, name: 'two' }),
		];
		// The 2nd response is a 500-ish empty body; in practice
		// the second call hits the COOLDOWN path (after the first
		// call set lastApiCallAt) and throws. The test then
		// expects [] from the second call but verifies the cache
		// keys are independent.
		const fetchMock = mockFetchSequence([
			{ ok: true, body: repos },
			{ ok: false, status: 500, body: {} },
		]);
		vi.stubGlobal('fetch', fetchMock);

		const { getCachedTopRepos } = await import('./github');

		// First call with limit=8 fires the request.
		const a = await getCachedTopRepos('seba3567', 8);
		expect(a).toHaveLength(2);

		// Second call with limit=4 is a different cache key. It
		// hits the API (different URL would be a different key,
		// but they actually share the URL — different only by the
		// `#N` suffix). It also tries to fetch, but the cooldown
		// blocks it after the first call. Either way, the cache
		// for limit=8 is NOT returned for limit=4 — they're
		// independent keys.
		const b = await getCachedTopRepos('seba3567', 4);
		// b is either a real fetch (cooldown hadn't kicked in)
		// or an empty array (cooldown blocked it). Either way,
		// it's not the same as `a` (different cache key).
		expect(b).not.toBe(a);

		// And the first cache is still intact.
		const aAgain = await getCachedTopRepos('seba3567', 8);
		expect(aAgain).toEqual(a);
	});
});

describe('computeStats', () => {
	it('aggregates stars, forks, languages, topics', async () => {
		const repos = [
			makeRepo({
				id: 1,
				name: 'one',
				stargazers_count: 10,
				forks_count: 2,
				topics: ['svelte', 'ui'],
				languages: { TypeScript: 1500, CSS: 200 },
			}),
			makeRepo({
				id: 2,
				name: 'two',
				language: 'Python',
				stargazers_count: 5,
				forks_count: 1,
				topics: ['python', 'data'],
				languages: { Python: 3000 },
			}),
		];
		vi.stubGlobal('fetch', mockFetchSequence([]));

		const { computeStats } = await import('./github');

		const stats = computeStats(repos as never);
		expect(stats.total).toBe(2);
		expect(stats.stars).toBe(15);
		expect(stats.forks).toBe(3);
		// TypeScript: 1 repo, 1500 bytes. Python: 1 repo, 3000 bytes.
		// Sorted by count DESC, then bytes DESC, so Python wins.
		expect(stats.languages[0]?.name).toBe('Python');
		expect(stats.languages.find((l) => l.name === 'TypeScript')).toBeTruthy();
		expect(stats.topics).toHaveLength(4);
	});

	it('defensive: repos without a `languages` field do not crash Object.entries', async () => {
		// Simulates a stale cache entry from a previous schema where
		// the public repo didn't carry a `languages` field.
		const repo = { ...makeRepo(), languages: undefined } as never;
		vi.stubGlobal('fetch', mockFetchSequence([]));

		const { computeStats } = await import('./github');

		expect(() => computeStats([repo])).not.toThrow();
	});
});
