---
id: bug-4
type: bug
title: Make goal next honor blockers and configured chain order inside explicit goal scope
status: backlog
priority: 1
parent: goal-77
next: test-469
tags: [goal-routing, graph, cli, audit-followup]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: []
blocks: [test-469]
refs: [goal-77, loop-7, dec-6, chk-545]
context_refs: [goal-77, dec-6, chk-545]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

`mdkg goal next <goal>` currently gathers all concrete scoped nodes and sorts
them only by priority, status preference, and QID. It does not exclude nodes
whose `blocked_by` dependencies remain incomplete and does not honor the
configured `work.next.strategy: chain_then_priority` or declared `prev`/`next`
edges.

This makes an explicit goal return later implementation work before its
definition-blocking bootstrap/test lane and undermines deterministic goal
routing.

# Reproduction Steps

1. Create one goal whose scope contains an unblocked task and an older-QID task
   blocked by an incomplete test.
2. Link the nodes in a declared `next` chain with the unblocked task first.
3. Configure `work.next.strategy` as `chain_then_priority`.
4. Run `mdkg goal next <goal> --json`.
5. Observe that the older-QID blocked task is selected.

# Expected vs Actual

- Expected: explicit goal routing excludes work with unresolved local blockers,
  honors a valid local chain when the configured strategy requests it, and
  falls back to priority/status/QID only among otherwise eligible nodes.
- Actual: `src/commands/goal.ts` calls `sortNodesForNext` on every non-done
  concrete scoped node without blocker or chain eligibility.

# Suspected Cause

`runGoalNextCommand` uses `isConcreteCandidate` and `sortNodesForNext`, while
the goal-scoped path does not implement the configured next strategy or inspect
`edges.blocked_by`. The global `mdkg next <id>` path follows a direct `next`
edge, but explicit goal routing does not.

# Fix Plan

- Add one shared eligibility/ordering helper for goal-scoped candidates.
- Treat a local blocker as unresolved until its target is done.
- Keep imported/subgraph blocker behavior read-only and warning-based.
- When `chain_then_priority` is configured, select the first eligible chain
  head or next eligible successor before the normal priority/status/QID
  fallback.
- Preserve explicit `active_node` behavior and archived/achieved goal behavior.
- Do not mutate goal state, claim work, or run commands from `goal next`.
- Keep CLI and MCP goal-next behavior in parity.

# Test Plan

- Add focused CLI/unit fixtures for blocked candidates, linear chains, completed
  predecessors, branching/fallback behavior, active-node precedence, missing
  blockers, and subgraph warnings.
- Add MCP parity coverage.
- Re-run the real paused `root:goal-77`; it must select `root:bug-4` before the
  fix and `root:test-469` after this bug is done.
- Run command, CLI contract, graph validation, and Git boundary checks.

# Links / Artifacts

- `root:goal-77`
- `root:test-469`
- `root:dec-6`
- `src/commands/goal.ts`
- `src/commands/next.ts`
- `src/util/sort.ts`
