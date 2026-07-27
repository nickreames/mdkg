---
id: goal-6
type: goal
title: Freeze event readiness and prepare Demo 3
status: backlog
priority: 1
goal_state: paused
goal_condition: Rehearsal findings are applied, deck and demo interfaces are frozen, runs/demo-003 is forked and specialized without implementation execution, its child chain and public-safe pack are verified, Git and provider read access are preflighted, the sendoff and exact allowlist are sealed, the quiet window is reserved, Demo 2 remains ready, and a dry rehearsal stops before side effects.
scope_refs: [epic-6]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [frozen deck and interface hashes, Demo 3 fork identity validation and concise pack, read-only Git dependency and Vercel preflight, sendoff allowlist and hard-blocker review, Demo 2 fallback recheck, dry event rehearsal with no implementation commit push or deploy]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-6]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/demo-003-readiness, artifact://ai-native-sdlc-demo/live-sendoff, artifact://ai-native-sdlc-demo/event-writer-lease]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, spike-1, goal-5]
evidence_refs: []
aliases: [demo-3-event-readiness]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Freeze event readiness and prepare Demo 3 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

Rehearsal findings are applied, deck and demo interfaces are frozen, runs/demo-003 is forked and specialized without implementation execution, its child chain and public-safe pack are verified, Git and provider read access are preflighted, the sendoff and exact allowlist are sealed, the quiet window is reserved, Demo 2 remains ready, and a dry rehearsal stops before side effects.

# Activation Conditions

Goal 5 has an accepted rehearsal and immutable-fallback checkpoint.

# Non-Goals

- No Demo 3 implementation, commit, push, deployment, provider mutation, or canonical-site publication.

# Recursive Algorithm

1. Re-read this goal, its accepted design context, predecessor evidence, and current writer lease.
2. Use goal next and a concise pack to select the first unfinished scoped node.
3. Complete one node at a time in the declared prev/next chain.
4. Run the node-specific and goal-level checks; record compact public-safe evidence.
5. Stop on authority, ownership, scope, safety, or prerequisite drift.
6. Evaluate the goal and close only when the end condition is fully evidenced.

# Required Skills

- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- frozen deck and interface hashes
- Demo 3 fork identity validation and concise pack
- read-only Git dependency and Vercel preflight
- sendoff allowlist and hard-blocker review
- Demo 2 fallback recheck
- dry event rehearsal with no implementation commit push or deploy

# Acceptance Criteria

- Demo 3 is specialized but its implementation work has not started.
- The source is `examples/website-demo-template/.mdkg/` at canonical `goal-1`; the target is `runs/demo-003/.mdkg/` with preserved-but-specialized `goal-1`.
- Readiness evidence renders the source and specialized `goal-1` side by side without exposing graph-fork mechanics in the audience narrative.
- The child goal exposes the complete positioning-to-production chain and contains no secrets or private refs.
- The exact continue-until prompt, three-attempt/twenty-minute repair bound, forbidden surfaces, and evidence outputs are sealed.
- The integration-owner quiet window has a start, end, invalidation condition, and owner.
- Dry rehearsal proves the workflow without side effects.

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

Fully specified and paused. Do not execute until Activation Conditions are accepted.

# Iteration Log

- 2026-07-26: Created as phase 6 of the AI-native SDLC presentation and live-demo program.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
