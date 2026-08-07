# ryanc.cc public-page analysis

Captured on 2026-08-06 for the Hardy theme's implementation research.

The files under `raw/` are unmodified public HTTP responses used only for local comparison. They are ignored by Git and must not be copied into theme templates, bundled assets, releases, or documentation. Hardy should reproduce observable layout and behavior with original HTML, CSS, and TypeScript.

## Snapshot set

| Local file          | Source URL                                   | Page role            |
| ------------------- | -------------------------------------------- | -------------------- |
| `raw/index.html`    | `https://ryanc.cc/`                          | Home and post list   |
| `raw/page-2.html`   | `https://ryanc.cc/page/2`                    | Post-list pagination |
| `raw/archives.html` | `https://ryanc.cc/archives`                  | Archive index        |
| `raw/post.html`     | `https://ryanc.cc/archives/docusaurus-shiki` | Post detail          |
| `raw/category.html` | `https://ryanc.cc/categories/about-halo`     | Category archive     |
| `raw/tag.html`      | `https://ryanc.cc/tags/halo`                 | Tag archive          |
| `raw/about.html`    | `https://ryanc.cc/about`                     | Single-page detail   |
| `raw/moments.html`  | `https://ryanc.cc/moments`                   | Moments plugin page  |
| `raw/photos.html`   | `https://ryanc.cc/photos`                    | Photos plugin page   |
| `raw/links.html`    | `https://ryanc.cc/links`                     | Links plugin page    |

`robots.txt` allows public routes and disallows `/console`. The snapshots deliberately exclude console, login, account, and other non-public areas.

## Global shell

- The page root is a centered layout with a maximum width of 1400 px and 16 px horizontal outer padding.
- At 1024 px and above, the shell is a row: a 25% sidebar and a 75% content area. The content area has 32 px padding.
- Below 1024 px, the sidebar collapses, a fixed 68 px mobile header appears, and content receives 128 px top padding.
- The desktop sidebar is sticky. Its visible profile block uses a 96 px square avatar with an 8 px radius, a 36/40 px extra-bold name, an 18/27 px light subtitle, social actions, and navigation rows separated by 24 px.
- On small screens, the menu opens as a fixed 320 px drawer over a full-viewport mask. The underlying content is shifted diagonally by 32 px while the drawer is open.
- The footer is full width, begins 40 px after content, and uses 32 px vertical padding. A 48 px circular scroll-to-top control sits 40 px from the right and bottom on desktop.
- The global font stack observed in computed styles is `Droid Serif`, `PingFang SC`, `Hiragino Sans GB`, `Droid Sans Fallback`, `Microsoft YaHei`, sans-serif at 18/27 px.

## Responsive post list

- The content section heading is 18/28 px with an icon, an 8 px icon/text gap, and 32 px bottom margin.
- Every post item has 48 px bottom padding and no enclosing card background or border.
- Below 768 px, a post item is stacked. Its feature image spans the available width and is 224 px high.
- At 768 px and above, a post item is horizontal. The feature image is fixed at 224 x 160 px, has an 8 px radius, and has 32 px right margin.
- The desktop text column fills the remaining width. Titles are 20/28 px extra-bold. Excerpts are 18/27 px, light weight, 80% foreground color, and clamped to three lines.
- Category, view, comment, upvote, and date metadata form a quiet single line below the excerpt. Category and tag archive pages reuse this list structure.
- The main shell reaches its 1400 px maximum at a 1440 px viewport and remains centered on wider displays.

## Page-specific structure

### Home, category, and tag

- Home renders a titled list of recent posts followed by a single "read more" pagination action.
- Category and tag pages reuse the post-list component with the taxonomy name as the heading.
- Featured images are meaningful content and disappear only when a post has no configured cover; placeholders must be Hardy-owned.

### Archives

- The archive page groups posts by year.
- Each row contains a linked post title and compact date.
- Pagination is independent from home pagination and follows Halo's archive URL context.

### Post and single page

- Both use the same `post-detail` content shell.
- A detail page begins with a 30/36 px title, metadata/actions, and a typography-scoped content body.
- Post content is followed by tags, a sticky bottom action group, previous/next navigation, comments, and a share modal.
- A desktop-only table of contents tracks active headings. It is hidden below 1024 px.
- The sampled post contains plugin custom elements for AI summary, Shiki code, hyperlink cards, upvote, share, and comments.
- The sampled single page uses the same typography and comment treatment and exposes an edit action to authorized users.

### Moments

- The page provides an RSS action, tag filters with counts, a timeline-like list, pagination, and per-item author, content, tags, upvote, comment, share, and date controls.
- Moment comments use the resource identity `moment.halo.run / Moment / <metadata.name>` in the observed output.
- Rich moment content must tolerate images, links, and code blocks. Light-gallery and Shiki integrations are present on the reference deployment.

### Photos

- The page has a heading, group filters, and a dedicated gallery root.
- The captured deployment currently exposes only the "all" filter and no photo items, so masonry behavior, viewer controls, and populated empty-state dimensions still require a populated Halo test fixture.

### Links

- Links are grouped by category.
- The grid uses two columns below 1024 px and four columns at 1024 px and above.
- Each item contains a 48 px circular logo, a name, and a clamped description. Hover raises the image shadow.
- The page is backed by the Links plugin in the observed output and enables comments for the `plugin.halo.run / Plugin / PluginLinks` resource.

## Color scheme

- The reference exposes light, dark, and system-aware switching through a checkbox-based icon control.
- It writes both `data-color-scheme` and `data-theme` to the root element. The observed dark theme name is `dracula`; the light theme name is `light`.
- Dark base background is approximately `oklch(28.8229% 0.022103 277.509)` with near-white content.
- Light base background is white with content approximately `oklch(27.8078% 0.029596 256.848)`.
- Hardy should expose its own neutral tokens while keeping `data-color-scheme="auto|light|dark"` synchronized so official plugin UIs inherit the correct mode.

## Interaction model

- Mobile navigation uses a drawer, a dismissible mask, and a close arrow. Desktop navigation remains in the sticky sidebar.
- Search delegates to the official Search Widget and opens an accessible keyword dialog. It closes with Escape.
- The scroll-to-top control fades in after scrolling and uses a circular icon-only button.
- Page entry content uses a short fade-in animation. Menu and mask transitions are about 300 ms.
- Image wrappers use lazy/responsive images and reserve dimensions to avoid layout shift.
- Post details use heading-aware table-of-contents highlighting and smooth in-page navigation.

## Halo implementation map

| Hardy area           | Halo integration                                                                      |
| -------------------- | ------------------------------------------------------------------------------------- |
| Global shell         | `site`, primary `menuFinder`, `theme.config`, and `<halo:footer />`                   |
| Home/taxonomy cards  | Route-provided `posts` plus documented post VO fields                                 |
| Archives             | Route-provided `archives` and its independent pagination context                      |
| Post detail          | Route-provided `post`, `postFinder.cursor`, tags/categories, and `haloCommentEnabled` |
| Single page          | Route-provided `singlePage` and the `SinglePage` comment extension point              |
| Search               | Guard `SearchWidget.open()` with `pluginFinder.available('PluginSearchWidget')`       |
| Plugin color mode    | Root `data-color-scheme` synchronized with the Hardy mode setting                     |
| Moments/photos/links | Optional plugin-specific templates guarded by verified plugin availability and APIs   |

Do not guess plugin Finder methods or model fields. Before implementing Moments, Photos, Links, upvote, edit controls, or plugin-specific comments, verify each installed plugin's current public contract and supported Halo version.

## Implementation order

1. Build the global shell, responsive sidebar/header, color tokens, and plugin-safe root attributes.
2. Build the shared post card and apply it to home, category, tag, and author archives.
3. Build archive pagination and the post/single-page typography shell.
4. Integrate official search and comment extension points, then validate their light/dark modes.
5. Add optional Links, Moments, and Photos support against real plugin fixtures.
6. Add TOC, upvote/share, image viewer, authorized edit controls, and motion after the core routes are stable.

## Remaining unknowns

- Exact populated Photos behavior cannot be established from the current public data.
- The reference's private theme settings schema is not observable and must be redesigned for Hardy.
- Upvote, authorized edit, Moments, Photos, and Links server contracts need current plugin documentation or a local Halo instance with those plugins installed.
- Browser-level visual checks are still required at 390, 768, 1024, 1280, and 1920 px during implementation.
