#!/usr/bin/env bun
/**
 * sync-aosp-devices — pull the AOSP device list from the user's
 * external devices-json repo, normalize, and write a local JSON
 * snapshot the site can read at build time.
 *
 * Why this exists:
 * - The site has no backend; it needs the device catalog at build
 *   time. Fetching it at runtime would add latency and a network
 *   dependency on every page load.
 * - The user maintains the YAML in seba3567/devices-json (one
 *   source of truth, hand-edited). This script pulls a snapshot
 *   and commits it under src/lib/data/aosp/devices.json so the
 *   site build is reproducible and offline-friendly.
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

const YAML_URL =
	'https://raw.githubusercontent.com/seba3567/devices-json/refs/heads/main/devices.yaml';
const OUT = join(process.cwd(), 'src', 'lib', 'data', 'aosp', 'devices.json');

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

	const devices = Object.entries(parsed.devices).map(([name, d]) => ({
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

	const out = {
		_about: {
			source: YAML_URL,
			generatedAt: new Date().toISOString(),
			note: 'Snapshot of seba3567/devices-json — regenerate via `bun run sync:aosp`',
		},
		devices,
	};

	await mkdir(dirname(OUT), { recursive: true });
	await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
	console.log(
		`Wrote ${devices.length} device(s) to ${OUT} (${(JSON.stringify(out).length / 1024).toFixed(1)} KB)`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
