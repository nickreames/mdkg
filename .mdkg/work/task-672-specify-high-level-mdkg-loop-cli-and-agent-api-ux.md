---
id: task-672
type: task
title: Specify high-level mdkg loop CLI and agent API UX
status: done
priority: 1
epic: epic-211
parent: epic-211
tags: [loop, planning, cli, api, agent-ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, epic-211, edd-66, dec-65, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Specify a semantic `mdkg loop` command family and structured API expectations
for agents without exposing low-level graph edge mechanics to users.

# Acceptance Criteria

- Minimal CLI shape covers list, show, fork, plan, and run/evidence inspection.
- Fork command defaults to linked child materialization and supports a
  planning-only/no-child option.
- Commands have agent-friendly structured output expectations.
- CLI text makes clear that mdkg stores loop state and does not execute runtime
  jobs directly.
- Command design avoids flag bloat and preserves existing `goal`, `task`,
  `pack`, `search`, and `show` behavior.

# Files Affected

Future implementation targets to verify, not change in this pass:

- CLI command source under `src/**`
- `CLI_COMMAND_MATRIX.md`
- generated docs/reference command surfaces

# Implementation Notes

- Keep high-level verbs. Avoid requiring users to write raw node/edge commands
  for normal loop workflows.
- If run evidence is modeled through existing nodes/events, the inspection
  command can surface that without creating a separate run node type.

# Proposed CLI/API Shape

The loop command family should be semantic:

- `mdkg loop list`: list loop templates, scoped loops, or active/planned loops
  with filters for mode, status, scope, and template lineage where supported.
- `mdkg loop show <loop>`: show purpose, mode, scope, definition of done,
  lineage, linked goals/subgoals, materialized child nodes, recent evidence,
  current projection, and next recommended planning action.
- `mdkg loop fork <template> --scope <scope>`: create a scoped loop identity
  from a reusable template, defaulting to linked child-node materialization.
- `mdkg loop fork <template> --scope <scope> --no-children` or equivalent:
  create only the scoped loop shell with lineage and pending materialization.
- `mdkg loop plan <loop>`: prepare or inspect the planned child-node structure
  without executing agents or tools.
- `mdkg loop runs <loop>` or equivalent: inspect run/evidence history if runs
  are represented through linked checkpoints, receipts, events, or artifacts.

# Agent Output Contract

All loop commands that inspect or mutate graph state should support structured
output consistent with existing mdkg command style:

- `--json` for machine-readable receipts.
- future `--xml`, `--toon`, and `--md` parity if the command joins the generic
  discovery/show surface.
- receipts should include qid, path, type, title, status, mode, scope,
  template lineage, materialized children, warnings, and validation hints where
  relevant.

# UX Guardrails

- Do not expose a normal workflow like
  `mdkg node create --type loop --edge ...`.
- Do not use command wording that implies mdkg executes agents directly.
- Keep `goal` commands focused on outcomes and `loop` commands focused on
  reusable process state.
- Keep fork dry-run/preview behavior deterministic enough for agents to review
  planned child nodes before applying.

# Test Plan

- `mdkg show edd-66`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `epic-211`
- `edd-66`
