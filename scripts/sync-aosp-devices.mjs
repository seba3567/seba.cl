#!/usr/bin/env bun
/**
 * sync-aosp-devices — pull the AOSP device list from the user's
 * external YAML source AND the per-device ROM/kernel releases
 * from GitHub, normalize, and write a single local JSON snapshot
 * the site can read at build time.
 *
 * Why this exists:
 * - The site has no backend; it needs the device catalog + builds
 *   at build time as a fallback. Fetching at runtime is the
 *   primary path (see src/lib/aosp-client.ts) but a bundled
 *   snapshot guarantees dev works offline and SSR renders the
 *   first paint without a network round-trip.
 * - The user maintains the YAML in their own repo (one source of
 *   truth, hand-edited). This script pulls a snapshot and commits
 *   it under src/lib/data/aosp/devices.json so the site build is
 *   reproducible and offline-friendly.
 *
 * Source: AOSP_DEVICES_YAML_URL (env var)
 *   Default: the seba3567/devices-json repo. Override it to point
 *   at any other repo/branch/path. The script doesn't care about
 *   the host (any URL that returns valid YAML works) — the user
 *   can swap repos without touching the site code.
 *
 * Release convention (per device):
 *   ROM repo:    seba3567/aosp-<slug>           (GitHub Releases)
 *   Kernel repo: seba3567/aosp-<slug>-kernel    (GitHub Releases)
 *
 *   The slug is the device's `codename` (or its slugified name
 *   if no codename). If a repo doesn't exist or has no releases,
 *   the page shows "No published builds yet" — not an error.
 *
 * Failure modes:
 * - YAML down or 4xx/5xx: the script prints the error and exits
 *   non-zero. The committed devices.json from the last successful
 *   run is what gets shipped to the build, so dev still works
 *   offline.
 * - GitHub API down: we skip the release fetch for that device
 *   and continue. A single device's releases never block the
 *   rest of the catalog.
 *
 * Note: this script is the BUILD-TIME fallback. The page itself
 * uses the client-side aosp-client.ts to fetch fresh data with
 * 15-min SWR — so this script can be run manually once to seed
 * the bundle, and never again if you don't want to.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { load } from 'js-yaml';

const DEFAULT_YAML_URL =
	'https://raw.githubusercontent.com/seba3567/devices-json/refs/heads/main/devices.yaml';
const YAML_URL = process.env.AOSP_DEVICES_YAML_URL || DEFAULT_YAML_URL;
const OUT = join(process.cwd(), 'src', 'lib', 'data', 'aosp', 'devices.json');

const DEFAULT_INCLUDE_STATUSES = 'active,beta';
const INCLUDE_STATUSES = new Set(
	(process.env.AOSP_DEVICES_INCLUDE_STATUSES || DEFAULT_INCLUDE_STATUSES)
		.split(',')
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean),
);

const GITHUB_OWNER = 'seba3567';
const GITHUB_API = 'https://api.github.com';

const STATUS_MAP = {
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

function slugify(name) {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeStatus(raw) {
	if (!raw) return 'abandoned';
	return STATUS_MAP[raw] ?? 'abandoned';
}

/**
 * Fetch the published GitHub Releases for a given repo. Returns
 * an empty array if the repo doesn't exist (404) or has no
 * releases yet. We never throw — a single missing repo should
 * not break the rest of the catalog.
 */
async function fetchReleases(repo) {
	const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${repo}/releases?per_page=10`;
	try {
		const res = await fetch(url, {
			headers: { Accept: 'application/vnd.github+json' },
		});
		if (res.status === 404) return []; // repo doesn't exist yet
		if (!res.ok) {
			console.warn(
				`[sync-aosp-devices] releases fetch ${GITHUB_OWNER}/${repo}: ${res.status}`,
			);
			return [];
		}
		return await res.json();
	} catch (err) {
		console.warn(
			`[sync-aosp-devices] releases fetch ${GITHUB_OWNER}/${repo} failed: ${err.message}`,
		);
		return [];
	}
}

/**
 * Extract a SHA-256 from a release body. Many Android ROM
 * releases include a `SHA-256:` line in the body — we pull
 * the first hex string that follows that label.
 */
function extractSha256(body) {
	if (!body) return null;
	const match = body.match(/SHA-?256[:\s]+([a-f0-9]{64})/i);
	return match ? match[1].toLowerCase() : null;
}

/**
 * Normalize a GitHub Release into our Build[] shape.
 */
function normalizeRelease(rel, kind) {
	const assets = (rel.assets ?? []).map((a) => ({
		name: a.name,
		url: a.browser_download_url,
		size: a.size,
		downloadCount: a.download_count,
	}));
	return {
		kind, // 'rom' | 'kernel'
		tag: rel.tag_name,
		name: rel.name ?? rel.tag_name,
		body: rel.body ?? '',
		publishedAt: rel.published_at,
		prerelease: rel.prerelease,
		assets,
		sha256: extractSha256(rel.body),
	};
}

async function main() {
	if (YAML_URL === DEFAULT_YAML_URL) {
		console.log(`[sync-aosp-devices] using default source: ${YAML_URL}`);
	} else {
		console.log(
			`[sync-aosp-devices] using override: AOSP_DEVICES_YAML_URL=${YAML_URL}`,
		);
	}

	const res = await fetch(YAML_URL);
	if (!res.ok) {
		throw new Error(
			`Failed to fetch ${YAML_URL}: ${res.status} ${res.statusText}`,
		);
	}
	const text = await res.text();
	const parsed = load(text);
	if (!parsed?.devices) {
		throw new Error('YAML did not contain a `devices` map');
	}

	const allDevices = Object.entries(parsed.devices).map(([name, d]) => ({
		slug: d.codename ? slugify(d.codename) : slugify(name),
		name,
		codename: d.codename ?? null,
		status: normalizeStatus(d.status),
		image: d.imagen ?? null,
		romRepo: d.romRepo ?? `aosp-${d.codename ? slugify(d.codename) : slugify(name)}`,
		kernelRepo:
			d.kernelRepo ??
			`aosp-${d.codename ? slugify(d.codename) : slugify(name)}-kernel`,
		specs: {
			display: d.pantalla ?? null,
			processor: d.procesador ?? null,
			ram: d.memoria_ram ?? null,
			storage: d.almacenamiento ?? null,
			rearCamera: d.camara_trasera ?? null,
			frontCamera: d.camara_frontal ?? null,
			battery: d.bateria ?? null,
			os: d.sistema_operativo ?? null,
			dimensions: d.dimensiones ?? null,
			weight: d.peso ?? null,
			connectivity: d.conectividad ?? null,
			waterResistance: d.resistencia_agua ?? null,
			screenProtection: d.proteccion_pantalla ?? null,
			extras: d.otros ?? null,
		},
	}));

	const devices = allDevices.filter((d) => INCLUDE_STATUSES.has(d.status));
	const discontinued = allDevices.filter(
		(d) => !INCLUDE_STATUSES.has(d.status),
	);

	// Fetch ROM + kernel releases for each active device. The
	// GitHub API has a 60 req/h unauth limit; with 15-min SWR
	// on the client side this is a one-shot warm-up that runs
	// at build time, not per page view. Sequential to stay well
	// under any burst limits.
	console.log(
		`[sync-aosp-devices] fetching releases for ${devices.length} device(s)…`,
	);
	for (const d of devices) {
		const [roms, kernels] = await Promise.all([
			fetchReleases(d.romRepo),
			fetchReleases(d.kernelRepo),
		]);
		d.builds = roms.map((r) => normalizeRelease(r, 'rom'));
		d.kernels = kernels.map((r) => normalizeRelease(r, 'kernel'));
		console.log(
			`[sync-aosp-devices]   ${d.slug}: ${d.builds.length} rom(s), ${d.kernels.length} kernel(s)`,
		);
	}

	const out = {
		_about: {
			source: YAML_URL,
			override: YAML_URL === DEFAULT_YAML_URL ? null : 'AOSP_DEVICES_YAML_URL',
			includeStatuses: [...INCLUDE_STATUSES].sort(),
			generatedAt: new Date().toISOString(),
			note:
				'Bundled fallback. The /aosp page fetches fresh data client-side every 15 min via src/lib/aosp-client.ts; this snapshot is the SSR / offline fallback.',
		},
		devices,
		discontinued,
	};

	await mkdir(dirname(OUT), { recursive: true });
	await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
	console.log(
		`[sync-aosp-devices] wrote ${devices.length} active device(s) and ${discontinued.length} discontinued to ${OUT} (${(JSON.stringify(out).length / 1024).toFixed(1)} KB)`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
