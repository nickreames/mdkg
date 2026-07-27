---
id: goal-5
type: goal
title: Publish and rehearse Demo 2
status: backlog
priority: 1
goal_state: paused
goal_condition: The accepted Demo 2 candidate is published by an allowlisted non-force origin/main push, both existing production deployments are READY for the exact final SHA, /demo/2/ and /demo/2/output/ pass desktop/mobile static, visibility, accessibility, claim, and privacy gates, the full talk rehearses within 35 minutes, and Demo 2 is sealed as an immutable public-safe fallback.
scope_refs: [epic-5]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [Git ownership staged paths fetch and zero-behind preflight, approved logical commit and non-force push receipt, both Vercel production projects READY for exact SHA, desktop and mobile live route checks, noindex accessibility zero-JavaScript claim secret and budget checks, 30-32 minute rehearsal with 35-minute hard stop, fallback reproducibility]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-5]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/demo-002-production-receipt, artifact://ai-native-sdlc-demo/demo-002-golden-fallback]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4]
evidence_refs: []
aliases: [demo-2-publication-and-rehearsal]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Publish and rehearse Demo 2 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

The accepted Demo 2 candidate is published by an allowlisted non-force origin/main push, both existing production deployments are READY for the exact final SHA, /demo/2/ and /demo/2/output/ pass desktop/mobile static, visibility, accessibility, claim, and privacy gates, the full talk rehearses within 35 minutes, and Demo 2 is sealed as an immutable public-safe fallback.

# Activation Conditions

Goal 4 has an accepted candidate checkpoint and the integration owner grants an exclusive Demo 2 publication window with an exact path allowlist.

# Non-Goals

- No manual Vercel deployment or project configuration, DNS, analytics, tag, npm publication, force push, or history rewrite.

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

- Git ownership staged paths fetch and zero-behind preflight
- approved logical commit and non-force push receipt
- both Vercel production projects READY for exact SHA
- desktop and mobile live route checks
- noindex accessibility zero-JavaScript claim secret and budget checks
- 30-32 minute rehearsal with 35-minute hard stop
- fallback reproducibility

# Acceptance Criteria

- Both production projects and both demo routes bind to the same final pushed SHA.
- No unrelated path enters the commit or push.
- Only the root integration owner stages, commits, and pushes the accepted Goal 2 platform, Goal 3 deck, and Goal 4 Demo 2 surfaces.
- The rehearsal proves kickoff, narrative, reveal, recovery, CTA, and fallback.
- Fallback receipts contain hashes, deployment IDs, route captures, deck version, and limitations.
- The sealed fallback can be shown without provider mutation.

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

- 2026-07-26: Created as phase 5 of the AI-native SDLC presentation and live-demo program.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
