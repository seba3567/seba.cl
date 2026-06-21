// Client-side AOSP catalog fetcher.
//
// Why client-side?
//   The /aosp page lists devices synced from a YAML file in
//   github.com/seba3567/devices-json plus per-device ROM and
//   kernel releases from GitHub Releases. We used to sync at
//   build time (`bun run sync:aosp`) which meant the deployed
//   site was always at most one deployment behind reality.
//
//   Instead, the client now fetches:
//   - the device YAML directly from raw.githubusercontent.com
//   - the per-device ROM/kernel releases from the GitHub API
//
//   Both are cached in localStorage with 15-min stale-while-
//   revalidate. Zero infra: no Cloudflare Function, no KV/D1,
//   no cost. The bundled `src/lib/data/aosp/devices.json` is
//   the SSR / offline fallback so first paint never blocks on
//   a fetch.
//
// Rate limits:
//   - raw.githubusercontent.com: 60 req/h unauth per IP
//   - api.github.com: 60 req/h unauth per IP
//   - Our usage: 1 device-YAML fetch + N release fetches every
//     15 min. With ≤10 active devices that's well under 20
//     req/h, so we never hit the limit even if every device
//     has both a ROM and a kernel repo.

import { browser } from '$app/environment';
import yaml from 'js-yaml';
import bundled from './data/aosp/devices.json';
import type { Device, Release } from './types/aosp';

export type DevicesBundle = typeof bundled;
export type BundledDevice = {
	slug: string;
	name: string;
	codename: string | null;
	status: string;
	image: string | null;
	romRepo?: string;
	kernelRepo?: string;
	specs: Device['specs'];
};

const DEVICES_YAML_URL =
	'https://raw.githubusercontent.com/seba3567/devices-json/main/devices.yaml';
const GITHUB_OWNER = 'seba3567';
const GITHUB_API = 'https://api.github.com';

const TTL_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'seba3567.aosp';
const NETWORK_TIMEOUT_MS = 8000;

const DEFAULT_INCLUDE = ['active', 'beta'] as const;
const INCLUDE_STATUSES: ReadonlySet<string> = new Set(DEFAULT_INCLUDE);

const subscribers = new Set<(snapshot: AospSnapshot) => void>();
const inFlight = new Map<string, Promise<unknown>>();

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export type AospSnapshot = {
	/** Freshest data we have, in the same shape as devices.json. */
	bundle: DevicesBundle;
	/** Per-device release map (keyed by device slug). */
	releases: Record<string, { roms: Release[]; kernels: Release[] }>;
	/** When the device YAML was last fetched (ms epoch). */
	updatedAt: number;
	/** Source URL — useful for the UI footer. */
	source: string;
};

// --------------------------------------------------------------------------
// Cache helpers
// --------------------------------------------------------------------------

type CachedEntry<T> = { value: T; fetchedAt: number };

function readCache<T>(key: string): CachedEntry<T> | null {
	if (!browser) return null;
	try {
		const raw = window.localStorage.getItem(`${STORAGE_KEY}.${key}`);
		if (!raw) return null;
		return JSON.parse(raw) as CachedEntry<T>;
	} catch {
		return null;
	}
}

function writeCache<T>(key: string, value: T): CachedEntry<T> {
	const entry: CachedEntry<T> = { value, fetchedAt: Date.now() };
	if (browser) {
		try {
			window.localStorage.setItem(
				`${STORAGE_KEY}.${key}`,
				JSON.stringify(entry),
			);
		} catch {
			// localStorage full / private mode — in-memory only.
		}
	}
	return entry;
}

// --------------------------------------------------------------------------
// Network helpers
// --------------------------------------------------------------------------

async function fetchJson<T>(url: string): Promise<T> {
	const res = await fetch(url, {
		headers: { Accept: 'application/json' },
		credentials: 'omit',
		signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
	return (await res.json()) as T;
}

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url, {
		headers: { Accept: 'text/plain' },
		credentials: 'omit',
		signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
	return res.text();
}

// --------------------------------------------------------------------------
// Device parsing
// --------------------------------------------------------------------------

type RawYaml = {
	devices?: Record<string, Record<string, unknown>>;
	meta?: Record<string, unknown>;
};

const STATUS_MAP: Record<string, string> = {
	Activo: 'active',
	Activa: 'active',
	Beta: 'beta',
	Pausado: 'paused',
	Pausada: 'paused',
	Abandonado: 'abandoned',
	Abandonada: 'abandoned',
	EOL: 'eol',
	'Fin de soporte': 'eol',
};

function slugify(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeStatus(raw: unknown): string {
	if (typeof raw !== 'string') return 'abandoned';
	return STATUS_MAP[raw] ?? 'abandoned';
}

function parseDevicesYaml(text: string, source: string): DevicesBundle {
	const parsed = yaml.load(text) as RawYaml | null;
	const rawDevices = parsed?.devices ?? {};
	const all = Object.entries(rawDevices).map(([name, d]) => {
		const codename = typeof d.codename === 'string' ? d.codename : null;
		const slug = codename ? slugify(codename) : slugify(name);
		return {
			slug,
			name,
			codename,
			status: normalizeStatus(d.status),
			image: typeof d.imagen === 'string' ? d.imagen : null,
			romRepo:
				typeof d.romRepo === 'string'
					? d.romRepo
					: `aosp-${slug}`,
			kernelRepo:
				typeof d.kernelRepo === 'string'
					? d.kernelRepo
					: `aosp-${slug}-kernel`,
			specs: {
				display: typeof d.pantalla === 'string' ? d.pantalla : null,
				processor:
					typeof d.procesador === 'string' ? d.procesador : null,
				ram: typeof d.memoria_ram === 'string' ? d.memoria_ram : null,
				storage:
					typeof d.almacenamiento === 'string'
						? d.almacenamiento
						: null,
				rearCamera:
					typeof d.camara_trasera === 'string'
						? d.camara_trasera
						: null,
				frontCamera:
					typeof d.camara_frontal === 'string'
						? d.camara_frontal
						: null,
				battery:
					typeof d.bateria === 'string' ? d.bateria : null,
				os:
					typeof d.sistema_operativo === 'string'
						? d.sistema_operativo
						: null,
				dimensions:
					typeof d.dimensiones === 'string' ? d.dimensiones : null,
				weight: typeof d.peso === 'string' ? d.peso : null,
				connectivity:
					typeof d.conectividad === 'string'
						? d.conectividad
						: null,
				waterResistance:
					typeof d.resistencia_agua === 'string'
						? d.resistencia_agua
						: null,
				screenProtection:
					typeof d.proteccion_pantalla === 'string'
						? d.proteccion_pantalla
						: null,
				extras: typeof d.otros === 'string' ? d.otros : null,
			},
		};
	});

	const devices = all.filter((d) => INCLUDE_STATUSES.has(d.status));
	const discontinued = all.filter(
		(d) => !INCLUDE_STATUSES.has(d.status),
	);

	return {
		_about: {
			source,
			override: null,
			includeStatuses: [...INCLUDE_STATUSES],
			generatedAt: new Date().toISOString(),
			note: 'Live snapshot from the latest YAML. Refreshed every 15 min in the browser.',
		},
		devices,
		discontinued,
	} as unknown as DevicesBundle;
}

// --------------------------------------------------------------------------
// Release parsing
// --------------------------------------------------------------------------

type GhRelease = {
	tag_name: string;
	name: string | null;
	body: string | null;
	published_at: string;
	prerelease: boolean;
	assets: Array<{
		name: string;
		browser_download_url: string;
		size: number;
		download_count: number;
	}>;
};

function extractSha256(body: string | null): string | null {
	if (!body) return null;
	const m = body.match(/SHA-?256[:\s]+([a-f0-9]{64})/i);
	return m ? m[1].toLowerCase() : null;
}

function normalizeRelease(rel: GhRelease, kind: 'rom' | 'kernel'): Release {
	return {
		kind,
		tag: rel.tag_name,
		name: rel.name ?? rel.tag_name,
		body: rel.body ?? '',
		publishedAt: rel.published_at,
		prerelease: rel.prerelease,
		assets: rel.assets.map((a) => ({
			name: a.name,
			url: a.browser_download_url,
			size: a.size,
			downloadCount: a.download_count,
		})),
		sha256: extractSha256(rel.body),
	} as Release;
}

// --------------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------------

/**
 * Load the device bundle (YAML). Stale-while-revalidate against
 * localStorage. Returns the bundled JSON as a synchronous fallback
 * the first time so SSR / first paint always have something to
 * render.
 */
export async function loadAospDevices(): Promise<DevicesBundle> {
	const cached = readCache<DevicesBundle>('devices');
	if (cached) {
		const age = Date.now() - cached.fetchedAt;
		if (age < TTL_MS) {
			// Warm cache hit. Schedule a background refresh near
			// the TTL midpoint so the next caller is also a hit.
			if (browser && age > TTL_MS / 2) void refreshDevices();
			return cached.value;
		}
		// Stale: return now, refresh in background.
		if (browser) void refreshDevices();
		return cached.value;
	}
	// Cold start: bundled fallback, fetch in background.
	if (browser) void refreshDevices();
	return bundled as DevicesBundle;
}

async function refreshDevices(): Promise<DevicesBundle> {
	const existing = inFlight.get('devices') as
		| Promise<DevicesBundle>
		| undefined;
	if (existing) return existing;
	const p = (async () => {
		try {
			const text = await fetchText(DEVICES_YAML_URL);
			const bundle = parseDevicesYaml(text, DEVICES_YAML_URL);
			writeCache('devices', bundle);
			notifyAll(bundle, getCurrentReleases());
			return bundle;
		} catch {
			return bundled as DevicesBundle;
		} finally {
			inFlight.delete('devices');
		}
	})();
	inFlight.set('devices', p);
	return p;
}

// --------------------------------------------------------------------------
// Releases
// --------------------------------------------------------------------------

function getCurrentReleases(): AospSnapshot['releases'] {
	const cached = readCache<AospSnapshot['releases']>('releases');
	return cached?.value ?? {};
}

/**
 * Fetch all releases for a device. Cached per-device with 15-min
 * SWR. The first call returns the cached snapshot (or empty),
 * subsequent calls in the same page load return the same promise
 * (deduped).
 */
export async function loadDeviceReleases(device: {
	slug: string;
	romRepo: string;
	kernelRepo: string;
}): Promise<{ roms: Release[]; kernels: Release[]; state: 'ready' }> {
	const cacheKey = `releases.${device.slug}`;
	const cached = readCache<{ roms: Release[]; kernels: Release[] }>(cacheKey);
	if (cached) {
		const age = Date.now() - cached.fetchedAt;
		if (age < TTL_MS) return { ...cached.value, state: 'ready' };
	}

	const inFlightKey = `releases.${device.slug}`;
	const existing = inFlight.get(inFlightKey) as
		| Promise<{ roms: Release[]; kernels: Release[]; state: 'ready' }>
		| undefined;
	if (existing) return existing;

	const p = (async () => {
		try {
			const [roms, kernels] = await Promise.all([
				fetchReleasesForRepo(device.romRepo).catch(() => []),
				fetchReleasesForRepo(device.kernelRepo).catch(() => []),
			]);
			const value = { roms, kernels };
			writeCache(cacheKey, value);
			notifyReleases(device.slug, { roms, kernels, state: 'ready' });
			return { ...value, state: 'ready' as const };
		} finally {
			inFlight.delete(inFlightKey);
		}
	})();
	inFlight.set(inFlightKey, p);
	return p;
}

async function fetchReleasesForRepo(repo: string): Promise<Release[]> {
	const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${repo}/releases?per_page=10`;
	try {
		const releases = await fetchJson<GhRelease[]>(url);
		const kind: 'rom' | 'kernel' = repo.endsWith('-kernel')
			? 'kernel'
			: 'rom';
		return releases.map((r) => normalizeRelease(r, kind));
	} catch {
		return [];
	}
}

// --------------------------------------------------------------------------
// Subscriptions
// --------------------------------------------------------------------------

function notifyAll(
	bundle: DevicesBundle,
	releases: AospSnapshot['releases'],
) {
	const cached = readCache<AospSnapshot>('snapshot');
	const snapshot: AospSnapshot = {
		bundle,
		releases,
		updatedAt: Date.now(),
		source: bundle._about.source,
	};
	writeCache('snapshot', snapshot);
	for (const cb of subscribers) {
		try {
			cb(snapshot);
		} catch {
			/* subscriber errors must not break the refresh */
		}
	}
}

function notifyReleases(
	slug: string,
	data: { roms: Release[]; kernels: Release[]; state: 'ready' },
) {
	const cached = readCache<AospSnapshot>('snapshot');
	if (!cached) return;
	const next: AospSnapshot = {
		...cached.value,
		releases: { ...cached.value.releases, [slug]: data },
	};
	writeCache('snapshot', next);
	for (const cb of subscribers) {
		try {
			cb(next);
		} catch {
			/* ignore */
		}
	}
}

/**
 * Subscribe to the AOSP snapshot (devices + releases). The
 * callback fires every time the device YAML is refreshed OR
 * a device's releases finish loading. Returns an unsubscribe.
 */
export function onAospChange(cb: (snapshot: AospSnapshot) => void): () => void {
	subscribers.add(cb);
	return () => subscribers.delete(cb);
}

/**
 * Force a full refresh (device YAML + all loaded releases).
 * Returns when both are settled. Throws on network failure.
 */
export async function refreshAosp(): Promise<DevicesBundle> {
	if (!browser) throw new Error('refreshAosp is client-only');
	return refreshDevices();
}

export const AOSP_TTL_MS = TTL_MS;
export const AOSP_DEVICES_SOURCE = DEVICES_YAML_URL;

