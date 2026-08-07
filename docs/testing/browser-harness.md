# Hardy Browser Harness

Status: manual harness selected; automated browser dependency not yet approved

## Decision

Use a user-managed, version-pinned Halo instance and expose it to browser checks through `HALO_TEST_BASE_URL`. The repository does not currently carry a Compose fixture because this workstation has neither Docker nor Java, and adding a browser test dependency requires explicit approval under `AGENTS.md`.

## Required Environment

```text
HALO_TEST_BASE_URL=http://localhost:8090
SPRING_THYMELEAF_CACHE=false
```

The theme directory must be installed or linked as `themes/theme-hardy`, then activated in Halo Console after a build. The test instance should use the fixture checklist and record its Halo version in the compatibility matrix.

`HALO_TEST_BASE_URL` may point at the user-managed test site (currently
`https://hardyzheng.com`) or a local Halo instance. Never put an administrator credential in an
environment file committed to this repository. Browser runs should use an isolated profile so
local storage, color-mode choices, and plugin sessions do not leak between cases.

## Current Public Smoke Evidence

On 2026-08-07, read-only HTTP probes against `https://hardyzheng.com` produced the following
baseline. This is a route/rendering smoke result, not a substitute for browser interaction tests:

| URL                                    | Expected evidence                           | Observed                                   |
| -------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `/`                                    | Hardy shell and list page                   | HTTP 200 HTML                              |
| `/archives/`                           | Archive list                                | HTTP 200 HTML                              |
| `/categories/`                         | Category tree                               | HTTP 200 HTML                              |
| `/categories/default`                  | Category post list                          | HTTP 200 HTML                              |
| `/tags/`                               | Tag list                                    | HTTP 200 HTML                              |
| `/tags/halo`                           | Tag post list                               | HTTP 200 HTML                              |
| `/archives/hello-halo`                 | Post detail, Comment Widget host            | HTTP 200 HTML                              |
| `/about`                               | Single-page detail, SinglePage comment host | HTTP 200 HTML                              |
| `/authors/test`                        | Author post list                            | HTTP 200 HTML                              |
| `/moments`                             | Moments list                                | HTTP 200 HTML                              |
| `/links`                               | Links list                                  | HTTP 200 HTML with populated fixture       |
| `/photos`                              | Photos list                                 | HTTP 200 HTML with five populated fixtures |
| `/archives/hardy-fixture-code-content` | Code fixture                                | HTTP 200 HTML with `<pre>` output          |
| `/archives/hardy-fixture-rich-content` | KaTeX fixture                               | HTTP 200 HTML with MathML output           |

The same responses identify Halo 2.25.4 and inject Comment Widget 3.1.2, Search Widget 1.7.1,
Shiki 1.4.2, hyperlink-card 1.9.1, and KaTeX 3.0.0. Moments, Links, and Photos are installed on
the test instance; all three routes render their Hardy templates, with Links having one populated
fixture and Photos having five populated fixtures.

## Planned Test Boundary

Static validation remains independent of the external server:

```text
pnpm check
pnpm build-only
pnpm build
```

After explicit approval to add a browser-test dependency, add isolated `test:smoke`, `test:interaction`, and `test:visual` commands. They must fail clearly when `HALO_TEST_BASE_URL` is missing, never become part of `pnpm check`, and cover the route, plugin, viewport, and color-mode matrices in `implementation-plan.md`.

The proposed command contract is:

| Command                 | Scope                                                                                           | Server requirement                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `pnpm test:smoke`       | HTTP status, generated asset presence, core route headings, and plugin capability markers.      | `HALO_TEST_BASE_URL` required.                             |
| `pnpm test:interaction` | Menu, Escape/mask close, focus restoration, color mode, share fallback, TOC, and scroll-to-top. | Live browser URL required.                                 |
| `pnpm test:visual`      | Fixed viewport/color-mode screenshots and overflow assertions.                                  | Live browser URL and screenshot output directory required. |

Until those dependencies are explicitly approved, use the following read-only HTTP probe from a
PowerShell session (it does not mutate the site):

```powershell
$base = $env:HALO_TEST_BASE_URL
if ([string]::IsNullOrWhiteSpace($base)) { throw 'HALO_TEST_BASE_URL is required' }
$routes = @('/', '/archives/', '/categories/', '/categories/default', '/tags/', '/tags/halo', '/archives/hello-halo', '/about')
foreach ($route in $routes) {
  $response = Invoke-WebRequest -Uri ([Uri]::new(([Uri]::new($base)), $route)) -Method Get
  "{0} {1} {2}" -f $response.StatusCode, $route, $response.Headers.'Content-Type'
}
```

The probe is intentionally not a `package.json` script yet: adding a browser framework or test
runner is an approval-gated dependency change.

## Manual Acceptance Until Automation Exists

For each compatibility-matrix row, visit all core routes at 390, 768, 1024, 1280, and 1920 px in
light and dark modes. Verify keyboard menu behavior, reduced motion, scroll-to-top, pagination,
comments, Search Widget, and absent-plugin states. Save screenshots outside the release package.

Each browser case must start from a fresh page and assert the server-rendered fallback before
enabling JavaScript. Then assert the enhancement through the stable `data-hardy-*` hooks listed in
the implementation specification. A failed optional enhancement must not prevent links, article
content, pagination, or the footer from remaining usable.
