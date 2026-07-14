---
id: task-779
type: task
title: Add deterministic archive mutation boundary receipts
status: done
priority: 1
epic: epic-248
tags: [archive, json, cli, observability]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-778]
blocks: [task-780, task-781]
refs: [goal-70, edd-76, dec-82]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Make the selected mutation boundary auditable without breaking existing JSON
consumers.

# Acceptance Criteria

- Preserve `action`, `count`, and `archives`.
- Add sorted `selection.requested_workspace`, `selected_workspaces`, and
  `excluded_read_only` entries containing workspace, qid, and stable reason.
- Human output states compressed workspaces/count and excluded imported
  projections without implying they were mutated.
- Failure receipts remain deterministic and actionable.

# Files Affected

List files/directories expected to change.

- Archive CLI output implementation.
- Command-contract snapshots and focused tests.

# Implementation Notes

- Bound output consistently with existing CLI conventions.
- Keep imported archives visible to non-mutating commands.

# Test Plan

Run `test-442`, JSON/text snapshot tests, and CLI contract checks.

# Links / Artifacts

- `dec-82`
