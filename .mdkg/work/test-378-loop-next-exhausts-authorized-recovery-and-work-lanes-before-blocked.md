---
id: test-378
type: test
title: Loop next exhausts authorized recovery and work lanes before blocked
status: done
priority: 1
epic: epic-226
tags: [loop, next, routing, blockers]
owners: []
links: []
artifacts: [node --test dist/tests/commands/loop.test.js dist/tests/graph/node.test.js dist/tests/graph/validate_graph.test.js (46/46 pass)]
relates: [goal-61, task-705]
blocked_by: []
blocks: []
refs: [task-705]
context_refs: [goal-61, epic-226, edd-70, dec-67]
evidence_refs: [chk-411]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove a loop continues useful authorized work across nested goals and blocker
recovery before the whole loop can be marked blocked.

# Target / Scope

`task-705`; `loop next`, mixed child state, recovery, and closeout readiness.

# Preconditions / Environment

Fixture with three nested goals, partial completion, optional/required gates,
blocked children, and available spike/proposal recovery.

# Test Cases

- Route to unblocked goal work while another lane awaits approval.
- Route blocked lanes to spike/proposal/recommendation when authorized.
- Return blocked only after every useful authorized path is exhausted.
- Reject closeout while a required non-waived lane remains incomplete.

# Results / Evidence

PASS on 2026-07-10. Routing fixtures proved that `loop next` skips completed,
waiting, and blocked branches while authorized child or blocker-recovery work
remains, and reports whole-loop blocking only after all useful paths are
exhausted. Evidence: `chk-411`.

# Notes / Follow-ups

- Preserve existing statuses.
