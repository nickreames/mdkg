---
id: task-573
type: task
title: audit current SPEC implementation docs templates fixtures and generated surfaces
status: todo
priority: 1
epic: epic-194
parent: goal-37
next: task-574
tags: [manifest, spec, audit, source-map]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, edd-14, dec-26, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-rename-source-audit, spec-surface-inventory]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Inventory every current `SPEC.md` and `spec` implementation surface before the
rename begins. This task is intentionally read-only except for recording audit
evidence in the task/checkpoint.

# Acceptance Criteria

- `git status --short --branch` is captured and unrelated dirty files are
  identified.
- Fast search covers `SPEC.md`, `MANIFEST.md`, `type: spec`, `type: manifest`,
  `Spec`, `spec`, `OmniFileKind`, `WORK.md`, and `WORK_ORDER.md`.
- Audit matrix lists source modules, CLI/help/docs, generated docs, templates,
  fixtures, example graphs, skills, and package scripts touched by the rename.
- Current behavior is summarized before implementation, including existing
  warnings/errors for no-SPEC repos and invalid SPEC fixtures.
- Any code path that must remain legacy-compatible is tagged for tests.

# Files Affected

- `src/graph/agent_file_types.ts`
- `src/graph/validate_graph.ts`
- `src/graph/capabilities_indexer.ts`
- `src/commands/spec.ts`
- `src/commands/work.ts`
- `src/cli.ts`
- `tests/commands/agent_file_types.test.ts`
- `tests/graph/capabilities_indexer.test.ts`
- `tests/fixtures/agent/**`
- `.mdkg/templates/default/spec.md`
- `.mdkg/templates/specs/*.SPEC.md`
- `docs/**`, `README.md`, `CLI_COMMAND_MATRIX.md`, generated docs, skills, and
  example graph indexes

# Implementation Notes

- Start with search and source reading only. Do not rename files in this task.
- Treat generated indexes and docs as derived surfaces; identify them, but
  update them only after behavior changes land.
- Preserve one compatibility lane for existing `SPEC.md` fixtures.

# Test Plan

- `rg -n "SPEC\\.md|MANIFEST\\.md|type: spec|type: manifest|OmniFileKind|WORK_ORDER\\.md|WORK\\.md|manifest" src tests docs .mdkg README.md CLI_COMMAND_MATRIX.md`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability list --kind spec --json`

# Links / Artifacts

- `goal-37`
- `edd-54`
- `dec-50`
