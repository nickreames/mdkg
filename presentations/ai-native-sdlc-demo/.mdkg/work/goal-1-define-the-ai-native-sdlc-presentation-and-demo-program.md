---
id: goal-1
type: goal
title: Define the AI-native SDLC presentation and demo program
status: done
priority: 1
goal_state: achieved
goal_condition: The mdkg-only authoring phase is complete with an accepted PRD, EDD, six decisions, eight fully scoped phase goals, deterministic routing, explicit artifact and authority contracts, passing nested validation and packs, a verified private root projection, root Remotion placeholders, and an accepted closeout checkpoint while product source, product docs, deck content, run graphs, deployments, staging, commits, and pushes remain unchanged.
scope_refs: [epic-1]
last_active_node: test-3
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [mdkg index, mdkg validate --json, mdkg goal next goal-1 --json, mdkg goal evaluate goal-1 --json, mdkg pack spike-1 --pack-profile concise --dry-run --stats, no loop nodes, private bundle and root projection verification]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-1]
owners: [program-orchestrator]
links: []
artifacts: [.mdkg/, artifact://ai-native-sdlc-demo/private-bundle, artifact://ai-native-sdlc-demo/root-registration-receipt]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, chk-1]
evidence_refs: [chk-1, test-1, test-2, test-3]
aliases: [ai-native-sdlc-program-definition]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Define the AI-native SDLC presentation and demo program under the accepted program requirements, ownership model, and authority boundary.

# End Condition

The mdkg-only authoring phase is complete with an accepted PRD, EDD, six decisions, eight fully scoped phase goals, deterministic routing, explicit artifact and authority contracts, passing nested validation and packs, a verified private root projection, root Remotion placeholders, and an accepted closeout checkpoint while product source, product docs, deck content, run graphs, deployments, staging, commits, and pushes remain unchanged.

# Activation Conditions

User-approved mdkg-only authoring is active. This nested writer may proceed independently; root registration and root Remotion writes require the root integration owner.

# Non-Goals

- No product source, product docs, deck, run graph, deployment, staging, commit, or push.
- No mutation of an active root writer's owned files.
- No activation of Goals 2–8.

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

- mdkg index
- mdkg validate --json
- mdkg goal next goal-1 --json
- mdkg goal evaluate goal-1 --json
- mdkg pack spike-1 --pack-profile concise --dry-run --stats
- no loop nodes
- private bundle and root projection verification

# Acceptance Criteria

- PRD, EDD, and exactly six accepted decisions are validation-clean.
- Goals 2–8 are fully scoped, paused, and have measurable activation, completion, checks, boundaries, and first work.
- Goal routing begins at spike-1 and each phase has a deterministic chain.
- No loop exists and no future source, deck, run, Git, or provider work is executed.
- Root registration and Remotion placeholders are completed only by the integration owner.
- The closeout checkpoint records IDs, base SHA, changed paths, checks, warnings, and the Goal 2 activation command.

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

Active mdkg-only authoring lane. No future phase is authorized.

# Iteration Log

- 2026-07-26: Created as phase 1 of the AI-native SDLC presentation and live-demo program.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Accepted checkpoint: chk-1.
- All eight scoped actionable nodes are done.
- Nested validation is zero-warning/zero-error; concise packs and deterministic routing pass; no loop is authored.
- Private explicit bundle and root alias `ai_native_sdlc_demo` verify read-only without `source_path`.
- Root Remotion research Goal 79 and implementation Goal 80 exist paused; Goal 80 has empty scope.
- Accepted base SHA: `2fdc15af544ac1931c106bd1b63536d537aafcf8`.
- Next activation command: `mdkg --root presentations/ai-native-sdlc-demo goal activate goal-2 --json`.
- No source, product documentation, deck, run, deployment, staging, commit, push, or provider mutation occurred.
