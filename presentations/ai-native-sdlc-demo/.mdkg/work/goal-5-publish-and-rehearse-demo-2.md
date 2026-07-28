---
id: goal-5
type: goal
title: Publish and rehearse Demo 2
status: backlog
priority: 1
goal_state: paused
goal_condition: After a separate human-accepted publication receipt approves the complete push range and allowlist, the paused Demo 2 child goal is resumed and achieved, its accepted candidate is published by a non-force origin/main push, both existing production deployments are READY for the exact final SHA, /demo/2/ and /demo/2/output/ pass desktop/mobile static, visibility, accessibility, claim, and privacy gates, the full talk rehearses within 35 minutes, and Demo 2 is sealed as an immutable public-safe fallback.
scope_refs: [epic-5]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [separate human Demo 2 publication approval, complete origin/main-to-HEAD push-range review, Git ownership staged paths fetch and zero-behind preflight, resumed and achieved Demo 2 child goal, approved logical commit and non-force push receipt, both Vercel production projects READY for exact SHA, desktop and mobile live route checks, noindex accessibility zero-JavaScript claim secret and budget checks, 30-32 minute rehearsal with 35-minute hard stop, fallback reproducibility]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/publication-approval.json, artifact://ai-native-sdlc-demo/demo-002-production-receipt, artifact://ai-native-sdlc-demo/demo-002-golden-fallback]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-13]
evidence_refs: [chk-13]
aliases: [demo-2-publication-and-rehearsal]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Publish and rehearse Demo 2 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

After a separate human-accepted publication receipt approves the complete push
range and allowlist, the paused Demo 2 child goal is resumed and achieved, its
accepted candidate is published by a non-force `origin/main` push, both
existing production deployments are READY for the exact final SHA, both Demo 2
routes pass, the full talk rehearses within 35 minutes, and Demo 2 is sealed as
an immutable public-safe fallback.

# Activation Conditions

Goal 4 has an accepted candidate checkpoint; its child goal is paused with the
publish task next; and the user separately accepts
`artifacts/demo-002/publication-approval.json`, which binds the complete
fetched `origin/main..HEAD` push range, exact path allowlist, owner, validity
window, and forbidden actions. The integration owner then grants the exclusive
Demo 2 publication window.

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
- separate human Demo 2 publication approval
- complete origin/main-to-HEAD push-range review
- resumed and achieved Demo 2 child goal
- approved logical commit and non-force push receipt
- both Vercel production projects READY for exact SHA
- desktop and mobile live route checks
- noindex accessibility zero-JavaScript claim secret and budget checks
- 30-32 minute rehearsal with 35-minute hard stop
- fallback reproducibility

# Acceptance Criteria

- Both production projects and both demo routes bind to the same final pushed SHA.
- No unrelated path enters the commit or push.
- Only the root integration owner stages, commits, and pushes. Every commit
  already ahead of fetched `origin/main`, every newly planned commit, and every
  changed path must appear in the human-accepted publication receipt; approval
  of newly staged Demo 2 files alone is insufficient.
- Goal 5 resumes the same Demo 2 child `goal-1`, executes its publish and
  exact-SHA/live-URL nodes through their named owners, creates its accepted
  child checkpoint, and only then marks the child achieved.
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
- 2026-07-27: Added separate Demo 2 publication approval, complete push-range
  review, and child-goal resume/achievement semantics.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
