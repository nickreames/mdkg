---
id: spike-31
type: spike
title: v0.5.0 backend API CLI bloat audit for mdkg root grounding spike
status: done
priority: 1
parent: loop-6
tags: [loop-template, audit, backend, api, cli, loop-fork, loop-child, spike, release-candidate]
owners: []
links: []
artifacts: [command-contract:116-commands-35-categories, cli-inventory:3677-lines, loop-module:2035-lines, node24-ci-release:572-tests]
relates: [loop-6]
blocked_by: []
blocks: []
refs: [loop-6, template://loops/backend-api-cli-bloat-audit, dec-72, prop-4, prop-5, task-728, test-399, goal-60]
context_refs: [root:goal-61]
evidence_refs: [dec-72, prop-5, task-728, test-399]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-10
updated: 2026-07-10
---
# Research Question

What source-grounded context, constraints, risks, and viable options should v0.5.0 backend API CLI bloat audit for mdkg root use for goal-61?

# Search Plan

- Inventory the generated public command contract and highest-flag commands.
- Measure command/router modules and repeated flag-parsing call sites.
- Inspect the loop descriptor pilot, generator integration, help path, package
  scripts, and regression coverage.
- Compare findings with `loop-4`, `prop-4`, completed `goal-59`, and queued
  `goal-60` rather than treating old metrics as current.

# Findings

## Public command and flag inventory

- The generated contract currently contains 116 public commands across 35
  top-level categories.
- Highest flag counts are `new` (24), `pack` (20), `loop fork` (12),
  `skill new` (10), and `validate` (9). The count alone is not a defect; the
  main UX risk is unclear grouping and duplicated metadata ownership.
- `src/cli.ts` remains 3,677 lines with 217 `requireFlagValue` references and
  145 `parseBooleanFlag` references. Common `--ws`, `--json`, `--no-cache`, and
  `--no-reindex` handling is still manually repeated by command families.

## Ownership and duplication

- The loop descriptor pilot is working: seven loop contract records derive
  flags, usage, output formats, side effects, and handlers from typed metadata,
  and direct help/parser parity tests now cover that contract.
- The broader generator still contains a large static command table plus a
  loop-specific descriptor overlay. This is a safe pilot boundary, not the
  desired final ownership model.
- `src/commands/loop.ts` is now the largest command module at 2,035 lines,
  ahead of `work.ts` (1,709), `fix.ts` (1,544), `subgraph.ts` (1,233), and
  `graph.ts` (1,128). It combines seed/template loading, fork planning/writes,
  identity-bound readiness, provenance, routing, and all output handlers.
- No current public behavior failure was found, but expanding the generic
  descriptor rollout on top of another monolithic module would amplify review
  and merge risk.

## Compatibility evidence

- Node 24.16 `ci:release` passed 572 tests plus CLI snapshot, command-contract,
  docs, installed-tarball loop smoke, and publish-readiness checks.
- All seven installed seed templates completed SQLite dry-run/real-fork,
  plan/next, pack, and validation proof.
- The loop descriptor changes preserved additive JSON envelopes and existing
  goal behavior. This provides a strong baseline for a later internal split.

# Recommendation

Adopt Option 1 from `prop-5`: split loop internals behind the existing command
exports before using loop as the architectural pattern for broader descriptor
migration.

- `loop_templates` or equivalent: seed/node template loading and provenance.
- `loop_fork`: planning, IDs, materialization, and writes.
- `loop_readiness`: identity bindings, lane projection, and closeout rules.
- `loop_routing`: next selection and blocker exhaustion.
- `loop.ts`: thin list/show/fork/plan/next/runs adapters.

Viable paths:

1. Incremental internal decomposition with exact command/JSON parity
   (recommended). It lowers review risk without changing public UX.
2. Build a generic descriptor/router framework first and move loop into it.
   This may remove more duplication, but widens scope before `goal-60` decisions.
3. Keep the current module and rely on tests only. This is lowest short-term
   effort but leaves the largest new module as the model for future work.

Keep generic status/next/evaluate/handoff semantics and risky-family migration
order in `goal-60`; do not implement them from this read-only audit.

# Follow-Up Nodes To Create

- `prop-5`: source-grounded decomposition proposal with three paths.
- `task-728`: plan the module split and ownership map under `goal-60`.
- `test-399`: preserve loop command, JSON, help, descriptor, and package parity.

# Skill Candidates

- Add a backend-audit metric rule that treats line/flag counts as discovery
  signals, not automatic findings; require ownership or compatibility evidence.

# Evidence And Sources

- `src/cli.ts`
- `src/commands/loop.ts`
- `src/commands/loop_descriptors.ts`
- `scripts/generate-command-contract.js`
- `dist/command-contract.json`
- `prop-4`
- `prop-5`
- `goal-59`
- `goal-60`
- Template: `template://loops/backend-api-cli-bloat-audit`

# Context And Constraints

# Options And Tradeoffs
