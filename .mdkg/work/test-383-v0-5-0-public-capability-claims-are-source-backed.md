---
id: test-383
type: test
title: v0.5.0 public capability claims are source backed
status: todo
priority: 1
epic: epic-229
tags: [release, claims, evidence, capabilities]
owners: []
links: []
artifacts: []
relates: [goal-62, task-710]
blocked_by: [task-710]
blocks: []
refs: [task-710]
context_refs: [goal-61, goal-62, epic-229, edd-71, dec-68, dec-73, test-400]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Ensure every candidate v0.5.0 public capability claim is supported by completed
source, test, CLI, package, or dogfood evidence.

# Target / Scope

`task-710`; commands, metadata, seeds, compatibility, limitations, and boundaries.

# Preconditions / Environment

Completed Goal 1 checkpoint, passing clean-baseline `test-400`, and current
built/package inspection outputs.

# Test Cases

- Trace each claim to evidence and classify unsupported claims Missing.
- Confirm all seven seeds and loop commands, readiness, provenance, continuation,
  evidence, closeout, and observational read/dry-run claims match shipped proof.
- Confirm public copy candidates exclude runtime/model/sandbox/scanner and
  self-healing or autonomous-execution claims.
- Reconcile inventory with packaged help, generated CLI reference, and seed
  payload.
- Confirm `read-only audit` distinguishes functional source immutability from
  allowed mdkg evidence and follow-up writes.

# Results / Evidence

Pending Goal 1 and `task-710`.

# Notes / Follow-ups

- Missing claims cannot enter final copy.
