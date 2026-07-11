---
id: chk-390
type: checkpoint
title: loop implementation regression smokes and goal closeout verified
checkpoint_kind: goal-closeout
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [src/graph/node.ts, src/commands/loop.ts, src/cli.ts, src/pack/pack.ts, .mdkg/templates/default/loop.md, .mdkg/templates/loops, tests/commands/loop.test.ts, tests/pack/pack.test.ts, CLI_COMMAND_MATRIX.md, README.md, docs/_generated/cli-reference.md]
relates: [task-685]
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, chk-383, chk-384, chk-385, chk-386, chk-387, chk-388, chk-389]
context_refs: []
evidence_refs: [chk-383, chk-384, chk-385, chk-386, chk-387, chk-388, chk-389]
aliases: []
skills: []
scope: [goal-58, task-685, test-351, test-352, test-353, test-354, test-355, test-356, test-357, test-358, test-359, test-360, test-361]
created: 2026-07-06
updated: 2026-07-06
---
# Summary

Final regression and closeout for `goal-58` are complete. mdkg now has one
first-class `loop` node type with parser/schema validation, default and seeded
templates, loop discovery, semantic `mdkg loop` commands, fork provenance,
default child materialization, planning-only/no-child materialization, pack
closure, generated docs, and regression coverage.

# Scope Covered

`goal-58`, `task-685`, and `test-351` through `test-361`.

## Changed Surfaces

- `src/graph/node.ts`, `src/graph/frontmatter.ts`, `src/graph/goal_scope.ts`
- `src/commands/loop.ts`, `src/commands/search.ts`, `src/cli.ts`
- `src/pack/order.ts`, `src/pack/pack.ts`
- `.mdkg/templates/default/loop.md`
- `.mdkg/templates/loops/*.loop.md`
- `tests/commands/loop.test.ts`, `tests/pack/pack.test.ts`, parser/template,
  init/upgrade, CLI, and generated command tests
- `README.md`, `CLI_COMMAND_MATRIX.md`, `assets/init/CLI_COMMAND_MATRIX.md`,
  `docs/_generated/cli-reference.md`, and generated command contract output

## Boundaries

- in scope: mdkg core node parsing, validation, templates, index/search/show,
  pack traversal, CLI help/dispatch, generated docs, seed templates, and tests
- out of scope: CocoIndex, embeddings, semantic search providers, remote
  reference providers, runtime execution, model routing, tools, approvals,
  sandboxes, traces, deploys, publishes, pushes, and tags
- raw secrets, raw prompts, raw provider payloads, and bulky execution traces
  excluded

# Decisions Captured

- `dec-65`: `loop` is one first-class node type for MVP.
- `edd-66`: first-class loop operating model and reusable template lifecycle.

# Implementation Summary

The implementation adds `loop` to mdkg's work/node type contracts and validates
minimal MVP loop metadata: mode, role, scope refs/description, template refs,
materialization mode, linked child/run/decision/output/approval/evaluation refs,
definition of done, and blocker-continuation policy.

`mdkg loop list/show/fork/plan/runs` gives users and agents semantic access to
loop state. `loop fork` resolves indexed loop nodes or seed templates, records
template path/hash lineage, preserves scope metadata, defaults to linked
spike/task/test child materialization, and supports planning-only/no-child
forks. Runtime execution remains outside mdkg.

Pack traversal now treats loop roots as process containers and includes linked
subnodes, evidence, and scoped goal closure in deterministic order. Seeded loop
templates cover security audit, design/frontend UX audit, backend/API/CLI bloat
audit, tech-stack audit, duplicate/lint audit, test/CI/SKILL.md audit, and
user-story audit/recommendations.

# Goal Closeout

- Goal condition result: achieved.
- Scoped nodes closed: `task-675` through `task-685`, and `test-351` through
  `test-361`.
- Remaining deferred work: CocoIndex/provider indexing remains separate in
  `goal-53`; no CocoIndex work is part of `goal-58`.

# Verification / Testing

## Command Evidence

- `npm test`: 553 tests passed, 0 failed.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed with command contract hash
  `547c7f55bc28db0e92a38f97ed013414c7d2c45ddb08f1adee00d78692059c1e`.
- `npm run docs:check`: passed.
- `npm run smoke:matrix`: passed for version `0.4.2`.
- `mdkg validate --changed-only --json`: passed with 0 warnings and 0 errors.
- `mdkg validate --summary --json --limit 20`: passed with 0 warnings and 0
  errors.
- `mdkg goal next goal-58 --json`: returned `node: null` after closure.
- `mdkg pack task-685 --pack-profile concise --dry-run --stats`: passed.
- `mdkg search loop --json`: returned loop discovery results.
- `mdkg search CocoIndex --json`: returned only the separate CocoIndex planning
  lane refs.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none from mdkg validation

# Known Issues / Follow-ups

- Earlier implementation checkpoints `chk-383` through `chk-389` exist as
  milestone refs; this final closeout checkpoint is the durable consolidated
  evidence record.

## Follow-up Refs

- `goal-53` remains the separate CocoIndex/index-provider planning lane.

# Links / Artifacts

- `goal-58`
- `task-685`
- `test-351` through `test-361`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
