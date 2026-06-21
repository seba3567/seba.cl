// Universal load for /aosp/[slug]. Reads the device bundle
// from the client-side cache (with SWR — see $lib/aosp-client)
// and resolves the device by slug. Throws a 404 if the slug
// isn't in the catalog.
//
// On the server we hit the bundled JSON (offline / SSR
// fallback). On the client we use the SWR cache, which may
// have a fresher copy after the user has loaded /aosp once.
// If the slug isn't in the bundle yet (because the YAML was
// updated after the bundle was last regenerated), we kick
// off a fresh fetch in the background so a navigation from
// /aosp to /aosp/<slug> works even when the slug is brand
// new in the YAML.

import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import { loadAospDevices, refreshAosp } from '$lib/aosp-client';
import type { Device, Release } from '$lib/types/aosp';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	let bundle = await loadAospDevices();
	let device = (bundle.devices as Device[]).find(
		(d) => d.slug === params.slug,
	);

	// On the client: if the slug isn't in the cache yet, kick
	// off a fresh fetch and try again. This covers the case
	// where the user just opened /aosp and the SWR cache
	// hasn't caught up with the latest YAML, OR the user
	// navigated directly to /aosp/<slug> without visiting
	// /aosp first.
	if (!device && browser) {
		try {
			bundle = await refreshAosp();
			device = (bundle.devices as Device[]).find(
				(d) => d.slug === params.slug,
			);
		} catch {
			// Network down or the YAML doesn't have this slug.
			// Fall through to the 404 below.
		}
	}

	if (!device) {
		throw error(404, `Device ${params.slug} not found`);
	}

	return {
		device,
		slug: params.slug,
		// Eagerly requested releases (may be empty if the device
		// has no GitHub releases yet — that's the expected state
		// right now while we're still publishing builds).
		releases: { roms: [] as Release[], kernels: [] as Release[] },
	};
};
