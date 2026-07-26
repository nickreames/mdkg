---
id: test-469
type: test
title: Verify goal next skips blocked work and follows chain then priority
status: done
priority: 1
parent: goal-77
prev: bug-4
next: task-810
tags: [goal-routing, graph, cli, test]
owners: [root]
links: []
artifacts: []
relates: [bug-4]
blocked_by: [bug-4]
blocks: [task-810]
refs: [goal-77, bug-4, dec-6]
context_refs: [goal-77, bug-4, dec-6]
evidence_refs: [chk-547]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [skip_unresolved_blocker, follow_linear_chain, completed_predecessor_advances, fallback_priority_status_qid, active_node_precedence, cli_mcp_parity, read_only_behavior]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Prove explicit goal routing respects local blocker eligibility and the
configured chain-first strategy without turning a read-only selection command
into a claim or execution action.

# Target / Scope

- `root:bug-4`
- CLI and MCP goal-next selection
- local blocker resolution
- `prev`/`next` chain ordering
- priority/status/QID fallback

# Preconditions / Environment

- `root:bug-4` is done.
- Use isolated graph fixtures plus the real paused `root:goal-77`.
- Goal-next commands remain read-only and must not alter selected-goal state,
  `active_node`, ownership, status, or event history.

# Test Cases

- A lower-QID node with an unresolved local blocker is skipped.
- A valid linear chain selects its first eligible node.
- Completing a predecessor advances to the next eligible successor.
- Disconnected or ambiguous eligible candidates fall back deterministically to
  configured priority, status preference, and QID ordering.
- A valid explicit active node retains precedence.
- Missing/imported blocker cases preserve current warning and read-only safety.
- CLI and MCP receipts return the same selected QID and warnings.
- The real Goal 77 graph selects `root:task-810` after this test is completed.

# Results / Evidence

- Node `24.18.0` focused command receipts passed: goal command `17/17`,
  pure selector `3/3`, and MCP `6/6`.
- Fixtures prove unresolved local, missing, and imported blockers are skipped;
  valid chains advance one unfinished frontier; ambiguous and disconnected work
  falls back to priority, status, and QID; and blocked active nodes cannot
  bypass dependencies.
- CLI and MCP use the same selector and return the same selected QID and
  warnings. Before and after read-only commands, `mdkg goal current --json`
  returned the unchanged achieved `root:goal-73`.
- The first full `npm test` attempt passed `664/665` in `78.300s` and exposed
  one stale pre-fix subgraph assertion that still expected blocked imported
  work to be selected. The assertion was corrected to the accepted fail-closed
  contract; the affected subgraph suite then passed `17/17` in `37.978s`.
- No whole-suite retry was performed. Later integrated release and coverage
  lanes remain responsible for fresh complete-suite proof.
- Real paused `root:goal-77` selected this owned progress node with zero
  warnings after `root:bug-4` completed. Completing this test must route next to
  `root:task-810`.
- After completion, the rebuilt real CLI routed Goal 77 to `root:task-810`
  with zero warnings.
- Changed-only graph validation and `git diff --check` passed before closeout.

# Notes / Follow-ups

- This test proves selection only. Ownership and `goal claim` remain explicit
  writer-stage actions.
