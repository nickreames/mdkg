---
id: test-383
type: test
title: v0.5.0 public capability claims are source backed
status: done
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

PASS on 2026-07-10.

- `task-710` traces every candidate public capability to parser/validation
  source, command descriptors, packaged CLI help, package metadata, seven seed
  files, release tests, or corrected dogfood.
- The inventory covers loop creation and command discovery, typed readiness,
  evidence and closeout, continuation routing, provenance drift, observational
  read/dry-run behavior, all seven seeds, compatibility, and runtime ownership.
- Installed-package and compatibility claims reconcile with `chk-426` and
  `test-382`; package availability remains Missing until Goal 64 publishes and
  verifies v0.5.0.
- `read-only audit` is explicitly bounded to no functional source changes while
  allowing mdkg findings, tasks, decisions, checkpoints, waivers, and evidence.
- Autonomous execution, self-healing, scanner, hosted-runtime, ROI, adoption,
  scale, superiority, and current v0.5.0 availability claims are classified
  Missing and excluded from downstream copy.
- Public examples must be purpose-built from the verified workflow and cannot
  copy private dogfood receipts.

# Notes / Follow-ups

- Missing claims cannot enter final copy.
- `task-711` may translate Known capabilities into intended value, but any
  Inferred value must remain qualified and cannot be promoted to measured proof.
