# M6 Official Plugin Runtime Audit

Audit date: 2026-08-06

Target: `https://hardyzheng.com`, Halo `2.25.4`, Hardy `0.1.0`.

## Search Widget

- Installed plugin: `PluginSearchWidget` `1.7.1`.
- The desktop and 390px mobile triggers rendered only when the capability guard was available.
- Clicking the trigger opened the official modal through `SearchWidget.open()`.
- The input and no-results state rendered; entering `Hello` retained a valid no-results view.
- Escape closed the modal. The modal remained usable with the root in dark mode and did not overflow the mobile viewport.
- Absent/disabled plugin behavior and long-result layout remain pending.

## Comment Widget

- Installed plugin: Comment Widget `3.1.2`.
- `/about` rendered a SinglePage comment host with the expected `content.halo.run / SinglePage` identity; the mobile editor and submit control were visible.
- The current published post route rendered a Post host with the expected `content.halo.run / Post` identity. Its child widget was empty because the current post/permission state does not provide a populated thread. The earlier local fixture slug is no longer published and is not used by the smoke test.
- Host spacing remained stable and did not create horizontal overflow.
- A fresh 390px browser pass on 2026-08-07 read the actual extension bootstrap blocks: `/about`
  mounted `content.halo.run / SinglePage / 373a5f79-f44f-441a-9df1-85a4f553ece8`, while the
  current post mounted `content.halo.run / Post / 019fda4a-3b74-7266-99ee-dd054ee2942d`.
  Both hosts remained inside the viewport in `auto` mode. The same routes were included in the
  forced light/dark visual matrix; the shared shell and host spacing remained stable.
- On 2026-08-07, the existing `hardy-fixture-page-comments` resource received eight synthetic
  `hardy-fixture-long-comment-*` top-level comments and three replies through Halo's documented
  public comment endpoint. The Comment Widget rendered eight `comment-item` elements at 390px in
  auto, light, and dark modes; each state reported `scrollWidth` below the viewport and no browser
  console errors. The fixture uses an invalid example email and contains no personal data.
- Comment Widget was temporarily disabled through Console on 2026-08-07: `/about` stayed HTTP 200,
  the comment-widget asset and SinglePage host disappeared, and the Hardy shell remained usable.
  The plugin was re-enabled successfully; the host and `kind: "SinglePage"` bootstrap returned.
- Disabled-content behavior for the resource itself and true uninstalled-plugin page fixtures
  remain pending; the populated long-thread state is covered by the fixture above.

## Rich Content

The remote plugin inventory identifies `editor-hyperlink-card` 1.9.1. Its Console detail page
reports the official plugin ID `editor-hyperlink-card` and a Halo requirement of `>=2.22.0`. The
default editor's visible insert menu did not expose a separately labelled hyperlink-card command,
and the official `嵌入网页` block produced an ordinary iframe rather than a plugin-owned element.
No Hyperlink Card fixture is claimed until a plugin-created node can be reproduced through the
supported editor flow.

Shiki `1.4.2`, Hyperlink Card `1.9.1`, and KaTeX `3.0.0` assets are present on the target site.
A temporary rich-content fixture was previously published through the official editor and its
front-end output contained a plugin-owned `.katex-block` with a MathML `math` element. Those
fixture slugs are no longer published; the evidence is retained as historical plugin evidence.
Shiki class/theme behavior still needs color-mode and absent-plugin checks, and no hyperlink-card
element is claimed yet.
Populated, error, absent-plugin, and both color modes therefore remain unverified. Hardy scopes ordinary prose styles to
`.hardy-prose` and does not target plugin-private selectors or bundle plugin assets.

The prose boundary now also constrains injected `iframe`, `video`, `audio`, and `svg` media to
`max-width: 100%` within `.hardy-prose`. This is a narrowly scoped overflow guard for rich-content
plugins; it does not initialize or style any plugin-private element.

LightGallery, AI Summary, and Steam content do not have a verified installed plugin contract in
this instance. Reference-page markup is not sufficient evidence for adding custom elements; each
needs a plugin-created fixture and an exact plugin identifier/version before integration. A future
LightGallery fixture may use its documented selector against `.hardy-prose`, but no selector or
initialization code is added speculatively.

No credentials, cookies, screenshots, or remote exports are stored in the repository.
