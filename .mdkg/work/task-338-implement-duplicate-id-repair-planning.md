---
id: task-338
type: task
title: implement duplicate id repair planning
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, ids, repair, 0-3-3]
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

Add the `ids` repair-family planner for duplicate local ids and deterministic
rewrite planning.

# Acceptance Criteria

- Duplicate ids in one workspace are detected and grouped.
- The planner proposes deterministic candidate ids for later repair.
- The receipt enumerates frontmatter and body/reference paths that a future
  apply command would need to update.
- No ids, filenames, references, or node bodies are changed.

# Files Affected

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
- Future duplicate-id fixtures.

# Implementation Notes

- Sort duplicate groups by workspace, id, path.
- Candidate id generation should be deterministic and avoid ids already present
  in the workspace.
- Keep high-risk rewrite planning separate from low-risk cache repair planning.

# Test Plan

- Fixture test with two files sharing one local id.
- Fixture test proving candidate ids are stable across runs.
- Assert `apply_supported: false`.

# Links / Artifacts

- `edd-19`
- `test-137`
- `chk-108`
