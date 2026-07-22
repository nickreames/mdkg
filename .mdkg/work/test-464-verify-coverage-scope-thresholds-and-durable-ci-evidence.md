---
id: test-464
type: test
title: verify coverage scope thresholds and durable CI evidence
status: backlog
priority: 1
tags: [audit-followup, coverage, ci, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-804]
blocked_by: [task-804]
blocks: []
refs: [loop-7, spike-32, test-461, chk-541, chk-542, task-804]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Prove the complete coverage contract created by `root:task-804` is enforced
locally and in the checked-in release workflow.

# Target / Scope

- package coverage command, all TS and MJS test families
- Node threshold behavior and V8 artifact output
- release-readiness workflow and publish ladder inclusion

# Preconditions / Environment

- `root:task-804` is done.
- Node 24.16 or the current supported 24.x runtime.
- Dedicated ignored coverage output and temporary negative fixtures.

# Test Cases

- The coverage command reports 676 tests with zero failures and includes both
  root MJS paths.
- Lines below 89%, branches below 77%, or functions below 96% independently
  fail the command.
- V8 JSON and a concise summary are produced, uploadable, and untracked.
- CI and prepublish definitions both invoke the gate.
- Removing an MJS path, threshold flag, or workflow artifact step makes a
  focused contract test fail.

# Results / Evidence

Attach the summary, threshold-negative cases, artifact inventory, workflow
contract receipt, and final Git boundary to a test-proof checkpoint.

# Notes / Follow-ups

- Provider execution remains a separate authority; source and local receipts
  do not claim a remote run.
