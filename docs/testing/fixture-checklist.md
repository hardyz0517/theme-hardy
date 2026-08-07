# Hardy Halo Fixture Checklist

Status: dataset specification complete; fixture data must be created in the user-managed Halo instance

Create the following data before recording runtime acceptance. Values are intentionally descriptive rather than copied from the reference site.

## Reproducible Setup

The repository does not contain an importer and must not contain credentials or a database dump.
Create the fixture through Halo Console (or an approved authenticated API client) using the stable
`hardy-fixture-` prefix below. The prefix makes repeated runs and cleanup unambiguous without
touching unrelated site content.

1. Record the target URL and exact Halo version in `docs/contracts/compatibility-matrix.md`.
2. Create or reset only resources whose names/slugs begin with `hardy-fixture-`; keep one ordinary
   site page and one ordinary post to prove that non-fixture content is unaffected.
3. Publish the posts after setting their requested publish dates. Confirm the resulting public
   permalink from Halo rather than constructing it from a guessed route prefix.
4. Configure the primary menu and theme settings, then reload the theme configuration before
   taking screenshots. Keep `SPRING_THYMELEAF_CACHE=false` during development checks.
5. Record each resulting URL, enabled plugin/version, viewport, color mode, and pass/fail result in
   a private test log. Do not commit that log, screenshots, exports, or credentials.

Suggested stable resource names are `hardy-fixture-post-01` through `hardy-fixture-post-12`,
`hardy-fixture-category-empty`, `hardy-fixture-category-nested`,
`hardy-fixture-tag-empty`, `hardy-fixture-tag-populated`, `hardy-fixture-page-comments`,
`hardy-fixture-page-no-comments`, and `hardy-fixture-menu`.

## Site And Navigation

- A site title, subtitle, logo, favicon, SEO description, and a second run with subtitle/logo absent.
- A primary menu with internal, external, new-window, nested, and long-label entries.
- A second run with no primary menu entries.
- Theme settings for an empty and a populated custom footer, plus auto, light, and dark color defaults once the setting exists.

## Posts And Archives

- At least twelve published posts across at least two years and three months to exercise route pagination and archive grouping.
- Covered and uncovered posts, a failed cover URL, empty excerpt, long excerpt, short title, long wrapping title, and a single unbroken long word.
- Posts with no taxonomy, one taxonomy, and several categories/tags.
- First, middle, and final pages for home, category, tag, author, and archive pagination.
- A long post containing H2/H3 headings, duplicate headings, images, wide tables, blockquotes, lists, inline code, code blocks, links, and an embedded or custom element.
- First and final posts in chronological order for previous/next navigation boundaries.

For repeatability, distribute the twelve posts across 2024, 2025, and 2026, with at least three
different months in each year. Use the following content-shape assignments (the exact prose is
not important):

| Fixture                   | Required shape                                                          |
| ------------------------- | ----------------------------------------------------------------------- |
| `post-01-cover`           | Valid cover, short title, short excerpt, one category, one tag.         |
| `post-02-no-cover`        | No cover, empty excerpt, no taxonomy.                                   |
| `post-03-long-title`      | Long title that wraps at 390 px; valid cover.                           |
| `post-04-long-word`       | One unbroken long word in title or excerpt; no overflow.                |
| `post-05-bad-cover`       | Cover URL that returns an image error; verify the layout fallback.      |
| `post-06-many-taxonomies` | Multiple categories and tags, including nested category.                |
| `post-07-comments-on`     | Comments enabled with an empty thread.                                  |
| `post-08-comments-off`    | Comments disabled at the post level.                                    |
| `post-09-excerpt-long`    | Excerpt longer than three card lines.                                   |
| `post-10-pinned`          | Pinned post, if the active Halo version exposes that state in the list. |
| `post-11-first`           | Oldest published post for previous/next boundary.                       |
| `post-12-last`            | Newest published post for previous/next boundary.                       |

The long article fixture should be the body of `hardy-fixture-post-06` or a separate post. Its
rendered HTML must include H2/H3 headings (including duplicate heading text), images with and
without intrinsic dimensions, a wide table, blockquote, ordered and unordered lists, inline code,
one fenced code block, links, and one installed rich-content custom element. Test it with the
Shiki, hyperlink-card, and KaTeX plugins independently when each is enabled.

## Taxonomy, Author, And Single Pages

- Empty and populated category/tag results, including nested categories, a category description, zero-count taxonomy values, and long display names.
- An author with avatar, display name, and bio, plus an author with no avatar or bio.
- One single page with comments enabled and one with comments disabled.

## Plugin Matrix

- Search Widget installed/enabled and absent/disabled.
- Comment widget installed/enabled and absent/disabled, with empty and long comment threads.
- Each selected rich-content plugin in light and dark mode.
- Links, Moments, and Photos only after their individual contracts are documented; each needs absent, disabled, empty, populated, and error-state evidence.

## Evidence Record

For each check, record a URL and one screenshot or browser assertion outside the repository:

| Area        | Minimum evidence                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Routes      | HTTP status and rendered heading for every core route, including a real `/authors/:name` URL.                    |
| Pagination  | First, middle, and final pages; previous/next links must be absent at boundaries.                                |
| Resilience  | Missing cover, empty excerpt, long text, no menu, and comments disabled.                                         |
| Interaction | Menu trigger, mask, Escape, focus restoration, color-mode toggle, share fallback, TOC, and scroll-to-top.        |
| Plugins     | Installed and absent/disabled states for Search and Comment; light and dark states for each rich-content plugin. |
| Viewports   | 390, 768, 1024, 1280, and 1920 px in light and dark modes; no horizontal overflow.                               |

When a fixture cannot be created (for example, no author archive exists), mark that matrix row
`blocked by fixture` rather than treating a 404 or an empty page as a passing result.
