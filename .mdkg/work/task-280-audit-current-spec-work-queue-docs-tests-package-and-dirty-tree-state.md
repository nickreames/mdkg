---
id: task-280
type: task
title: audit current SPEC WORK queue docs tests package and dirty tree state
status: done
priority: 1
epic: epic-53
parent: goal-9
next: task-281
tags: [audit, release, spec, work, queue]
owners: []
links: []
artifacts: []
relates: [goal-9, epic-53]
blocked_by: []
blocks: [task-281]
refs: [edd-15]
aliases: [0-3-0-current-state-audit]
skills: [select-work-and-ground-context]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Record the current implementation state before 0.3.0 work starts.

# Acceptance Criteria

- Capture package version, git status, validation state, `capability list --kind spec`, work command help, queue command help, docs state, templates, and test/smoke coverage.
- Distinguish existing implemented surfaces from new 0.3.0 work.
- Record blockers before source mutation begins.

# Files Affected

- Graph evidence only until implementation tasks are selected.

# Implementation Notes

- This is the first goal node and must stay read-only except for evidence
  updates when executed.

# Test Plan

- `node dist/cli.js --version`
- `node dist/cli.js validate`
- `node dist/cli.js capability list --kind spec --json`
- `node dist/cli.js work --help`
- `git status --short --branch`

# Links / Artifacts

- `goal-9`

# Audit Evidence

Recorded on 2026-06-06 before functional 0.3.0 source changes.

## Package And Release State

- `node dist/cli.js --version`: `0.2.0`.
- `package.json`, `package-lock.json`, and the compiled CLI are still on
  `0.2.0`.
- `CHANGELOG.md` currently starts with `0.2.0 - Unreleased`; there is no
  `0.3.0` section yet.
- 0.3.0 package metadata and changelog work remains future work under
  `task-301`.

## Git And Graph State

- `git status --short --branch` is on `main...origin/main`.
- Existing dirty state before source changes is graph-only:
  `.mdkg/index/mdkg.sqlite` plus untracked goal-9 design, epic, task, test,
  and goal markdown files.
- `node dist/cli.js index` completed and refreshed the graph/capability
  indexes.
- `node dist/cli.js validate --json` passed with `ok: true`,
  `warning_count: 0`, and `error_count: 0`.
- `node dist/cli.js goal next goal-9 --json` selects `task-280` and reports
  non-blocking selector warnings for `dec-26`, `dec-27`, `dec-28`, and
  `edd-15` because those design nodes are included in goal scope even though
  the goal selector only acts on concrete work/test nodes.

## SPEC And Capability State

- `node dist/cli.js capability list --kind spec --json` returns `count: 0`.
- `node dist/cli.js capability list --kind work --json` returns `count: 0`.
- `node dist/cli.js capability search "mdkg cli tool spec" --json` finds only
  the existing `skill:author-mdkg-skill` record, not a concrete mdkg CLI
  `SPEC.md` record.
- Existing capability index code already supports `kind: spec` and records
  `version`, `role`, `runtime_mode`, `work_contracts`,
  `requested_capabilities`, `skill_refs`, `tool_refs`, `model_refs`,
  `wasm_component_refs`, `runtime_image_refs`, `subagent_refs`,
  `resource_profile`, and `update_policy`.
- Missing 0.3.0 work: concrete dogfood mdkg CLI `SPEC.md`, `spec_kind`
  metadata, documentation-only misuse diagnostics, `mdkg spec ...` public
  helper commands, and tests proving optional SPEC behavior.

## Work And Queue Command State

- `node dist/cli.js work --help` exposes existing semantic mirror helpers:
  `work contract new`, `work order new/update`, `work receipt new/update`, and
  `work artifact add`.
- `node dist/cli.js work order status --help` and
  `node dist/cli.js work receipt verify --help` do not expose real status or
  verification subcommands yet.
- `node dist/cli.js db queue --help` exposes the public local queue lifecycle:
  create, pause, resume, enqueue, claim, ack, fail, dead-letter,
  release-expired, stats, list, and show.
- Queue capability is implemented as durable local delivery state, but the
  optional bridge from `mdkg work trigger` to project DB queue rows is not
  implemented yet.

## Docs, Templates, And Tests

- `README.md`, `CLI_COMMAND_MATRIX.md`, `AGENT_START.md`, and init assets
  mention current capability discovery, work mirrors, and public DB queue
  commands.
- Docs do not yet describe the full 0.3.0 behavior: optional `SPEC.md`,
  `spec_kind`, documentation-only misuse diagnostics, dogfood mdkg CLI SPEC,
  `mdkg spec ...`, `mdkg work trigger`, `work order status`,
  `work receipt verify`, or queue bridge semantics.
- Canonical SPEC templates exist under `.mdkg/templates/specs/` for base,
  agent, api, capability, integration, model, project, runtime-agent,
  runtime-image, and tool.
- Default agent workflow templates exist for `SPEC.md`, `WORK.md`,
  `WORK_ORDER.md`, and `RECEIPT.md`.
- Existing tests cover agent workflow file validation, capability indexing
  fixtures, archive work, and public DB queue CLI smoke.
- Missing 0.3.0 coverage is tracked by `test-107` through `test-118`.

## Blockers Before Source Mutation

- No external blocker was found.
- Implementation should begin only after `task-281` locks the final 0.3.0
  acceptance matrix and non-publish release boundary.
