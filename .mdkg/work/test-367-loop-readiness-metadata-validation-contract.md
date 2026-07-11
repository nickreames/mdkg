---
id: test-367
type: test
title: Loop readiness metadata validation contract
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, metadata, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-693, task-694]
context_refs: []
evidence_refs: [chk-394, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that loop readiness metadata is accepted, projected, and rejected
clearly when invalid.

# Target / Scope

- `task-693`
- `task-694`
- loop parser/validation behavior

# Preconditions / Environment

- Run from the mdkg repo root after build.
- Use fixture loops for minimal, full, and invalid readiness metadata.

# Test Cases

- A loop with `pre_run_questions`, approvals, evidence lanes, waiver refs,
  `decision_refs`, and `approval_refs` validates.
- A legacy/minimal loop without readiness metadata still validates.
- Invalid typed refs or malformed lane metadata fail with clear diagnostics.
- Projection output includes readiness fields deterministically.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- This test should remain focused on loop readiness metadata, not generic CLI
  semantics.
