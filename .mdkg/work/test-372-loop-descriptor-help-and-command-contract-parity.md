---
id: test-372
type: test
title: Loop descriptor help and command contract parity
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, descriptor, contract, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-699, task-700, test-366]
context_refs: []
evidence_refs: [chk-405, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate that loop typed descriptors preserve help and command-contract parity.

# Target / Scope

- `task-699`
- `task-700`
- `test-366`

# Preconditions / Environment

- Run after loop descriptors are wired into help/contract generation.

# Test Cases

- Existing loop help text remains compatible or changes only by accepted
  additive UX improvements.
- Command contract records for loop commands are deterministic.
- Loop flag descriptions come from explicit metadata, not unrelated help notes.
- `npm run cli:check` and generated docs checks pass.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- This test is the focused loop-family version of `test-366`.
