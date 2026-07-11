---
id: task-664
type: task
title: rewrite public changelog 0.4.0 release wording
status: done
priority: 1
parent: goal-56
tags: [docs-mdkg-dev, changelog, release-notes, public-copy, 0.4.0]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-663]
blocks: []
refs: [goal-42, task-662, chk-375, chk-376]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Rewrite the public `0.4.0` changelog card/details and source release notes so
they read as user-facing release notes rather than internal launch-management
evidence.

# Acceptance Criteria

- Public docs changelog no longer describes `0.4.0` with phrases like Vercel
  currentness, Chrome live-validation blockers, npm postpublish install proof,
  source-backed currentness requirements, or explicit approval boundaries.
- `0.4.0` is described as shipped user outcomes: website/docs refresh,
  customization guidance, release cards, generated references, and CTA polish.
- `CHANGELOG.md` remains the source for generated release-note data and is
  updated only as needed to make public release-note wording reader-facing.
- `docs/_generated/release-notes.json` is regenerated from `CHANGELOG.md`, not
  hand-edited.

# Files Affected

List files/directories expected to change.

- `CHANGELOG.md`
- `docs/src/content/docs/project/changelog.md`
- `docs/_generated/release-notes.json`

# Implementation Notes

- Suggested summary direction:
  `Website and docs refresh for the 0.4.0 public alpha, including clearer
  customization guidance, release-note cards, generated CLI references, and
  smoother mdkg.dev CTA rendering.`
- Suggested bullets:
  - `Added public release cards and changelog detail pages for recent
    public-alpha versions.`
  - `Updated docs and examples for config overlays, custom skill mirrors,
    COLLABORATION.md, and MANIFEST.md naming.`
  - `Refreshed mdkg.dev launch copy and CTA rendering while keeping public
    claims bounded to documented capabilities.`
- Keep operational details in root mdkg evidence or terse root changelog
  history only when useful; do not surface launch-management wording in the
  rendered public docs page.
- Do not alter release dates, package versions, or npm publish state.

# Test Plan

How will we verify it works?

- `npm run docs:release-notes`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev-docs`
- `npm run docs:check`
- Search docs source and generated release-note data for the forbidden
  process terms from this task.

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-audit-20260705/report.md`
- `goal-42`
- `task-662`
- `chk-376`
