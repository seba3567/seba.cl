// AOSP build data structures.
//
// `Build` is one published release for one device (one
// `codename`). The changelog array is the visual changelog
// the page renders — see the "Build detail" panel.
//
// For now, builds.json ships with zero entries: the user
// hasn't published any releases yet ("por el momento no
// salen por github releases pero proximamente van a salir
// por ahi"). When they do, the sync-aosp-releases.mjs
// script (future) will hit the GitHub Releases API and
// merge into builds.json, keeping the same shape.

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

export type Build = {
	/** Slug of the device this build targets (matches
	 *  Device.slug in devices.json). */
	codename: string;
	version: string;
	/** ISO date string. */
	date: string;
	/** "15", "14", etc. */
	android: string;
	/** YYYY-MM-DD. */
	securityPatch: string;
	/** Kernel version baked into the build. */
	kernel: string;
	changelog: ChangeLogEntry[];
	downloads: DownloadMirror[];
	/** Free-form notes (warnings, install steps, known issues). */
	notes?: string;
};

export type Device = {
	slug: string;
	name: string;
	/** Optional: AOSP/CODENAME marker (e.g. "berlin"). When the
	 *  YAML provides it, used for the device card subtitle. */
	codename: string | null;
	status: 'active' | 'beta' | 'paused' | 'abandoned' | 'eol';
	image: string | null;
	// The spec keys here are the same as the i18n keys under
	// aosp.devices.specs.* — translating the labels in the
	// template is a 1:1 mapping.
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

export type Kernel = {
	/** Kernel codename / project name. */
	name: string;
	/** Target device codename. */
	target: string;
	/** Kernel version (e.g. "5.10.198"). */
	version: string;
	/** One-line tagline (e.g. "AnyKernel3 · optimized for battery"). */
	tagline: string;
	/** Link to the source / repo. */
	source: string;
	/** Primary download mirror. */
	download: string;
	/** Optional: alternate mirrors. */
	altDownloads?: DownloadMirror[];
	/** Optional: free-form notes. */
	notes?: string;
};
