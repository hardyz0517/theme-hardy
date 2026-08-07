# Optional Content Plugin Contracts

Status: source contracts verified; runtime gate has empty/populated and temporary disabled evidence
for Links/Photos. Photos has five populated fixtures and a verified neighbor link; the full metadata
matrix remains pending (2026-08-06).

This note records only contracts checked against plugin source at a pinned revision and the
test Halo instance. The rendered HTML captured from `ryanc.cc` remains visual research, not
API evidence.

## Evidence

- Halo test instance: `https://hardyzheng.com/`, Halo `2.25.4`.
- Authenticated plugin inventory endpoint: `/apis/api.console.halo.run/v1alpha1/plugins`.
- Public probes: `/apis/api.moment.halo.run/v1alpha1/moments`, `/moments`, `/links`, and
  `/photos`.
- Source documents are the `dev/theme-api.md` and `dev/rest-api.md` files in each pinned
  repository revision below. Retrieval date: 2026-08-06.

The current plugin inventory contains `PluginMoments` `1.16.1`, `PluginLinks` `2.3.0-beta.4`,
and `PluginPhotos` `2.1.2`. All three reported `enabled: true` and `status.phase: STARTED`.

## Contract Matrix

| Plugin          | Pinned source and compatibility                                                                                                                                                                                                                                          | Theme routes and templates                                                                                                                                                                 | Theme data contract                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Comment identity                                                                                         | Runtime evidence                                                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PluginMoments` | `v1.16.1`, commit [`bad4fe1`](https://github.com/halo-sigs/plugin-moments/tree/bad4fe1cc2548bf806466bbc7e38d309c4c3668a); `requires: >=2.22.0`; optional `PluginFeed >=1.4.0`                                                                                            | `/moments` and `/moments/page/{page}` -> `moments.html`; `/moments/{name}` -> `moment.html`; `/moments/rss.xml` redirects permanently to `/feed/moments/rss.xml`                           | List: `moments: UrlContextListResult<MomentVo>`, `tags: List<MomentTagVo>`. Detail: `moment: MomentVo`. Finder: `momentFinder.listAll()`, `list(page,size)`, `list(Map)`, `listBy(tag)`, `listByTag(page,size,tag)`, `get(name)`, `listAllTags()`. `MomentVo.spec.content` has `raw`, `html`, nullable `medium[]` (`PHOTO`, `VIDEO`, `POST`, `AUDIO`); `spec.releaseTime`, `spec.tags`, `owner`, and `stats.{upvote,totalComment,approvedComment}` are available.                                                                  | `group="moment.halo.run"`, `kind="Moment"`, `name=moment.metadata.name`                                  | Installed and started. One populated public moment (`total: 1`, HTML content, empty media, zero stats) renders `/moments` and `/moments/moment-nsb2va7a` with Moment comments and no console errors.                                        |
| `PluginLinks`   | `v2.3.0-beta.4`, commit [`d7c3a88`](https://github.com/halo-sigs/plugin-links/tree/d7c3a880c71129a788c4e9e962df616e46bf5572); `requires: >=2.25.0`; optional `ai-foundation >=1.0.0-beta.4 <2.0.0`                                                                       | `/links` -> `links.html`; optional `group` query parameter                                                                                                                                 | Context: `links: List<LinkVo>`, `simpleGroups: List<LinkGroupVo>`, `groups: List<LinkGroupVo>`, `group`, `linksTitle`, `pluginName`, `csrfToken`, and `linkApplicationEnabled`. Finder: `linkFinder.groupBy()`, `listBy(group)`, `random(maxSize)`, `count()`. Theme fields are `spec.url`, `displayName`, `logo`, `description`, `priority`, and `groupName`; missing logo, description, and status are valid.                                                                                                                    | `group="plugin.halo.run"`, `kind="Plugin"`, `name=pluginName` (the plugin context name is `PluginLinks`) | Installed and started. `/links` renders the Hardy empty state; a populated grouped `hardy-fixture-link` with a long description and broken external URL renders at `/links` without horizontal overflow at 390px.                           |
| `PluginPhotos`  | `v2.1.2`, commit [`64e3b2f`](https://github.com/halo-sigs/plugin-photos/tree/64e3b2faf38e265e52666d76b96452254dbfa5a0); manifest declares `requires: >=2.22.0` (the tag is the version source of truth; its manifest also contains a legacy `spec.version: 1.0.0` field) | `/photos` -> `photos.html`; `/photos/{name}` -> `photo.html`; `/photos/page/{page}` redirects `301` to `/photos?page={page}`. `group`, `page`, and `size` are optional context parameters. | List: `groups: List<PhotoGroupVo>`, `photos: UrlContextListResult<PhotoVo>`, `photoUrl: PhotoUrlBuilder`, `title`. Detail: `photo`, `neighbors` (up to five), nullable `prev`/`next`, `position`, `total`, `group`, `page`, `size`, `backUrl`, `title`, and `photoUrl`. Finder: `photoFinder.groupBy()`, `listAll()`, `listBy(group)`, `list(page,size)`, `list(page,size,group)`. `PhotoVo.spec` has `displayName`, `description`, `url`, optional `cover`, `groupName`, `tags`, and `priority`; public `exif` strips GPS fields. | `group="core.halo.run"`, `kind="Photo"`, `name=photo.metadata.name`                                      | Installed and started. The built-in `本地存储` policy is configured; `/photos` renders five populated fixtures and `/photos/photo-vjbgyo93` exposes a `Next` neighbor. Group, EXIF, absent/disabled, and full mobile states remain pending. |

## Gate Results

The source contract is sufficient to design isolated templates for all three plugins. The
implementation gate is not yet green:

- Moments has a real installed/populated fixture, but list/detail templates and all
  empty/disabled/error states still need to be exercised in the theme.
- Links has an installed empty state and one populated mobile fixture; Photos has five populated
  fixtures and a verified neighbor link, while its mobile screenshot and metadata matrix remain
  pending. Do not infer runtime behavior from `ryanc.cc`.
- Plugin absence must be tested by disabling/uninstalling the plugin and reloading the shell.
  Navigation should be capability-gated with the exact identifier for each route, for example
  `pluginFinder.available('PluginMoments')`, `pluginFinder.available('PluginLinks')`, or
  `pluginFinder.available('PluginPhotos')`;
  the plugin-owned route must not be recreated by Hardy when absent.
- Moments `stats.upvote` is a read-only counter in the documented theme contract. No public
  upvote mutation endpoint or browser contract is documented in the pinned source, so Hardy
  must not invent an upvote action. Comments can use the identity above through the official
  `halo:comment` extension point.
- Links' visitor application form has a separate CAPTCHA/CSRF contract. It must not be
  emitted until `linkApplicationEnabled` is true; REST application calls are out of scope
  for the first theme implementation.
- Photos' EXIF object may be null and GPS fields are deliberately removed from public theme
  data. The theme must not display or attempt to recover GPS data.

## Asset And License Boundary

The theme may consume plugin-provided rendered content, URLs, and extension points, but must
not bundle plugin JavaScript, CSS, fonts, logos, or copied reference-site assets. The plugin
repositories remain the license and asset source; Hardy supplies only original templates,
scoped styles, and capability guards.
