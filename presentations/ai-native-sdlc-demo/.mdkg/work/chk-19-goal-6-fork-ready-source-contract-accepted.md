---
id: chk-19
type: checkpoint
title: Goal 6 fork-ready source contract accepted
checkpoint_kind: handoff
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-6, pre-activation, handoff]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/private-bundle]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, spike-6, task-47, test-25, task-28, task-29, goal-7, goal-9, goal-10, chk-18, prd-1, edd-1, dec-3, dec-4, dec-5]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-5, chk-17, goal-6, chk-18, goal-7, goal-9, goal-10]
evidence_refs: [chk-17, chk-18, test-12, test-13, test-14]
aliases: [goal-6-fork-ready-source-contract]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
scope: []
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Goal 6 is aligned around source-first iteration. It will promote reusable Demo
2 lessons into a semantic source release, prove two materially distinct
zero-manual-edit forks, and only then create a bound, sealed, unexecuted Demo
3. The child may execute a separately activated authority but may not author
or expand it.

# Scope Covered

This checkpoint records a pre-activation mdkg contract only. It is
context/evidence and never actionable goal scope.

## Changed Surfaces

- Program PRD and EDD
- Decisions 2 through 5
- Goal 6, Epic 6, and the existing 13-node Goal 6 chain
- Goal 7 execution boundary
- Goal 9 source-improvement and Demo 4 preparation boundary
- Goal 10 live-event boundary
- Nested generated indexes/events and the root-owned private projection

## Boundaries

- in scope: nested mdkg/operator planning surfaces and the root read-only
  program projection
- out of scope: source-template implementation, bootstrap code, Demo 3 or Demo
  4 creation, deck/site/docs/package changes, activation, staging, push,
  deployment, or provider mutation

# Decisions Captured

- `dec-3`: exact authored-content fork plus immutable binding preserves
  creative latitude through a positioning decision artifact
- `dec-4`: source owner, binding owner, child writer, external authority owner,
  and root integration owner remain distinct
- `dec-5`: authority binds the immutable child seal and remains external to the
  writable run

# Implementation Summary

The execution model is now:

`semantic source release + immutable run binding -> exact authored-content
child + interface receipt + immutable child-contract seal`

The source owns the complete generic positioning-to-production topology,
static-output constraints, root-explicit operator flow, receipt contracts, and
closure rules. The binding owns Demo ID, routes, component key, bounded
positioning brief, designated harness, timing profile, and receipt
destinations. The child owns normal statuses, decisions, evidence, outputs,
events, checkpoints, indexes, and packs. Human approval, leases, allowlists,
baseline state, provider access, and validity windows remain externally owned.

Demo 3 and Demo 4 may not be patched after materialization. Reusable defects
return to the source; run-specific inputs return to the binding; either change
requires recreating an absent target.

# Verification / Testing

## Command Evidence

- nested changed-only validation: pass, zero warnings/errors
- heading-format dry run: pass, zero changes
- `git diff --check`: pass
- full nested validation: pass, zero warnings/errors
- nested doctor: pass, zero warnings/errors and no selected goal
- Goal 6 routing: paused `goal-6` selects `spike-6`; the preserved 13-node
  chain is symmetric from `spike-6` through `test-17`
- no loop work node exists
- concise first-node pack: 57 nodes, 12,546 estimated tokens, `chk-19` and all
  required designs/predecessor evidence/skills included, no dropped node
- standard full-skill execution pack: 57 nodes, 71,447 estimated tokens, no
  dropped node
- private bundle, projection, and root verification remain the final
  integration gate before the second local commit

## Contract Review

- Goal 6 remains paused with first node `spike-6`
- The existing 13-node chain and IDs are preserved
- No loop node is introduced
- Goal 7 can execute but cannot repair immutable source/binding/seal drift
- Goal 9 must improve the source before creating Demo 4
- Goal 10 consumes a fresh Demo-4-specific external authority

# Known Issues / Follow-ups

- Goal 6 execution still requires explicit acceptance of `spike-6` findings
  and exact source mutation allowlist before `task-47`.
- This checkpoint authorizes planning readiness only. It does not activate Goal
  6, change the source template, create Demo 3, grant Git/provider authority,
  or authorize a push.
- The repository remains ahead of `origin/main`; Goal 6 must recheck the live
  base, ownership, and quiet window before any shared-source work.
- Pre-existing untracked Demo 2 pack files remain unrelated and must not be
  staged or absorbed.

# Links / Artifacts

- predecessor readiness: `chk-18`
- next activation, only after user direction:
  `mdkg --root presentations/ai-native-sdlc-demo goal activate goal-6 --json`
- private projection:
  `.mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip`
- no push, deployment, provider action, or child-run creation
