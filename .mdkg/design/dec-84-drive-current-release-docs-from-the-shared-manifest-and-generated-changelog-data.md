---
id: dec-84
type: dec
title: Drive current-release docs from the shared manifest and generated changelog data
status: accepted
tags: [docs, release, automation, current-release]
owners: []
links: []
artifacts: []
relates: [goal-73, edd-57, edd-71]
refs: [goal-73, edd-57, edd-71, dec-74]
aliases: []
created: 2026-07-16
updated: 2026-07-16
---
# Context

The shared public-release projection now targets published mdkg `0.5.2`, but
the visible Starlight supplement and its tests remain named and written for
v0.5.0. Generic release visibility therefore activates stale release-specific
presentation after later releases even though the canonical changelog and
generated release data are current.

# Decision

**Accepted.**

Use `release/public-release.json` as the only source for target version, state,
and qualifier. Use `docs/_generated/release-notes.json`, generated from
`CHANGELOG.md`, as the only source for dates, item counts, sections, and
highlights. A version-neutral current-release projection combines them at build
time and supplies all release supplement variants.

Keep compact supplements on Install, Changelog, and Generated CLI Reference.
Install and Reference use evergreen commands and links; Changelog renders up
to three generated highlights. Historical v0.5.0 loop content remains in the
normal changelog and loop pages, not in the current-release component.

# Alternatives considered

- Keep `ReleaseV050Supplement` as a permanent promotion. Rejected because
  generic release visibility makes it appear current indefinitely.
- Remove supplements from all three routes. Rejected because the operator chose
  to retain a compact release-aware aid.
- Hand-author a replacement for every release. Rejected because it repeats the
  drift that `edd-57` intended to prevent.

# Consequences

Future release work updates changelog, generated notes, manifest, and package
metadata without editing component or smoke-test version literals. Visible
inconsistency becomes a build failure. Generated changelog text must be escaped
or structurally rendered and may not enter the page through unrestricted raw
HTML.

# Links / references

- `goal-73`
- `edd-78`
- `edd-57`
- `edd-71`
- `dec-74`
- `task-738`
