---
id: task-707
type: task
title: Align loop descriptors flags help and side effect contracts
status: done
priority: 1
epic: epic-227
prev: task-706
next: task-708
tags: [loop, descriptor, help, contract]
owners: []
links: []
artifacts: []
relates: [goal-61, test-380]
blocked_by: []
blocks: [task-708]
refs: [test-380]
context_refs: [goal-61, epic-227, edd-70, dec-67, prop-4, task-699, task-700]
evidence_refs: [chk-413]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Make loop command descriptors a truthful source for supported flags, help,
generated contracts, write paths, and side effects.

# Acceptance Criteria

- Descriptor flags match public parsing, including global/workspace/run flags.
- Read commands declare no side effects and actually use the pure read path.
- Fork declares all graph/index/event writes; dry-run declares none.
- Help, command contract, generated docs, and JSON envelopes remain compatible.

# Files Affected

List files/directories expected to change.

- `src/commands/loop_descriptors.ts` and loop command registration
- CLI help/contract generation scripts and generated outputs
- Descriptor parity tests

# Implementation Notes

- Keep the pilot scoped to loop; broader migration remains `goal-60`.
- Favor generated contract truth over duplicated hand-maintained descriptions.

# Test Plan

Run `test-380`, CLI snapshot/contract/docs checks, and direct help-versus-parser
flag comparison.

# Links / Artifacts

- `prop-4`
- `dec-67`
