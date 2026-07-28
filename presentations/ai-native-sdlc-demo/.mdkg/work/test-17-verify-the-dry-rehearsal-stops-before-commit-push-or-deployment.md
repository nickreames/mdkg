---
id: test-17
type: test
title: Verify the dry rehearsal stops before commit push or deployment
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: test-16
tags: [ai-native-sdlc, presentation-demo, phase-6, step-13]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/dry-rehearsal-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-16]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-16]
evidence_refs: []
aliases: [phase-6-step-13]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [preauthorization_complete, no_mid_run_approval_gap, no_implementation, no_stage, no_commit, no_push, no_deploy, fallback_ready]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate the pre-authorized dry workflow and prove it stops before commit,
push, or deployment as the final step 13 of Goal 6.

# Target / Scope

- goal-6
- epic-6
- test-16

# Preconditions / Environment

- Goal 6 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Demo 3 source identity, specialized contrast, graph validation, routing, and concise pack pass.
- No child implementation node has executed.
- Git, dependencies, provider read access, and both project identities are visible without storing credentials.
- Sendoff text, allowlist, attempt/time bound, hard blockers, quiet window, and fallback are sealed.
- Dry rehearsal creates no implementation, commit, push, deployment, or provider change.
- The frozen authority covers the full future happy path without another
  approval prompt, while each invalidation condition produces a hard blocker.
- Later Goal 6/7 test/status/event/checkpoint/index/bundle/projection and
  publication/activation/umbrella receipt writes match the exact
  local-evidence-only inventory, remain excluded from future Git staging, and
  do not change a bound functional hash. Child-run/canonical staged paths are
  disjoint and remain unchanged until their authorized child nodes.
- The rehearsal proves the T+24/T+29:15/T+29:30/T+30 cutoffs, at most two
  pre-publication repairs, at most one production repair, one designated
  harness, and truthful Demo 2 selection.
- No implementation, staging, commit, push, deployment, provider mutation, or
  bundle refresh occurs.
- This test specifically proves: Verify the dry rehearsal stops before commit push or deployment.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Write `artifacts/demo-003/dry-rehearsal-verification.json` with pass/fail per
case, before/after identities, authority consistency, deadline/retry
assertions, fallback timing, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to goal closeout until the required result is evidenced.
