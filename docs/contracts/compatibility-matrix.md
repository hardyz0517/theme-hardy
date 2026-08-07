# Hardy Compatibility Matrix

Status: partial runtime evidence recorded; compatibility support is not yet declared

This document records evidence for the exact repository and test instance. `theme.yaml`
currently declares `requires: ">=2.0.0"`; that declaration is intentionally treated as an
untested claim until the minimum supported Halo line has been rendered with the full matrix.

## Version Matrix

| Halo version | Evidence                                                                                                                                                                                                                                                                                                                                                                  | Result                                                                                                                                                                                    | Status                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 2.0.0        | Official v2.0.0 source was built locally on 2026-08-07 with Temurin JDK 17.0.20. A clean H2 file instance on port 8092 installed the generated ZIP variant (with legacy `website`/`require` metadata aliases) and rendered `/`, `/archives/`, `/categories/`, and `/tags/` with HTTP 200. `/about` returned 404 because the temporary database has no SinglePage fixture. | Theme installation, metadata parsing, and the empty core list templates are observed. Post, SinglePage, author, pagination, plugin, and full browser matrices remain unexecuted on 2.0.0. | **Partial evidence; full support decision pending** |
| 2.25.4       | Public response from `https://hardyzheng.com/` on 2026-08-07 contains `<meta name="generator" content="Halo 2.25.4">` and loads `/themes/theme-hardy/assets/...`.                                                                                                                                                                                                         | Public smoke responses are available for core routes, the current published post, and the enabled `/links`, `/moments`, and `/photos` routes.                                             | **Observed; full matrix pending**                   |

The latest release reference is [Halo v2.25.4](https://github.com/halo-dev/halo/releases/tag/v2.25.4),
checked on 2026-08-06. The public response is strong evidence of the running version and active
theme, but does not prove every empty, boundary, keyboard, color-mode, or absent-plugin state.

## Observed Halo 2.25.4 Runtime

The following observations were made without modifying the remote site:

| Check                   | Observation                                                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Active theme            | HTML references the current `/themes/theme-hardy/assets/main-DVNQPdWL.js` and `main-BzF5IOY-.css` bundles.                                                                    |
| Core routes             | `/`, `/archives/`, `/categories/`, `/tags/`, `/about`, the current published post route, `/categories/default`, and `/tags/halo` returned HTTP 200 with HTML.                 |
| Known missing routes    | `/authors/` and `/search/` returned HTTP 404. `/authors/` is only an index probe; the contract route is `/authors/:name`. Optional plugin routes are tested separately.       |
| Theme mode              | `<html data-color-scheme="auto">` and Hardy's configured-mode attribute are present in public HTML.                                                                           |
| Comment extension       | The post response contains a Comment Widget host with `group: "content.halo.run"`, `kind: "Post"`, and a post resource name. The page response contains `kind: "SinglePage"`. |
| Installed plugin assets | `PluginCommentWidget` 3.1.2, `PluginSearchWidget` 1.7.1, `shiki` 1.4.2, `editor-hyperlink-card` 1.9.1, and `plugin-katex` 3.0.0 are injected by the public pages.             |
| Health endpoint         | `/actuator/health` returned `{"status":"UP"}`. It does not expose Java, database, or server configuration.                                                                    |

## Halo 2.0 Finder Parity Probe

The official v2.0.0 source build also exposes every core Finder method consumed by Hardy's
templates: `menuFinder.getPrimary()`, `pluginFinder.available(String)`, `postFinder.cursor(String)`,
the category/tag list methods, `postFinder.archives(...)`, and the `SinglePageFinder` list/content
methods. The v2.0 `PostFinder`, `MenuFinder`, `PluginFinder`, `CategoryFinder`, `TagFinder`, and
`SinglePageFinder` interfaces were read directly from the pinned source build. This confirms API
symbol parity, but not populated-data rendering or plugin extension behavior; those remain outside
the partial 2.0 runtime result above.

No author permalink was present in the current sitemap, so the parameterized author route
remains unexecuted. `/search/` is a modal integration rather than a Hardy-owned route. No claim
is made for absent/uninstalled optional-plugin states.

## Local Environment Audit

On 2026-08-07 this workspace had Node.js 24.18.0 and pnpm 10.33.0. The repository does not
ship Java or Docker, so the Halo 2.0.0 audit used a temporary official source build, Temurin
JDK 17.0.20, and an H2 file database outside the repository. The public runtime target remains
the user-managed Halo 2.25.4 instance.

## Static Build Baseline

The current working tree passed `pnpm check` on 2026-08-06. The latest generated artifact is
`dist/theme-hardy-0.1.0.zip` (about 56 KB), containing generated route templates, hashed CSS/JS,
`theme.yaml`, `settings.yaml`, README, and LICENSE. It contains no `src/`, `node_modules/`,
`research/`, fixture data, credentials, or `pnpm-workspace.yaml`; `scripts/package-theme.mjs`
stages only release-owned files before invoking the official package CLI.

## Package Script Audit

The scripts below are the complete `package.json` command surface as observed on 2026-08-06.
No browser-test command is currently declared, and no script requires a running Halo server.

| Command              | Current implementation            | Writes / external requirement                                                                |
| -------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm check`         | `vp check`                        | Read-only format, lint, and type checks.                                                     |
| `pnpm check:fix`     | `vp check --fix`                  | May edit source; use only intentionally and review the diff.                                 |
| `pnpm build-only`    | `tsc && vp build`                 | Generates `templates/` and bundled assets.                                                   |
| `pnpm build`         | `tsc && vp build && pnpm package` | Generates `templates/` and a staged `dist/*.zip` without development metadata.               |
| `pnpm package`       | `node scripts/package-theme.mjs`  | Packages release-owned files through the official CLI.                                       |
| `pnpm dev`           | `vp build --watch`                | Continuously regenerates build output; Halo still performs request-time Thymeleaf rendering. |
| `pnpm prepare`       | `vp config`                       | Configures Vite Plus hooks/integration.                                                      |
| `pnpm skills:update` | `npx skills update`               | Network access; unrelated to theme rendering.                                                |

The package manager is pinned to `pnpm@10.33.0`. Dependency installation was not part of this
audit; `node_modules/` is present, but its presence alone is not evidence that a clean install or
lockfile-only install has passed.

## Required Runtime Evidence

For each matrix row, record the following before treating the row as supported:

- Exact Halo version, Java version, operating system, and database mode.
- Theme installation from the generated ZIP and activation after reloading theme configuration.
- `SPRING_THYMELEAF_CACHE=false` during development verification.
- Home, archives, categories, category, tags, tag, author, post, and single-page routes.
- Empty, missing cover, long text, pagination, absent plugin, and active plugin states from the fixture checklist.
- Browser screenshots at 390, 768, 1024, 1280, and 1920 px in light and dark modes.

If a verified Finder API or extension point is unavailable on 2.0.0, update `spec.requires` to the first genuinely supported Halo version and state the reason in the release notes. Null checks must not be used to disguise an unsupported API.
