---
id: task-778
type: task
title: Refactor archive compression into complete preflight and mutation phases
status: done
priority: 0
epic: epic-247
tags: [archive, preflight, filesystem, atomic-write]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-777]
blocks: [task-779, task-781]
refs: [goal-70, edd-76, dec-82, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Separate selection/preflight from apply so one invalid selected archive cannot
cause earlier archive mutations.

# Acceptance Criteria

- Validate ownership, identity, source/destination containment, symlinks,
  existence/readability, frontmatter/raw input, and destination authority for
  every item before the first write.
- No filesystem helper receives an imported virtual path.
- Preserve command lock, atomic ZIP/sidecar replacement, final reindex, and
  existing archive behavior for valid local workspaces.
- Do not claim cross-archive rollback for unexpected apply-time I/O failure.

# Files Affected

List files/directories expected to change.

- Archive command and centralized filesystem authority modules.
- Archive containment and regression tests.

# Implementation Notes

- Build a deterministic sorted compression plan from `task-777` output.
- Reuse shared security helpers under `dec-80`; do not add ad hoc path checks.

# Test Plan

Run `test-436`, `test-440`, `test-441`, archive unit tests, and archive/subgraph
smokes.

# Links / Artifacts

- `edd-76`
- `dec-80`
