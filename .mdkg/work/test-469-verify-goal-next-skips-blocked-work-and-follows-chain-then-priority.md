---
id: test-469
type: test
title: Verify goal next skips blocked work and follows chain then priority
status: backlog
priority: 1
parent: goal-77
prev: bug-4
next: task-810
tags: [goal-routing, graph, cli, test]
owners: []
links: []
artifacts: []
relates: [bug-4]
blocked_by: [bug-4]
blocks: [task-810]
refs: [goal-77, bug-4, dec-6]
context_refs: [goal-77, bug-4, dec-6]
evidence_refs: []
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
- The real Goal 1 graph selects `root:task-810` after this test is completed.

# Results / Evidence

Attach focused fixture receipts, CLI/MCP parity output, real Goal 1 routing, and
before/after selected-goal and Git state to a test-proof checkpoint.

# Notes / Follow-ups

- This test proves selection only. Ownership and `goal claim` remain explicit
  writer-stage actions.
