---
id: test-406
type: test
title: Upgrade reference and version facts remain generated gated and truthful
status: todo
priority: 1
epic: epic-239
tags: [release, test, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-738, task-739]
blocks: [test-407]
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-63, goal-64, epic-239, dec-74, prop-8, task-738, task-739]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prove upgrade prose, release facts, generated reference, and version metadata do
not outrun package or registry truth.

# Target / Scope

`task-738` and `task-739`; install/upgrade surfaces, changelog/release notes,
generated CLI reference, package versions, draft/preview output, and examples.

# Preconditions / Environment

Root package at 0.4.2, manifest draft, generated docs clean, and draft plus
active-preview site outputs.

# Test Cases

- Package and public structured version remain 0.4.2 throughout Goal 63.
- Draft output contains no v0.5.0 availability claim or dormant release facts.
- Active preview labels v0.5.0 as a target Pre-v1 public alpha release without
  claiming npm availability.
- Upgrade guidance lives in existing install surfaces and links correctly.
- Version facts live in existing changelog/release-note surfaces.
- CLI matrix/reference regeneration is clean and descriptor-backed.
- Every public command parses against live help; no hand-authored drift remains.
- Existing MANIFEST/SPEC and goal command/reference behavior remains unchanged.

# Results / Evidence

Pending Goal 63 implementation.

# Notes / Follow-ups

- Goal 64 owns the 0.5.0 bump and finalized availability language.
- Generated files must be produced only by canonical scripts.
