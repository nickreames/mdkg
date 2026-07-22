---
id: test-466
type: test
title: verify startup contributor and test guidance matches repository contracts
status: backlog
priority: 2
tags: [audit-followup, harness, docs, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-806]
blocked_by: [task-806]
blocks: []
refs: [loop-7, spike-32, test-461, chk-541, chk-542, task-806]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Prevent recurrence of the active-loop routing, tracked-index, and test-family
guidance contradictions corrected by `root:task-806`.

# Target / Scope

- root and public agent startup files
- contributor generated-state guidance and Git ignore/tracking behavior
- tests README family and command descriptions

# Preconditions / Environment

- `root:task-806` is done.
- Use the current repository and one disposable initialized agent fixture.

# Test Cases

- Both active-loop quickstarts contain show, skill, plan, `loop next`, and
  concise-pack steps in deterministic order.
- Contributor guidance matches `git ls-files .mdkg/index` and `.gitignore`,
  including the tracked SQLite exception and ignored transient files.
- Test guidance names all six current families and maps the compiled and root
  MJS execution paths without claiming command tests are deferred.
- Whole-file equality is not required for audience-specific wrappers.

# Results / Evidence

Attach root/public semantic check output, Git tracking receipt, and test-family
inventory to a test-proof checkpoint.

# Notes / Follow-ups

- Public seed skill currentness remains owned by `root:task-805`.
