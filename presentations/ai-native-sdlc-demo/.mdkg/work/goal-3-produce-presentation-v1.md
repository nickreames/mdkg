---
id: goal-3
type: goal
title: Produce presentation v1
status: done
priority: 1
goal_state: achieved
goal_condition: A source-backed 30–32 minute narrated presentation exists as editable source and PPTX, three representative visual prototypes receive explicit human approval before full production, every factual claim has primary-source support, every slide passes rendered visual QA, and an offline cue rehearsal proves that the reveal plus CTA can finish within the 35-minute content hard stop before audience Q&A.
scope_refs: [epic-3]
last_active_node: test-9
required_skills: [select-work-and-ground-context, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
required_checks: [first-node context and evidence pack coverage without truncation, primary-source claim matrix review, explicit three-slide visual prototype approval, Artifact Tool PowerPoint generation, full slide render and individual full-size review, overflow contrast hierarchy and legibility checks, 30-32 minute narrated rehearsal plus reveal and CTA within 35 minutes]
max_iterations: 25
blocked_after_attempts: 3
tags: [ai-native-sdlc, presentation-demo, phase-3]
owners: [program-orchestrator]
links: []
artifacts: [deck/source/ai-native-sdlc.mjs, deck/citations/claim-matrix.md, deck/speaker-notes.md, deck/assets/, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md, deck/rendered/rehearsal-receipt.md, deck/ai-native-sdlc.pptx]
relates: []
blocked_by: []
blocks: []
refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, chk-4, chk-5, chk-6, chk-7, chk-8, chk-9, chk-10, chk-11, chk-12]
context_refs: [prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2, chk-4]
evidence_refs: [chk-6, chk-7, chk-8, chk-9, chk-10, chk-11, chk-12]
aliases: [ai-native-sdlc-presentation-v1]
skills: [select-work-and-ground-context, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Objective

Produce presentation v1 under the accepted program requirements, ownership model, and authority boundary.

# End Condition

A source-backed 30–32 minute narrated presentation exists as editable source and
PPTX, three representative visual prototypes receive explicit human approval
before full production, every factual claim has primary-source support, every
slide passes rendered visual QA, and an offline cue rehearsal proves that the
reveal plus CTA can finish within the 35-minute content hard stop before
audience Q&A.

# Activation Conditions

Goal 2 is achieved and its accepted interface checkpoint freezes the route names, evidence fields, and reveal surfaces used by the deck.

# Non-Goals

- No canonical website or docs changes.
- No run graph, commit, push, deployment, or provider mutation.
- No Remotion dependency.

# Recursive Algorithm

1. Re-read this goal, its accepted design context, predecessor evidence, and current writer lease.
2. Select the first unfinished scoped node with `mdkg --root presentations/ai-native-sdlc-demo goal next goal-3 --json`.
3. Preview the execution handoff with `mdkg --root presentations/ai-native-sdlc-demo pack <node-id> --profile concise --depth 1 --edges context_refs,evidence_refs --skills auto --skills-depth full --dry-run --stats`.
4. Require the preview to include the selected node, goal-3, epic-3, prd-1, edd-1, dec-1 through dec-6, goal-2, chk-4, and all required skills without truncation.
5. Build the same pack without `--dry-run` and use it as the execution handoff.
6. Complete one node at a time in the declared prev/next chain; task-12 remains open until explicit human prototype approval.
7. Run the node-specific and goal-level checks; record compact public-safe evidence.
8. Stop on authority, ownership, scope, safety, prerequisite, or context-pack drift.
9. Evaluate the goal and close only when the end condition is fully evidenced.

# Required Skills

- select-work-and-ground-context
- produce-powerpoint-with-artifact-tool
- verify-close-and-checkpoint

# Required Checks

- first-node context and evidence pack coverage without truncation
- primary-source claim matrix review
- explicit three-slide visual prototype approval
- Artifact Tool PowerPoint generation
- full slide render and individual full-size review
- overflow contrast hierarchy and legibility checks
- 30–32 minute narrated rehearsal plus reveal and CTA within 35 minutes

# Acceptance Criteria

- The capability sequence is a loose pedagogical progression with explicitly overlapping product dates, not a claim of strict chronological handoffs.
- Timeline anchors Autocomplete in GitHub Copilot; Prompt engineering in conversational generate/explain/refine; Reasoning in OpenAI o1; Tool-using agents in Claude Code, Cursor, and comparable harnesses; Conditional context in Agent Skills and `SKILL.md`; and Long-horizon goal-driven agents in Codex, Claude Code, and other products only where primary-source multi-hour evidence directly supports the wording.
- Every externally checkable claim records source, publication date, support, approved paraphrase, confidence, and slide use.
- The story explains improving model capability, reasoning effort, harnesses, and context length while showing why context engineering remains necessary.
- The story connects spec-driven design, requirements, architecture decisions, guardrails, Plan -> Work -> Evidence, and what completed, why, and what comes next.
- The central takeaway is that capable coding agents still need durable specifications, guardrails, and evidence to form a dependable software-development lifecycle.
- One brief first-person transition explains the gaps in AI coding tools and the desire to increase development velocity on personal projects that motivated mdkg.
- mdkg is described as public alpha and pre-v1 with active improvements underway, without unsupported benchmarks, dates, or roadmap claims.
- The narrated deck targets 30–32 minutes; the fixture-backed reveal plus CTA uses no more than the remaining time before minute 35; audience Q&A follows.
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

Pre-activation execution hardening is accepted in chk-5. The user explicitly
accepted the V2 Ocean Flow prototype direction on 2026-07-27, recorded in
chk-6, and authorized full-deck production. All eight scoped nodes are now
done; chk-7 through chk-11 record production, cue, citation, visual-QA, and
fixture-only timing proof. Goal closeout is accepted in chk-12.

# Iteration Log

- 2026-07-26: Created as phase 3 of the AI-native SDLC presentation and live-demo program.
- 2026-07-26: Added the deterministic context/evidence pack, Artifact Tool skill, explicit prototype approval, focused test lanes, and fixture-only rehearsal boundary; accepted in chk-5 without activating the goal.
- 2026-07-27: User explicitly approved the V2 light-mode Ocean Flow direction; task-12 closed in chk-6 and Goal 3 activated on task-13.
- 2026-07-27: Built the 20-slide V2 deck and closed full-deck production in chk-7.
- 2026-07-27: Froze fixture-only event cues in chk-8, verified all claim mappings in chk-9, verified rendering and accessibility in chk-10, and verified the 33:55 rehearsal boundary in chk-11.
- 2026-07-27: Accepted Goal 3 closeout in chk-12 with no commit, push, deployment, provider action, or production-readiness claim.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- chk-4
- chk-5
- chk-6
- chk-7
- chk-8
- chk-9
- chk-10
- chk-11
- chk-12
