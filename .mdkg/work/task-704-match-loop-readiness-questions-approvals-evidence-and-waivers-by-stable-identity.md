---
id: task-704
type: task
title: Match loop readiness questions approvals evidence and waivers by stable identity
status: done
priority: 1
epic: epic-226
prev: task-703
next: task-705
tags: [loop, readiness, approvals, evidence]
owners: []
links: []
artifacts: []
relates: [goal-61, test-377]
blocked_by: []
blocks: [task-705]
refs: [test-377]
context_refs: [goal-61, epic-226, edd-70, dec-67, edd-69]
evidence_refs: [chk-410]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Replace aggregate readiness shortcuts with stable per-requirement matching for
pre-run questions, approval-gated actions, evidence lanes, and waivers.

# Acceptance Criteria

- Each requirement has a stable identity surfaced in JSON and diagnostics.
- Decisions answer only referenced questions; approvals authorize only matching
  actions; evidence completes only matching lanes.
- A waiver requires typed decision rationale and applicable approval evidence.
- Invalid, missing, duplicate, or wrong-kind refs fail clearly.

# Files Affected

List files/directories expected to change.

- Loop metadata parsing/validation and readiness projection
- Default/seed loop templates and focused tests where schema changes require it

# Implementation Notes

- Preserve additive compatibility for existing loop metadata when unambiguous.
- Do not treat non-empty ref arrays as blanket authorization.

# Test Plan

Run the positive and negative matrix in `test-377`, including unrelated refs and
partially satisfied loops.

# Links / Artifacts

- `edd-70`
- `dec-67`
- Evidence: canonical `identity=ref` bindings now map questions, gated actions,
  evidence lanes, and paired waiver rationale/approval independently.
- Compatibility: legacy aggregate refs satisfy only a single unambiguous
  requirement; optional unrequested gated actions no longer block readiness.
- Verification: focused parser, graph, and loop suites passed 45/45 on
  2026-07-10.
