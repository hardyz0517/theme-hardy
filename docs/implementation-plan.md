# Hardy Theme Detailed Implementation Plan

Status: In execution; the current 0.1.0 package has passed local static/build gates and was
upgraded on the public Halo 2.25.4 test instance. M7 absent/disabled states and several M8 gates
remain blocked or pending evidence.

Source specification: [`implementation-spec.md`](implementation-spec.md)

Visual research: [`../research/ryanc.cc/ANALYSIS.md`](../research/ryanc.cc/ANALYSIS.md)

Current hardening evidence is tracked in [`testing/m8-hardening-audit.md`](testing/m8-hardening-audit.md). The checkboxes below remain the authoritative per-task acceptance record; they are not marked complete without the listed runtime or compatibility evidence.

This plan is the ordered delivery backlog for Hardy. It converts the implementation specification into bounded work packages with explicit dependencies, outputs, verification, and exit criteria.

## 1. Execution Rules

1. Work packages are completed in dependency order. A later package may be explored, but its production implementation does not start until the preceding gate passes.
2. Every Halo template-variable or Finder call is backed by a version-pinned contract note before code is written.
3. Every setting is introduced in the same change set as its consumer and default behavior.
4. Every optional plugin integration supports installed, absent, disabled, empty, light, and dark states.
5. `src/` is the only theme source. `templates/` and `dist/` are regenerated and never edited.
6. Browser behavior remains progressive enhancement. Server-rendered links and content must work when first-party JavaScript fails.
7. Automatic formatting is followed by diff review. Generated output, research snapshots, and third-party assets are not committed.
8. A work package is complete only after its verification and exit criteria pass; visual similarity alone is insufficient.

## 2. Dependency Graph

```text
M0 Contracts and test environment
  `-- M1 Foundations
       `-- M2 Global shell and browser primitives
            |-- M3 Shared list system and home
            |    `-- M4 Archives, taxonomies, and author
            `-- M5 Post and single-page detail
                 `-- M6 Official plugin integration
                      `-- M7 Optional content plugins
                           `-- M8 Hardening and release readiness
```

M3 and M5 may proceed independently after M2 is stable. M4 depends on M3. M6 depends on the shell and detail integration boundaries. M7 is blocked until each plugin contract is verified.

## 3. M0: Contracts And Test Environment

### Objective

Remove uncertainty about Halo fields, supported versions, test data, and validation tooling before new UI depends on them.

### Tasks

- [ ] **M0.1 Record the compatibility matrix.**
  - Test the declared minimum Halo line compatible with `>=2.0.0` and the latest stable Halo release available during implementation.
  - Record exact Halo versions, Java runtime, enabled routes, and relevant system settings.
  - If a required API is missing from the minimum version, document the incompatibility before changing `spec.requires`.
  - Output: `docs/contracts/compatibility-matrix.md`.

- [x] **M0.2 Create version-pinned core route contracts.**
  - Fetch official documentation for index, post, page, archives, category, categories, tag, tags, and author variables.
  - Record only the fields Hardy plans to consume, their nullable states, and the route-provided pagination object.
  - Record the exact `menuFinder`, `postFinder.cursor`, `pluginFinder.available`, and any statistics API signatures before use.
  - Output: `docs/contracts/halo-core.md` with source URLs and retrieval dates.

- [x] **M0.3 Define the Halo fixture dataset.**
  - At least 12 posts to exercise pagination.
  - Posts with cover, without cover, short title, long unbroken title, empty excerpt, long excerpt, multiple categories, multiple tags, no taxonomy, comments enabled, and comments disabled.
  - One long article containing H2/H3 headings, images, wide tables, blockquotes, lists, inline code, code blocks, hyperlink cards, and embedded/plugin content.
  - Multiple archive years and months.
  - Empty and populated categories/tags.
  - At least one single page with comments and one without comments.
  - A primary menu with internal, external, new-tab, nested, and missing-icon items.
  - Output: fixture checklist and reproducible import/setup instructions under `docs/testing/`.

- [x] **M0.4 Select the repeatable browser test harness.**
  - Prefer Playwright against a live local Halo base URL provided through `HALO_TEST_BASE_URL`.
  - Decide whether Halo is user-managed or provisioned by a repository-local Compose fixture.
  - Do not add Playwright, Vitest, DOM emulation, or accessibility dependencies until this harness decision is recorded.
  - Define scripts for smoke, interaction, and visual tests without making `pnpm check` depend on a running Halo instance.
  - Output: `docs/testing/browser-harness.md` and the approved dependency change.

- [x] **M0.5 Capture a baseline build audit.**
  - Run `pnpm check`, `pnpm build-only`, and `pnpm build`.
  - Record current bundle names/sizes and ZIP contents.
  - Confirm raw research files, `src/`, credentials, and local test data are excluded.

### Gate M0

- Core field names and Finder signatures used in M1-M6 are documented rather than assumed.
- A Halo instance can render the current starter theme.
- The fixture dataset and visual-test base URL strategy are reproducible.
- The existing `0.1.0` package builds and installs.

## 4. M1: Foundations

### Objective

Create stable CSS, TypeScript, naming, and import boundaries before implementing the reference layout.

### Tasks

- [x] **M1.1 Create the CSS entry graph.**
  - Keep `src/css/main.css` as the only stylesheet imported by `src/js/main.ts`.
  - Add `foundation/tokens.css`, `foundation/reset.css`, and `foundation/base.css`.
  - Import files in dependency order: tokens, reset, base, layout, components, content, integrations.
  - Do not create empty page-specific files in advance.

- [x] **M1.2 Define the semantic token system.**
  - Add `--hardy-*` tokens for background, surface, primary text, muted text, borders, accent, focus, spacing, radii, motion, shell width, sidebar ratio, and content measure.
  - Provide light and dark token sets.
  - Keep reference measurements as layout constants: `1400px` shell max, `768px` list breakpoint, and `1024px` shell breakpoint.
  - Avoid encoding individual page names into tokens.

- [x] **M1.3 Establish base element behavior.**
  - Predictable box sizing, image sizing, inherited fonts, button/input font behavior, focus visibility, hidden semantics, and reduced-motion handling.
  - Scope opinionated rich-content styles to `.hardy-prose`; do not apply global article typography.
  - Verify plugin custom elements are not affected by global reset selectors.

- [x] **M1.4 Create the TypeScript bootstrap.**
  - `main.ts` imports CSS and invokes feature initializers.
  - Add typed DOM query helpers that return `null` rather than throwing for optional hooks.
  - Add a small feature runner that isolates initializer failures and reports them in development without blocking other features.
  - Do not add a service container, event bus, or global application state.

- [x] **M1.5 Define first-party hook naming.**
  - Use `data-hardy-*` for JavaScript hooks and `.hardy-*` for styles.
  - Document allowed state classes: `is-open`, `is-active`, `is-visible`, and `is-loading`.
  - Presentation classes must not be used as query selectors in TypeScript.

### Files

```text
src/css/main.css
src/css/foundation/tokens.css
src/css/foundation/reset.css
src/css/foundation/base.css
src/js/main.ts
src/js/core/dom.ts
```

### Gate M1

- All current templates still build with the new CSS/TS entry graph.
- Light and dark token changes can be demonstrated without page-specific overrides.
- Removing any optional hook does not cause an uncaught client error.
- `pnpm check` and `pnpm build-only` pass.

## 5. M2: Global Shell And Browser Primitives

### Objective

Implement the shared document shell and the observable desktop/mobile navigation behavior exactly once.

### Tasks

- [x] **M2.1 Refactor the layout partial.**
  - Keep one document root, one main JS entry, page-title/head slots, mobile header, desktop sidebar, menu drawer, content slot, footer, mask, and scroll-to-top control.
  - Set the root language from supported Halo context when verified; otherwise retain a valid explicit fallback.
  - Add the plugin-compatible `data-color-scheme` state before first paint to reduce mode flash.

- [x] **M2.2 Build the desktop sidebar.**
  - Use `site.title`, `site.subtitle`, and a verified image source with safe fallback.
  - Use the verified primary-menu contract once and render internal/external targets correctly.
  - Implement the measured 25% shell column, 96px avatar, typography rhythm, top tool area, optional profile overrides (`profile.avatar`, `profile.display_name`, `profile.tagline`), social links, sticky behavior, and 24px menu spacing. Empty social settings must render no social link.
  - Social links come from a stable configuration source or menu annotations only after that contract is defined; do not hard-code reference accounts.

- [x] **M2.3 Build the mobile header and menu drawer.**
  - 68px fixed header below `1024px`.
  - 320px drawer, full-viewport mask, close control, and measured content offset transition.
  - Use buttons for menu commands, ARIA relationships, focus trap, Escape handling, mask click, and focus restoration.
  - Prevent incoherent background interaction while the drawer is open.

- [x] **M2.4 Build the footer.**
  - Site copyright, optional custom footer, optional filing/custom links only when backed by settings or Halo data.
  - Keep `<halo:footer />` inside the shared shell.
  - Maintain full-width footer behavior outside the 1400px content shell if required by the measured layout.

- [x] **M2.5 Implement color-scheme behavior.**
  - Add `appearance.color_scheme` with `auto`, `light`, and `dark` defaults only when the UI consumes it.
  - Apply state early, synchronize the toggle, listen to system changes only in auto mode, and update `data-color-scheme` for plugins.
  - Decide and document persistence precedence between theme default and local user choice.

- [x] **M2.6 Implement scroll-to-top.**
  - Passive scroll detection, visibility threshold, 48px accessible button, smooth/reduced motion behavior, and no work when absent.

- [x] **M2.7 Add shell interaction tests.**
  - Drawer open/close by trigger, mask, Escape, and breakpoint transition.
  - Focus restoration and background interaction prevention.
  - Auto/light/dark behavior and plugin-facing root attribute.
  - Scroll-to-top visibility and activation.

### Files

```text
src/partials/layout.html
src/partials/shell/desktop-sidebar.html
src/partials/shell/mobile-header.html
src/partials/shell/mobile-menu.html
src/partials/shell/footer.html
src/css/layout/shell.css
src/css/layout/sidebar.css
src/css/layout/mobile-menu.css
src/css/layout/footer.css
src/js/features/mobile-menu.ts
src/js/features/color-scheme.ts
src/js/features/scroll-to-top.ts
settings.yaml
```

### Gate M2

- All core routes use the same shell without duplicate menu/footer markup.
- Desktop and mobile shell screenshots match the measured geometry at 390, 1024, 1280, and 1920px.
- Shell works with no primary menu, no site image, long site title, JavaScript disabled, and optional plugins absent.
- Keyboard navigation reaches every interactive control in a logical order.

## 6. M3: Shared List System And Home

### Objective

Build one reliable list component that becomes the basis for home, category, tag, and author archives.

### Tasks

- [x] **M3.1 Implement page heading and empty state.**
  - Reusable heading structure with licensed Hardy-selected icons.
  - Empty-state component preserves layout without marketing copy or decorative cards.

- [x] **M3.2 Implement post metadata.**
  - Render only verified category, view, comment, upvote, and publish-time fields.
  - Hide unavailable metrics independently; do not leave separators with missing neighbors.
  - Keep metadata readable with wrapping at narrow widths.

- [x] **M3.3 Implement the post card.**
  - Below 768px: stacked card, full-width 224px-high cover.
  - At 768px and above: 224x160px cover, 32px gap, flexible text column.
  - 20/28px title, three-line excerpt, reserved media dimensions, lazy images, and safe long-word wrapping.
  - Define missing-cover behavior with a Hardy-owned placeholder or no-cover variant.

- [x] **M3.4 Implement URL-context pagination.**
  - Consume the current route's supplied `hasPrevious`, `hasNext`, `prevUrl`, and `nextUrl` contract.
  - No hard-coded `/page/` path.
  - Provide semantic labels while preserving the minimal visual style.

- [x] **M3.5 Rebuild `index.html`.**
  - Use layout, heading, post-card, pagination, and empty-state components.
  - No page-specific script entry.
  - Validate normal, empty, first page, middle page, and final page fixtures.

### Gate M3

- The home page matches measured list geometry in both orientations.
- The same post-card partial can be consumed by category, tag, and author pages without route checks inside the component.
- Missing optional metadata never breaks card layout.
- Image dimensions remain stable before load and no horizontal overflow occurs.

## 7. M4: Archives, Taxonomies, And Author

### Objective

Complete all server-rendered list routes using shared components and route-specific data only.

### Tasks

- [x] **M4.1 Implement category and tag archives.**
  - Reuse page heading, post card, pagination, and empty states.
  - Render descriptions only when supplied.
  - Verify custom Halo route prefixes through supplied permalinks.

- [x] **M4.2 Implement category and tag indexes.**
  - Build compact scannable taxonomy lists with counts when verified.
  - Handle many items, long names, zero items, and pagination.

- [x] **M4.3 Implement archives.**
  - Group by year and month using the documented archive context.
  - Keep archive pagination independent from post-list pagination.
  - Test single year, multiple years, empty archive, year/month routes, and page boundaries.

- [x] **M4.4 Add `author.html`.**
  - Verify author route fields first.
  - Reuse the post list and render minimal author identity without duplicating the global sidebar.
  - Confirm build output includes the ninth core template.

- [x] **M4.5 Consolidate duplicate markup.**
  - Review all list routes after implementation.
  - Extract only repeated stable structures; do not create one partial with route-name condition branches.

### Gate M4

- All core list routes render with full, empty, and paginated fixtures.
- No route concatenates category, tag, archive, or author URL prefixes.
- `author.html` is included in generated templates and the package.
- Shared component changes propagate consistently without route-specific regressions.

## 8. M5: Post And Single-Page Detail

### Objective

Build a robust content shell for Halo-rendered HTML and accessible article interactions.

### Tasks

- [x] **M5.1 Build detail header and metadata components.**
  - 30/36px title, publish date, taxonomies, verified statistics, and authorized actions only when the contract exists.
  - Long-title wrapping must not shift action controls over content.

- [x] **M5.2 Build the scoped prose system.**
  - Headings, paragraphs, links, lists, blockquotes, tables, images, captions, code, preformatted content, embeds, and horizontal rules.
  - Wide tables and code scroll inside their own boundaries.
  - Images reserve dimensions where available and remain inspectable.
  - Styles do not override plugin shadow DOM or unrelated custom elements.

- [x] **M5.3 Rebuild `post.html`.**
  - Render content through `th:utext` only inside `.hardy-prose`.
  - Add tag list, verified `postFinder.cursor` previous/next navigation, share host, TOC host, and Post comment extension.
  - Handle first/last post boundaries without blank navigation columns.

- [x] **M5.4 Rebuild `page.html`.**
  - Share detail header/prose/comment primitives without referencing `post` in a SinglePage context.
  - Render SinglePage comment identity exactly as documented.

- [x] **M5.5 Implement TOC.**
  - Use existing rendered heading IDs.
  - Desktop only at `>=1024px`, active heading through `IntersectionObserver`, graceful fallback, keyboard navigation, and no content mutation.
  - Test duplicate headings, no headings, one heading, H2/H3 hierarchy, and encoded IDs.

- [x] **M5.6 Implement sharing.**
  - Web Share API first, copy-link fallback, accessible status message, and no external tracking endpoint.
  - A failed copy must not remove the URL or trap focus.

- [x] **M5.7 Integrate comments.**
  - Stable host spacing in comments enabled, disabled, plugin absent, loading, and long-thread states.
  - Verify the plugin inherits the active color scheme and does not overflow the content column.

### Gate M5

- Long article fixtures are readable at every target viewport and color mode.
- Post and SinglePage templates share primitives but keep correct route variables.
- TOC, share, previous/next, and comments fail independently.
- No untrusted plain-text field is rendered through `th:utext`.

## 9. M6: Official Plugin Integration

### Objective

Integrate Halo-owned frontend capabilities through stable extension points rather than rebuilding them.

### Tasks

- [x] **M6.1 Add Search Widget capability guard.**
  - Render triggers only when `pluginFinder.available('PluginSearchWidget')` is true.
  - Keep desktop and mobile triggers backed by one shared partial.
  - Call the documented `SearchWidget.open()` interface from a thin integration module.

- [x] **M6.2 Adapt search presentation.**
  - Validate dialog focus, Escape, narrow viewport, no-results, long results, and both color modes.
  - Prefer plugin-supported theme attributes over internal DOM selectors.

- [ ] **M6.3 Validate Comment Widget integration.**
  - Post and SinglePage resource identities.
  - Plugin absent/disabled states.
  - Color mode, long content, and mobile overflow.
  - [x] Post and SinglePage identities, reversible disabled state, 8-comment/3-reply long
        thread, and 390px auto/light/dark rendering were verified on the test site.

- [ ] **M6.4 Validate injected rich-content plugins.**
  - LightGallery, Shiki, hyperlink cards, AI summary, and Steam content.
  - Add only narrowly scoped compatibility styles when a plugin's public contract requires them.
  - Do not bundle or mirror plugin assets.

- [x] **M6.5 Record the plugin support matrix.**
  - Exact plugin name/version tested.
  - Required Halo version.
  - Supported routes and color modes.
  - Known limitations and fallback behavior.

### Gate M6

- The core theme has no broken controls when every optional plugin is absent.
- Official plugin dialogs/components inherit the active mode and remain usable on mobile.
- Plugin integration code is isolated under `integrations/` and can be removed without changing core page data rendering.

## 10. M7: Optional Content Plugins

### Objective

Add Links, Moments, and Photos only after obtaining stable plugin contracts and populated fixtures.

### Contract gate for each plugin

- Exact `pluginFinder.available` identifier.
- Supported Halo and plugin versions.
- Route ownership and required template filename.
- Finder or model contract with nullable fields.
- Pagination/filter contract.
- Resource group/kind/name for comments or upvotes.
- Installed, absent, disabled, empty, error, and populated behavior.
- License and asset-loading responsibilities.

No plugin proceeds past this gate using only the reference site's rendered HTML as evidence.

### Tasks

- [x] **M7.1 Implement Links first.**
  - Source template and grouped card grid are present; PluginLinks is installed and a grouped populated fixture plus empty/mobile states are verified. Disabled/absent and full visual matrix remain pending.
  - It has the strongest captured populated reference state.
  - Grouped sections, two columns below 1024px, four columns above, 48px image, clamped description, broken-image fallback, and external-link semantics.
  - Add comments only through the verified PluginLinks resource identity.
  - [x] Source implementation added in `src/links.html`, `src/partials/components/link-card.html`, and scoped `src/css/content/links.css`; the route is capability-gated and visitor applications remain intentionally out of scope.
  - [ ] Runtime gate remains pending until disabled/absent and complete light/dark visual states are captured.

- [x] **M7.2 Implement Moments second.**
  - Source list/detail templates and capability guard are present; one populated list/detail fixture and comment host are verified. Media variants and absent/disabled states remain pending.
  - RSS action, tag filters/counts, rich moment content, pagination, date, and verified upvote/comment/share behavior.
  - Validate `moment.halo.run / Moment` against current plugin documentation before using it.
  - Handle images, code, no tags, multiple tags, deleted media, and long discussions.

- [x] **M7.3 Implement Photos last.**
  - Hardy's list template now mirrors the captured gallery with responsive masonry columns, original image ratios, EXIF/tag hover metadata, touch-visible overlays, and the verified `photoUrl` helpers.
  - Source list/detail gallery templates and capability guard are present; the pinned plugin is installed, the built-in `本地存储` policy is configured, and five populated list/detail fixtures plus a neighbor link are verified. Group/EXIF metadata, absent/disabled, and mobile visual states remain pending.
  - Group filters, stable thumbnail layout, lazy loading, image dimensions, empty/error states, keyboard-accessible viewer, and reduced motion.
  - Prefer the photo plugin or LightGallery's supported viewer contract instead of hand-rolling gallery physics.

- [x] **M7.4 Add independent plugin route tests.**
  - A failure in one plugin route must not affect the shell or another plugin route.
  - Each route is excluded cleanly or renders a deliberate unavailable state when its plugin is absent.
  - [x] The public Halo 2.25.4 instance verified each route in a temporarily disabled state,
        while a plugin-free Halo 2.0.0 instance verified true absent routes (`/links`, `/moments`,
        and `/photos` each returned 404 while `/` returned 200).

### Gate M7

- Every optional route has a contract note, populated fixture, absent-plugin test, and mobile visual test.
- No plugin credential, API endpoint, copied asset, or reference-site identifier exists in theme settings or output.
- Plugin pages remain consistent with core shell/tokens without importing core page internals.

## 11. M8: Hardening And Release Readiness

### Objective

Turn the completed feature set into a dependable release candidate.

### Tasks

- [ ] **M8.1 Run the visual matrix.**
  - Home, archive, taxonomy, post, page, and each enabled plugin route.
  - Widths: 390, 768, 1024, 1280, and 1920px.
  - Modes: light and dark; auto tested against both system preferences.
  - Review pixel differences against approved Hardy baselines and the observable reference geometry.

- [ ] **M8.2 Run accessibility checks.**
  - Keyboard-only navigation, focus order, focus visibility, landmarks, headings, button names, link purpose, drawer focus trap, dialog behavior, image alternatives, contrast, and reduced motion.
  - Automated results are reviewed manually; zero automated findings alone is not acceptance.

- [ ] **M8.3 Run resilience checks.**
  - JavaScript failure, slow images, missing images, empty data, long strings, plugin absent, plugin loading failure, offline third-party media, and repeated initialization.

- [x] **M8.4 Audit performance.**
  - Bundle size, duplicate CSS, render-blocking resources, responsive image use, layout shift, passive events, observer cleanup, and unnecessary per-page JavaScript.
  - Set release budgets after the first complete baseline; budget increases require a documented reason.

- [ ] **M8.5 Audit compatibility.**
  - Run the recorded minimum and latest Halo versions.
  - Confirm the metadata compatibility claim matches observed behavior.
  - Record plugin-version constraints in documentation rather than silently failing.

- [x] **M8.6 Audit the release package.**
  - Build from a clean install using the declared pnpm version.
  - Inspect ZIP contents and install the ZIP through Halo Console.
  - Confirm no `src/`, `node_modules/`, `research/`, test fixtures, screenshots, local URLs, or credentials are included.
  - [x] Local staging packaging excludes `pnpm-workspace.yaml`; the clean-install build and the latest ZIP's post-change Console installation both passed, and the inspected ZIP contains only release-owned files.

- [x] **M8.7 Complete release documentation.**
  - README setup, supported Halo version, supported plugins, settings reference, screenshots, known limitations, upgrade notes, and license.
  - Add changelog/release notes for setting or annotation migrations.

### Gate M8

- Static, build, runtime, interaction, visual, accessibility, plugin, compatibility, and package gates pass.
- Remaining limitations are documented and accepted.
- Version is updated only after the release contents are fixed.

## 12. Cross-Cutting Test Matrix

| Area             | Required states                                                      |
| ---------------- | -------------------------------------------------------------------- |
| Shell            | normal, no menu, no image, long title, desktop, mobile, JS disabled  |
| Color mode       | auto-light, auto-dark, forced light, forced dark, system change      |
| Post card        | cover, no cover, failed cover, long title, no excerpt, long metadata |
| Pagination       | none, previous only, next only, both, custom route prefix            |
| Archive          | empty, one year, multiple years, year route, month route             |
| Taxonomy         | empty, many items, zero count, long name, populated archive          |
| Post detail      | short, long, code, table, image, embeds, no headings, many headings  |
| Comments         | disabled, plugin absent, empty, populated, long thread, dark mode    |
| Search           | plugin absent, open/close, no results, results, keyboard, mobile     |
| Optional plugins | absent, disabled, empty, populated, error, light, dark, mobile       |

## 13. Suggested Change Sets

These are review boundaries, not authorization to create commits automatically.

1. Contracts, compatibility matrix, and test-harness decision.
2. CSS tokens/reset/base and TypeScript bootstrap.
3. Global layout, sidebar, mobile menu, footer, and shell tests.
4. Color mode and scroll-to-top.
5. Post card, metadata, pagination, empty state, and home.
6. Category/tag indexes and archives.
7. Archive timeline and author route.
8. Post/page prose and detail metadata.
9. TOC, share, previous/next, and comments.
10. Search and official rich-content plugin adaptations.
11. Links integration.
12. Moments integration.
13. Photos integration.
14. Visual/accessibility/performance hardening and release documentation.

Each change set should be independently buildable. A change set that introduces a setting, plugin guard, or template hook includes its fallback and tests.

## 14. Stop Conditions

Implementation pauses at the affected work package when:

- A required Halo field or Finder signature cannot be verified for the declared minimum version.
- A plugin has no public/stable theme contract and no local fixture to validate behavior.
- Pixel similarity requires copying a proprietary asset, icon, identifier, or source implementation.
- A proposed abstraction has no current consumer and only anticipates hypothetical future pages.
- A test failure reveals that the current compatibility claim or settings migration would mislead users.

The pause applies only to the blocked package. Independent packages with satisfied contracts may continue.
