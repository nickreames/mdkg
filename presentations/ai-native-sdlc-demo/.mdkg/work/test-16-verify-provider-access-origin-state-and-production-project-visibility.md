---
id: test-16
type: test
title: Verify provider access origin state and production project visibility
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: test-15
next: test-17
tags: [ai-native-sdlc, presentation-demo, phase-6, step-12]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/provider-origin-verification.json]
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
updated: 2026-07-26
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

- Demo 3 source identity, specialized contrast, graph validation, routing, and concise pack pass.
- No child implementation node has executed.
- Git, dependencies, provider read access, and both project identities are visible without storing credentials.
- Current base equals current origin, no unrelated ahead history exists, and
  `event-authority.json` contains a valid prospective range-validation policy.
  Future event commits must be linear descendants; the actual range and stable
  range hash are calculated and proven against that policy immediately before
  push.
- Sendoff text, allowlist, attempt/time bound, hard blockers, quiet window, and fallback are sealed.
- The expected preparation manifest excludes the exact local-evidence-only
  Goal 6/7 inventory, including task-58 and timed umbrella receipts; those
  paths are permitted to change locally but are never staged in the
  preparation or timed publication ranges. The child-run/canonical
  publication inventory is disjoint and exact.
- Dry rehearsal creates no implementation, commit, push, deployment, or provider change.
- This test specifically proves: Verify provider access origin state and production project visibility.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Write `artifacts/demo-003/provider-origin-verification.json` with pass/fail per
case, exact redacted observations, base/origin equality, authority-policy hash,
provider/project identity, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-17 until the required result is evidenced.
