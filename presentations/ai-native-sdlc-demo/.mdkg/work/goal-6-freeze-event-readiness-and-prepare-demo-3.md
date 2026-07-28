---
id: goal-6
type: goal
title: Freeze event readiness and prepare Demo 3
status: backlog
priority: 1
goal_state: paused
goal_condition: Demo 2 production and rehearsal evidence is applied to a human-approved final deck, its execution and prompt evidence is evaluated, accepted source-template and sendoff refinements are verified by a clean deterministic bootstrap, runs/demo-003 is forked and specialized without implementation execution, its child chain and public-safe pack are verified, Git and provider read access are preflighted, the sendoff, exact allowlist, and separate human event pre-authorization are sealed, the quiet window is reserved, Demo 2 remains ready, and a dry rehearsal stops before side effects.
scope_refs: [epic-6]
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
required_checks: [production-evidence-backed final deck and human approval, Demo 2 source and prompt evaluation, accepted refinement or no-change receipt, clean deterministic source bootstrap and pack, Demo 3 fork identity validation and concise pack, read-only Git dependency and Vercel preflight, sendoff allowlist and separate human event pre-authorization, Demo 2 fallback recheck, dry event rehearsal with no implementation commit push or deploy]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/deck-freeze.json, artifacts/demo-003/source-prompt-evaluation.md, artifacts/demo-003/source-prompt-enhancement-receipt.json, artifacts/demo-003/event-authority.json, artifact://ai-native-sdlc-demo/demo-003-readiness, artifact://ai-native-sdlc-demo/live-sendoff, artifact://ai-native-sdlc-demo/event-writer-lease]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-3, chk-12, goal-5, chk-13]
evidence_refs: [chk-12, chk-13]
aliases: [demo-3-event-readiness]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Freeze event readiness and prepare Demo 3 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

Demo 2 production and rehearsal evidence is applied to a human-approved final
deck; its execution and prompt evidence is evaluated; accepted source-template
and sendoff refinements are verified by a clean deterministic bootstrap;
`runs/demo-003` is forked and specialized without implementation execution;
and the sendoff, allowlist, event pre-authorization, quiet window, fallback,
preflights, and dry rehearsal are sealed.

# Activation Conditions

Goal 5 has an accepted rehearsal and immutable-fallback checkpoint. Its
production screenshots, reveal image, child receipts, prompt observations,
timings, and golden fallback are available. Any template/sendoff mutation
recommended by spike-6 requires explicit user acceptance before task-47.

# Non-Goals

- No Demo 3 implementation, commit, push, deployment, provider mutation, or
  canonical-site publication.
- Goal 6 may apply only the exact source-template and sendoff refinements
  accepted after spike-6. It may not change mdkg CLI/package APIs, canonical
  site content, deployment configuration, docs, or unrelated source.

# Recursive Algorithm

1. Re-read this goal, the accepted Goal 3 baseline, Goal 5 checkpoint and
   receipts, current source/prompt hashes, and writer lease.
2. Use `goal next goal-6` and the explicit-edge concise/full-skill pack for
   each selected node.
3. Complete one node at a time in the 13-node prev/next chain.
4. Stop task-47 until the user explicitly accepts spike-6's recommendation.
5. Do not create Demo 3 until test-25 proves the accepted source and sendoff.
6. Seal `event-authority.json` through explicit human acceptance before Goal 6
   can close.
7. Run node and goal checks; record compact public-safe evidence.
8. Stop on authority, ownership, scope, safety, prerequisite, source, prompt,
   pack, Git, or provider drift.
9. Evaluate and close only when every end condition is evidenced.

# Required Skills

- select-work-and-ground-context
- build-pack-and-execute-task
- produce-powerpoint-with-artifact-tool
- verify-close-and-checkpoint

# Required Checks

- production-evidence-backed final deck and human approval
- Demo 2 source and prompt evaluation
- accepted refinement or no-change receipt
- clean deterministic source bootstrap and pack
- Demo 3 fork identity validation and concise pack
- read-only Git dependency and Vercel preflight
- sendoff allowlist and separate human event pre-authorization
- Demo 2 fallback recheck
- dry event rehearsal with no implementation commit push or deploy

# Acceptance Criteria

- Demo 3 is specialized but its implementation work has not started.
- Final deck changes are limited to evidence-backed Goal 5 findings and receive
  explicit human approval before their hashes are frozen.
- Demo 2's actual execution and prompt behavior is evaluated before Demo 3.
  The accepted source/prompt enhancement receipt records either bounded
  refinements or an explicit no-change result.
- A temporary absent-target bootstrap proves the exact source graph, operator
  manifest, skill projections, fresh-agent pack, and live-sendoff authority
  contract used for Demo 3; the temporary run is removed.
- The source is `examples/website-demo-template/.mdkg/` at canonical `goal-1`; the target is `runs/demo-003/.mdkg/` with preserved-but-specialized `goal-1`.
- Readiness evidence renders the source and specialized `goal-1` side by side without exposing graph-fork mechanics in the audience narrative.
- The child goal exposes the complete positioning-to-production chain and contains no secrets or private refs.
- The exact continue-until prompt, three-attempt/twenty-minute repair bound, forbidden surfaces, and evidence outputs are sealed.
- A separate human-accepted `event-authority.json` pre-authorizes every frozen
  in-scope live action and confirms that no additional mid-run approval is
  required while its hashes and quiet window remain valid.
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

Expanded and paused. Do not execute until Goal 5 is accepted.

# Iteration Log

- 2026-07-26: Created as phase 6 of the AI-native SDLC presentation and live-demo program.
- 2026-07-27: Added evidence-backed final polish, Demo 2 source/prompt
  refinement, deterministic pre-fork proof, and explicit live-run
  pre-authorization.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
