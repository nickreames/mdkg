---
id: test-466
type: test
title: verify startup contributor and test guidance matches repository contracts
status: backlog
priority: 3
parent: goal-78
prev: task-806
tags: [audit-followup, harness, docs, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-806]
blocked_by: [task-806]
blocks: []
refs: [goal-78, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-89, test-465, task-806]
context_refs: [goal-78, loop-7, chk-544, dec-89, test-465, task-806]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint, pursue-mdkg-loop]
cases: [active_loop_ordering, tracked_index_contract, test_family_contract]
created: 2026-07-17
updated: 2026-07-26
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
- `root:test-465` has proven the final public skill projection semantics.
- Use the current repository and one disposable initialized agent fixture.

# Test Cases

- Root, public source, built public source, and disposable initialized
  quickstarts contain show, skill, plan, `loop next`, concise pack,
  answer/gate, and authorized execution steps in deterministic order.
- `git ls-files .mdkg/index` includes the tracked SQLite database;
  `.gitignore` covers transient forms but not that tracked file; contributor
  guidance states the exception and forbids blanket cleanup.
- Dynamic test-family discovery matches documented command, core, graph, pack,
  util, and root-MJS execution paths without claiming CLI tests are deferred.
- Each case fails independently when its owned semantic contract is removed.
- Whole-file equality is not required for audience-specific wrappers.

# Results / Evidence

Attach startup-order output for all four surfaces, Git tracking/ignore receipt,
dynamic test-family inventory, focused negative cases, and final Git boundary
to a test-proof checkpoint.

# Notes / Follow-ups

- Public seed skill currentness remains owned by `root:task-805`.
- This focused guidance proof does not rerun `ci:release` or
  `prepublishOnly`; both are shared once at Goal 78 closeout.
