---
id: test-21
type: test
title: Verify hard-blocker handling fallback honesty and public receipt
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: test-20
next: task-40
tags: [ai-native-sdlc, presentation-demo, phase-7, step-10]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-20]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-20]
evidence_refs: []
aliases: [phase-7-step-10]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [hard_blockers, attempt_bound, time_bound, demo_2_fallback, truthful_goal_state, public_receipt]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify hard-blocker handling fallback honesty and public receipt as step 10 of Goal 7. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-7
- epic-7
- test-20

# Preconditions / Environment

- Goal 7 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- The child outcome is reported exactly as observed; a timed blocker never
  fabricates child achievement.
- On the Demo 3 success branch, canonical/public-safety, actual-range,
  exact-SHA deployment, and live-route evidence all pass.
- On the Demo 2 fallback branch, require the blocker, last completed child
  state, partial-side-effect inventory, applicable receipt audits,
  `not_applicable` success-only fields, and no fabricated success.
- At most two pre-publication repairs and one production repair occurred; no
  production repair began after T+24; the selection was made by T+29:30 and
  all live actions stopped by T+30.
- Reveal selection and receipt state Demo 3 success or Demo 2 fallback
  truthfully; the final record distinguishes child success from a complete
  rehearsal evaluation.
- This test specifically proves: Verify hard-blocker handling fallback honesty and public receipt.
- Any applicable skipped or unavailable check is a failure or explicit
  blocker. A success-only check that the selected fallback branch never
  reached must be explicitly `not_applicable`, never silently skipped.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to task-40 until the required result is evidenced.
