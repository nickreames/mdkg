---
id: test-373
type: test
title: Loop UX pilot preserves existing loop and goal behavior
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, goal, regression, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, goal-58, edd-69, dec-66, task-701, test-366]
context_refs: []
evidence_refs: [chk-406, chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate compatibility for existing loop commands and unrelated goal behavior.

# Target / Scope

- `goal-59`
- existing loop command family
- goal command behavior

# Preconditions / Environment

- Run from the mdkg repo root after implementation.

# Test Cases

- Existing `mdkg loop list/show/fork/plan/runs` tests continue passing.
- `mdkg loop fork` materialization behavior is unchanged.
- `mdkg goal next` remains read-only and unaffected.
- Existing goal scopes and packs remain valid.

# Results / Evidence

PASS. The loop UX descriptor pilot contract is implemented and covered by the
focused loop, CLI, descriptor, generated-contract, and compatibility suites.
Historical evidence is linked in frontmatter and consolidated by `chk-408`.

# Notes / Follow-ups

- This guards against accidentally turning the loop UX pass into a goal
  semantics change.
