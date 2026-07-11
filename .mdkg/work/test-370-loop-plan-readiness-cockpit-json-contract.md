---
id: test-370
type: test
title: Loop plan readiness cockpit JSON contract
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, plan, readiness, json]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-697]
context_refs: []
evidence_refs: [chk-400, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that `mdkg loop plan` is the primary loop readiness/status cockpit.

# Target / Scope

- `task-697`
- readiness projection from `task-694`

# Preconditions / Environment

- Fixture loops should include ready, not-ready, blocked-lane, waived-lane, and
  done cases.

# Test Cases

- `loop plan --json` includes open pre-run questions, approvals, evidence
  lanes, child refs, run refs, output refs, waivers, blockers, and closeout
  readiness.
- Done loops report no remaining required lanes.
- Not-ready loops identify missing questions or approvals.
- Existing `loop plan` fields remain compatible.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- Do not require a separate `loop status` command for this contract.
