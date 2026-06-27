---
id: chk-298
type: checkpoint
title: release notes changelog contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-307]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-307]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The release-notes/changelog contract passed for the source docs surface.
Public changelog content now has release cards and 0.3.9 details, while
automation checks reconcile the public data with `CHANGELOG.md`.

# Scope Covered

Scope is `test-307`: prove public release notes are reconciled with
`CHANGELOG.md`.

## Changed Surfaces

- test evidence for `test-307`
- docs release-note/changelog smoke coverage

## Boundaries

- in scope: local source/build contract.
- out of scope: production deploy, live browser verification, npm publish,
  git tag, DNS, and analytics.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- `CHANGELOG.md` remains the canonical release-fact source for public release
  notes.
- Live currentness remains a separate `task-605` verification item.

# Implementation Summary

The test confirmed that the public changelog source includes release cards and
0.3.9 details. The docs checker verifies changelog-derived release-note data,
and the docs smoke verifies card/detail snippets.

# Test Proof

- Test target: `task-601`, `CHANGELOG.md`, and the docs changelog surface.
- Fixtures or temp repos: none.
- Coverage gaps: production `docs.mdkg.dev` freshness requires approved deploy.

# Verification / Testing

## Command Evidence

- command: `npm run docs:check`
- result: passed during the goal-42 local proof sequence.
- command: `npm run smoke:mdkg-dev-docs`
- result: passed and verified release-card/detail snippets.

## Pass / Fail Status

- status: pass for source/build contract.

## Known Warnings

- warning: live docs verification remains open under `task-605`.

# Known Issues / Follow-ups

- verify production docs changelog after approved push/deploy.

## Follow-up Refs

- `task-601`
- `task-605`
- `goal-42`

# Links / Artifacts

- `test-307`
- `CHANGELOG.md`
- `docs/`

# Raw Content Safety

- Summarized command receipts only; no raw secrets, raw prompts, raw payloads,
  or bulky logs are stored here.
