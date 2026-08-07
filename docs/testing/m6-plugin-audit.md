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
- `/archives/hello-halo` rendered a Post host with the expected `content.halo.run / Post` identity. Its child widget was empty because the current post/permission state does not provide a populated thread.
- Host spacing remained stable and did not create horizontal overflow.
- Disabled-plugin, disabled-content, and populated long-thread states remain pending.

## Rich Content

The remote plugin inventory identifies `editor-hyperlink-card` 1.9.1. Its Console detail page
reports the official plugin ID `editor-hyperlink-card` and a Halo requirement of `>=2.22.0`. The
default editor's visible insert menu did not expose a separately labelled hyperlink-card command,
and the official `嵌入网页` block produced an ordinary iframe rather than a plugin-owned element.
No Hyperlink Card fixture is claimed until a plugin-created node can be reproduced through the
supported editor flow.

Shiki `1.4.2`, Hyperlink Card `1.9.1`, and KaTeX `3.0.0` assets are present on the target site.
A new `hardy-fixture-rich-content` article was published through the official editor and its
front-end output contains a plugin-owned `.katex-block` with a MathML `math` element. A separate
`hardy-fixture-code-content` article now produces a `<pre>` block containing the fixture code;
Shiki class/theme behavior still needs color-mode and absent-plugin checks. The formula
was left empty by the editor fixture flow, and no hyperlink-card element is claimed yet.
Populated, error, absent-plugin, and both color modes therefore remain unverified. Hardy scopes ordinary prose styles to
`.hardy-prose` and does not target plugin-private selectors or bundle plugin assets.

LightGallery, AI Summary, and Steam content do not have a verified installed plugin contract in
this instance. Reference-page markup is not sufficient evidence for adding custom elements; each
needs a plugin-created fixture and an exact plugin identifier/version before integration. A future
LightGallery fixture may use its documented selector against `.hardy-prose`, but no selector or
initialization code is added speculatively.

No credentials, cookies, screenshots, or remote exports are stored in the repository.
