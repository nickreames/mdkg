---
id: task-208
type: task
title: design alignment and goal graph contract updates
status: done
priority: 1
epic: epic-37
next: task-209
tags: [goal, design, graph, contract]
owners: []
links: []
artifacts: [.mdkg/design/prd-3-mdkg-goal-node-ux-and-agent-harness-contract.md, .mdkg/design/edd-10-mdkg-goal-node-architecture-and-recursive-agent-loop.md]
relates: [epic-37, prd-3, edd-10, task-209, task-210, task-211]
blocked_by: []
blocks: [task-209, task-210, task-211]
refs: [rule-3, rule-6]
aliases: [goal-design-alignment]
skills: []
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Record the selected-goal and `scope_refs` decisions in the mdkg design graph
before implementation continues.

# Acceptance Criteria

- `prd-3` and `edd-10` state that `scope_refs` are explicit goal scope roots.
- Design docs state selected-goal state is local ignored convenience state.
- Design docs state `goal next` is read-only and `goal claim` mutates
  `active_node`.
- Design docs state `feat`, `task`, `bug`, and `test` are actionable goal
  candidates while `epic` remains a scope container.

# Files Affected

- `.mdkg/design/prd-3-mdkg-goal-node-ux-and-agent-harness-contract.md`
- `.mdkg/design/edd-10-mdkg-goal-node-architecture-and-recursive-agent-loop.md`
- `.mdkg/work/epic-37-goal-scope-selection-and-skill-guided-pursuit.md`

# Implementation Notes

- This task is graph/design alignment only; source behavior lands in follow-on
  implementation tasks.

# Test Plan

- `node dist/cli.js validate`
- `node dist/cli.js pack task-208 --profile concise --dry-run --stats`

# Verification Evidence

- `prd-3` and `edd-10` were updated with selected-goal, `scope_refs`, read-only
  `goal next`, explicit `goal claim`, and actionable `feat|task|bug|test`
  decisions.
- `node dist/cli.js validate` passed after graph closeout.

# Links / Artifacts

- `prd-3`
- `edd-10`
- `epic-37`
