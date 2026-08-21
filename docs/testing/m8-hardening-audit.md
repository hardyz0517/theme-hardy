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
| `templates/assets/main-C72vpxGB.css` |     24.94 kB |       n/a |
| `templates/assets/main-CH_JTq6o.js`  |      6.97 kB |       n/a |
| `dist/theme-hardy-0.1.0.zip`         | 64,789 bytes |       n/a |

The browser bundle contains one first-party entry and no page-specific JavaScript entries. Scroll
events are passive; optional feature initializers return when their hooks are absent. Color mode,
TOC, media fallback, and menu initializers are guarded against repeated initialization.

The 2026-08-07 publish-latency follow-up tightened the server-rendering budget. Generated route
templates now contain one `menuFinder.getPrimary()` call and one
`pluginFinder.available('PluginSearchWidget')` call each, shared by all shell variants. Moment
list items no longer instantiate comment widgets; the detail route owns the single Moment comment
extension point. Internal links use native navigation without the former fixed 220 ms delay and
page-wide pointer lock. `pnpm test:hardening` enforces these three contracts.

The post-fix production build contains `main-CXh7CUUr.js` at 15.01 kB raw / 5.47 kB gzip and
`main-C_62XAOO.css` at 45.70 kB raw / 8.07 kB gzip. The packaged `theme-hardy-0.1.11.zip` is
109,744 bytes. All 14 generated route templates contain exactly one shared menu Finder call and
one shared Search Widget capability check.

The post-build package inventory was rechecked on 2026-08-07. The ZIP contains the generated
templates, hashed assets, theme metadata, settings, README, and license only; it contains no
`src/`, `node_modules/`, `research/`, fixture data, screenshots, `pnpm-workspace.yaml`, or
credentials.

Package staging derives its HTML allowlist from the top-level source templates in `src/` and copies
only those generated templates plus the current asset directory. Stale generated HTML left in
`templates/` cannot enter the release ZIP.

A clean-install check was also completed in an isolated temporary directory with `pnpm@10.33.0`
and `pnpm install --frozen-lockfile`. The clean tree installed 158 packages, passed `pnpm build`,
and produced the same 64,789-byte ZIP inventory. The temporary checkout was removed after the
verification.

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

## Latest Runtime Verification

On 2026-08-07, the current `dist/theme-hardy-0.1.0.zip` was uploaded and accepted as an upgrade
through Halo Console on the public Halo 2.25.4 instance at `https://hardyzheng.com`. The site then
served the new `main-BzF5IOY-.css` bundle. Its computed body style is the expected Droid Serif
family at `18px` with a `27px` line height.

The same instance returned HTTP 200
for `/`, `/archives/`, `/categories/`, `/categories/default`, `/tags/`, `/tags/halo`, `/about`,
the current published post route, `/links`, `/moments`, and `/photos`. At 390px the mobile drawer opened,
closed with Escape, restored focus, and the color-mode control changed the root from `light` to
`dark` without console errors. The checked plugin list and detail routes had no horizontal overflow.

The home route was also checked at 390, 768, 1024, 1280, and 1920px: the mobile header and desktop
sidebar switched at the expected breakpoint, the computed typography stayed at 18px/27px, and no
viewport overflow was observed. A broken media event exposed the Hardy fallback, and the long
article fixture retained its prose/TOC content without overflow or console errors.

With Web Share and Clipboard APIs unavailable in the browser context, clicking the post Share
control produced the documented fallback status `暂时无法分享，请从浏览器地址栏复制链接。`
without a console error or focus trap.

The live Photos route also exercised missing-media resilience: all five fixture images reported
`naturalWidth: 0`, displayed the Hardy fallback, and kept the 390px document within the viewport.
Reloading the route preserved one initialization marker per media/menu hook, with no duplicate
controls or console errors. The server response contains the `hardy-noscript-nav` fallback, so
primary navigation remains present in the no-JavaScript document path.

The same structural matrix covered 11 core/plugin routes at all five widths (55 route/viewport
checks). Every check had a Hardy stylesheet, an `h1`, 18px/27px body typography, and no horizontal
overflow; the browser reported no Hardy console errors.

The mobile color control cycled through `auto -> light -> dark -> auto`, updating both the visible
label and the root `data-color-scheme` attribute without errors.

The deployed home page also passed a semantic accessibility baseline: one `main`, three navigation
landmarks, one footer landmark, one `h1`, no empty link names or `href` values, no unnamed visible
buttons, no missing image `alt` attributes, no positive `tabindex`, and no mobile overflow. The
drawer focus trap and restoration were verified directly; full keyboard traversal and contrast
review still need manual confirmation because the in-app browser's synthetic Tab action did not
advance focus reliably.

Resilience checks covered a broken media event (Hardy fallback became visible), a long article with
TOC content at 390px, and server-rendered route content. The share-control click could not complete
within the browser backend's locator timeout and remains unverified; it produced no page error.

## Current Matrix Rerun

On 2026-08-07, the deployed package was checked again with a live browser matrix. All 11
core/optional routes at 390, 768, 1024, 1280, and 1920px (55 route/viewport states) had exactly
one `h1`, a Hardy stylesheet, and no document horizontal overflow in `auto` mode. The same 11
routes were rerun at 390px in forced `light` and forced `dark`; each kept the selected root mode,
one `h1`, and no horizontal overflow. The test session restored `auto` mode and the default
viewport afterward. This is structural visual evidence, not the remaining screenshot/pixel review.

The same live pass checked semantic baselines on all 11 routes: every route had one `main` and
one `h1`, zero unnamed visible buttons, empty links, missing image `alt` attributes, or positive
`tabindex` values. Additional `nav`/`footer` landmarks on detail and plugin pages are intentional
content and extension landmarks rather than duplicate shell controls.

## Latest CLI Smoke Rerun

On 2026-08-07, `HALO_TEST_BASE_URL=https://hardyzheng.com pnpm test:smoke` completed with 11
independent `PASS` results: home, archives, categories, category, tags, tag, page, post, links,
moments, and photos. Every response was HTTP 200 and contained a Hardy theme asset. This is a
route-health check only; it does not close the absent-plugin, rich-content, keyboard, or pixel
review gaps listed below.

## Contrast Follow-up

The browser contrast pass found the light-mode muted token (`#8390a0`) at 3.25:1 on ordinary
navigation text and the subtle token (`#a0a9b5`) at 2.38:1 on metadata text. They were changed to
`#52657b` and `#607286` respectively in `src/css/foundation/tokens.css`; both clear the 4.5:1 AA
threshold on white. `pnpm check`, `pnpm build`, and `git diff --check` passed after the change.
The regenerated package uses `main-C72vpxGB.css`; the live site must be upgraded to this package
before claiming the new contrast result in the deployed matrix.

The token check is now repeatable with `pnpm test:contrast`; it reports `5.99:1` light muted,
`4.94:1` light subtle, `8.64:1` dark muted, and `5.73:1` dark subtle. This automated check does
not replace the remaining keyboard traversal and deployed browser review.

The dependency-free `pnpm test:hardening` check also passed. It verifies the reduced-motion rule,
media error and failed-load fallback hooks, idempotent menu/media guards, feature error isolation,
and the scoped rich-content media width rule. These source-contract checks supplement, but do not
replace, live failure injection.

## Full Screenshot Matrix

On 2026-08-07, a fixed 900px-high browser viewport captured 165 screenshots to the disposable
directory `C:\Users\Hardy\AppData\Local\Temp\hardy-visual-matrix-20260807` (not the repository):
the 11 routes above at 390, 768, 1024, 1280, and 1920px, in `auto`, forced `light`, and forced
`dark` modes. Each capture recorded the selected `data-color-scheme`, document width, route title,
landmark counts, and overflow status in `matrix.json`. All 165 states reported the expected mode,
exactly one `main`, exactly one `h1`, and no horizontal overflow. Representative light desktop,
dark desktop, and dark mobile captures were visually inspected against the approved reference
geometry; no incoherent overlap, unstable cover dimensions, or broken shell breakpoint was found.
The screenshots remain outside the release package by design.

Representative live screenshots at 390px dark and 1280px light/dark were inspected during this
rerun; the shell breakpoint, sidebar/list geometry, cover dimensions, typography, and focus ring
were visually coherent. They were emitted for review only and were not written into the release
package. The complete screenshot archive and pixel-difference review remain open.

## Evidence Gaps

- No Halo 2.0.0 instance is available, so the declared `>=2.0.0` compatibility range remains
  unproven; see `docs/contracts/compatibility-matrix.md`.
- The screenshot matrix is complete as a fixed-viewport visual/structural pass. Full keyboard
  traversal and contrast review still require manual confirmation because the in-app browser's
  synthetic Tab action did not advance focus reliably.
- A manual accessibility sample on 2026-08-07 found one `main`, one footer, two intentional
  navigation landmarks, no missing image alternatives, unnamed buttons, empty links, or positive
  `tabindex` values. The mobile dialog exposed `aria-modal="true"`, moved focus to Close, and
  restored focus to the trigger after Escape. Computed body text contrast was 12.80:1 in light
  mode and 16.43:1 in dark mode. Full control-by-control keyboard traversal and reduced-motion
  animation review remain open.
- Plugin absent/uninstalled/error states and the complete optional-route visual matrix remain pending;
  see `docs/contracts/plugin-support.md` and `docs/testing/m7-plugin-audit.md`.
- The current package installation, post-install smoke verification, and clean-install package
  check are complete. Remaining gaps are feature-matrix gaps rather than package-installation gaps.
