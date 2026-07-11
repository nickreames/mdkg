---
id: chk-378
type: checkpoint
title: 0.4.0 public changelog wording aligned
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md, /private/tmp/mdkg-public-copy-cleanup-20260706/changelog-040-desktop.png, /private/tmp/mdkg-public-copy-cleanup-20260706/changelog-040-mobile.png]
relates: [task-664]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-664]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

The public 0.4.0 changelog and generated release-note data now describe shipped
user outcomes instead of launch-management evidence. The wording focuses on the
website/docs refresh, customization guidance, release cards, generated
references, and CTA polish.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `CHANGELOG.md`
- `docs/src/content/docs/project/changelog.md`
- `docs/_generated/release-notes.json`

## Boundaries

- in scope: public changelog copy and generated release-note data derived from
  `CHANGELOG.md`.
- out of scope: release dates, package versions, npm publish state, deployment,
  tags, DNS, and runtime behavior.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

The 0.4.0 notes were rewritten as release value for readers. Release-note data
was regenerated with `npm run docs:release-notes` rather than hand-edited.

# Implementation Details

- Code or graph surfaces changed:
- Architecture or data-shape notes:
- Compatibility notes:

# Verification / Testing

## Command Evidence

- `npm run docs:release-notes`: passed and regenerated
  `docs/_generated/release-notes.json`.
- `npm --prefix docs run build`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run docs:check`: passed.
- Browser audit: docs changelog desktop/mobile checked with no forbidden phrase
  matches and no console errors.

## Pass / Fail Status

- status: passed

## Known Warnings

- none

# Known Issues / Follow-ups

- none for this task.

## Follow-up Refs

- task/test/goal refs:

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/changelog-040-desktop.png`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/changelog-040-mobile.png`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
