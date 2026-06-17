---
id: task-373
type: task
title: design mdkg goal activate command and single-active semantics
status: done
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, goal-activate, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-372]
blocks: [task-374]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design the command and state transition rules that make goal activation explicit and single-writer friendly.

# Decision

Add `mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]` as the public command that changes durable root-goal lifecycle state. Keep `mdkg goal select` as a local ignored pointer for operator convenience.

`activate` is intentionally stricter than `resume`:

- `goal select` only writes `.mdkg/state/selected-goal.json`.
- `goal resume` keeps its existing narrow behavior: set one goal to `status: progress` and `goal_state: active`.
- `goal activate` is the safe high-level transition for normal operators. It makes exactly one local root goal active and pauses every other active local root goal in the same workspace.
- `goal current` keeps using selected-goal state first, then the unique active-goal fallback.
- `goal claim` continues to mutate only `active_node` inside the already selected or explicit goal.

# State Transition Contract

`goal activate <goal>` must:

- resolve only a local non-imported goal node;
- reject non-goal qids;
- reject archived goals after archived support exists;
- reject achieved/done goals unless a future explicit reopen command exists;
- set the target goal to `status: progress`, `goal_state: active`, and update `updated`;
- clear or pause competing local root active goals in the same workspace by setting `status: blocked`, `goal_state: paused`, and updating `updated`;
- not mutate imported subgraph goals;
- not mutate goals in other workspaces unless that workspace was explicitly selected with `--ws`;
- write selected-goal state to the activated goal so `goal next` routes predictably;
- emit a JSON receipt listing `activated_goal`, `paused_goals`, `selection`, and `warnings`.

# Failure Behavior

Activation should fail before mutation when:

- the target id is missing, ambiguous, imported/read-only, or not a goal;
- the target is achieved/done;
- the target is archived once `archived` support lands;
- the workspace hint is invalid.

Competing active root goals are not a hard failure for `activate`; they are the reason the command exists. `activate` resolves that conflict by pausing local competing root goals and selecting the requested goal.

Strict validation should still fail when the graph contains multiple active local root goals, because this indicates manual editing or use of older commands. The remediation should point to `mdkg goal activate <goal-id>` or manual repair.

# Archived Goal Contract

Archived goal support belongs to `task-375`. The intended behavior is:

- archived goals are historical context, not actionable backlog;
- archived goals remain readable via show/search/list with explicit filters;
- archived goals are valid refs and can appear in historical body text;
- archived goals are excluded from default `goal current`, `goal next`, and active-goal fallback;
- `goal activate` must refuse archived goals with a clear diagnostic.

Legacy goals should not be set to archived until this parser and command behavior exists.

# Subgraph Independence

Single-active enforcement applies to the current mutable root workspace only. Imported subgraph goals are read-only context:

- root validation may report subgraph goal state as context, but must not enforce root single-active rules inside imported subgraphs;
- subgraph bundles remain valid mdkg graphs and may internally contain their own active goal;
- MCP/subgraph orchestration work can later surface subgraph active goals read-only.

# Acceptance Criteria

- Define `goal activate` behavior relative to `goal select`, `goal claim`, and `goal current`.
- Define failure behavior when another root goal is already active.
- Define how paused and archived goals behave.
- Preserve subgraph independence as a design invariant.

# Files Affected

- `src/commands/goal.ts`
- `src/cli.ts`
- `src/graph/node.ts`
- `src/graph/validate_graph.ts`
- `tests/commands/goal.test.ts`
- `tests/graph/node.test.ts`
- `tests/graph/validate_graph.test.ts`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `assets/init/**`

# Implementation Notes

- Preserve `select` as local operator state and avoid overloading it with lifecycle mutation.
- Use existing mutation locking and event logging from goal state mutation commands.
- Implement single-active validation in graph validation, not only in command handlers.
- Do not archive legacy goals until task-375 support exists.

# Test Plan

- Unit test `goal activate` pauses competing root active goals, selects the target, and leaves exactly one active goal.
- Unit test `goal activate` rejects achieved/done goals and non-goal ids.
- Validation test multiple active local root goals fail with remediation.
- Validation test imported/subgraph goals are not counted against root single-active validation.
- Archived behavior tests land with `task-375`.

# Evidence

- Design grounded against `src/commands/goal.ts`, `src/cli.ts`, `src/graph/node.ts`, and existing goal command tests on 2026-06-16.

# Links / Artifacts

- Active goal: `goal-16`
- Follow-on implementation: `task-374`
