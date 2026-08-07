# Hardy Theme Development

The implementation contract is documented in [`docs/implementation-spec.md`](docs/implementation-spec.md), and the ordered delivery backlog is in [`docs/implementation-plan.md`](docs/implementation-plan.md). Changes should update these documents when they alter a route, setting, plugin contract, dependency, milestone, or quality gate.

## Source Of Truth

- Maintain theme templates and frontend assets in `src/`.
- Treat `templates/` and `dist/` as generated output. Never edit or commit them.
- Keep the project directory, `theme.yaml` metadata name, setting name, and ConfigMap name aligned.
- Use the pnpm version declared by `packageManager`. Do not add or upgrade dependencies without explicit approval.

## Halo Contracts

- Verify template variables, Finder API signatures, and plugin extension points against current Halo documentation before implementation.
- Preserve required Halo page entries and keep theme settings synchronized with every `theme.config` access.
- Support official plugin extension points where relevant, including `halo:comment`, `halo:footer`, search, and color-scheme integration.

## Reference Implementation

- Reproduce the observable layout, spacing, responsive behavior, and interaction model of the approved reference site with original HTML, CSS, and TypeScript.
- Do not copy the reference site's branding, prose, icons, images, analytics identifiers, or raw assets into the theme.
- Keep downloaded public-page snapshots under `research/ryanc.cc/raw/`; they are local research material and must not be committed or shipped.

## Quality Gates

- Run `pnpm check` for a read-only format, lint, and type check.
- Use `pnpm check:fix` only when automatic edits are intended, then review the diff.
- Run `pnpm build` before release and inspect the generated theme ZIP.
- Test all supported page types and enabled plugin integrations in Halo with Thymeleaf caching disabled during development.
- Do not create commits, releases, or external publications unless explicitly requested.
