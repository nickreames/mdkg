---
id: task-673
type: task
title: Specify loop validation index search show and pack impacts
status: done
priority: 1
epic: epic-212
parent: epic-212
tags: [loop, planning, validation, index, pack, search]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, epic-212, edd-66, dec-65, edd-10]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Specify the implementation impacts for validation, indexing, search, show/list,
pack, docs, generated command matrix, and smoke tests once `loop` is added as a
first-class node type.

# Acceptance Criteria

- Node parsing and scaffold requirements are listed.
- Validation requirements include linked goals, child nodes, provenance, fork
  ambiguity, materialization options, and blocked/continuation behavior.
- Index/search/show/list behavior makes loops discoverable without confusing
  templates, forks, and active loops.
- Pack ordering includes loop purpose, constraints, linked goals/subgoals,
  child work, recent evidence, and outputs while avoiding bulky artifacts.
- Tests preserve existing goal/work node behavior.
- Docs and command matrix generation requirements are captured.

# Files Affected

Future implementation targets to verify, not change in this pass:

- `src/graph/node.ts`
- parser/validator/index/search/show/list/pack source under `src/**`
- `.mdkg/templates/**`
- `CLI_COMMAND_MATRIX.md`
- `docs/**`
- `scripts/**`
- test and smoke folders

# Implementation Notes

- Do not use CocoIndex as part of this implementation contract.
- Keep vector/semantic retrieval as a future derived provider concern, not a
  source of truth for loops.

# Implementation Impact Specification

## Parsing And Templates

- Add `loop` to `WORK_TYPES` or a deliberately selected process-node set in
  `src/graph/node.ts`.
- Add `loop` to `ALLOWED_TYPES`.
- Add loop-specific extracted attributes after the exact schema is accepted.
- Add `.mdkg/templates/default/loop.md` and bundled fallback template support.
- Ensure `src/graph/template_schema.ts` recognizes the local/bundled loop
  template so validation does not fail with missing schema.

## Creation And CLI

- Add scaffold support through `mdkg new loop` or route creation through
  `mdkg loop fork/plan` if a generic new command is intentionally not exposed.
- Add `mdkg loop` dispatch/help in `src/cli.ts`.
- Update `CLI_COMMAND_MATRIX.md`, generated docs, help snapshots, and command
  contract tests.

## Validation

- Validate required loop fields for purpose, mode, scope, definition of done,
  lineage when forked, status/lifecycle, and linked child-node expectations.
- Detect ambiguous template/fork states where both template and scoped identity
  are present without lineage.
- Validate default materialized child refs when a fork claims child
  materialization.
- Validate no-child/planning-only fork state when materialization is deferred.
- Validate blocker-continuation contracts when loop output claims blocked state.
- Preserve existing goal validation, work-mirror validation, and agent file
  validation.

## Index / Search / Show / List

- Ensure loop attributes are included in index nodes.
- Generic `list --type loop`, `search`, and `show` should work once loops are
  indexed.
- `mdkg loop list/show` should provide semantic filtering and richer loop
  receipts without relying on generic output only.
- Search text should include loop mode, scope, template lineage, aliases, refs,
  and linked child ids.

## Pack

- Decide explicit `loop` placement in `src/pack/order.ts`.
- When packing a loop, include purpose, mode, definition of done, constraints,
  scope, lineage, linked goals/subgoals, materialized child nodes, recent
  evidence, decisions, recommendations, and outputs.
- Keep bulky artifacts referenced, not embedded.
- Do not let vector/semantic retrieval become authoritative for loop packs.

## Tests And Smokes

- Parser/template tests for canonical loop nodes.
- `mdkg new loop` or `mdkg loop fork` scaffold tests.
- Validation tests for template loops, scoped forks, run-bearing loops, stale
  forks, materialized children, no-child forks, and blocker-continuation state.
- Search/show/list/index tests.
- Pack tests for loop ordering and bounded context.
- CLI/help/command matrix/docs tests.
- Seed catalog smoke tests.
- Regression tests proving existing `goal` behavior is unchanged.

# Test Plan

- `mdkg show test-345`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `epic-212`
- `test-345`
- `goal-58`
