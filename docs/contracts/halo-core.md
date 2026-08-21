# Hardy Core Halo Contract

Status: documented from official source; selected public runtime observations recorded on 2026-08-06

Source revision: Halo documentation commit [`b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b`](https://github.com/halo-dev/docs/tree/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b), retrieved on 2026-08-06.

This is the field and API allow-list for Hardy's core templates. Template code must not use a field absent from this document without extending the contract and recording its source.

## Global Context

| Context                        | Hardy usage                                                                                                                            | Notes                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `site`                         | `title`, `subtitle`, `logo`                                                                                                            | `logo` and `subtitle` can be empty; the shell must retain a useful fallback.                 |
| `theme`                        | `config.basic.custom_footer`, `config.basic.site_start_time`, `config.basic.new_post_url`, future settings declared in `settings.yaml` | A `theme.config` lookup is valid only when its matching FormKit field exists.                |
| `menuFinder.getPrimary()`      | `menu.menuItems`, `item.status.displayName`, `item.status.href`, `item.spec.target.value`                                              | A primary menu can have no items. Use `status.*`, not raw `spec.displayName` or `spec.href`. |
| `siteStatsFinder.getStats()`   | `visit`                                                                                                                                | Supplies the site-wide visit total shown in the shared footer.                               |
| `pluginFinder.available(name)` | Capability guards for official and optional plugins                                                                                    | Returns true only when a plugin is installed and enabled.                                    |
| `haloCommentEnabled`           | Guard the comment host                                                                                                                 | It combines page comment enablement and installed comment capability.                        |
| `sec:authorize`                | `hasRole('super-role')` on archive-page new-post and edit links                                                                        | Server-side Spring Security dialect; only the Halo super administrator receives these links. |

Sources: [global variables](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/global-variables.md), [menu finder](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/finder-apis/menu.md), [site statistics finder](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/finder-apis/site-stats.md), and [plugin finder](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/finder-apis/plugin.md).

## Route Context

| Template                                   | Route context                                                 | Hardy fields                                                                            |
| ------------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `index.html`                               | `posts: UrlContextListResult<ListedPostVo>`                   | `items`, pagination fields, and listed-post fields below.                               |
| `category.html`, `tag.html`, `author.html` | route object plus `posts: UrlContextListResult<ListedPostVo>` | Route objects use display name, permalink, and optional description/bio/avatar only.    |
| `archives.html`                            | `archives: UrlContextListResult<PostArchiveVo>`               | `archive.year`, `archive.months`, `month.month`, `month.posts`, and archive pagination. |
| `categories.html`                          | `categories: List<CategoryTreeVo>`                            | This is a tree list, not a paged `items` object. Use `children` recursively.            |
| `tags.html`                                | `tags: List<TagVo>`                                           | This is a plain list, not a paged `items` object.                                       |
| `post.html`                                | `post: PostVo`                                                | Full post fields and content.                                                           |
| `page.html`                                | `singlePage: SinglePageVo`                                    | Full single-page fields and content.                                                    |

Sources: [index](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/index_.md), [post](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/post.md), [page](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/page.md), [archives](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/archives.md), [category](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/category.md), [categories](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/categories.md), [tag](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/tag.md), [tags](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/tags.md), and [author](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-variables/author.md).

### `UrlContextListResult<T>` pagination

The route-provided list object has the following fields. `hasPrevious()` and `hasNext()` are
Thymeleaf-accessible boolean methods; the URL values are already resolved for the current route.
Hardy must pass these values through and must not construct a route prefix in a template or in
TypeScript.

| Field                                 | Use                       | Nullable / boundary behavior                                               |
| ------------------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| `items`                               | Current page's `List<T>`. | Empty on an empty result; the list page still renders an empty state.      |
| `page`, `size`, `total`, `totalPages` | Optional page indicator.  | `totalPages` can be one for a non-paged result; do not infer URLs from it. |
| `first`, `last`                       | Page boundary flags.      | Prefer `hasPrevious()` / `hasNext()` for navigation visibility.            |
| `hasPrevious()`, `hasNext()`          | Navigation visibility.    | False at the corresponding boundary.                                       |
| `prevUrl`, `nextUrl`                  | Server-provided links.    | Only read when the matching flag is true.                                  |

Sources: the `UrlContextListResult` definitions in the route documents linked above. The
production templates currently consume `items`, `page`, `totalPages`, `prevUrl`, `nextUrl`,
`hasPrevious()`, and `hasNext()`.

## Core View Objects

### Listed Posts

Hardy may use `metadata.name`, `spec.title`, `spec.cover`, `spec.publishTime`, `status.permalink`, `status.excerpt`, `categories`, `tags`, `owner`, and `stats.visit/comment/upvote`. Cover, excerpt, taxonomies, owner, and statistics are individually optional presentation data. A missing value removes only its own item and separator.

### Full Posts And Single Pages

Hardy may use `metadata.name`, `spec.title`, `spec.cover`, `spec.publishTime`, `status.permalink`, `status.excerpt`, `stats`, and `content.content`. Posts also expose `categories` and `tags`. Only Halo-rendered `content.content` is inserted with `th:utext`; all title, excerpt, taxonomy, and other plain-text values use `th:text`.

### Taxonomies, Authors, And Menus

Categories use `spec.displayName`, `spec.description`, `status.permalink`, `postCount`, and tree `children`. Tags use `spec.displayName`, `status.permalink`, and `postCount`. Authors use `spec.displayName`, `spec.avatar`, `spec.bio`, and `status.permalink`. Every image URL remains optional.

`author.html` is a parameterized route (`/authors/:name`), not an author index. A missing author
avatar or bio must remove only that identity detail. `categories.html` receives a plain category
tree list and `tags.html` receives a plain tag list; neither object has list pagination methods.

Sources: [listed post](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_ListedPostVo.md), [post](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_PostVo.md), [single page](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_SinglePageVo.md), [category](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_CategoryVo.md), [category tree](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_CategoryTreeVo.md), [tag](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_TagVo.md), [user](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_UserVo.md), and [menu item](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/vo/_MenuItemVo.md).

## Finder And Extension Points

- Post neighbours use `postFinder.cursor(post.metadata.name)`, then `hasPrevious()`, `previous`, `hasNext()`, and `next`.
- Search UI is emitted only when `pluginFinder.available('PluginSearchWidget')`; the button delegates to `SearchWidget.open()`.
- Post comments use `halo:comment` with `group="content.halo.run"`, `kind="Post"`, and `name=post.metadata.name` behind `haloCommentEnabled`.
- Single-page comments use the same group with `kind="SinglePage"` and `name=singlePage.metadata.name`.
- The archive page's new-post action uses `sec:authorize="hasRole('super-role')"` and opens the configured `theme.config.basic.new_post_url`, falling back to Halo Console's `/console/posts/editor` route. Article creation, metadata, editor selection, snapshots, formulas, media, autosave, and publishing remain owned by the selected authoring surface.
- Each archive post's edit action uses the same configured authoring base and appends `name=post.metadata.name`; it is rendered only for `super-role` users and leaves post mutation to the linked authoring surface.
- The shared shell always retains `<halo:footer />` before `</body>`.
- The root has `data-color-scheme="auto|light|dark"` so official plugin UI can match Hardy's active mode.

Sources: [post finder](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/finder-apis/post.md), [plugin finder](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/finder-apis/plugin.md), and [template tags](https://github.com/halo-dev/docs/blob/b466520ff9f8cfbbfa2ea6547d2154f5f24bd94b/docs/developer-guide/theme/template-tags.md).

## Deliberately Deferred Contracts

Links, Moments, Photos, upvotes, rich-content plugins, and their comments remain outside this core contract. Their plugin name, template route, Finder methods, model fields, and resource identities must be separately verified against installed plugin documentation and a populated local fixture before Hardy renders them.
