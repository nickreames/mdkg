---
id: goal-58
type: goal
title: Implement first-class loop node type
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg supports a first-class `loop` node type across parsing, templates, validation, indexing, search/show/list, pack ordering, semantic `mdkg loop` CLI commands, generated docs, smoke/unit tests, and seeded reusable read-only/planning loop templates while preserving existing goal behavior and excluding CocoIndex/provider work.
scope_refs: [task-675, task-676, task-677, task-678, task-679, task-680, task-681, task-682, task-683, task-684, task-685, test-351, test-352, test-353, test-354, test-355, test-356, test-357, test-358, test-359, test-360, test-361]
last_active_node: task-685
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, mdkg goal show goal-58 --json, mdkg goal next goal-58 --json, mdkg pack task-678 --pack-profile concise --dry-run --stats, mdkg search loop --json, mdkg search CocoIndex --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [loop, implementation, node-type, agent-harness]
owners: []
links: []
artifacts: [src/graph/node.ts, src/commands/loop.ts, src/cli.ts, src/pack/pack.ts, .mdkg/templates/default/loop.md, .mdkg/templates/loops, tests/commands/loop.test.ts, tests/pack/pack.test.ts, CLI_COMMAND_MATRIX.md, README.md, docs/_generated/cli-reference.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-57, edd-66, dec-65, edd-10, edd-63]
context_refs: [goal-57, edd-66, dec-65, task-667, task-668, task-669, task-670, task-671, task-672, task-673, task-674, test-345, test-346, test-347, test-348, test-349, test-350]
evidence_refs: [chk-383, chk-384, chk-385, chk-386, chk-387, chk-388, chk-389, chk-390]
aliases: [implement-loop-node, loop-node-implementation]
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-06
---
# Objective

Implement mdkg's first-class `loop` node type as an executable source goal. A
loop is one graph-native process node type for MVP. It may be used as a
template, forked/scoped loop, or run-bearing loop through metadata and links;
separate `loop_template` and `loop_run` node types are out of scope unless
`dec-65` is superseded.

# End Condition

This goal is achieved when:

- `loop` is accepted by mdkg node parsing, templates, validation, indexing,
  search/show/list, pack traversal, CLI help, generated command references, and
  tests.
- A semantic `mdkg loop` command family exists for list/show/fork/plan/runs or
  equivalent evidence inspection.
- `mdkg loop fork` preserves template lineage and defaults to linked child-node
  materialization, with a planning-only/no-child option.
- Initial read-only/planning loop templates are seeded for security audit,
  design/frontend UX audit, backend/API/CLI bloat audit, tech-stack audit,
  duplicate/lint audit, test/CI/SKILL.md audit, and user-story audit.
- Blocker-continuation behavior routes material blockers toward spike,
  proposal with at least three viable paths, recommendation, evidence on
  affected nodes, and continued useful scoped work when possible.
- Existing `goal` behavior and Omni semantic files remain compatible.

# Non-Goals

- Do not include CocoIndex, embeddings, semantic search, remote references, or
  optional index-provider integration.
- Do not split MVP into separate `loop_template` or `loop_run` node types unless
  the planning decision is superseded.
- Do not change `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`,
  `DISPUTE.md`, or `PROPOSAL.md` semantics.

# Activation Conditions

Activation prerequisites are now satisfied: `goal-57` is achieved, `edd-66` and
`dec-65` are accepted, implementation scope is populated below, and CocoIndex
work remains separate in `goal-53`.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --json --limit 20`
- `mdkg goal show goal-58 --json`
- `mdkg goal next goal-58 --json`
- `mdkg pack task-678 --pack-profile concise --dry-run --stats`
- `mdkg search loop --json`
- `mdkg search CocoIndex --json`
- `git diff --check`

# Acceptance Criteria

- `task-675` through `task-685` are completed with evidence.
- `test-351` through `test-361` pass or record precise blocker evidence.
- `mdkg loop` remains a generic mdkg primitive and does not leak runtime-owned
  or product-specific naming.
- CocoIndex and semantic-search provider work remain excluded.
- Required checks pass, including build/test/CLI/doc gates selected by the
  active implementation task.

# Definition Of Done

- Goal condition is achieved.
- Completion evidence is recorded in this goal and final closeout task.
- No unresolved validation, generated-doc, command-matrix, or regression drift
  remains for the loop node implementation.

# Stop Conditions

- The scope starts mixing in CocoIndex/project-memory provider work.
- The implementation requires changing `goal` semantics instead of preserving
  them.
- The implementation would move runtime execution, model routing, tools,
  approvals, sandboxes, traces, or provider secrets into mdkg.
- Validation shows that the chosen loop schema weakens existing Omni semantic
  file or goal behavior.

# Current State

Achieved on 2026-07-06. mdkg now supports `loop` as one first-class node type
across parsing, templates, validation, indexing, search/show/list, pack
traversal, CLI help, generated command references, seeded reusable loop
templates, and regression tests. `goal-57`, `edd-66`, and `dec-65` remain the
accepted planning and decision basis. CocoIndex remains out of scope in
`goal-53`.

# Iteration Log

- 2026-07-05: Placeholder created with explicit blocked/paused boundary.
- 2026-07-06: Populated executable implementation scope from `goal-57`,
  `edd-66`, and `dec-65`; cleared the obsolete blocker; selected `task-675`
  as first active task; kept CocoIndex explicitly excluded.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `task-675` through `task-685` are done.
- `test-351` through `test-361` are done.
- `chk-383` through `chk-390` record the implementation and closeout milestones.
- Source artifacts include `src/graph/node.ts`, `src/commands/loop.ts`,
  `src/cli.ts`, `src/pack/pack.ts`, `.mdkg/templates/default/loop.md`, and the
  seeded templates under `.mdkg/templates/loops/`.
- Test artifacts include `tests/commands/loop.test.ts`,
  `tests/pack/pack.test.ts`, updated parser/template/init/upgrade tests, CLI
  tests, generated docs checks, and command matrix smoke coverage.
- Final verification evidence from `chk-390`: `npm test` passed with 553 tests
  and 0 failures; `npm run cli:check`, `npm run cli:contract`,
  `npm run docs:check`, `npm run smoke:matrix`, `mdkg validate --changed-only
  --json`, `mdkg validate --summary --json --limit 20`, `mdkg goal next
  goal-58 --json`, `mdkg pack task-685 --pack-profile concise --dry-run
  --stats`, `mdkg search loop --json`, `mdkg search CocoIndex --json`, and
  `git diff --check` passed.
- `mdkg goal next goal-58 --json` returns `node: null` after closure, proving no
  scoped actionable implementation/test node remains open.
