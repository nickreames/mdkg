---
id: test-10
type: test
title: Verify Demo 2 child local segment build and public safety
status: done
priority: 1
epic: epic-4
parent: goal-4
prev: task-20
next: test-11
tags: [ai-native-sdlc, presentation-demo, phase-4, step-8]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-20]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-20]
evidence_refs: []
aliases: [phase-4-step-8]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [child_local_segment_complete, publication_next, static_build, zero_client_javascript, accessibility, public_safety, asset_budget]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Validate the Demo 2 child local-through-canonical segment, local build, and
public safety as step 8 of Goal 4. A passing result must include exact commands
or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-4
- epic-4
- task-20

# Preconditions / Environment

- Goal 4 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Fork receipt preserves IDs and binds the exact source hash.
- The specialized graph validates, routes correctly, and differs visibly from the source.
- Child positioning, implementation, local test, integration, and
  canonical-site test are done; the child remains unachieved and its untouched
  publish task is next.
- The local output is static, zero-JavaScript, accessible, noindex/unlisted, public-safe, responsive, and within budgets.
- Adapter routes work locally and candidate/fallback hashes and receipts verify.
- No Git or provider side effect occurred.
- This test specifically proves: Verify Demo 2 child graph completion local build and public safety.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Passed with one explicit pre-Demo-2 test-drift follow-up on 2026-07-27.

- The fork receipt preserves `goal-1` and binds source snapshot
  `sha256:06397e1a338bfb855c40fba65f8daaaf4f56f0a3aec669d3253886a7ed243c2c`.
- The specialized child graph indexed and validated with zero warnings and zero
  errors.
- Child `spike-1`, `task-1`, `test-1`, `task-2`, and `test-2` are done. The
  child is paused and unachieved; read-only `goal next goal-1 --json`
  deterministically selects untouched backlog `task-3`.
- The run-local and canonical Astro builds pass. Both canonical routes are
  unlisted, noindexed, static, semantic, responsive, and under 39 KiB initial
  local transfer.
- Built route output has zero generated JavaScript files, client directives,
  Astro islands, remote fonts, forms, trackers, third-party runtime assets, or
  raster assets. The detail route's sole script block is non-executable JSON-LD.
- Browser checks pass for detail and output at desktop and mobile sizes with no
  horizontal overflow. Measured text contrast has a 4.66:1 minimum.
- The fallback manifest
  `sha256:79d969e3c4bf1d1949ade31adb4e6d04b3a486e09ad99a99becc827619952186`
  verifies all 17 listed files.
- `git diff --cached --name-only` is empty. No commit, push, provider
  inspection, deployment, live URL, or publication receipt exists.
- The existing `scripts/smoke-mdkg-dev.js` still contains a fixture sentinel
  asserting that reserved Demo 2 can never produce a route. It was run and
  failed at that exact assertion. Goal 4 intentionally creates Demo 2 and its
  frozen allowlist excludes scripts and fixtures, so the stale sentinel is
  recorded as test drift rather than bypassed or silently changed.

Evidence:

- `artifacts/demo-002/fork-receipt.json`
- `artifacts/demo-002/local-execution-receipt.json`
- `artifacts/demo-002/integration-receipt.json`
- `artifacts/demo-002/candidate-receipt.json`
- `artifacts/demo-002/fallback/manifest.sha256`
- `runs/demo-002/artifacts/local-validation.json`
- `runs/demo-002/artifacts/canonical-route-validation.json`

# Notes / Follow-ups

- The required local-through-canonical result is evidenced; advance to
  `test-11`.
- Route the stale base-smoke reservation through a later authorized
  test-maintenance change. It does not weaken the direct Demo 2 route proof.
