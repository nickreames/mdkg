---
id: chk-294
type: checkpoint
title: release notes cards and 0.3.9 details added
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-601]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-601]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The public docs changelog surface was updated with per-release cards and
detailed 0.3.9 content. The legacy docs mirror stayed aligned, and the docs
smoke now checks for release-card/detail content so the public release-notes
surface cannot silently regress.

# Scope Covered

Scope is `task-601`: add public changelog/release-note cards and details
reconciled with `CHANGELOG.md`.

## Changed Surfaces

- `docs/` changelog/release-note content.
- legacy docs mirror content.
- docs smoke expectations for release-card/detail snippets.

## Boundaries

- in scope: source docs and local smoke coverage.
- out of scope: production deploy, DNS, analytics, npm publish, git tag, and
  `0.4.0` release publication.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- `docs.mdkg.dev/project/changelog/` remains the canonical public release-notes
  surface for this pass.
- `CHANGELOG.md` remains the release-fact source that docs checks reconcile
  against.

# Implementation Summary

The changelog page now exposes release cards and 0.3.9 details for config
overlays, arbitrary skill mirror paths, `COLLABORATION.md`, legacy `HUMAN.md`,
and MANIFEST/SPEC compatibility. This records source readiness only; live
currentness is verified later in `task-605`.

# Implementation Details

- Code or graph surfaces changed: docs source and docs smoke assertions.
- Architecture or data-shape notes: release notes are checked against
  changelog-derived facts instead of handwritten-only drift.
- Compatibility notes: 0.3.9 bridge details are described as shipped 0.3.9
  facts without claiming `0.4.0` is published.

# Verification / Testing

## Command Evidence

- command: `npm run smoke:mdkg-dev-docs`
- result: passed.

## Pass / Fail Status

- status: pass for source/build release-note coverage.

## Known Warnings

- warning: live `docs.mdkg.dev` still requires approved push/deploy and browser
  verification under `task-605`.

# Known Issues / Follow-ups

- verify production `docs.mdkg.dev/project/changelog/` after approved deploy.
- keep `CHANGELOG.md` and generated public release-note data aligned.

## Follow-up Refs

- `test-307`
- `task-605`
- `goal-42`

# Links / Artifacts

- `CHANGELOG.md`
- `docs/`
- `mdkg-dev/`

# Raw Content Safety

- Summarized command receipts only; no raw secrets, raw prompts, raw payloads,
  or bulky logs are stored here.
