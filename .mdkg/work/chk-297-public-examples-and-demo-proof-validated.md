---
id: chk-297
type: checkpoint
title: public examples and demo proof validated
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-604]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-604]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Public examples and deterministic demo proof were validated with the current
local CLI build. `npm run smoke:demo-graph` exercised the demo graphs and
proved the launch claims are backed by bounded, repeatable examples.

# Scope Covered

Scope is `task-604`: validate public examples and deterministic demo proof.

## Changed Surfaces

- `examples/demo-agentic-coding`
- `examples/template-mdkg-dev`
- demo graph smoke coverage

## Boundaries

- in scope: local examples and deterministic demo smoke.
- out of scope: demo subdomain deployment, Vercel production promotion, DNS,
  analytics, npm publish, and git tag.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Demo proof stays command-driven and bounded; no public demo hosting is
  promoted in this task.

# Implementation Summary

The smoke validates example graph health, indexing, goal selection, search,
pack statistics, capability search, read-only subgraph verification, and
high-risk marker absence.

# Test Proof

- Test target: public examples and deterministic demo graph behavior.
- Fixtures or temp repos: example workspaces under `examples/`.
- Coverage gaps: no hosted demo subdomain verification in this task.

# Verification / Testing

## Command Evidence

- command: `npm run smoke:demo-graph`
- result: passed.

## Pass / Fail Status

- status: pass for local deterministic demo proof.

## Known Warnings

- warning: public hosted demo proof remains out of scope unless separately
  approved.

# Known Issues / Follow-ups

- preserve bounded public-safe receipts when linking demo claims.

## Follow-up Refs

- `test-309`
- `task-605`
- `goal-42`

# Links / Artifacts

- `examples/`
- `scripts/`
- `docs/`

# Raw Content Safety

- Summarized command receipts only; no raw secrets, raw prompts, raw payloads,
  or bulky logs are stored here.
