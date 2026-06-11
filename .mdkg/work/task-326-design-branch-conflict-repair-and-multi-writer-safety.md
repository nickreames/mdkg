---
id: task-326
type: task
title: design branch conflict repair and multi writer safety
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [branches, multi-writer, ids, 0-3-6, 0-3-7]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-341, task-328]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Design the `0.3.6` to `0.3.7` branch and multi-writer safety lane before mdkg
claims production-grade multi-developer repo support.

# Acceptance Criteria

- Duplicate numeric ID detection and deterministic ID rewrite planning are
  specified.
- Reference updates include frontmatter refs, qids, linked orders/receipts, and
  known Markdown references.
- Repo-local writer lock and atomic-write expectations are defined.
- Two-branch/two-agent smoke scenarios are specified.

# Files Affected

- `.mdkg/design/edd-21-branch-conflict-repair-and-multi-writer-safety-architecture.md`
- `.mdkg/work/task-341-implement-branch-duplicate-id-detection-and-deterministic-rewrite-planning.md`
- `.mdkg/work/task-342-implement-reference-rewrite-receipts-and-stale-goal-repair-planning.md`
- `.mdkg/work/task-343-harden-writer-lock-coverage-and-atomic-write-audit.md`
- `.mdkg/work/task-344-add-two-branch-conflict-smoke-and-prepublish-gate.md`
- `.mdkg/work/test-138-branch-duplicate-id-detection-and-rewrite-plan-contract.md`
- `.mdkg/work/test-139-writer-lock-and-atomic-mutation-audit-contract.md`
- `.mdkg/work/test-140-two-branch-merge-conflict-smoke-contract.md`

# Implementation Notes

- Design separates detection, planning, write-safety audit, and merge-smoke
  proof into separate nodes.
- Duplicate-id planning builds on the existing `fix plan --family ids` surface
  and keeps apply behavior deferred.
- Reference rewrite planning must include frontmatter edges, qids, linked
  workflow mirrors, and known Markdown references.
- Writer-lock hardening audits existing repo-local locks and atomic writes
  before adding new mutation paths.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Links / Artifacts

- `edd-21`
- `epic-71`
- `task-341`
- `task-342`
- `task-343`
- `task-344`
- `test-138`
- `test-139`
- `test-140`
