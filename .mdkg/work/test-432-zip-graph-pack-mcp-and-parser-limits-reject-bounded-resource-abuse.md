---
id: test-432
type: test
title: ZIP graph pack MCP and parser limits reject bounded resource abuse
status: done
priority: 1
epic: epic-244
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: [task-772, task-773]
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove resource and parser guards reject unsafe work before allocation, inflation,
recursive closure, body reads, response construction, or Git semantic changes.

# Target / Scope

`task-772` and `task-773`; nine finding IDs.

# Preconditions / Environment

Generated boundary fixtures in temporary roots and fake Git/MCP harnesses.

# Test Cases

- At-limit passes and limit+1 fails for ZIP entries/inflation, graph files/bytes,
  depth/nodes, body bytes, MCP lines/batches/responses, and duplicate IDs.
- Failure occurs before full read/traversal; peak work is bounded.
- Cycles, nested imports, repeated bodies, and quadratic alias/identity patterns are
  bounded deterministically.
- Option-like Git operands and prototype-colliding aliases fail with stable errors;
  valid inputs preserve behavior.

# Results / Evidence

Pending. Record boundary values, work counters, and structured errors.

# Notes / Follow-ups

- Avoid wall-clock-only assertions where deterministic counters can prove bounds.
