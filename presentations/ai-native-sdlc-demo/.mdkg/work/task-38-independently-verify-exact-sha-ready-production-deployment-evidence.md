---
id: task-38
type: task
title: Independently verify exact-SHA READY production deployment evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-37
next: task-39
tags: [ai-native-sdlc, presentation-demo, phase-7, step-6, post-reveal]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/deployment-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-37]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-37]
evidence_refs: []
aliases: [phase-7-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Independently inspect any applicable production deployment evidence and compare
it with the child result. This umbrella node is read-only and is post-reveal
step 6 of Goal 7.

# Acceptance Criteria

- Read test-18's immutable selection first.
- On Demo 3 success, consume the pushed SHA from the child commit/push receipt,
  inspect both existing production projects without creating or redeploying
  anything, and require each deployment READY for that exact SHA.
- On Demo 2 fallback, inspect any provider evidence already produced and the
  recorded partial-side-effect inventory. Do not start a new polling loop.
  If no Demo 3 push occurred, mark exact-SHA Demo 3 deployment fields
  `not_applicable`.
- For each project record name, opaque project ID, environment, deployment ID/URL, provider Git SHA field, state, observation time, and redacted query/tool receipt without credentials.
- Audit the already-recorded provider result after the reveal. Do not restart
  live polling or repair. Never create, redeploy, cancel, promote, alias, or
  reconfigure. Any discrepancy is post-rehearsal evidence requiring fresh
  authority.
- Write `artifacts/demo-003/umbrella/deployment-receipt.json` with child commit receipt hash, exact pushed SHA, both project records, attempt/timing ledger, exact comparisons, and pass/hard-blocker state.
- Do not accept a merely recent or successful deployment for a different SHA.
- The successor task-39 does not begin until this node is verified.

# Files Affected

- Program evidence under this nested graph plus read-only existing-deployment inspection.
- No manual deploy, project configuration, DNS, analytics, or other provider mutation.

# Implementation Notes

- Re-read the pushed-SHA receipt immediately before provider inspection.
- Prefer provider deployment identity and exact-SHA fields over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- On success, both production projects are independently observed READY for
  the exact pushed SHA and all child/umbrella fields agree.
- On fallback, every available provider receipt is audited and absent
  success-only deployment evidence is explicitly `not_applicable`; no READY
  claim is fabricated.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
