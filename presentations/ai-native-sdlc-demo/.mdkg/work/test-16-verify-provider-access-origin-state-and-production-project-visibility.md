---
id: test-16
type: test
title: Verify provider access origin state and production project visibility
status: done
priority: 1
epic: epic-6
parent: goal-6
prev: test-15
next: test-17
tags: [ai-native-sdlc, presentation-demo, phase-6, step-12]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/provider-readiness-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-15]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-15]
evidence_refs: []
aliases: [phase-6-step-12]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [git_access, origin_state, dependency_state, vercel_read_access, production_project_identity]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Validate provider access, origin/push-range state, production project
visibility, and pre-authorization currency as step 12 of Goal 6.

# Target / Scope

- goal-6
- epic-6
- test-15

# Preconditions / Environment

- Goal 6 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Demo 3 source-release, run-binding, child-seal, graph validation, routing,
  and concise-pack identities pass without authored child drift.
- No child implementation node has executed.
- Git, dependencies, provider read access, and both project identities are visible without storing credentials.
- The accepted old-origin base equals live `origin/main`; the local candidate
  is an ahead-only linear descendant with no unrelated history, and
  `event-authority.json` contains a valid prospective range-validation policy.
  Future event commits must be linear descendants; the actual range and stable
  range hash are calculated and proven against that policy immediately before
  push.
- Sendoff text, allowlist, attempt/time bound, hard blockers, quiet window, and fallback are sealed.
- Provider observations and human authority remain external to the child; no
  provider identifier, credential, approval, or lease is promoted into the
  reusable source or writable run binding.
- The expected preparation manifest excludes the exact local-evidence-only
  Goal 6/7 inventory, including task-58 and timed umbrella receipts; those
  paths are permitted to change locally but are never staged in the
  preparation or timed publication ranges. The child-run/canonical
  publication inventory is disjoint and exact.
- Dry rehearsal creates no implementation, commit, push, deployment, or provider change.
- This test specifically proves: Verify provider access origin state and production project visibility.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Write `artifacts/demo-003/provider-readiness-receipt.json` with pass/fail per
case, exact redacted observations, base/origin equality, authority-policy hash,
provider/project identity, warnings, and follow-up refs.

- Live `origin/main` remains the accepted old-origin base
  `f6af6410cf03ae222c4ee102844a678373b35d93`.
- Local candidate `4e95431c96da4b0a261fec3bab82fbe94a5dda87` is a
  linear 16-commit descendant with zero behind commits and no unrelated or
  unexplained history. Its current range patch SHA-256 is
  `ae83f1768ce3a0905464fe842cc2ebdf2fda6f48ca52b42037e838071bd75b4d`.
- Node `v26.0.0`, npm `11.12.1`, and every required top-level root, docs, and
  mdkg-dev package passed installed-tree checks without installation or build.
  A broad mdkg-dev tree reports optional transitive native-runtime artifacts
  as extraneous; this is recorded as a non-blocking warning because required
  dependency checks exit zero and the accepted one-attempt build receipt is
  unchanged.
- Read-only provider inspection confirmed both existing production deployments
  remain `READY` on `main` for the exact live-origin SHA. No raw provider
  payload, credential, creator identity, or secret is retained.
- Provider identities, accepted human authority, writer lease, and prospective
  publication policy remain external to the reusable source, run binding, and
  writable child.
- The receipt uses the exact `provider-readiness-receipt.json` filename frozen
  in the accepted local-evidence-only inventory. The corresponding readiness
  and dry-rehearsal receipt names were reconciled to that same frozen inventory
  without modifying the accepted authority payload or any functional hash.
- The final provider-readiness receipt SHA-256 is
  `93f25b2404534cd95c79c9704b44d55d341df0964a04aaed82708b0c84017889`.
- All five cases pass with zero blockers. Test 17 may begin.

# Notes / Follow-ups

- Do not advance to test-17 until the required result is evidenced.
