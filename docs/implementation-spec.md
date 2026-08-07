# Hardy Theme Implementation Specification

Status: In execution; core route, shell, detail, and official-plugin implementation is present, with fixture-dependent and compatibility gates still pending.

This document turns the public `ryanc.cc` analysis into an original, maintainable Halo theme implementation. It is an engineering specification, not a copy of Walker's source, CSS, assets, text, or brand identity.

## 1. Goals And Non-Goals

### Goals

- Reproduce the observed layout, responsive behavior, typography rhythm, navigation, article list, detail-page hierarchy, and plugin-friendly interaction model.
- Keep Halo server rendering, Vite build-time composition, and browser-side progressive enhancement as separate responsibilities.
- Make core pages usable when optional plugins are absent.
- Make new page types, settings, and plugin integrations additive rather than requiring edits to every page.
- Keep `theme.yaml` compatibility at `>=2.0.0` until testing proves that constraint false.

### Non-goals

- Copy Walker source code, bundled JavaScript, utility class names as an implementation shortcut, icons, images, analytics IDs, or prose.
- Build an SPA or move Halo content rendering into a client-side data-fetching layer.
- Add a dependency for every visual primitive. Prefer the existing Vite, TypeScript, CSS, and Halo capabilities.
- Add a settings field that is not consumed by a template or client feature.

## 2. Architecture Decisions

### 2.1 Rendering boundary

Thymeleaf owns route data, conditional rendering, links, iteration, and plugin availability checks. Vite owns `<include>` / `<slot>` expansion and asset bundling. TypeScript owns only browser behavior that cannot be expressed as a link, form, CSS state, or server-rendered condition.

No client module may fetch Halo content merely to avoid writing a Thymeleaf loop. Finder calls must remain in templates and must be verified against the target Halo documentation before use.

### 2.2 Composition boundary

Pages compose a single layout partial. The layout owns the document shell and exposes named slots for the page title, page-level head additions, and body content. Shared UI is nested below the layout in small partials. A route page must not duplicate the sidebar, mobile header, footer, menu loop, or plugin trigger.

Use the Vite plugin's build-time includes only for structural composition. Do not mix build-time include semantics with Thymeleaf fragment syntax in the same responsibility.

### 2.3 Client architecture

Use vanilla TypeScript modules with small feature initializers, not a client framework. `src/js/main.ts` is the only browser entry imported by the global layout. It calls feature initializers in a deterministic order and catches failures per feature so a broken optional enhancement cannot disable navigation or content.

Each feature must:

- Find elements through stable `data-hardy-*` hooks, never through Tailwind-like presentation classes.
- Be idempotent and safe when its target element is absent.
- Toggle classes and ARIA state instead of rewriting large DOM subtrees.
- Use event delegation or an `AbortController` for listeners that may be reinitialized.
- Respect `prefers-reduced-motion`.
- Avoid a global mutable singleton such as `window.Hardy`.

The first-party features are `mobile-menu`, `color-scheme`, `scroll-to-top`, `toc`, and `share`. Plugin-owned widgets remain plugin-owned; Hardy supplies triggers, containers, theme tokens, and extension points.

## 3. Target Source Layout

The current starter files may be migrated incrementally. The target structure is:

```text
src/
├── archives.html
├── categories.html
├── category.html
├── index.html
├── page.html
├── post.html
├── tag.html
├── tags.html
├── css/
│   ├── main.css
│   ├── foundation/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   └── base.css
│   ├── layout/
│   │   ├── shell.css
│   │   ├── sidebar.css
│   │   ├── mobile-menu.css
│   │   └── footer.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── post-card.css
│   │   ├── post-meta.css
│   │   ├── pagination.css
│   │   └── empty-state.css
│   ├── content/
│   │   ├── prose.css
│   │   ├── toc.css
│   │   └── taxonomy.css
│   └── integrations/
│       ├── comments.css
│       ├── search.css
│       └── rich-content.css
├── js/
│   ├── main.ts
│   ├── core/
│   │   ├── dom.ts
│   │   └── media-query.ts
│   ├── features/
│   │   ├── color-scheme.ts
│   │   ├── mobile-menu.ts
│   │   ├── scroll-to-top.ts
│   │   ├── share.ts
│   │   └── toc.ts
│   └── integrations/
│       └── search-widget.ts
└── partials/
    ├── layout.html
    ├── shell/
    │   ├── desktop-sidebar.html
    │   ├── mobile-header.html
    │   ├── mobile-menu.html
    │   └── footer.html
    ├── components/
    │   ├── page-heading.html
    │   ├── post-card.html
    │   ├── post-meta.html
    │   ├── pagination.html
    │   └── empty-state.html
    └── content/
        ├── post-detail.html
        ├── taxonomy-list.html
        └── archive-list.html
```

The directory is a responsibility map, not a requirement to create empty abstractions. A file is introduced only when it owns a cohesive piece of behavior or markup used by at least two pages.

## 4. Template Contracts

### 4.1 Core route matrix

| Template          | Route               | Primary context     | Reuse                                               |
| ----------------- | ------------------- | ------------------- | --------------------------------------------------- |
| `index.html`      | `/`                 | `posts`             | `layout`, `post-card`, `pagination`                 |
| `archives.html`   | `/archives[...]`    | `archives`          | `layout`, `archive-list`, `pagination`              |
| `categories.html` | `/categories`       | `categories`        | `layout`, `pagination`                              |
| `category.html`   | `/categories/:slug` | `category`, `posts` | `layout`, `page-heading`, `post-card`, `pagination` |
| `tags.html`       | `/tags`             | `tags`              | `layout`, `pagination`                              |
| `tag.html`        | `/tags/:slug`       | `tag`, `posts`      | `layout`, `page-heading`, `post-card`, `pagination` |
| `post.html`       | `/archives/:slug`   | `post`              | `layout`, `post-detail`                             |
| `page.html`       | `/:slug`            | `singlePage`        | `layout`, `post-detail` variant                     |
| `author.html`     | `/authors/:slug`    | `author`, `posts`   | `layout`, `post-card`, `pagination`                 |

Route prefixes are configurable by Halo. Templates must use the supplied permalink fields and Thymeleaf URL context; never concatenate route prefixes in TypeScript.

### 4.2 Template safety rules

- Use `th:text` for titles, labels, metadata, and user-controlled plain text.
- Use `th:utext` only for Halo's trusted rendered post/page body, inside the scoped prose container.
- Use safe navigation `?.`, Elvis defaults `?:`, and null-safe list checks where a field can be absent.
- Use `@{${url}}` for dynamic permalinks.
- Do not add SEO meta tags that Halo injects automatically; provide page titles only.
- Keep `<halo:footer />` in the document footer and use `haloCommentEnabled` with the documented `Post` and `SinglePage` comment tags.
- Do not invoke a Finder method in a loop when one bound result can be reused by a partial.

### 4.3 Fallback behavior

Every list page must render a useful empty state, not an empty `<ul>`. Missing cover images use an Hardy-owned neutral placeholder or reserved aspect-ratio block. Missing menu data hides the menu without breaking the shell. Missing optional plugin data removes its trigger or shows an explicit unavailable state.

## 5. Settings Contract

`theme.yaml` and `settings.yaml` remain synchronized through `theme-hardy-setting` and `theme-hardy-configMap`.

Settings are grouped by stable user intent:

- `basic`: custom footer text and optional social links (`social_github`, `social_email`, `social_website`). Empty links are omitted from the sidebar.
- `appearance`: color scheme and motion preference.
- `layout`: sidebar visibility and list presentation only when both modes are implemented.
- `post`: table of contents, cover visibility, and detail-page actions only when consumed.
- `integrations`: opt-in visual adaptations for installed plugins, never credentials or API endpoints.

Defaults must preserve a usable theme on a fresh install. New fields are additive; renaming a group or field is a migration event and requires a release note and a compatibility test. Annotation settings are reserved for real per-post, per-page, category, tag, or menu-item data that cannot be represented by global settings; all annotation values must remain strings and names must use a Hardy-specific prefix.

## 6. CSS System

### 6.1 Tokens

All first-party variables use the `--hardy-*` namespace. Define semantic roles rather than page-specific colors:

```css
:root {
  --hardy-color-bg: ...;
  --hardy-color-surface: ...;
  --hardy-color-text: ...;
  --hardy-color-muted: ...;
  --hardy-color-border: ...;
  --hardy-color-accent: ...;
  --hardy-space-1: ...;
  --hardy-radius-sm: ...;
  --hardy-duration-fast: 160ms;
}
```

Light and dark themes override the same semantic variables through the root color-scheme state. Official plugin UI must receive `data-color-scheme="auto|light|dark"`; Hardy must not assume that a plugin uses Hardy's private token names.

### 6.2 Selectors and breakpoints

- Use semantic `.hardy-*` classes and `data-hardy-*` hooks.
- Keep layout selectors separate from content selectors.
- Avoid global styling of custom elements, `img`, `button`, or `a` that can leak into plugin widgets.
- Scope rendered article CSS below `.hardy-prose`.
- Preserve the measured breakpoints: `768px` for post-card orientation and `1024px` for the desktop shell.
- Use stable `aspect-ratio`, `min-height`, grid tracks, and reserved image dimensions to prevent layout shifts.
- Include reduced-motion rules and visible keyboard focus styles.

The reference site's utility classes are evidence of behavior, not a dependency or naming convention for Hardy.

## 7. Halo And Plugin Adapters

Plugin integration is capability-based and isolated. The template checks `pluginFinder.available(...)` before emitting a plugin-dependent trigger or container. JavaScript then enhances only the emitted hook.

| Capability             | First implementation                                                                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search                 | Render a Hardy icon button only when `PluginSearchWidget` is available; call the official `SearchWidget.open()` API.                                                                                                                                                 |
| Comments               | Use `haloCommentEnabled` and `<halo:comment>` for `Post` and `SinglePage`; keep the host container stable for the plugin.                                                                                                                                            |
| Footer injection       | Keep `<halo:footer />` before the closing body boundary through the shared footer partial.                                                                                                                                                                           |
| Color scheme           | Set the root `data-color-scheme` and keep plugin UI in the same mode.                                                                                                                                                                                                |
| Rich content           | Style the prose boundary without replacing Shiki, hyperlink-card, image-viewer, or AI-assistant custom elements.                                                                                                                                                     |
| Links, Moments, Photos | Treat each as an optional plugin-owned route. Verify the plugin name, route, Finder/API, resource kind, and empty state before adding a template. Links and Moments now have isolated capability-gated source templates; their runtime fixture gates remain pending. |

Never infer plugin contracts from Walker's generated HTML. The current public analysis identifies visible resource kinds and custom elements, but implementation must use the installed plugin's current documentation or a local Halo fixture.

## 8. Browser Feature Contracts

### Mobile menu

The menu initializer targets `data-hardy-menu-trigger`, `data-hardy-menu`, and `data-hardy-menu-mask`. It toggles `is-open`, `aria-expanded`, and `aria-hidden`, traps focus while open, closes on Escape and mask click, and restores focus to the trigger. It must be a no-op on desktop.

### Color scheme

The initializer reads the configured default, applies `auto`, `light`, or `dark` to the root, updates the control's checked state, and emits no network request. System preference changes affect only `auto` mode.

Persistence precedence is: a valid local user choice in `localStorage["hardy:color-scheme"]`, then `theme.config.appearance.color_scheme`, then `auto`. Invalid stored or configured values are ignored. Hardy sets `data-color-scheme` to the active mode (`auto`, `light`, or `dark`) for official plugin compatibility.

### Scroll-to-top

Use a passive scroll listener, a visibility threshold, a keyboard-accessible icon button, and `window.scrollTo` with reduced-motion fallback. The listener must not run continuously when the page has no scroll-to-top control.

### Table of contents

Build from rendered heading IDs only after the content exists. Use `IntersectionObserver` when available, fall back to a stable active state, and avoid rewriting heading IDs supplied by Halo. Hide the table of contents below the desktop breakpoint.

### Share

Prefer the Web Share API when available and provide a copy-link fallback. Never require a third-party analytics or share endpoint. Report copy failures non-destructively.

## 9. Testing And Quality Gates

### Static and build gates

Every change must pass:

```bash
pnpm check
pnpm build-only
pnpm build
git diff --check
```

The ZIP must contain generated `templates/`, `theme.yaml`, `settings.yaml`, README, and LICENSE, and must not contain `src/`, `node_modules/`, research snapshots, or credentials.

### Halo smoke matrix

Run the built theme in a target Halo instance with Thymeleaf caching disabled and verify:

- Home, archive, category, tag, categories, tags, author, post, and single-page routes.
- Empty lists, missing cover, long title, long excerpt, no menu, no logo, and no comments.
- Configured footer, menu targets, previous/next boundaries, and pagination boundaries.
- Theme reload after changing `theme.yaml` and settings reload after changing `settings.yaml`.

### Plugin matrix

Test each optional plugin in both installed and absent states. At minimum cover Search Widget, Comment Widget, LightGallery, Shiki, hyperlink cards, AI summary, and any selected Links/Moments/Photos plugin. Check light, dark, and system color schemes for every plugin that renders UI.

### Visual matrix

Capture representative pages at `390`, `768`, `1024`, `1280`, and `1920px` in light and dark modes. Acceptance includes no horizontal overflow, stable reserved media dimensions, readable focus states, correct drawer behavior, and no plugin content occlusion.

## 10. Delivery Phases

### Phase A: Foundation

Implement tokens, shell, sidebar, mobile header/drawer, footer, mode switch, and scroll-to-top. Acceptance: all current core routes render through the same layout and no page-specific shell duplication remains.

### Phase B: Content system

Implement post card, metadata, pagination, archive groups, taxonomy pages, author page, empty states, and image fallbacks. Acceptance: all list contexts share the same component and pass the Halo smoke matrix without optional plugins.

### Phase C: Detail system

Implement post/page detail, prose, tags, table of contents, previous/next, comments, and share fallback. Acceptance: long article fixtures, code blocks, images, links, and comments remain usable in both modes.

### Phase D: Optional integrations

Add Search Widget, then verified Links/Moments/Photos support, followed by rich-content plugin styling. Acceptance: each integration is capability-gated and absent-plugin behavior is clean.

### Phase E: Hardening

Run visual regression, accessibility checks, bundle inspection, ZIP inspection, and compatibility tests against the supported Halo range. Update README, CHANGELOG/release notes, and the relevant contract notes before increasing the theme version.

## 11. Definition Of Done

A feature is done only when its template, styles, client behavior, settings, plugin guards, empty/error states, tests, and documentation agree. A screenshot that looks correct but fails with an absent plugin, a missing field, a narrow viewport, or a fresh theme install is not complete.

## 12. Known Risks

- Declaring `>=2.0.0` while using newer Finder or plugin contracts may be unsound; maintain a compatibility matrix instead of hiding failures behind null checks.
- Public HTML and computed styles describe output, not the reference theme's private data model or settings. They are insufficient evidence for plugin APIs.
- The public Photos page was empty during capture; populated gallery behavior needs a fixture.
- Raw reference snapshots can become stale. They are research inputs, never runtime dependencies.
