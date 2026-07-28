---
id: chk-18
type: checkpoint
title: Goal 6 thirty-minute Demo 3 rehearsal contract ready
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
refs: [goal-6, spike-6, goal-7, task-58, goal-9, goal-10, task-59, prd-1, edd-1, dec-5]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-5, chk-17, goal-6, goal-7, goal-9, goal-10]
evidence_refs: [chk-17, test-12, test-13, test-14]
aliases: [goal-6-timed-demo-3-contract-ready]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
scope: []
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Goal 6 is ready for activation as a deterministic, single-harness,
approximately 30-minute Demo 3 dress-rehearsal preparation workflow. Demo 3 is
now the measured test identity; fresh Demo 4 is reserved for the live event
after Goal 9's final evidence-backed polish.

# Scope Covered

This checkpoint records a pre-activation contract only; it is context/evidence,
never actionable goal scope.

## Changed Surfaces

- Program PRD, EDD, decisions 3/5/6, Goal 6/7 contracts and nodes, new paused
  Goals 9/10 and their complete chains, separate root-integration-owned
  pre-clock tasks 58/59, nested pack limit, generated nested indexes/events,
  and the root-owned private bundle/projection.

## Boundaries

- in scope: mdkg/operator planning surfaces and root read-only projection
- out of scope: Demo 3/Demo 4 run creation or execution, deck/source/site/docs/
  package changes, staging, commit, push, deployment, and provider mutation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes

# Decisions Captured

- `dec-3`: portable static Astro output and timed-run creative boundary
- `dec-5`: pre-P0/T0 published preparation baseline, prospective range policy,
  post-publication authority-activation receipt, explicit writer-lease
  handoff, two/one repairs, T+24/T+29:15/T+29:30/T+30 hard boundaries, and
  Demo 2 fallback
- `dec-6`: Demo 2/3/4 remain noindex and unlisted pending Goal 8

# Implementation Summary

Historical Demo 2 evidence showed that duplicated integration, builds, and
production verification—not reasoning time—made the serialized path roughly
51:44. Goal 6 now requires warm one-attempt dependencies, one portable
`DemoOutput.astro` plus thin wrapper, serial shared-output tests, build-once
validation, a prepared fast production verifier, deterministic receipts, and
per-stage timing. Comprehensive screenshots, audits, and bundle work move
after the reveal gate.

Root-integration-owned task-58 publishes and activates the approved Demo 3
preparation baseline before the clock, releases its lease, and then task-34
starts `P0`/`T0` and dispatches one harness. Goal 7 executes Demo 3 as the
timed dress rehearsal with a T+29:15 receipt and T+29:30 selection. Goal 9
consumes its evidence, applies only human-accepted final deck/source/sendoff
changes, and prepares fresh Demo 4. Task-59 repeats the pre-clock publication
boundary before Goal 10's live dispatch. Goal 8 remains the post-event
adoption lane.

# Handoff Summary

- Recipient/context: fresh Goal 6 execution agent in the nested program root
- Starting node or command:
  `mdkg --root presentations/ai-native-sdlc-demo goal activate goal-6 --json`
- First node: `spike-6`
- Explicit boundaries: Goal 6 may evaluate and prepare but must not execute
  Demo 3 or perform Git/provider publication

# Verification / Testing

## Command Evidence

- `mdkg --root presentations/ai-native-sdlc-demo validate --json`: pass, zero
  warnings/errors
- `mdkg --root presentations/ai-native-sdlc-demo doctor --json`: pass, zero
  warnings/errors and no selected goal
- Goal routing: Goal 6 -> `spike-6`; Goal 7 -> `task-58`; Goal 9 -> `spike-7`;
  Goal 10 -> `task-59`; all goals paused
- concise first-node dry run: 56 nodes, 12,154 estimated tokens, required
  designs/predecessors/checkpoints/tests/skills present
- standard full-skill execution dry run: 56 nodes, 66,923 estimated tokens,
  no dropped nodes; complete required skill bodies present
- private bundle pass A: 217 files, bundle
  `sha256:4348da02f740f93a5c751b815bcd374a7468ad644b82b326d45ba6355730ec2f`
- nested bundle verify, root projection refresh, root `subgraph verify --all`,
  and root `show` for Goals 6/9/10: pass

## Pass / Fail Status

- status: pass

## Known Warnings

- The current CLI resolves the global same-day "latest checkpoint" by
  lexicographic QID, so the pack metadata hint remains `chk-9`. The explicit
  traversal includes `chk-18`; changing unrelated checkpoint dates or mdkg CLI
  behavior is outside this pass. No nodes are truncated in the 80,000-token
  standard execution dry run.

# Known Issues / Follow-ups

- Goal 6 still requires explicit user acceptance after `spike-6` before any
  source/sendoff refinement.
- Goal 7 still requires separate preparation-baseline publication authority;
  this checkpoint does not authorize commit, push, or provider access.
- Current repository `HEAD` `8e3b42222ddfc4881d1418b821e3aa24ccfe916a`
  is three commits ahead of `origin/main`
  `f6af6410cf03ae222c4ee102844a678373b35d93`, and two pre-existing Demo 2
  pack files remain untracked. Goal 6 may execute its earlier planning nodes,
  but task-30 must fail closed until those surfaces receive a separate reviewed
  baseline disposition.

## Follow-up Refs

- goal-6, spike-6, goal-7, task-58, goal-9, goal-10, task-59

# Links / Artifacts

- private projection:
  `.mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip`
- no PR, commit, push, deployment, or provider action

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
