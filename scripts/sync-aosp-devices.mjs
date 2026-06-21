#!/usr/bin/env bun
/**
 * sync-aosp-devices — pull the AOSP device list from the user's
 * external YAML source, normalize, and write a local JSON snapshot
 * the site can read at build time.
 *
 * Source: AOSP_DEVICES_YAML_URL (env var)
 *   Default: the historical seba3567/devices-json repo. Override it
 *   to point at any other repo/branch/path. The script doesn't
 *   care about the host (any URL that returns valid YAML works) —
 *   the user can swap repos without touching the site code.
 *
 * Why this exists:
 * - The site has no backend; it needs the device catalog at build
 *   time. Fetching it at runtime would add latency and a network
 *   dependency on every page load.
 * - The user maintains the YAML in their own repo (one source of
 *   truth, hand-edited). This script pulls a snapshot and commits
 *   it under src/lib/data/aosp/devices.json so the site build is
 *   reproducible and offline-friendly.
 *
 * Failure modes:
 * - Network down or 4xx/5xx: the script prints the error and
 *   exits non-zero. The committed devices.json from the last
 *   successful run is what gets shipped to the build, so dev
 *   still works offline (just without updates).
 *
 * Future: when builds move to GitHub Releases, add a second
 * script (sync-aosp-releases.mjs) that hits the GitHub API per
 * device and merges into builds.json. Keep the snapshot pattern
 * for the same reason.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { load } from 'js-yaml';

const DEFAULT_YAML_URL =
	'https://raw.githubusercontent.com/seba3567/devices-json/refs/heads/main/devices.yaml';
const YAML_URL = process.env.AOSP_DEVICES_YAML_URL || DEFAULT_YAML_URL;
const OUT = join(process.cwd(), 'src', 'lib', 'data', 'aosp', 'devices.json');

// Status filter: by default we hide 'paused', 'abandoned', and
// 'eol' devices so the /aosp page shows only the actively
// developed build targets. Override via env var as a
// comma-separated list.
// Example: AOSP_DEVICES_INCLUDE_STATUSES=active,beta,paused,abandoned,eol
const DEFAULT_INCLUDE_STATUSES = 'active,beta';
const INCLUDE_STATUSES = new Set(
	(process.env.AOSP_DEVICES_INCLUDE_STATUSES || DEFAULT_INCLUDE_STATUSES)
		.split(',')
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean),
);

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

	// Apply the status filter. The full list (incl. filtered ones)
	// is preserved as `discontinued` for reference / future UI.
	const devices = allDevices.filter((d) => INCLUDE_STATUSES.has(d.status));
	const discontinued = allDevices.filter(
		(d) => !INCLUDE_STATUSES.has(d.status),
	);

	const out = {
		_about: {
			source: YAML_URL,
			override: YAML_URL === DEFAULT_YAML_URL ? null : 'AOSP_DEVICES_YAML_URL',
			includeStatuses: [...INCLUDE_STATUSES].sort(),
			generatedAt: new Date().toISOString(),
			note: 'Snapshot of the AOSP device catalog. Regenerate via `bun run sync:aosp`.',
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
