---
id: task-667
type: task
title: Audit current goal working-loop and node-type surfaces for loop design
status: done
priority: 1
epic: epic-208
parent: epic-208
tags: [loop, planning, audit, node-types]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, epic-208, edd-66, edd-10, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Audit the current mdkg source, docs, and graph surfaces that a future `loop`
node would touch. This task establishes the live baseline before the loop design
becomes implementation-ready.

# Acceptance Criteria

- Current node-type parsing and validation surfaces are identified.
- Current `goal` architecture and recursive working-loop assumptions are
  summarized with refs to `edd-10` and live source.
- Current template/scaffold, CLI help, command matrix, index/search/show/list,
  and pack surfaces are mapped.
- Gaps and risks are recorded in `edd-66` or follow-up nodes.
- No source implementation changes are made under this task.

# Files Affected

Planning-only inspection targets:

- `src/graph/node.ts`
- `src/**`
- `.mdkg/templates/**`
- `CLI_COMMAND_MATRIX.md`
- `docs/**`
- `scripts/**`
- `.mdkg/work/**`
- `.mdkg/design/edd-10-*`
- `.mdkg/design/edd-63-*`

# Implementation Notes

- Start read-only.
- Use `rg` for `WORK_TYPES`, `ALLOWED_TYPES`, `goal`, `pack`, `index`,
  `search`, `show`, `new`, and template references.
- Treat source behavior as more authoritative than planning text.

# Source Audit Evidence

Completed 2026-07-05. The current implementation surfaces for a future `loop`
node are:

- Node type contract: `src/graph/node.ts` owns `WORK_TYPES`, `ALLOWED_TYPES`,
  goal-specific frontmatter validation, template-schema checks, semantic refs,
  extracted attributes, and the rule that `skills` only applies to work types.
- Creation/scaffold: `src/commands/new.ts` validates allowed types, maps types
  to id prefixes and folders, renders `.mdkg/templates/default/<type>.md`, and
  currently defaults new goals to `goal_state: active` unless status maps to a
  closed/blocked state.
- Template schema: `.mdkg/templates/default/*.md` and
  `src/graph/template_schema.ts` define allowed frontmatter keys; a `loop`
  implementation needs a local template plus bundled fallback support before
  validation can parse loop nodes.
- Goal routing: `src/graph/goal_scope.ts` currently treats `epic` and `feat` as
  containers and `feat`, `task`, `bug`, `test`, and `spike` as actionable
  goal-scope types. `goal next` also includes compatibility refs from direct
  relationships, which explains non-fatal warnings when a goal has design or
  placeholder refs outside `scope_refs`.
- Goal validation: `src/graph/validate_graph.ts` checks that `scope_refs`
  resolve to allowed goal-scope types, that `active_node` is actionable, and
  that only one local root goal is active.
- Indexing: `src/graph/indexer.ts` loads template schemas from
  `ALLOWED_TYPES`, walks workspace docs, parses nodes, normalizes edges, and
  hydrates index nodes. Adding `loop` must be paired with template schema
  support.
- Generic discovery: `src/commands/list.ts`, `src/commands/search.ts`, and
  `src/commands/show.ts` are mostly type-agnostic once the index contains the
  node. Search indexes node metadata, refs, aliases, skills, and attributes,
  not full body text.
- Pack traversal: `src/pack/pack.ts` traverses configured edge keys and adds
  goal scope when the pack root is a goal. `src/pack/order.ts` has explicit
  type-priority lists that omit `test` in `WORK_TYPES` and omit future `loop`,
  so loop pack ordering will need an intentional placement.
- CLI/help/docs: `src/cli.ts` and `CLI_COMMAND_MATRIX.md` list first-class
  command families. A `mdkg loop` family needs source help, generated command
  matrix coverage, docs, and smoke/unit tests.
- Existing tests: relevant coverage lives in `tests/graph/node.test.ts`,
  `tests/graph/validate_graph.test.ts`, `tests/commands/new.test.ts`,
  `tests/commands/list.test.ts`, `tests/commands/search/show` surfaces,
  `tests/commands/goal.test.ts`, `tests/commands/pack*.test.ts`, and smoke
  scripts such as `scripts/smoke-goal.js` and `scripts/smoke-goal-lifecycle.js`.

# Gaps / Risks Recorded

- `loop` cannot be parser-only; it must include template schema, local and
  bundled templates, index, docs, generated command matrix, and tests.
- Existing `goal` routing treats compatibility refs as scope for warnings.
  Future loop planning should avoid mixing design refs into executable loop
  routing, or should make context-vs-scope separation explicit.
- Generic list/search/show will mostly work after indexing, but `loop` needs
  user-facing semantics and likely `mdkg loop` wrappers so users do not rely on
  low-level generic commands.
- Pack ordering currently has hard-coded type order. A process-oriented `loop`
  needs explicit ordering relative to goals, epics, tasks, tests, checkpoints,
  decisions, and evidence.
- `mdkg new goal` defaults to active state. A future `mdkg new loop` or
  `mdkg loop fork` should deliberately choose default lifecycle state rather
  than inheriting goal defaults.

# Test Plan

- `git status --short --branch`
- `rg -n "WORK_TYPES|ALLOWED_TYPES|goal|pack|index|search|show|new" src .mdkg/templates CLI_COMMAND_MATRIX.md docs scripts`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `goal-57`
- `edd-66`
- `edd-10`
- `edd-63`
- `src/graph/node.ts`
- `src/commands/new.ts`
- `src/graph/goal_scope.ts`
- `src/graph/validate_graph.ts`
- `src/pack/pack.ts`
- `src/pack/order.ts`
- `src/commands/list.ts`
- `src/commands/search.ts`
- `src/commands/show.ts`
- `.mdkg/templates/default/goal.md`
- `CLI_COMMAND_MATRIX.md`
