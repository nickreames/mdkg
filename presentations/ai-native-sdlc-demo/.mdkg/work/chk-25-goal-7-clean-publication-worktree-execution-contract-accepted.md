---
id: chk-25
type: checkpoint
title: Goal 7 clean publication-worktree execution contract accepted
checkpoint_kind: audit
status: done
priority: 9
tags: [ai-native-sdlc, presentation-demo, phase-7, pre-activation, publication-worktree]
owners: [program-orchestrator]
links: []
artifacts: []
relates: [task-58]
blocked_by: []
blocks: []
refs: [goal-7, epic-7, task-58, goal-6, chk-24, dec-4, dec-5]
context_refs: [goal-6, chk-24, dec-4, dec-5]
evidence_refs: [chk-24, test-17]
aliases: []
skills: []
scope: [task-58]
created: 2026-07-28
updated: 2026-07-28
---
# Summary

Accepted the local pre-activation execution contract that makes Task 58
fresh-agent safe. Goal 7 now distinguishes the intentionally divergent private
control checkout from the clean publication worktree, treats an already
published preparation baseline idempotently, proves the complete range rather
than only staged paths, and keeps exact and pattern-based local evidence out of
every publication range.

Goal 7 remains paused and Task 58 remains `todo`. No timed Demo 3 work began.

# Scope Covered

- task-58: clean publication-worktree and idempotent-baseline algorithm
- goal-7: activation, required-check, pack, and publication boundaries
- epic-7: milestone and risk alignment

## Changed Surfaces

- `goal-7`, `epic-7`, and `task-58`
- this accepted local checkpoint
- generated nested mdkg indexes refreshed for validation

## Boundaries

- in scope: local mdkg work nodes, checkpoint, generated nested indexes, and a
  temporary bounded pack under `/private/tmp`
- out of scope: authority policy, event authority, sendoff, allowlist, run
  binding, child seal, source template, Demo 3 implementation, canonical site,
  Git commit/push, deployment, provider mutation, bundle, and root projection
- raw secrets, raw prompts, raw provider payloads, credentials, and bulky
  execution traces excluded

# Decisions Captured

- The control checkout owns private orchestration evidence and is forbidden
  from publishing.
- A distinct clean publication worktree is the only preparation
  staging/commit/push surface.
- If live origin already equals the accepted preparation baseline, Task 58
  verifies and reuses it without another commit or push.
- Publication safety is evaluated over the complete candidate range with both
  exact-manifest equality and an empty exclusion intersection.
- The 32 exact plus seven checkpoint conflicts are regression expectations;
  current policy and Git state are always recalculated.
- Task 58 uses a depth-one standard full-body pack; later timed nodes retain
  concise packs.

# Implementation Summary

Task 58 now defines an eleven-step deterministic worktree algorithm, cache
handling, origin-drift recovery, idempotent reuse, receipt fields, role
separation, and complete-range assertions. Goal 7 and Epic 7 repeat the
critical ownership and success boundaries so a fresh agent cannot infer that
the private control checkout should be merged, rebased, repaired, or pushed.

# Audit Findings

- Reviewed surfaces: Goal 7, Epic 7, Task 58, authority-policy exclusion
  inventory, preparation handoff, local control Git state, clean publication
  worktree state, and bounded execution pack.
- Findings: the control checkout is clean but intentionally `18 ahead / 3
  behind`; the publication worktree is clean and `0 ahead / 0 behind` at
  `7a90d13920aa98732fc3ddf12c7af8bfd4db59a9`.
- Findings: the historic control range contains 32 exact excluded paths plus
  seven Goal 6 checkpoint paths matched by policy.
- Residual risk: Task 58 must still independently verify live origin, the
  approved baseline, both worktree descriptors, receipt bindings, and lease
  release when it executes.

# Verification / Testing

## Command Evidence

- command: nested `mdkg index` followed by full nested `mdkg validate --json`
- result: pass, zero warnings, zero errors
- command: depth-one standard Task 58 pack with
  `parent,epic,context_refs,evidence_refs`, automatic skills, and full skill
  bodies
- result: pass; 18 nodes, approximately 33,000 estimated tokens, no
  truncation
- command: inspect pack for the deterministic algorithm, control-checkout
  prohibition, idempotency, complete-range assertions, 32-path regression,
  and bounded-pack instruction
- result: all required contracts present verbatim
- command: `git diff --check`
- result: pass

## Pass / Fail Status

- status: accepted local pre-activation contract

## Known Warnings

- warning: no unresolved graph or pack warning
- warning: the control checkout's divergence is intentional private history,
  not publication readiness and not a repair target for Task 58

# Known Issues / Follow-ups

- Task 58 has not executed its baseline/authority receipts or released the
  preparation writer lease.
- Goal 7 must remain paused until the user separately authorizes execution.

## Follow-up Refs

- task-58
- goal-7
- task-34

# Links / Artifacts

- `task-58`
- `goal-7`
- `epic-7`
- `chk-24`
- `test-17`
- `artifacts/demo-003/event-authority-policy.json`
- `artifacts/demo-003/preparation-baseline-handoff.json`
- temporary verification pack:
  `/private/tmp/ai-native-task58-bounded.md`

# Raw Content Safety

- Evidence is summarized through refs, hashes, counts, and public-safe command
  results. No secrets, raw prompts, provider payloads, or bulky traces are
  stored.
