---
id: goal-5
type: goal
title: Publish and rehearse Demo 2
status: progress
priority: 1
goal_state: active
goal_condition: The accepted Demo 2 candidate has a green canonical smoke contract and bounded local commits; a separate human publication receipt approves the actual fetched origin/main..HEAD commit/path range; that exact range is normal-pushed without force; the same child goal is achieved; both existing production deployments are READY for the exact final SHA; /demo/2/ and /demo/2/output/ pass desktop/mobile static, visibility, accessibility, claim, and privacy gates; the full talk rehearses within 35 minutes; and Demo 2 is sealed as an immutable public-safe fallback.
scope_refs: [epic-5]
active_node: task-22
required_skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
required_checks: [accepted chk-14 candidate and green canonical Demo 2 smoke contract, exact local-integration allowlist and bounded local commits, separate human approval of the actual fetched push range, fetched zero-behind state immediately before normal push, resumed and achieved Demo 2 child goal, non-force push receipt, both Vercel production projects READY for exact SHA, desktop and mobile live route checks, noindex accessibility zero-JavaScript claim secret and budget checks, 30-32 minute rehearsal with 35-minute hard stop, fallback reproducibility]
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
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-13, chk-14, chk-15]
evidence_refs: [chk-14, chk-15]
aliases: [demo-2-publication-and-rehearsal]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Objective

Publish and rehearse Demo 2 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

The accepted candidate first passes the repaired canonical smoke contract and
is integrated into bounded local commits. A separate human-accepted receipt
then binds the actual fetched `origin/main..HEAD` commit/path range. That exact
range is normal-pushed without force; the paused Demo 2 child is resumed and
achieved; both existing production deployments are READY for the exact final
SHA; both Demo 2 routes pass; the full talk rehearses within 35 minutes; and
Demo 2 is sealed as an immutable public-safe fallback.

# Activation Conditions

Goal 4 is achieved at accepted `chk-14`; its child goal is paused with
publication `task-3` next; the Goal 5 pre-activation checkpoint is accepted;
and the user authorizes the local preparation phase plus an exclusive root
integration-owner window. This activation permits task-48, task-21, and
task-22 only. It does not authorize push or provider inspection.

Task-49 must separately freeze the actual post-commit, fetched
`origin/main..HEAD` range and obtain explicit human publication approval.
Only that still-valid receipt authorizes task-50's normal push and task-23/24's
read-only provider and public-URL inspections.

# Non-Goals

- No manual Vercel deployment or project configuration, DNS, analytics, tag, npm publication, force push, or history rewrite.

# Recursive Algorithm

1. Re-read this goal, `chk-14`, its accepted design context, child publication
   nodes, pre-activation checkpoint, and current writer lease.
2. Use `goal next goal-5`, preview coverage with `--profile concise`, and build
   the execution handoff with `--profile standard`; both use
   `--edges context_refs,evidence_refs --skills auto --skills-depth full
   --depth 1`.
3. Require both task-48 pack receipts to include task-48, goal-5, epic-5, PRD,
   EDD, decisions 1–6, goal-4, chk-13, chk-14, chk-15, test-10, test-11, and
   every required skill without node truncation. Require the standard pack to
   contain the full skill bodies; concise is selection/size preview only.
4. Complete one node at a time in the 12-node prev/next chain.
5. Stop task-49 for human approval after actual local commits and a fresh
   fetched push-range manifest. Do not infer approval from activation.
6. Run node and goal checks; record compact public-safe evidence.
7. Stop on authority, ownership, scope, safety, source, Git, provider, or
   prerequisite drift.
8. Evaluate and close only when the end condition is fully evidenced.

# Required Skills

- select-work-and-ground-context
- publish-static-demo-with-exact-sha
- verify-close-and-checkpoint

# Required Checks

- accepted chk-14 candidate and green canonical Demo 2 smoke contract
- exact local integration allowlist and bounded local commits without push
- separate human approval of the actual post-commit push range
- fetched zero-behind state immediately before normal push
- resumed and achieved Demo 2 child goal
- normal non-force push receipt
- both Vercel production projects READY for exact SHA
- desktop and mobile live route checks
- noindex accessibility zero-JavaScript claim secret and budget checks
- 30-32 minute rehearsal with 35-minute hard stop
- fallback reproducibility

# Acceptance Criteria

- Both production projects and both demo routes bind to the same final pushed SHA.
- No unrelated path enters the commit or push.
- The obsolete fixture-only Demo 2 smoke sentinel is replaced by a positive
  unlisted/noindexed Demo 2 contract before any local integration commit.
- Only the root integration owner stages, commits, and pushes. Local commits
  are completed before approval so every actual commit and changed path in
  fetched `origin/main..HEAD` appears in the human-accepted receipt; approval
  of “Demo 2” or newly staged files alone is insufficient.
- Approval and preflight receipts remain local evidence-only dirty exceptions,
  are never silently added to the approved range, and invalidate on drift.
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

Enhanced and paused at accepted `chk-15`. Do not execute until the user grants
local preparation authority and the exclusive writer window. Activation still
does not authorize publication.

# Iteration Log

- 2026-07-26: Created as phase 5 of the AI-native SDLC presentation and live-demo program.
- 2026-07-27: Added separate Demo 2 publication approval, complete push-range
  review, and child-goal resume/achievement semantics.
- 2026-07-27: Split local smoke repair and commits from exact-range approval
  and push, bound the accepted chk-14 evidence, and added the portable
  exact-SHA publication skill.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
