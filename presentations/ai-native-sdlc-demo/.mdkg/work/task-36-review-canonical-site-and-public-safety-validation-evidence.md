---
id: task-36
type: task
title: Review canonical site and public-safety validation evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-35
next: task-37
tags: [ai-native-sdlc, presentation-demo, phase-7, step-3]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/canonical-site-test-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-35]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-35]
evidence_refs: []
aliases: [phase-7-step-3]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Review the Demo 3 child goal's canonical-site and public-safety validation receipts without rerunning a mutating implementation lane. This is step 3 of 11 in Goal 7.

# Acceptance Criteria

- Consume only `runs/demo-003/artifacts/receipts/canonical-site-test.json` and confirm build, route, claim, accessibility, privacy, noindex, zero-JavaScript, and asset-budget gates.
- Inspect artifacts read-only when needed; do not repair source from the umbrella lane.
- Route any in-scope failure back to the still-running child goal within its attempt/time budget.
- Record a sanitized pass or exact blocker for the reveal.
- Write `artifacts/demo-003/umbrella/canonical-site-test-receipt.json` with child path/hash, build SHA, command/tool versions, route inventory, per-gate results, asset measurements, review time, and pass/blocker state.
- The successor task-37 does not begin until this node is verified.

# Files Affected

- Program evidence under this nested graph only.
- Read-only inspection of child artifacts is allowed; source, Git, and provider mutation are not.

# Implementation Notes

- Re-read the child test receipt and writer lease before recording the review.
- Prefer deterministic build and public-safety receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Every frozen local gate has an explicit pass; skipped checks fail the review.
- Review hashes match `runs/demo-003/artifacts/receipts/canonical-site-test.json` and no source path changes in this node.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
