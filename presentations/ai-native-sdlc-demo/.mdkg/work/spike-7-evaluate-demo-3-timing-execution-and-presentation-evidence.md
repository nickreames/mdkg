---
id: spike-7
type: spike
title: Evaluate Demo 3 timing execution and presentation evidence
status: todo
priority: 1
epic: epic-9
parent: goal-9
next: task-51
tags: [ai-native-sdlc, presentation-demo, phase-9, step-1]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/demo-3-evaluation.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-9, epic-9, prd-1, edd-1, dec-2, dec-3, dec-5, goal-7, test-18, task-40]
context_refs: [goal-9, epic-9, prd-1, edd-1, dec-2, dec-3, dec-5, goal-7, test-18, task-40]
evidence_refs: [goal-7, test-18, task-40]
aliases: [phase-9-step-1]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Research Question

What did Demo 3 prove about the 30-minute path, what failed or consumed time,
and which deck, source-template, sendoff, validation, or cue changes should be
accepted before fresh Demo 4?

# Context And Constraints

- Separate presentation polish from source/sendoff defects and execution
  variance.
- No mutation until the user accepts exact findings and paths.

# Search Plan

- Compare planned and actual per-stage timing, retries, waits, interventions,
  child receipts, reveal gate, and fallback.
- Review the pre-test deck handoff and identify only evidence-backed changes.

# Findings

Pending Goal 7.

# Options And Tradeoffs

- no change: safest when the tested contract passed cleanly.
- bounded polish: apply only measured, accepted improvements.
- defer: route out-of-scope redesign beyond the live event.

# Recommendation

Write `demo-3-evaluation.md` with ranked findings, exact evidence, accepted/
rejected changes, timing impact, risks, and an explicit user decision.

# Follow-Up Nodes To Create

- Existing tasks 51–54 and tests 26–27 own accepted follow-up.

# Skill Candidates

- Record only a repeatable workflow gap; do not edit skills here.

# Data Structures And Algorithms Notes

- Preserve stable IDs, deterministic receipts, and the active-cursor invariant.

# UX Notes

- Preserve the core narrative, context-engineering conclusion, reveal, and CTA.

# Security Notes

- Keep artifacts public-safe and credentials/provider payloads out.

# mdkg.dev Launch Implications

- No canonical adoption beyond the accepted live-event allowlist.

# Evidence And Sources

- Goal 7 timing ledger, reveal gate, post-reveal receipts, and checkpoint.
