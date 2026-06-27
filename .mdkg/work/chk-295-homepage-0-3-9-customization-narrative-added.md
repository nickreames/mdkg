---
id: chk-295
type: checkpoint
title: homepage 0.3.9 customization narrative added
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-602]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-602]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The mdkg.dev homepage source now reflects the 0.3.9 customization model and no
longer hardcodes stale `0.3.7` structured metadata. JSON-LD
`softwareVersion` derives from the root package version, and homepage copy adds
0.3.9 config overlay, custom skill mirror, and `COLLABORATION.md` messaging
without claiming `0.4.0` is published.

# Scope Covered

Scope is `task-602`: polish mdkg.dev narrative and structured metadata for
source-backed 0.3.9 launch facts.

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- mdkg.dev smoke/SEO expectations.

## Boundaries

- in scope: local source and smoke coverage.
- out of scope: production deploy, DNS, analytics, npm publish, git tag, and
  public launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Config overlays are presented as the primary enterprise customization path.
- Forkable starters are not positioned as the default enterprise path.
- `COLLABORATION.md` is presented as canonical while `HUMAN.md` remains legacy
  bridge context.

# Implementation Summary

Homepage public claims now match the published 0.3.9 capability set: config
overlays after init, arbitrary skill mirror paths, upgradable kernel behavior,
and collaboration-profile naming. The structured metadata strategy now follows
package metadata rather than a stale literal version string.

# Implementation Details

- Code or graph surfaces changed: mdkg.dev homepage source.
- Architecture or data-shape notes: JSON-LD package version is package-derived.
- Compatibility notes: copy covers 0.3.9 bridge capabilities while preserving
  the no-real-`0.4.0` boundary.

# Verification / Testing

## Command Evidence

- command: `npm run smoke:mdkg-dev`
- result: passed.
- command: `npm run smoke:mdkg-dev-seo`
- result: passed.

## Pass / Fail Status

- status: pass for local source and SEO smoke coverage.

## Known Warnings

- warning: live `mdkg.dev` still reflects the older deployed commit until
  local commits are pushed and Vercel rebuilds.

# Known Issues / Follow-ups

- verify live `mdkg.dev` structured metadata after approved push/deploy.
- close `task-605` only after production reflects this source.

## Follow-up Refs

- `task-605`
- `test-308`
- `goal-42`

# Links / Artifacts

- `mdkg-dev/src/pages/index.astro`
- `CHANGELOG.md`

# Raw Content Safety

- Summarized command receipts only; no raw secrets, raw prompts, raw payloads,
  or bulky logs are stored here.
