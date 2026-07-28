---
id: task-53
type: task
title: Freeze the clean Demo 4 baseline and event authority
status: backlog
priority: 1
epic: epic-9
parent: goal-9
prev: task-52
next: task-54
tags: [ai-native-sdlc, presentation-demo, phase-9, step-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/event-preflight.json, artifacts/demo-004/sendoff.md, artifacts/demo-004/event-allowlist.json, artifacts/demo-004/event-authority-policy.json, artifacts/demo-004/preparation-baseline-handoff.json, artifacts/demo-004/event-writer-lease.json, artifacts/demo-004/fallback-readiness.json, artifacts/demo-004/event-authority.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-9, epic-9, prd-1, edd-1, dec-4, dec-5, task-52, goal-5, chk-17]
context_refs: [goal-9, epic-9, prd-1, edd-1, dec-4, dec-5, task-52, goal-5, chk-17]
evidence_refs: [task-52, chk-17]
aliases: [phase-9-step-5]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Freeze Demo 4's preparation baseline, preflight, prospective authority,
writer lease, and fallback under a fresh human approval boundary.

# Acceptance Criteria

- Require a clean, reviewed preparation manifest and separate
  baseline-publication handoff; unrelated ahead history is a blocker.
- Verify warm dependencies, build-once validation, fast production verifier,
  Git/fetch access, both existing provider projects, and Demo 2 live/offline
  fallback.
- Freeze one authoritative sendoff, exact allowlist, prospective range policy,
  one designated harness, two/one repair limits,
  T+24/T+29:15/T+29:30/T+30 cutoffs, and non-overlapping
  writer/integration leases.
- Bind the logical orchestrator and child-implementation roles to the same
  designated physical timed writer/lease, with explicit yield to and release
  from the root integration owner before read-only verification resumes.
- Obtain explicit human acceptance of `event-authority.json`. It binds every
  current hash, clean pre-publication origin, expected preparation tree, and
  activation rule, but does not invent the future published baseline SHA or
  future event range. Goal 10 binds the actual baseline after publication and
  calculates the actual event range immediately before its later push.
- Inventory exact Goal 9/10 test/status/event/checkpoint/index/bundle/
  projection paths plus task-59 publication/activation and Goal 10 dispatch/
  timing/blocker/reveal/closeout receipts as local-evidence-only exceptions.
  They may change locally after acceptance, are excluded from the preparation
  manifest and every timed push, and may not alter any bound functional,
  source, sendoff, allowlist, child-run, or interface hash. Freeze the
  disjoint exact Demo 4 child-run/canonical staged allowlist separately. Any
  correction to a bound hash invalidates authority and requires fresh human
  acceptance.
- Demo 3 authority is not reusable.

# Files Affected

- Program-local Demo 4 evidence and the exact accepted preparation surfaces.
- No Demo 4 implementation, Git publication, or provider mutation.

# Implementation Notes

- The preparation baseline is published only by root-integration-owned
  task-59 under separate publication authority and before `P0` and timed `T0`.

# Test Plan

Hash-check every contract, prove owner/lease consistency and sub-30-second
fallback, and fail closed on base/origin/access drift.

# Links / Artifacts

- task-52
- dec-5
- chk-17
