---
id: goal-8
type: goal
title: Evaluate and adopt results
status: backlog
priority: 2
goal_state: paused
goal_condition: Sanitized feedback and event evidence are reviewed, separate decisions classify Demo 2 and Demo 3 as promote, retain unlisted, or archive, evidence-backed canonical-site and SEO/LLM ideas are selected, the source claim map is updated before public copy, accepted changes are validated locally, and publication is explicitly deferred or handed to a separately authorized lane.
scope_refs: [epic-8]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [sanitized feedback and event-evidence review, separate retention decisions, source claim-map reconciliation, canonical build and route smokes, SEO LLM metadata robots sitemap navigation and accessibility, fresh publication-authority handoff]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-8]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/adoption/sanitized-feedback.md, artifacts/adoption/demo-comparison.md, artifact://ai-native-sdlc-demo/adoption-decisions, artifact://ai-native-sdlc-demo/publication-handoff]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-7]
evidence_refs: []
aliases: [post-demo-evaluation-and-adoption]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Evaluate and adopt results under the accepted program requirements, ownership model, and authority boundary.

# End Condition

Sanitized feedback and event evidence are reviewed, separate decisions classify Demo 2 and Demo 3 as promote, retain unlisted, or archive, evidence-backed canonical-site and SEO/LLM ideas are selected, the source claim map is updated before public copy, accepted changes are validated locally, and publication is explicitly deferred or handed to a separately authorized lane.

# Activation Conditions

An event-outcome checkpoint exists, whether Demo 3 achieved or the fail-closed Demo 2 fallback was used. Before any canonical source edit, a new writer lease records an accepted base SHA, exact source allowlist, quiet window, owner, and zero-conflict/zero-behind preflight.

# Non-Goals

- No implicit commit, push, deployment, indexing promotion, provider mutation, DNS, analytics, tag, or package publication authority.

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

- sanitized feedback and event-evidence review
- separate retention decisions
- source claim-map reconciliation
- canonical build and route smokes
- SEO LLM metadata robots sitemap navigation and accessibility
- fresh publication-authority handoff

# Acceptance Criteria

- Demo 2 and Demo 3 receive separate reversible retention decisions.
- Canonical ideas are accepted or rejected individually with evidence and owner.
- Unsupported claims block public adoption.
- Selected source changes pass local static, accessibility, SEO/LLM, visibility, and no-secret tests.
- Any publication is explicitly deferred or routed to a fresh authority decision.
- Canonical edits are allowed only after the Goal 8 lease/allowlist gate; acceptance of event evidence alone grants no source or Git authority.

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

- 2026-07-26: Created as phase 8 of the AI-native SDLC presentation and live-demo program.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
