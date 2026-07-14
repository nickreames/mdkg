---
id: task-763
type: task
title: Design and implement symlink-safe contained path capability
status: done
priority: 0
epic: epic-241
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: [src/core/filesystem_authority.ts, tests/core/filesystem_authority.test.ts]
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80, test-425]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Design and implement the one internal filesystem authority required by `edd-75`.
All later containment fixes depend on a stable API that distinguishes contained
repository paths from explicit external destinations and enforces the boundary at
the final read/write/delete sink.

# Acceptance Criteria

- API requires an allowed root, operation, and relative identity; callers cannot
  pass an already trusted absolute path by accident.
- Reject absolute paths, parent traversal in either separator form, NUL, invalid
  empty components, linked ancestors, and canonical targets outside the root.
- Support existing and non-existing final targets for read, exclusive create,
  atomic replace, and recursive delete without a check/use gap.
- Define cross-platform behavior and stable structured errors.
- Do not weaken explicit operator-selected external output behavior; model it as a
  separate opt-in capability.

# Files Affected

List files/directories expected to change.

- `src/core/paths.ts`, `src/core/workspace_path.ts`
- `src/util/atomic.ts` and a focused safe-path module
- Unit fixtures/tests for links, missing targets, replace, and delete

# Implementation Notes

- Prefer a small capability object or operation-specific helpers over a boolean
  `allowOutside` flag.
- Planning-time checks are advisory; repeat containment/no-follow enforcement at
  the final filesystem operation.
- Preserve atomicity and mutation-lock behavior while adding boundary checks.

# Test Plan

Run focused unit tests with fresh temporary roots, outside sentinel files, linked
ancestors at each depth, linked final components, missing parents, and rename/delete
races. Prove valid contained operations still work on supported platforms, then run
`test-425` before migration tasks rely on the API.

# Links / Artifacts

- `goal-69`, `edd-75`, `dec-80`
- `epic-241`, `test-425`
