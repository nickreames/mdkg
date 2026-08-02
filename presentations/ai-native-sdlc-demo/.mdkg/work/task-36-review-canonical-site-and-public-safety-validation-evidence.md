---
id: task-36
type: task
title: Review canonical site and public-safety validation evidence
status: done
priority: 1
epic: epic-7
parent: goal-7
prev: test-18
next: task-37
tags: [ai-native-sdlc, presentation-demo, phase-7, step-4, post-reveal]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/canonical-site-test-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-18]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-18]
evidence_refs: []
aliases: [phase-7-step-4]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Review the Demo 3 child goal's canonical-site and public-safety validation
evidence without rerunning or reopening a mutating implementation lane. This
is post-reveal step 4 of Goal 7.

# Acceptance Criteria

- Read test-18's immutable selection first.
- On Demo 3 success, consume
  `runs/demo-003/artifacts/receipts/canonical-site-test.json` and confirm
  build, route, claim, accessibility, privacy, noindex, zero-JavaScript, and
  asset-budget gates.
- On Demo 2 fallback, consume the blocker, timing ledger, last completed child
  node, and partial-side-effect inventory. Audit any canonical receipt that
  exists; if the child never reached that stage, record canonical success
  fields as `not_applicable` with the exact reason.
- Inspect artifacts read-only when needed; do not repair source from the umbrella lane.
- Never route work back to the timed child after test-18. Record discrepancies
  only as Goal 9 follow-up.
- Record a sanitized branch-specific pass or exact blocker.
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

- On success, every frozen local gate has an explicit pass; skipped applicable
  checks fail the review.
- On fallback, every available partial receipt is audited, absent success-only
  checks are explicitly `not_applicable`, and no success is implied.
- When the child canonical receipt exists, review hashes match it. When the
  fallback occurred before that stage, its absence agrees with the blocker,
  timing ledger, and last completed child node. No source path changes in this
  node.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
