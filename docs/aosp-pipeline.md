# AOSP data pipeline — `src/lib/data/aosp/*`

The site has no backend, but it renders a live AOSP device
catalog pulled from a hand-maintained YAML. This doc explains
how that pipeline works so a future maintainer (or an agent)
can extend it when the user starts publishing builds.

## Files at a glance

| File | Role |
|------|------|
| `scripts/sync-aosp-devices.mjs` | Downloads the YAML, normalizes it, writes `devices.json` |
| `src/lib/data/aosp/devices.json` | Snapshot of the device catalog. **Committed to git** so the build works offline |
| `src/lib/data/aosp/builds.json` | Per-device published builds + changelogs. Empty until the user publishes to GitHub Releases |
| `src/lib/data/aosp/kernels.json` | Standalone kernels the user builds outside the main ROM |
| `src/lib/types/aosp.ts` | `Device`, `Build`, `ChangeLogEntry`, `DownloadMirror`, `Kernel` types |
| `.env.example` | Documents the `AOSP_*` env vars |

## The sync

```
.env (optional)
  ├─ AOSP_DEVICES_YAML_URL      # where the YAML lives
  └─ AOSP_DEVICES_INCLUDE_STATUSES  # which statuses to render

predev / prebuild
  └─> bun run sync:aosp
        └─> fetch YAML
              └─> normalize status strings (es → enum)
                    slugify names
                    drop null fields
              └─> filter by INCLUDE_STATUSES
              └─> write src/lib/data/aosp/devices.json
                    ├─ devices (rendered)
                    └─ discontinued (filtered out, kept for reference)
```

## Configuring the source

The YAML source is controlled by an env var, **not** a
hardcoded URL. The script ships with a default
(`seba3567/devices-json` main) so existing setups keep
working, but you can swap repos / branches / hosts without
touching the site code.

| Env var | Default | Effect |
|---------|---------|--------|
| `AOSP_DEVICES_YAML_URL` | `https://raw.githubusercontent.com/seba3567/devices-json/refs/heads/main/devices.yaml` | Where to fetch the YAML from. Any URL that returns valid YAML works (GitHub raw, GitLab raw, your own mirror, etc.) |
| `AOSP_DEVICES_INCLUDE_STATUSES` | `active,beta` | Comma-separated list of statuses to render. Devices with statuses NOT in this list are written to `devices.json#discontinued` for reference but never rendered. The default is conservative (only show devices under active development); set to `active,beta,paused,abandoned,eol` to render everything. |

Set them in `.env` (gitignored, local dev) or in your CI's
secret store (production). The site itself ships the
**snapshot** (`devices.json`), not the live URL — the env
var only affects what gets snapshotted on the next build.

### Swapping to a new repo

When the user creates a new devices repo (or moves to a
different branch), the only change is one line in `.env`:

```diff
- # (uses default: seba3567/devices-json main)
+ AOSP_DEVICES_YAML_URL=https://raw.githubusercontent.com/seba3567/devices-json-v2/main/devices.yaml
```

Next `bun run sync:aosp` (or any `bun run dev` / `bun run build`)
pulls from the new URL. The site code doesn't change.

`bun run sync:aosp` is idempotent and offline-safe. If
the YAML fetch fails (network down, 4xx, etc.), the
script exits non-zero and the build uses the previously
committed `devices.json` as a snapshot. The dev server
keeps working offline; the user just doesn't get updates
until they fix the network or the YAML.

## The data model

`Device.slug` is the join key: it's the codename from
the YAML when present, otherwise a slugified version of
the human name. `Build.codename` matches it.

`Build.changelog` is the visual changelog the page renders
with category-coloured badges (Added / Removed / Fixed /
Improved) and section headers (Boot / Kernel / Security /
System / UI / Build / Networking / Misc). The structure is
open — sections are a string enum and the badge color is
derived from `type`. To add a new section, add it to the
`ChangeSection` union in `types/aosp.ts` and the
color-map in the page.

## When GitHub Releases are ready

The user said: "por el momento no salen por github releases
pero proximamente van a salir por ahi." When that happens:

1. Create `scripts/sync-aosp-releases.mjs` (mirror of the
   devices sync). For each device, hit
   `https://api.github.com/repos/seba3567/aosp-<slug>/releases`
   and merge into `builds.json`.
2. Decide: do we keep `builds.json` as a manual cache
   (like `devices.json`) or fetch live at runtime? The
   GitHub API is unauthenticated and rate-limited (60/h), so
   a build-time snapshot is the right call for a static
   site — same reasoning as the devices YAML.
3. The changelog parsing: GitHub release bodies are
   markdown. The current `ChangeLogEntry` shape is
   structured, so the sync script would need a small
   markdown → ChangeLogEntry parser. The simplest mapping
   is: each H2/H3 = section, each bullet = entry with
   type inferred from leading verb (Added/Removed/Fixed/
   Improved) or the `*type*` prefix.
4. Once `builds.json` is populated, the page automatically
   picks them up — no other changes needed.

## Adding a new field

If the YAML gains a new spec field (say, `gps`):

1. Add `gps: string | null` to the `specs` type in
   `types/aosp.ts`.
2. Add the YAML key in `sync-aosp-devices.mjs`:
   ```js
   specs: {
     // ...
     gps: d.gps ?? null,
   }
   ```
3. Run `bun run sync:aosp` to regenerate the snapshot.
4. Add the i18n key in `es.json` and `en.json`:
   `aosp.devices.specs.gps` → "GPS" / "GPS".
5. Render it in the device detail panel:
   ```svelte
   {#if device.specs.gps}
     <dt>{$t('aosp.devices.specs.gps')}</dt>
     <dd>{device.specs.gps}</dd>
   {/if}
   ```

Same pattern for kernels: add a field to `Kernel` in
`types/aosp.ts`, add entries to `kernels.json` (or
introduce a YAML feed for kernels too if the list grows),
no other changes.
