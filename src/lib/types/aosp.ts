// AOSP build data structures.
//
// `RomRelease` is one published GitHub Release for a device's
// ROM repo. `KernelRelease` is the same shape for a device's
// kernel repo. The page groups them per device and renders
// them as a simple "Latest builds" + "Kernels" list.
//
// Both fields are populated by:
//   - build time: `bun run sync:aosp` (scripts/sync-aosp-devices.mjs)
//     which hits raw.githubusercontent.com for the device YAML
//     and api.github.com for releases.
//   - runtime:    `src/lib/aosp-client.ts` which re-fetches
//     both with a 15-min SWR cache. The bundled snapshot is
//     only used as the SSR / offline fallback.
//
// `Build` and `Kernel` below are the older manual-editing
// shapes — kept around for back-compat with existing
// `builds.json` / `kernels.json` and for hand-curated entries
// the user might want to add without going through GitHub.

export type ChangeType = 'added' | 'removed' | 'fixed' | 'improved';
export type ChangeSection =
	| 'boot'
	| 'kernel'
	| 'security'
	| 'system'
	| 'ui'
	| 'build'
	| 'networking'
	| 'misc';

export type ChangeLogEntry = {
	type: ChangeType;
	section: ChangeSection;
	text: string;
};

export type DownloadMirror = {
	name: string;
	url: string;
	size?: string;
	sha256?: string;
};

/** A single asset attached to a GitHub Release. */
export type ReleaseAsset = {
	name: string;
	url: string;
	size: number;
	downloadCount: number;
};

/**
 * One published GitHub Release — either a ROM or a kernel.
 * `kind` tells the page which section the release belongs in.
 * The page parses the release body for a "SHA-256: …" line;
 * if present, the hash is surfaced next to the download button.
 */
export type RomRelease = {
	kind: 'rom';
	tag: string;
	name: string;
	body: string;
	publishedAt: string;
	prerelease: boolean;
	assets: ReleaseAsset[];
	sha256: string | null;
};

export type KernelRelease = {
	kind: 'kernel';
	tag: string;
	name: string;
	body: string;
	publishedAt: string;
	prerelease: boolean;
	assets: ReleaseAsset[];
	sha256: string | null;
};

export type Release = RomRelease | KernelRelease;

/** Legacy shape — hand-curated builds. */
export type Build = {
	codename: string;
	version: string;
	date: string;
	android: string;
	securityPatch: string;
	kernel: string;
	changelog: ChangeLogEntry[];
	downloads: DownloadMirror[];
	notes?: string;
};

export type Device = {
	slug: string;
	name: string;
	codename: string | null;
	status: 'active' | 'beta' | 'paused' | 'abandoned' | 'eol';
	image: string | null;
	/** Convention: `seba3567/aosp-<slug>`. Override per-device. */
	romRepo?: string;
	/** Convention: `seba3567/aosp-<slug>-kernel`. Override per-device. */
	kernelRepo?: string;
	specs: {
		display: string | null;
		processor: string | null;
		ram: string | null;
		storage: string | null;
		rearCamera: string | null;
		frontCamera: string | null;
		battery: string | null;
		os: string | null;
		dimensions: string | null;
		weight: string | null;
		connectivity: string | null;
		waterResistance: string | null;
		screenProtection: string | null;
		extras: string | null;
	};
};

/** Legacy hand-curated kernels. */
export type Kernel = {
	name: string;
	target: string;
	version: string;
	tagline: string;
	source: string;
	download: string;
	altDownloads?: DownloadMirror[];
	notes?: string;
};
