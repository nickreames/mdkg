---
id: test-377
type: test
title: Loop readiness refs satisfy only matching questions actions and lanes
status: done
priority: 1
epic: epic-226
tags: [loop, readiness, refs, approvals]
owners: []
links: []
artifacts: []
relates: [goal-61, task-704]
blocked_by: []
blocks: []
refs: [task-704]
context_refs: [goal-61, epic-226, edd-70, dec-67]
evidence_refs: [chk-410]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prevent one unrelated decision, approval, evidence ref, or waiver from making an
entire loop appear ready or complete.

# Target / Scope

`task-704`; readiness identities, typed refs, validation, and JSON projection.

# Preconditions / Environment

Fixtures with multiple required/optional questions, actions, lanes, and waivers.

# Test Cases

- Satisfy each requirement independently and prove all others remain pending.
- Exercise missing, duplicate, unrelated, and wrong-kind refs.
- Require both rationale decision and applicable approval for a waiver.
- Verify additive compatibility for valid existing metadata.

# Results / Evidence

PASS on 2026-07-10. Multi-question, multi-action, and multi-evidence fixtures
proved that extra aggregate refs do not satisfy unrelated identities. Optional
unrequested provider work remained non-blocking. Waivers failed without paired
accepted decision and verified approval evidence, then passed when both typed
bindings were present. Parser and graph diagnostics covered malformed, missing,
wrong-kind, incomplete, and conflicting metadata.

# Notes / Follow-ups

- False readiness is release-blocking.
