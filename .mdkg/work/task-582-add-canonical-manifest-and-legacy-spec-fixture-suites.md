---
id: task-582
type: task
title: add canonical MANIFEST and legacy SPEC fixture suites
status: todo
priority: 1
epic: epic-198
parent: goal-37
tags: [manifest, fixtures, tests, legacy-spec]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-fixtures, legacy-spec-fixtures, manifest-spec-test-fixtures]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Add canonical manifest fixtures and retain targeted legacy spec fixtures so
tests prove both forward behavior and compatibility behavior.

# Acceptance Criteria

- New valid fixtures use `MANIFEST.md` and `type: manifest`.
- Legacy fixtures using `SPEC.md` and `type: spec` remain covered.
- Negative fixtures cover duplicate manifest/spec ambiguity.
- Fixtures cover manifest-linked `WORK.md`, legacy spec-linked `WORK.md`, and
  work trigger resolution.
- Fixture naming makes canonical versus legacy status obvious.

# Files Affected

- `tests/fixtures/agent/**`
- `tests/commands/agent_file_types.test.ts`
- `tests/commands/archive_work.test.ts`
- `tests/graph/capabilities_indexer.test.ts`
- any smoke fixture generators discovered by `task-573`

# Implementation Notes

- Do not delete all old SPEC fixtures; keep enough to prove compatibility.
- Prefer small fixtures that isolate one behavior each.

# Test Plan

- `test-289`
- `test-290`
- `test-291`
- `test-292`
- `test-293`
- `node --test dist/tests/commands/agent_file_types.test.js`

# Links / Artifacts

- `edd-54`
- `task-276`
