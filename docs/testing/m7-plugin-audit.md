# M7 Optional Plugin Audit

Audit date: 2026-08-06. Contract details and pinned source links are in
[`../contracts/optional-content-plugins.md`](../contracts/optional-content-plugins.md).

## Reproducible Runtime Checks

Run these read-only probes against the test Halo base URL. An authenticated cookie is needed
only for the Console plugin inventory; never store that cookie or a password in the repository.

```powershell
$base = $env:HALO_TEST_BASE_URL
curl.exe -k -sS "$base/apis/api.console.halo.run/v1alpha1/plugins"
curl.exe -k -sS "$base/apis/api.moment.halo.run/v1alpha1/moments?page=1&size=10"
curl.exe -k -sS -D - "$base/moments" -o $null
curl.exe -k -sS -D - "$base/links" -o $null
curl.exe -k -sS -D - "$base/photos" -o $null
```

The current baseline on `hardyzheng.com` is Halo `2.25.4`, `PluginMoments` `1.16.1`,
`PluginLinks` `2.3.0-beta.4`, and `PluginPhotos` `2.1.2` started. `/moments`, `/links`, and
`/photos` render their Hardy templates; `/links` has one populated fixture and `/photos` has one
populated fixture (`hardy-fixture-photo.png`).
A changed response is evidence that the fixture or plugin inventory changed and must be recorded
before implementation continues.

The current Hardy source keeps each optional route independent: `moments.html` and
`moment.html` guard only `PluginMoments`, while `links.html`, `photos.html`, and `photo.html`
guard their respective plugin. When a plugin is absent, the route contributes no plugin data or
comment host and the shared shell remains available; populated and disabled states still need a
runtime fixture after installation.

The Halo application market was searched on 2026-08-06. It did not expose matching entries, so the
pinned official releases were installed through Halo's remote-download form instead:
`PluginLinks` 2.3.0-beta.4 and `PluginPhotos` 2.1.2. Both started successfully. `/links` and
`/photos` now render Hardy's deliberate empty states. A `hardy-fixture-links` group and one
`hardy-fixture-link` with a long description and intentionally failing external URL were created;
the populated Links card and 390px layout render correctly. The Photos manager uses the built-in
`本地存储` policy and contains five `hardy-fixture-` images; `/photos` renders five detail links
and a detail route renders a `Next` neighbor, responsive `srcset`, broken-media fallback, and the
Photo comment host. Group, EXIF, absent/disabled, and full mobile visual states remain pending.
The browser captured one console error from Halo's unrelated `app-store-integration` token probe
(`404` on `halo.run`) while loading plugin pages; no Hardy asset or route script produced an error.

Photos was temporarily disabled through the Console to verify the absent route behavior (`/photos`
returned Halo's 404 with no plugin template), then re-enabled. The plugin required a short startup
delay before its switch became green and `/photos` returned 200 again; this delay is recorded as
operational evidence, not a theme loading failure.

On 2026-08-07, `hardy-fixture-moment` was published via the official Moments Console editor.
The populated list route and `/moments/moment-dp1iqbqt` detail route both rendered the fixture.
At a 390px viewport, each route reported no horizontal overflow and the detail page contained its
Moment comment host. This is positive-path and narrow-viewport evidence only; media/tag/pagination
fixtures and the disabled/absent plugin state remain pending.

## Fixture Checklist

For each plugin, install the pinned version from the contract note in a disposable test
instance, disable Thymeleaf caching, and create data that exercises normal and boundary states:

- [ ] Moments: at least three public moments; plain HTML, image/video/audio media, no tags,
      multiple tags, long content, and one comment. Verify `/moments`, tag filtering,
      pagination, `/moments/{name}`, RSS redirect, absent template, and comment identity.
- [ ] Links: two groups plus one ungrouped link; missing logo, long description, external URL,
      and one RSS-enabled link. Verify `/links`, `group` filtering, grouped ordering, empty
      data, absent plugin, and the optional application form only when enabled.
- [ ] Photos: at least five photos across two groups; one without cover, one without EXIF,
      one with non-GPS EXIF, long caption, and an empty group. Verify list/detail routes,
      pagination and `size`, group context, previous/next/neighbors, legacy redirect,
      missing photo, absent plugin, and that GPS fields never reach the theme.

## Required Browser States

- [ ] Desktop and 390px mobile screenshots for each populated route.
- [ ] Light, dark, and system color modes with Comment Widget enabled and absent.
- [ ] Empty, plugin disabled/absent, missing media, and route error states leave the Hardy
      shell usable and do not emit uncaught console errors.
- [ ] Each plugin route can fail without changing core home, archive, taxonomy, post, or
      single-page rendering.

No M7 route should be marked complete until its source contract, populated fixture, absent
plugin behavior, and mobile visual evidence are all present. Photos currently has only the first
populated fixture, so its route is not yet complete.
