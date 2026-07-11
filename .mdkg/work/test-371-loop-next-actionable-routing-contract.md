---
id: test-371
type: test
title: Loop next actionable routing contract
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, next, routing, json]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-698]
context_refs: []
evidence_refs: [chk-402, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate read-only loop routing through `mdkg loop next`.

# Target / Scope

- `task-698`
- loop readiness projection

# Preconditions / Environment

- Fixture loops contain multiple child refs with mixed statuses, blockers,
  waivers, and approvals.

# Test Cases

- `mdkg loop next <loop> --json` returns the next actionable child or lane.
- The response explains the selection rationale.
- Blocked or approval-gated lanes are skipped only when another lane is
  actionable.
- Done loops return no actionable node.
- Command is read-only and does not mutate goal/loop/task state.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- Use `goal next` as an ergonomics reference, not as the loop routing algorithm.
