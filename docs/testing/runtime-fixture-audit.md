# Hardy Runtime Fixture Audit

Audit date: 2026-08-07. Target: `https://hardyzheng.com/`, Halo 2.25.4.

This record contains no credentials. The named resources use the `hardy-fixture-` prefix and
may be removed from the user-managed test site without affecting ordinary content.

## Created Data

- Twelve published fixture posts spanning January 2024 through May 2026.
- Long title, unbroken word, empty-cover, long-excerpt, taxonomy, pinned, comments-on, and
  comments-off cases.
- Two published pages: `/hardy-fixture-page-comments` and `/hardy-fixture-page-no-comments`.
- The comments-enabled fixture contains eight `hardy-fixture-long-comment-*` top-level comments
  and three synthetic replies, created through Halo's public comment contract for long-thread QA.
- Primary menu entries for an internal page, external new-window URL, nested page, and existing
  core routes.
- Two public Moments from `PluginMoments` 1.16.1, including
  `hardy-fixture-moment`, a deliberately long public text fixture created with
  the official Console editor on 2026-08-07.
- One `hardy-fixture-links` group and one populated `hardy-fixture-link` in `PluginLinks` 2.3.0-beta.4;
  the URL intentionally responds 404 to exercise link-status/error presentation.
- Five `hardy-fixture-` images uploaded through `PluginPhotos` 2.1.2 using the built-in `本地存储`
  policy; the 71-byte fixtures intentionally render detail media fallbacks and exercise neighbors.
- A previously published rich-content post created through the official editor; its front-end
  output currently contains an empty plugin-owned KaTeX block and is retained for editor-contract
  follow-up. No Shiki or hyperlink-card element is claimed from this fixture.
- A previously published code-content post created through the official editor; the public
  response contains the expected `<pre>` block and fixture source text.

## Route Evidence

Read-only HTTP smoke probes on 2026-08-07 returned 200 for `/`, `/archives`, `/categories`,
`/tags`, `/about`, `/authors/test`, `/moments`, `/links`, `/photos`, and `/actuator/health`.
`/search` returned 404; the installed Search Widget is exposed as a modal integration rather than
the theme's own route, so this response is not treated as a core route failure. The public pages
now reference the upgraded package assets `main-Btlf9kZt.js` and `main-DWGKb33z.css`.

| Route                                                                                           | Result                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` and `/page/2`                                                                               | 200; home pagination observed as `1 / 2` and `2 / 2`.                                                                                                                   |
| `/archives`, `/categories`, `/categories/default`, `/tags`, `/tags/hardy-fixture-tag-populated` | 200; archive, taxonomy, and populated list content rendered.                                                                                                            |
| `/authors/test`                                                                                 | 200; author heading and author pagination rendered.                                                                                                                     |
| `/archives/hardy-fixture-post-06-many-taxonomies-long-articletur`                               | 200; real H2/H3 headings, generated TOC anchors, and no horizontal overflow at 1280px.                                                                                  |
| `/archives/hardy-fixture-post-07-comments-on` and `/hardy-fixture-page-comments`                | Comment editor and submit controls present.                                                                                                                             |
| `/archives/hardy-fixture-post-08-comments-off` and `/hardy-fixture-page-no-comments`            | Comment editor and submit controls absent.                                                                                                                              |
| `/moments` and `/moments/moment-nsb2va7a`                                                       | 200 after adding `moments.html` and `moment.html`; list/detail content and Moment comments render.                                                                      |
| `/moments` and `/moments/moment-dp1iqbqt`                                                       | 200; the `hardy-fixture-moment` text renders in the list and detail routes. At 390px neither route has horizontal overflow; the detail route has a Moment comment host. |
| `/links`, `/photos`                                                                             | 200; optional plugin list routes render with their current populated fixtures.                                                                                          |
| Historical fixture slugs (no longer published)                                                  | Previously returned 200; the former contained `<pre>` source text and the latter contained plugin-owned KaTeX MathML.                                                   |

## Interaction Evidence

- At 390px, Menu opens a modal dialog with `aria-modal`, focusable Close control, and primary
  navigation; Close restores the header trigger.
- Color-scheme control changed from dark to auto and updated its accessible label.
- At 1280px, `document.documentElement.scrollWidth` was 1265px, below the 1280px viewport.
- TOC links matched the rendered heading IDs (`#nested-heading`, `#duplicate-heading`) without
  double encoding.
- Photos was disabled and re-enabled through the Console. While disabled, `/photos` returned the
  expected Halo 404; after the plugin startup delay, the five-photo list returned successfully.

## Post-upgrade Browser Matrix

The latest `dist/theme-hardy-0.1.0.zip` was uploaded and upgraded through Halo Console on
2026-08-07. The public home page now references the generated `main-Btlf9kZt.js` and
`main-DWGKb33z.css` assets. At 390, 768, 1024, 1280, and 1920px, the home shell reached
`readyState=complete`, had no console errors, and reported no horizontal overflow. The mobile
menu trigger was visible at 390/768px and the desktop sidebar at 1024/1280/1920px. A 390px menu
open/close cycle set the expected ARIA state, moved focus to Close, and restored focus to the
trigger; color-scheme switching changed the root from `auto` to `light` without console errors.

After the upgrade, the long post, comments-enabled page, comments-disabled page, Moments list, and
Moment detail all rendered `#hardy-main` with zero browser console errors. The enabled pages exposed
the expected comment hosts, while the disabled page exposed none; the long post and comments page
also exposed their TOC host.

## Remaining Runtime Gaps

- PluginLinks and PluginPhotos are installed on the target instance. PluginLinks has one populated
  mobile fixture; disabled and absent states remain pending. PluginPhotos has five populated list/detail
  fixtures and a verified neighbor link; group, EXIF, and plugin-state matrices remain pending.
- Rich-content fixtures now include a Shiki `<pre>` response and a KaTeX `.katex-block`/MathML
  response. The official editor's `嵌入网页` block produced an ordinary iframe with an empty `src`
  for `https://example.com/`; it is not evidence of a Hyperlink Card plugin element. Hyperlink Card
  still lacks a plugin-owned element, and color-mode, absent-plugin, and
  failure-state checks remain pending.
- Halo 2.0.0 compatibility and the full 390/768/1024/1280/1920 light/dark visual matrix are
  not claimed as complete.

## Temporary Halo 2.0.0 Compatibility Probe

On 2026-08-07 an official Halo v2.0.0 source build was run with Temurin JDK 17.0.20 and an
isolated H2 database. The generated Hardy package, augmented only in the temporary copy with
Halo 2.0 legacy `website`/`require` metadata aliases, installed as `theme-hardy`. After setting
the temporary system `theme.active` value to `theme-hardy`, `/`, `/archives/`, `/categories/`,
and `/tags/` returned HTTP 200. `/about` returned HTTP 404 because no SinglePage fixture exists
in that database. This is installation and empty-list evidence only; it does not close the full
Halo 2.0.0 compatibility gate.
