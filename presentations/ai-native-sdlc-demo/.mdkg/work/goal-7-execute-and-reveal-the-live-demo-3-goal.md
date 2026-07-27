---
id: goal-7
type: goal
title: Execute and reveal the live Demo 3 goal
status: backlog
priority: 1
goal_state: paused
goal_condition: The specialized Demo 3 child goal is achieved, approved commits are pushed non-force to origin/main, both existing production deployments are READY for the same final SHA, /demo/3/ and /demo/3/output/ pass the frozen contract, the integration owner refreshes and verifies the private program bundle, and a public-safe receipt proves Plan -> Work -> Evidence plus what completed, why, and what comes next. Showing Demo 2 after a hard blocker does not achieve Goal 7.
scope_refs: [epic-7]
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [Demo 3 child goal and local evidence, canonical site build route claim accessibility privacy and zero-JavaScript gates, Git allowlist fetch zero-behind commit and non-force push, both production projects READY for exact SHA, live detail and output routes, program bundle and root projection verification, fallback honesty and public receipt]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-7]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/demo-003-event-receipt, artifact://ai-native-sdlc-demo/demo-003-blocker-receipt]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, spike-1, goal-6]
evidence_refs: []
aliases: [live-demo-3-execution-and-reveal]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Execute and reveal the live Demo 3 goal under the accepted program requirements, ownership model, and authority boundary.

# End Condition

The specialized Demo 3 child goal is achieved, approved commits are pushed non-force to origin/main, both existing production deployments are READY for the same final SHA, /demo/3/ and /demo/3/output/ pass the frozen contract, the integration owner refreshes and verifies the private program bundle, and a public-safe receipt proves Plan -> Work -> Evidence plus what completed, why, and what comes next. Showing Demo 2 after a hard blocker does not achieve Goal 7.

# Activation Conditions

Goal 6 has an accepted readiness checkpoint and the event quiet window is active with the frozen allowlist and baseline still valid.

# Non-Goals

- No force, published-history reset, manual deployment, DNS, Vercel project configuration, analytics, tags, npm publication, or paths outside the allowlist.
- No second implementation or publication writer in the program graph. The Demo 3 child owns the work topology and evidence, its implementation writer owns pre-publication source work, and the root integration owner exclusively claims and executes the child's publish node for staging, commits, and push after a lease handoff.

# Recursive Algorithm

1. Re-read this goal, its accepted design context, predecessor evidence, and current writer lease.
2. Use goal next and a concise pack to select the first unfinished scoped node.
3. Complete one node at a time in the declared prev/next chain.
4. Run the node-specific and goal-level checks; record compact public-safe evidence.
5. Stop on authority, ownership, scope, safety, or prerequisite drift.
6. Evaluate the goal and close only when the end condition is fully evidenced.

# Required Skills

- select-work-and-ground-context
- build-pack-and-execute-task
- pursue-mdkg-goal
- verify-close-and-checkpoint

# Required Checks

- Demo 3 child goal and local evidence
- canonical site build route claim accessibility privacy and zero-JavaScript gates
- Git allowlist fetch zero-behind commit and non-force push
- both production projects READY for exact SHA
- live detail and output routes
- program bundle and root projection verification
- fallback honesty and public receipt

# Acceptance Criteria

- Sendoff requires continuation through achieved child goal, non-force push, exact-SHA READY deployments, and passing public routes.
- The child goal executes exactly: positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint.
- At most three bounded fix-forward attempts and twenty minutes follow the first production failure.
- Origin advancement, force or unrelated integration, missing access, provider outage at the bound, provider/DNS mutation, out-of-scope changes, or unrepaired safety failures are hard blockers.
- Demo 3 is revealed only after independent proof; otherwise Demo 2 is shown transparently and Demo 3 remains unachieved.
- The reveal shows reusable source, specialized goal, output, Plan -> Work -> Evidence, and what/why/next without teaching graph mechanics.
- The reusable source is `examples/website-demo-template/.mdkg/:goal-1`; the executed specification is `runs/demo-003/.mdkg/:goal-1`.
- Program tasks 35–39 mirror and independently inspect child receipts read-only; they never repeat child source, Git, or provider mutations.
- The child implementation writer and root integration owner never mutate concurrently: accepted canonical-site evidence releases the implementation lease, the integration owner performs the child publish node, then exact-SHA/live verification is read-only.

# Sendoff Contract

> Continue until the specialized goal is achieved, the approved commit is non-force pushed to `origin/main`, both production deployments for that exact SHA are READY, and the public detail and output URLs pass verification. Do not stop at a local build or commit. Fix transient in-scope failures forward. Stop only for an enumerated hard blocker.

Authorized actions are restricted to the frozen allowlist plus `runs/demo-003/`, local validation and production-safe smoke tests, bounded in-scope fix-forward work, an integration-owner-only non-force `origin/main` push through the child publish node, read-only inspection of existing Vercel deployments and public URLs, and integration-owner bundle refresh and verification.

Hard blockers are origin advancement after final preflight; a push requiring force, history rewrite, or unrelated integration; unavailable credentials or provider access; provider outage or unresolved production failure beyond three attempts or twenty minutes; or any need for DNS, project configuration, manual redeploy, analytics, package publication, or out-of-scope source changes.

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

- 2026-07-26: Created as phase 7 of the AI-native SDLC presentation and live-demo program.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
