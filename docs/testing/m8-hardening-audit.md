# M8 Hardening Audit

Audit date: 2026-08-07

This record captures checks that can be reproduced from the current workspace. It does not
replace live Halo browser evidence or the compatibility matrix.

## Static And Build Evidence

The following commands passed after the M8 hardening changes:

```text
pnpm check
pnpm build-only
pnpm build
git diff --check
```

The current generated baseline after the no-JS mobile navigation fallback is:

| Asset                                |     Raw size | Gzip size |
| ------------------------------------ | -----------: | --------: |
| `templates/assets/main-DWGKb33z.css` |     24.05 kB |       n/a |
| `templates/assets/main-Btlf9kZt.js`  |      6.91 kB |       n/a |
| `dist/theme-hardy-0.1.0.zip`         | 57,061 bytes |       n/a |

The browser bundle contains one first-party entry and no page-specific JavaScript entries. Scroll
events are passive; optional feature initializers return when their hooks are absent. Color mode,
TOC, media fallback, and menu initializers are guarded against repeated initialization.

The post-build package inventory was rechecked on 2026-08-07. The ZIP contains the generated
templates, hashed assets, theme metadata, settings, README, and license only; it contains no
`src/`, `node_modules/`, `research/`, fixture data, screenshots, `pnpm-workspace.yaml`, or
credentials.

## Static Accessibility Scan

The generated 14-template set was scanned on 2026-08-07: 38 image elements all carry an `alt`
attribute, all 100 button elements declare an explicit `type`, and no anchor contains an empty
`href`. This is a static baseline only; keyboard order, contrast, and screen-reader behavior still
require manual browser review.

## Package Inventory

The generated ZIP contains:

- `templates/` with nine core route templates and the hashed CSS/JS assets;
- `theme.yaml`, `settings.yaml`, `README.md`, and `LICENSE`;

The ZIP does not contain `src/`, `node_modules/`, `research/`, fixture data, screenshots,
`pnpm-workspace.yaml`, or credentials. `scripts/package-theme.mjs` stages only release-owned files
before invoking the official package CLI, preventing development YAML from entering the artifact.

## Hardening Changes

- The mobile drawer uses dialog semantics, a focus trap, `inert` background nodes, Escape/mask
  close behavior, and connected-element focus restoration.
- Auto color mode listens for `prefers-color-scheme` changes while forced modes remain stable.
- TOC links preserve existing Halo heading IDs without double encoding, expose `aria-current`, and initialize only once.
- Cover and detail images reserve space and expose a Hardy-owned fallback when loading fails.

The current package was uploaded and upgraded through Halo Console on 2026-08-07. The remote home
route was checked at 390, 768, 1024, 1280, and 1920px in the earlier visual pass; the current
package was additionally checked at 390px on core and enabled plugin routes. Every checked viewport completed
without Hardy console errors or horizontal overflow; the shell switched between mobile drawer and
desktop sidebar at the expected breakpoint. A mobile menu focus cycle and an `auto` to `light`
color-mode transition both passed. The active page now references `main-Btlf9kZt.js` and
`main-DWGKb33z.css`, matching the current local build.

## Evidence Gaps

- No Halo 2.0.0 instance is available, so the declared `>=2.0.0` compatibility range remains
  unproven; see `docs/contracts/compatibility-matrix.md`.
- The full 390/768/1024/1280/1920 visual and keyboard matrix requires a browser harness against
  a live Halo instance and is not represented by static checks.
- Plugin absent/disabled/error states and optional Links/Moments/Photos routes remain pending;
  see `docs/contracts/plugin-support.md` and `docs/testing/m7-plugin-audit.md`.
- The current ZIP has been installed and activated through the remote Halo Console. The remaining
  runtime gaps are feature-matrix gaps, not package-installation gaps.
