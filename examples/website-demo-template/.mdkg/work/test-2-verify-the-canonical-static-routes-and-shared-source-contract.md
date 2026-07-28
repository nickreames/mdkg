---
id: test-2
type: test
title: Verify the canonical static routes and shared-source contract
status: backlog
priority: 1
epic: epic-1
parent: goal-1
prev: task-2
next: task-3
tags: [demo, integration, canonical-validation, static]
owners: []
links: []
artifacts: [artifacts/canonical-route-validation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2, task-2, chk-3]
evidence_refs: [task-2]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [caller lease identity matches., exact integration paths match the lease., canonical site builds once., shared-output checks run serially., bound detail and output routes exist., routes remain noindex and unlisted., portable output uses a thin static wrapper., semantic accessibility and ocean flow requirements pass., zero client javascript scripts remote fonts forms trackers and third-party runtime assets pass., source-to-execution plan-work-evidence what-why-next quickstart and feedback proof pass., transfer and raster budgets pass., no secret or unsupported claim is present., no git push deployment or provider action occurs.]
created: 2026-07-28
updated: 2026-07-28
---
# Overview

Verify that caller-authorized canonical integration is exact, static,
public-safe, and ready for a separate publication authority decision.

# Target / Scope

- `task-2`
- bound canonical detail and output routes
- thin adapter, registry, data record, and portable output

# Preconditions / Environment

- `task-2` receipt and caller lease identities resolve.
- Warm dependencies are already available.

# Test Cases

- Build canonical output exactly once.
- Run every check that consumes the shared generated output serially.
- Verify bound routes, noindex/unlisted behavior, semantic HTML, keyboard
  behavior, reduced motion, WCAG AA contrast, transfer/raster budgets, and
  zero client JavaScript/runtime scripts/remote assets.
- Verify source-versus-execution proof, Plan → Work → Evidence, what/why/next,
  quickstart, feedback CTA, and source-backed claims.
- Verify no path outside the caller lease changed and no Git/provider side
  effect occurred.

# Results / Evidence

Write `artifacts/canonical-route-validation.json` with one build receipt,
ordered serial checks, route/output hashes, allowlist comparison, public-safety
results, and next QID.

# Notes / Follow-ups

- On pass, continue to `task-3`; this test grants no publication authority.
