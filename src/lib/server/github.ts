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
const CACHE_TTL_MS = 1000 * 60 * 60;

type CacheEntry<T> = {
	value: T;
	expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

async function githubFetch<T>(url: string): Promise<T> {
	const cached = cache.get(url);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.value as T;
	}
	const res = await fetch(url, {
		headers: {
			'User-Agent': USER_AGENT,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	});
	if (!res.ok) {
		throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`);
	}
	const data = (await res.json()) as T;
	cache.set(url, { value: data, expiresAt: Date.now() + CACHE_TTL_MS });
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
	const enriched = await Promise.all(
		filtered.map(async (r) => {
			const langs = await githubFetch<Record<string, number>>(r.languages_url);
			return { ...r, languages: langs };
		}),
	);
	return enriched.sort((a, b) => {
		if (b.stargazers_count !== a.stargazers_count) {
			return b.stargazers_count - a.stargazers_count;
		}
		return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
	});
}

export type RepoStats = {
	total: number;
	stars: number;
	forks: number;
	languages: Array<{ name: string; count: number; bytes: number }>;
	topics: Array<{ name: string; count: number }>;
};

export function computeStats(repos: PublicRepo[]): RepoStats {
	const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
	const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
	const langCount = new Map<string, number>();
	const langBytes = new Map<string, number>();
	const topicCount = new Map<string, number>();
	for (const r of repos) {
		for (const [lang, bytes] of Object.entries(r.languages)) {
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
