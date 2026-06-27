---
id: chk-299
type: checkpoint
title: public demo contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-309]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-309]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The public examples and deterministic demo contract passed. The demo smoke
validated the examples and launch-support claims with bounded local checks.

# Scope Covered

Scope is `test-309`: prove public examples and deterministic demos support the
launch claims.

## Changed Surfaces

- test evidence for `test-309`
- example/demo smoke coverage

## Boundaries

- in scope: local public examples and demo graph contract.
- out of scope: hosted demo subdomains, production promotion, DNS, analytics,
  npm publish, and git tag.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Demo readiness is proven by deterministic local smoke here; hosted demo
  promotion remains a separate approval boundary.

# Implementation Summary

`npm run smoke:demo-graph` passed. It validates examples, deterministic
first-success path behavior, bounded pack stats, capability search, read-only
subgraphs, and no high-risk markers.

# Test Proof

- Test target: `task-604`, examples, and demo graph smoke.
- Fixtures or temp repos: local `examples/` workspaces.
- Coverage gaps: no hosted demo verification.

# Verification / Testing

## Command Evidence

- command: `npm run smoke:demo-graph`
- result: passed.

## Pass / Fail Status

- status: pass for local demo contract.

## Known Warnings

- warning: demo subdomain deployment remains out of scope without explicit
  approval.

# Known Issues / Follow-ups

- preserve bounded, public-safe demo receipts for final launch closeout.

## Follow-up Refs

- `task-604`
- `task-605`
- `goal-42`

# Links / Artifacts

- `test-309`
- `examples/`
- `scripts/`

# Raw Content Safety

- Summarized command receipts only; no raw secrets, raw prompts, raw payloads,
  or bulky logs are stored here.
