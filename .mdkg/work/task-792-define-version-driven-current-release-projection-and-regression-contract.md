---
id: task-792
type: task
title: Define version-driven current-release projection and regression contract
status: done
priority: 1
parent: goal-73
next: task-793
tags: [goal-73, docs, release, design, current-release]
owners: []
links: []
artifacts: []
relates: [dec-84, edd-78, task-738]
blocked_by: []
blocks: [task-793]
refs: [goal-73, dec-84, edd-78, edd-57, edd-71, dec-74, task-738]
context_refs: [edd-57, edd-71, dec-74, task-738]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Ground the current manifest, generated-note, component, footer, and smoke-test
data flow, then freeze the exact projection and rendered behavior before source
implementation begins.

# Acceptance Criteria

- Confirm current public state is published `0.5.2` and identify every
  hardcoded current-release version assertion.
- Specify one pure projection for published, draft preview, and hidden draft.
- Freeze the three evergreen route variants, version-neutral DOM identifiers,
  safe generated-text handling, and fail-closed errors from `edd-78`.
- Confirm the implementation changes only docs/release/test surfaces and adds
  one `Unreleased / Fixed` note without a package bump.

# Files Affected

- Read-only grounding across the existing release projection, generated release
  data, Starlight supplement/footer, changelog generator, and docs smoke tests.

# Implementation Notes

- Use `mdkg pack task-792 --profile concise` as the execution handoff.
- Record any newly discovered inconsistency as a blocker instead of silently
  adding fallback copy.

# Test Plan

Review the accepted projection against `dec-84`, `edd-78`, and the cases in
`test-455`; no source mutation closes this design task.

# Results / Evidence

- Confirmed package, manifest target, and generated latest release all equal
  published `0.5.2`.
- Confirmed `ReleaseV050Supplement.astro` hardcodes the published/preview
  label, DOM ids, install copy, changelog highlights, and reference commands.
- Confirmed `Footer.astro` already owns the correct three-route visibility
  boundary and can retain it with a version-neutral component.
- Confirmed `generate-release-notes-data.js` already produces published and
  Unreleased sections but still checks a v0.5.0 component path for draft facts.
- Confirmed `smoke-mdkg-dev-docs.js` asserts v0.5.0 labels and feature copy in
  canonical and preview output; these become data-driven assertions.
- Accepted the pure projector and fail-closed published/draft/hidden contract in
  `dec-84` and `edd-78`; no additional design decision remains.

# Links / Artifacts

- `dec-84`
- `edd-78`
- `task-738`
