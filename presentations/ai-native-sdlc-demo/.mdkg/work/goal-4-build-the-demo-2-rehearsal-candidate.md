---
id: goal-4
type: goal
title: Build the Demo 2 rehearsal candidate
status: done
priority: 1
goal_state: achieved
goal_condition: Demo 2 has a source-hash-bound positioning brief, deterministic fork under runs/demo-002, complete operator bootstrap, specialized design and goal contracts, a locally accepted child goal paused with publication next, local adapter integration, passing static and public-safety gates, and a sealed candidate receipt plus deck-ready offline fallback, with no publication.
scope_refs: [epic-4]
last_active_node: test-11
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [predecessor and first-node pack coverage, fork receipt and preserved IDs, run graph validation goal routing and concise pack, child local-through-canonical lifecycle with publication next, local static Astro build, zero-JavaScript accessibility noindex claims secret and asset checks, local adapter route proof, deck-ready capture and fallback hash verification]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-4]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/goal-4-activation.json, artifacts/demo-002/positioning-brief.md, runs/demo-002/.mdkg/, artifacts/demo-002/local-execution-receipt.json, artifacts/demo-002/candidate-receipt.json, artifacts/demo-002/fallback/, artifacts/demo-002/reveal/source-vs-specialized-16x9.png]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2, chk-4, goal-3, chk-12, task-10, chk-13, chk-14]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2, chk-4, goal-3, chk-12, task-10, chk-13]
evidence_refs: [chk-4, chk-12, chk-13, chk-14]
aliases: [demo-2-rehearsal-candidate]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Objective

Build the Demo 2 rehearsal candidate under the accepted program requirements, ownership model, and authority boundary.

# End Condition

Demo 2 has a source-hash-bound positioning brief, deterministic fork under
runs/demo-002, complete operator bootstrap, specialized design and goal
contracts, a locally accepted child goal paused with publication next, local
adapter integration, passing static and public-safety gates, and a sealed
candidate receipt plus deck-ready offline fallback, with no publication.

# Activation Conditions

Goals 2 and 3 are achieved with accepted checkpoints `chk-4` and `chk-12`;
`chk-13` is accepted; the source graph, source-tree hash, operator manifest, and
Goal 2 contracts are pinned; `runs/demo-002` is absent; Demo ID 2 and both
routes are reserved; the Goal 3 baseline is locally integrated; and an
exclusive Goal 4 local allowlist is accepted. This activation grants no Demo 2
publication authority.

# Non-Goals

- No staging, commit, push, deployment inspection, public URL claim, DNS, provider mutation, analytics, tag, or package publication.

# Recursive Algorithm

1. Re-read this goal, `chk-4`, `chk-12`, `chk-13`, task-10, the accepted
   platform contracts, current Git ownership, and the writer lease.
2. Select the first unfinished node with
   `mdkg --root presentations/ai-native-sdlc-demo goal next goal-4 --json`.
3. Preview its execution handoff with
   `mdkg --root presentations/ai-native-sdlc-demo pack <node-id> --profile concise --depth 1 --edges context_refs,evidence_refs --skills auto --skills-depth full --dry-run --stats`.
4. Require the first-node preview to contain the selected node, goal-4,
   epic-4, PRD, EDD, all six decisions, goal-2, chk-4, goal-3, chk-12,
   task-10, chk-13, and all required skills without truncation.
5. Build the same pack without `--dry-run` and use it as the execution handoff.
6. Complete one node at a time in the declared prev/next chain.
7. Run node and goal checks, recording compact public-safe evidence.
8. Stop on authority, ownership, scope, safety, prerequisite, source-hash, or
   pack drift.
9. Evaluate and close only when the child is paused at the publication gate
   and every local end condition is evidenced.

# Required Skills

- select-work-and-ground-context
- build-pack-and-execute-task
- pursue-mdkg-goal
- verify-close-and-checkpoint

# Required Checks

- predecessor and first-node pack coverage
- fork receipt and preserved IDs
- run graph validation goal routing and concise pack
- child local-through-canonical lifecycle with publication next
- local static Astro build
- zero-JavaScript accessibility noindex claims secret and asset checks
- local adapter route proof
- deck-ready capture and fallback hash verification

# Acceptance Criteria

- Demo 2 remains an owned run graph and is not root-registered.
- The source is `examples/website-demo-template/.mdkg/` at canonical `goal-1`; the target is `runs/demo-002/.mdkg/` with preserved-but-specialized `goal-1`.
- The candidate receipt binds the source hash and shows the exact source `goal-1` versus specialized Demo 2 `goal-1` contrast.
- Specialized requirements, design, authority, goal condition, and tests visibly differ from the source while retaining traceability.
- The child goal completes positioning, implementation, local validation,
  integration, and canonical-site local validation, then is paused with its
  publish task next. It is not achieved in Goal 4.
- Local adapter integration exposes detail and output routes without publication.
- The sealed receipt records source hash, output hash, changed paths, checks,
  warnings, child publication-gate state, and fallback location.
- The fallback contains local desktop/mobile detail/output captures plus one
  intentionally composed 16:9 source-versus-specialized reveal image for later
  Goal 6 deck polish.

# Definition Of Done

- The goal condition is achieved without waived authority or safety gates.
- Every scoped actionable node is done with evidence.
- One milestone checkpoint records changed surfaces, checks, warnings, and the next activation.
- Evidence refs identify that checkpoint and any test, artifact, Git, deployment, or route receipts.

# Stop Conditions

- Required context, ownership, authority, or prerequisite evidence is missing.
- Work would touch paths or side effects outside this goal.
- A required validation or public-safety gate cannot be satisfied.
- The configured blocker threshold is reached without another authorized scoped lane.

# Current State

Pre-activation hardening is accepted in `chk-13`. Keep paused until the user
explicitly approves and activates the local Demo 2 run.

# Iteration Log

- 2026-07-26: Created as phase 4 of the AI-native SDLC presentation and live-demo program.
- 2026-07-27: Clarified predecessor packs, child publication-gate lifecycle,
  deck-ready evidence, and the separate Demo 2 publication authority.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- chk-4
- chk-12
- chk-13
