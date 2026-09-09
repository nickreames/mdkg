---
id: chk-590
type: checkpoint
title: Verify installed v2 MCP reads and cache-backend parity
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-mcp-read-parity.json]
relates: [goal-83, goal-84]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Installed v2 CLI/MCP reads preserve identities, authored work and Git staging
across stale, fresh and absent caches. Same-graph JSON/SQLite semantic parity
passes. This milestone does not close bug-7, Goal 83 or publication readiness.

# Scope Covered

Bug-7 under the approved Goal83/84 local qualification contract. Selected Goal73
and canonical identity/runtime state remain unchanged.

## Changed Surfaces

scripts/smoke-mcp.js, this checkpoint, bug-7/Goal84 narratives, the hash-bound
MCP-read artifact and required index projections. No shipped runtime change.

## Boundaries

Synthetic disposable parent/child graphs, local Git, installed package and stdio
MCP only. No canonical migration, bundle refresh, lock takeover, provider action,
remote Git, consumer writes or publication. No raw operational payloads stored.

# Decisions Captured

No new policy accepted. Legacy-writer adoption, config-less public transport and
safe killed-writer recovery remain unresolved; continuation is not approval.

# Implementation Summary

The existing manifest-backed MCP smoke retains legacy coverage and adds migrated
v2 fixtures for both index backends. Staged then unstaged task content verifies
current authored reads. A same-graph backend switch compares semantic responses
without assigning or changing identities. Read-only calls are hash-bookended.

# Test Proof

- Ten scenarios per runtime: two backends each with stale, warm, absent and
  permission-read-only absent caches, plus switched-backend equivalence.
- CLI show/search/list/validate and all eight MCP tools pass. Stable references
  and parent/child pack identities survive. Mutation-shaped MCP calls refuse.
- All file bytes, modes, directory inventory, Git index and unknown user notes
  remain unchanged during reads. Read-only mode enforcement is checked, then
  original fixture permissions are restored.
- POSIX permissions are not a mounted read-only filesystem test. Work/archive,
  private migration rehearsal, scale and remaining installed families stay open.

# Verification / Testing

## Command Evidence

Installed smoke:mcp passes on Node 24.15.0, 24.18.0 and 26.0.0 using the same
intermediate candidate SHA-256
5d72db2d486ab187eef8da487abd519e31700e6e41bb7420a18850216d3eba05.
All 222 installed regular files except npm-normalized package.json match current
repository bytes. This is not the final 0.6.0 seal.

Fresh npm test builds successfully and passes 1341 tests with no failures/skips.
CLI parity, documentation parity (494 examples, zero failures), syntax and diff
checks pass. Full graph validation passes with three preserved bundle-age
warnings; changed-only validation has no errors and SQLite reports fresh caches.
Six owned temporary fixture/install/cache trees were removed after preserving
compact diagnostics; no canonical or unknown paths were deleted.

## Pass / Fail Status

Installed MCP/cache-read milestone verified; overall NOT_READY.

## Known Warnings

Protected imported bundles remain intentionally stale. No bundle refresh or
security waiver is inferred from passing local tests.

# Known Issues / Follow-ups

Old-client compatibility, safe killed-writer recovery and bug-17 remain open.
Complete the remaining installed families, independent remediation security
review, release guidance, full coverage ladder and exact artifact seal.

## Follow-up Refs

bug-7, bug-17, task-826, task-827, task-828, task-829, task-830, goal-83, goal-84.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-mcp-read-parity.json; local diagnostics under
/private/tmp/mdkg-mcp-qualification.RFDM6E. No remote evidence asserted.

# Raw Content Safety

Synthetic case summaries, source/package hashes and validation digests only.
Existing goal-pursuit, pack-first and checkpoint skills reused. Candidates none.
