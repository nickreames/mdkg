---
id: task-327
type: task
title: design dry run fix plan and repair receipt contract
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, repair, dry-run, receipts, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-333, test-132, test-133, test-134]
blocks: [task-335, task-329]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Design the `0.3.3` fix-planning surface so repairs are reviewable plans before
any apply behavior is introduced.

# Acceptance Criteria

- `mdkg fix plan --json` has a deterministic receipt-shaped contract.
- Initial repair families cover index/cache, graph references, and duplicate ID
  planning.
- Dry-run writes nothing and exposes planned paths and risk levels.
- Apply behavior is explicitly deferred until the plan format is proven.

# Files Affected

- `.mdkg/design/edd-19-fix-plan-and-repair-receipt-architecture.md`
- `.mdkg/work/epic-70-fix-planning-and-repair-receipts.md`
- `.mdkg/work/task-335-implement-fix-plan-command-skeleton-and-receipt-schema.md`
- `.mdkg/work/task-336-implement-index-and-generated-cache-repair-planning.md`
- `.mdkg/work/task-337-implement-graph-reference-repair-planning.md`
- `.mdkg/work/task-338-implement-duplicate-id-repair-planning.md`
- `.mdkg/work/task-339-add-fix-plan-temp-repo-smoke-docs-and-publish-gate.md`
- `.mdkg/work/test-135-fix-plan-json-receipt-contract.md`
- `.mdkg/work/test-136-fix-plan-no-mutation-temp-repo-contract.md`
- `.mdkg/work/test-137-repair-family-fixture-contract.md`

# Implementation Notes

- `mdkg fix plan --json` is a read-only operator command.
- The first contract supports `index`, `refs`, `ids`, and `all` repair-family
  planning.
- The receipt must expose deterministic plan ids, hashes, risk levels, affected
  paths, reason codes, and whether apply is supported.
- Apply behavior is explicitly out of scope for `0.3.3`; every planned change
  should report `apply_supported: false` until a later apply design exists.
- Dirty worktrees are allowed for planning, but the receipt should record dirty
  state so future apply behavior can safely refuse it.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Links / Artifacts

- `edd-19`
- `epic-70`
- `task-335`
- `test-135`
