---
id: task-7
type: task
title: Add source goal versus specialized goal evidence surfaces
status: backlog
priority: 1
epic: epic-2
parent: goal-2
prev: task-6
next: task-8
tags: [ai-native-sdlc, presentation-demo, phase-2, step-4]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-platform/source-execution-evidence-contract.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-6]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-6]
evidence_refs: []
aliases: [phase-2-step-4]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Add source goal versus specialized goal evidence surfaces. This is step 4 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- Add explicit `sourceGoal`, `executedGoal`, `work`, and `evidence` fields to each demo record.
- Preserve local goal ID, title, condition, requirements, authority, tests, status, checkpoint, and source hash needed to show reusable versus executed specification.
- Render a sanitized side-by-side source/specialized contrast plus Plan -> Work -> Evidence and what completed, why, and what comes next.
- Fail closed on missing provenance, unsupported claims, raw prompts, credentials, provider payloads, or unrelated private context.
- Keep graph-fork mechanics out of the audience-facing copy.
- Keep all work local; publication is forbidden.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-8 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-2 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Demo detail pages render both goals and evidence at the same stable grain.
- Sanitization fixtures reject forbidden fields and unverifiable claims.
- Source and executed goal identities remain visibly distinct even when both preserve local ID `goal-1`.

# Links / Artifacts

- goal-2
- epic-2
- Evidence pending activation.
