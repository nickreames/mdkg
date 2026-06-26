---
id: task-577
type: task
title: preserve WORK mirror validation and trigger compatibility for legacy spec refs
status: todo
priority: 1
epic: epic-196
parent: goal-37
tags: [manifest, work-mirrors, compatibility, refs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-work-trigger-compatibility, legacy-spec-work-ref-compatibility, work-md-manifest-refs]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Preserve semantic mirror behavior where `WORK.md` relationships, work trigger,
orders, receipts, and validation currently resolve through `SPEC.md`
capability refs.

# Acceptance Criteria

- `WORK.md` can reference canonical manifest records where it previously
  referenced specs.
- Existing `WORK.md` to `SPEC.md` references continue to validate during the
  one-compatibility-release window.
- `mdkg work trigger` accepts a direct `WORK.md` ref and a manifest/spec ref
  with exactly one resolvable work contract.
- Error messages prefer `MANIFEST.md` while explaining legacy `SPEC.md`
  compatibility.
- `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`, and
  `PROPOSAL.md` semantics remain unchanged.

# Files Affected

- `src/commands/work.ts`
- `src/graph/agent_file_types.ts`
- `src/graph/validate_graph.ts`
- `tests/commands/archive_work.test.ts`
- `tests/fixtures/agent/**`

# Implementation Notes

- Keep production order state and execution state outside mdkg. This task only
  updates semantic mirror validation and deterministic trigger creation.
- Do not widen validation to accept arbitrary manifest-like files.

# Test Plan

- `test-293`
- `npm run smoke:archive-work`
- Existing work invocation smoke remains compatible.

# Links / Artifacts

- `edd-54`
- `task-276`
- `test-293`
