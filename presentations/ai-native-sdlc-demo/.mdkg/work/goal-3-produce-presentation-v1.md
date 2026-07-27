---
id: goal-3
type: goal
title: Produce presentation v1
status: backlog
priority: 1
goal_state: paused
goal_condition: A source-backed 30–32 minute presentation with a 35-minute hard stop exists as editable source and PPTX, three representative visual prototypes precede full production, every factual claim has primary-source support, every slide passes rendered visual QA, and a timed rehearsal proves kickoff, reveal, fallback, recovery, and CTA cues.
scope_refs: [epic-3]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [primary-source claim matrix review, three-slide visual prototype review, PowerPoint generation, full slide render and contact-sheet review, overflow contrast hierarchy and legibility checks, timed rehearsal under 35 minutes]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-3]
owners: [program-orchestrator]
links: []
artifacts: [deck/source/ai-native-sdlc.mjs, deck/citations/claim-matrix.md, deck/speaker-notes.md, deck/assets/, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md, deck/ai-native-sdlc.pptx]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2]
evidence_refs: []
aliases: [ai-native-sdlc-presentation-v1]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Objective

Produce presentation v1 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

A source-backed 30–32 minute presentation with a 35-minute hard stop exists as editable source and PPTX, three representative visual prototypes precede full production, every factual claim has primary-source support, every slide passes rendered visual QA, and a timed rehearsal proves kickoff, reveal, fallback, recovery, and CTA cues.

# Activation Conditions

Goal 2 is achieved and its accepted interface checkpoint freezes the route names, evidence fields, and reveal surfaces used by the deck.

# Non-Goals

- No canonical website or docs changes.
- No run graph, commit, push, deployment, or provider mutation.
- No Remotion dependency.

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

- primary-source claim matrix review
- three-slide visual prototype review
- PowerPoint generation
- full slide render and contact-sheet review
- overflow contrast hierarchy and legibility checks
- timed rehearsal under 35 minutes

# Acceptance Criteria

- Timeline anchors Autocomplete in GitHub Copilot; Prompt engineering in conversational generate/explain/refine; Reasoning in OpenAI o1; Tool-using agents in Claude Code, Cursor, and comparable harnesses; Conditional context in Agent Skills and `SKILL.md`; and Long-horizon goal-driven agents in primary-source multi-hour evidence, including 8+ hours only when directly supported.
- Every externally checkable claim records source, publication date, support, approved paraphrase, confidence, and slide use.
- The story explains improving model capability, reasoning effort, harnesses, and context length while showing why context engineering remains necessary.
- The story connects spec-driven design, requirements, architecture decisions, guardrails, Plan -> Work -> Evidence, and what completed, why, and what comes next.
- mdkg is described as public alpha and pre-v1 with active improvements underway, without unsupported benchmarks, dates, or roadmap claims.
- The closing CTA is Try mdkg on one real project and send me feedback.

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

- 2026-07-26: Created as phase 3 of the AI-native SDLC presentation and live-demo program.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
