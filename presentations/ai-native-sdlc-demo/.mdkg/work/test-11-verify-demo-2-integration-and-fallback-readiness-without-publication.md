---
id: test-11
type: test
title: Verify Demo 2 integration and fallback readiness without publication
status: done
priority: 1
epic: epic-4
parent: goal-4
prev: test-10
tags: [ai-native-sdlc, presentation-demo, phase-4, step-9]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-10]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-10]
evidence_refs: []
aliases: [phase-4-step-9]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [adapter_routes, source_specialized_contrast, publication_gate_pause, fallback_hash, offline_capture, deck_ready_capture, no_publication]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Validate verify demo 2 integration and fallback readiness without publication as step 9 of Goal 4. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-4
- epic-4
- test-10

# Preconditions / Environment

- Goal 4 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Fork receipt preserves IDs and binds the exact source hash.
- The specialized graph validates, routes correctly, and differs visibly from the source.
- The local output is static, zero-JavaScript, accessible, noindex/unlisted, public-safe, responsive, and within budgets.
- Adapter routes work locally and candidate/fallback hashes and receipts verify.
- Child `goal-1` is paused with publish next, remains unachieved, and has no
  publication, deployment, live-URL, or accepted-checkpoint evidence.
- The 16:9 comparison and four desktop/mobile route captures are present,
  hash-bound, public-safe, and suitable inputs to Goal 6 final deck polish.
- No Git or provider side effect occurred.
- This test specifically proves: Verify Demo 2 integration and fallback readiness without publication.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Passed on 2026-07-27.

- Fork provenance, deterministic operator materialization, specialization,
  local execution, canonical integration, and the sealed candidate all resolve
  through hash-bound receipts.
- Program and child graphs index and validate with zero warnings and zero
  errors.
- The child `goal-1` is `goal_state: paused`, remains unachieved, and routes
  next to untouched backlog publication `task-3`. `task-3`, `test-3`, and the
  later accepted checkpoint have no Goal 4 execution or evidence.
- Candidate receipt copies match exactly at
  `sha256:0a4f6f09d1a5d9221c90fb0f278ee40f55b7b4f2b6681586b086ec839e465e82`.
- Fallback manifest
  `sha256:79d969e3c4bf1d1949ade31adb4e6d04b3a486e09ad99a99becc827619952186`
  verifies all 17 stable-path-ordered files. Both fallback routes reproduce
  locally at 1280 x 720 with their CSS and image assets complete and zero
  client scripts.
- The reveal inventory is complete and hash-bound:
  - detail desktop: 1280 x 720,
    `sha256:b8edf76beaf8663f060dd0817cf57aae8772ce377e76da93afad3db6efdc5e4e`
  - detail mobile: 390 x 720,
    `sha256:9341f502c1be5ed49bc924450536d6bd2ae9dde3bd92a02a552a54b57c582139`
  - output desktop: 1280 x 720,
    `sha256:efcb74ac0d385278bb8071c2d16a640d7008779c51377d9fef7111ff5ea83933`
  - output mobile: 390 x 720,
    `sha256:21de49ca9d094ec2a1ed34fa8d93c04521d728a20aa2c79eeb9602345967b8bc`
  - source-versus-specialized reveal: 1600 x 900,
    `sha256:0a1fb5d99741a7cd14df28f0596ab4cf34e6026826615bfab0b5446cd70edd0c`
- Full-size inspection confirmed the 16:9 visual shows the reusable goal,
  specialized goal, Plan -> Work -> Evidence, what completed, why, and what
  comes next, plus an explicit “local candidate · not published” label.
- `git diff --check` passes and the Git index is empty. Dirty paths remain
  confined to the Goal 4 activation allowlist. Root bundles, root mdkg state,
  commits, pushes, deployments, providers, and public URLs were not touched.
- The one retained warning is test drift: the older base smoke still forbids
  every reserved Demo 2 route. The direct Demo 2 static, visibility, browser,
  accessibility, budget, and fallback checks all pass, and the frozen Goal 4
  allowlist intentionally forbids modifying that script or fixture.

Evidence:

- `artifacts/demo-002/candidate-receipt.json`
- `artifacts/demo-002/fallback/README.md`
- `artifacts/demo-002/fallback/manifest.sha256`
- `artifacts/demo-002/reveal/`
- `runs/demo-002/artifacts/canonical-route-validation.json`

# Notes / Follow-ups

- Goal 4 may advance to its accepted local-only checkpoint and closeout.
- Goal 5 must obtain a fresh human publication approval before it may claim
  child `task-3`, stage, commit, push, or inspect providers.
- A later authorized test-maintenance change should replace the stale
  pre-Demo-2 base-smoke sentinel with assertions for the now-real unlisted
  Demo 2 route contract.
