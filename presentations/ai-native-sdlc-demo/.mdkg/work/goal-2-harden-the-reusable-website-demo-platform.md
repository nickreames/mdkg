---
id: goal-2
type: goal
title: Harden the reusable website-demo platform
status: progress
priority: 1
goal_state: active
goal_condition: The reusable demo platform is locally implemented and verified with a static-Astro zero-client-JavaScript contract, per-demo records and output components, route and sitemap controls, source-versus-specialized goal evidence, deterministic fork and operator materialization, rehearsal/event sendoff contracts, and integrated build, accessibility, claims, privacy, asset, and startup proof, with no publication.
scope_refs: [epic-2]
active_node: spike-2
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [accepted read-only drift and proposed-allowlist receipt, accepted shared-source mutation lease before task-5, static Astro and zero-JavaScript build checks, mdkg-dev route sitemap and demo-specific smoke checks, accessibility claim secret and asset-budget checks, deterministic fork and operator bootstrap, context-complete concise and standard packs]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-2]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-platform/activation-contract.json, artifacts/demo-platform/drift-audit.md, artifacts/demo-platform/proposed-source-allowlist.json, artifacts/demo-platform/goal-2-activation-receipt.json, artifacts/demo-platform/interface-contract.json, artifacts/demo-platform/validation-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-1, chk-1, chk-2, chk-3]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-1, chk-1, chk-2, chk-3]
evidence_refs: [chk-2, chk-3]
aliases: [reusable-website-demo-platform-hardening]
skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Harden the reusable website-demo platform under the accepted program requirements, ownership model, and authority boundary.

# End Condition

The reusable demo platform is locally implemented and verified with a static-Astro zero-client-JavaScript contract, per-demo records and output components, route and sitemap controls, source-versus-specialized goal evidence, deterministic fork and operator materialization, rehearsal/event sendoff contracts, and integrated build, accessibility, claims, privacy, asset, and startup proof, with no publication.

# Activation Conditions

Goal 2 has two deliberately separate gates.

## Discovery gate

Goal 1 is achieved, `chk-1` and the private root projection verify, and one program-orchestrator writer owns this nested graph. Goal 2 may then be activated only to claim and complete `spike-2`. During the spike, root/source paths are read-only; writes are limited to this program graph and `artifacts/demo-platform/`.

## Mutation gate

Before `task-5` starts, `spike-2` is done with an accepted `drift-audit.md` and `proposed-source-allowlist.json`. The root integration owner then records and accepts `goal-2-activation-receipt.json` with:

- `goalQid`, `checkpointQid`, accepted program bundle hash, and spike evidence hashes;
- clean `baseCommitSha`, branch/upstream, full dirty and staged path inventory, and inventory SHA-256;
- program orchestrator, shared-source writer, and root integration owner identities;
- exact repo-relative read-only and mutable paths, allowed operations, owners, reasons, and expected base hashes;
- explicit forbidden paths including `examples/demo-runs/demo-001/**`, `mdkg-dev/public/demo-001/**`, unrelated `src/**`, `tests/**`, `docs/**`, package/lockfiles, deployment, and provider configuration;
- quiet-window start, expiry, release condition, and invalidation conditions.

Any base, path, hash, owner, lease, or parallel-writer drift invalidates the receipt and returns execution to the discovery/preflight boundary.

# Non-Goals

- No root bundle refresh, staging, commit, push, deployment, DNS, provider mutation, analytics, tag, or package publication during ordinary Goal 2 execution.
- No work outside the frozen Goal 2 source allowlist.
- No mutation of `examples/demo-runs/demo-001/**` or `mdkg-dev/public/demo-001/**`; Demo 1 regression means the built canonical mdkg.dev routes.

# Recursive Algorithm

1. Re-read this goal, its accepted design context, predecessor evidence, and the applicable discovery or mutation receipt.
2. Use explicit goal QID `root:goal-2`; do not treat selected-goal state as authority.
3. Preview a context-complete pack with `mdkg pack <work-id> --profile concise --depth 1 --edges parent,epic,relates,blocked_by,blocks,prev,next,context_refs,evidence_refs --skills auto --skills-depth full --dry-run --stats`.
4. Build the execution pack with the same edges and `--profile standard`; it must include full PRD, EDD, decision, predecessor, and required-skill bodies.
5. Complete one node at a time in the declared prev/next chain. Do not claim `task-5` until the mutation gate passes.
6. Run the node-specific and goal-level checks; record compact public-safe evidence.
7. Stop on authority, ownership, scope, safety, or prerequisite drift.
8. Evaluate the goal and close only when the end condition is fully evidenced.

# Required Skills

- select-work-and-ground-context
- pursue-mdkg-goal
- build-pack-and-execute-task
- verify-close-and-checkpoint

# Required Checks

- accepted read-only drift and proposed-allowlist receipt
- accepted shared-source mutation lease before task-5
- static Astro and zero-JavaScript build checks
- mdkg-dev route sitemap and demo-specific smoke checks
- accessibility claim secret and asset-budget checks
- deterministic fork and operator bootstrap
- context-complete concise and standard packs

# Acceptance Criteria

- Static Astro build and detail/output routes pass without client directives or generated JavaScript.
- Per-demo listed and noindex controls fail closed and unlisted demos stay out of navigation and sitemap.
- Source and specialized goals remain distinguishable and sanitized.
- Output-component selection is deterministic by demo ID.
- Fork plus operator and skill materialization validates reproducibly from an absent or empty target.
- A fresh agent can recover the complete execution contract from the prescribed explicit-edge standard pack.

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

Discovery accepted at chk-3. Shared-source implementation remains forbidden
until the root integration owner commits the discovery milestone, refreshes the
private projection, and accepts the typed mutation receipt.

# Iteration Log

- 2026-07-26: Created as phase 2 of the AI-native SDLC presentation and live-demo program.
- 2026-07-26: Split read-only discovery from shared-source mutation; added explicit pack, owner, allowlist, lease, historical Demo 1, bootstrap, and evidence contracts.
- 2026-07-26: Completed spike-2 and accepted the static-Astro recommendation at chk-3; task-5 remains behind the mutation gate.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
