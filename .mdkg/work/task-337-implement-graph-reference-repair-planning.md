---
id: task-337
type: task
title: implement graph reference repair planning
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, refs, repair, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-335]
blocks: [task-339, test-137]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Add the `refs` repair-family planner for missing or unsafe graph references.

# Acceptance Criteria

- Missing `blocked_by`, `blocks`, `relates`, `refs`, and parent/epic refs are
  reported with stable reason codes.
- Visibility or workspace boundary issues are reported as blocked or manual
  review findings.
- The planner avoids guessing replacement ids when confidence is low.
- Findings include the source node path and frontmatter field involved.

# Files Affected

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
- Future graph-reference fixtures.

# Implementation Notes

- Reuse validation/index graph traversal where possible.
- Prefer blocked/manual-review output over destructive or speculative edits.

# Test Plan

- Fixture test with a missing blocker reference.
- Fixture test with a parent/epic mismatch.
- Assert proposed changes are deterministic and non-mutating.

# Links / Artifacts

- `edd-19`
- `test-137`
- `chk-106`
