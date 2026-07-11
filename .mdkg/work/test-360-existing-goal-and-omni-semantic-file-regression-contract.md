---
id: test-360
type: test
title: existing goal and omni semantic file regression contract
status: done
priority: 1
epic: epic-219
parent: goal-58
tags: [loop, regression, goal, omni]
owners: []
links: []
artifacts: [src/graph/node.ts, src/cli.ts, tests/commands/agent_file_types.test.ts, tests/commands/goal.test.ts, tests/commands/cli_runtime.test.ts, tests/commands/loop.test.ts, tests/pack/pack.test.ts]
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, task-684, chk-389]
context_refs: []
evidence_refs: [chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that adding loops does not weaken existing mdkg goal or Omni semantic
file behavior.

# Target / Scope

- `task-684`
- existing goal, MANIFEST/SPEC, WORK, WORK_ORDER, RECEIPT, FEEDBACK, DISPUTE,
  and PROPOSAL tests

# Preconditions / Environment

Loop implementation and docs/help updates are complete.

# Test Cases

- Existing goal lifecycle tests pass.
- MANIFEST and legacy SPEC compatibility tests pass.
- Omni work/order/receipt/feedback/dispute/proposal validation tests pass.
- `mdkg new`, `validate`, `pack`, `search`, `show`, and `list` regressions pass.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- This is a regression gate, not a loop feature test.
