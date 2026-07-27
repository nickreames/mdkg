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
tags: [ai-native-sdlc, presentation-demo, phase-7, step-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/deployment-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-37]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-37]
evidence_refs: []
aliases: [phase-7-step-5]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Independently inspect the existing production deployments and compare them with the child receipt. This umbrella node is read-only. This is step 5 of 11 in Goal 7.

# Acceptance Criteria

- Consume the pushed SHA from `runs/demo-003/artifacts/receipts/commit-push.json`, then inspect both existing production projects without creating or redeploying anything.
- Require each deployment to be `READY` and bound to the exact pushed SHA from task-37's reviewed receipt.
- For each project record name, opaque project ID, environment, deployment ID/URL, provider Git SHA field, state, observation time, and redacted query/tool receipt without credentials.
- Poll read-only until both match or the twenty-minute production-failure bound is exhausted; never create, redeploy, cancel, promote, alias, or reconfigure. Polls do not consume a fix-forward attempt: only a complete child repair, local/canonical re-gate, bounded commit/push, and exact-SHA recheck cycle increments the three-attempt counter.
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

- Both production projects are independently observed `READY` for the exact pushed SHA.
- Child and umbrella receipts agree on project, deployment, environment, SHA, state, query, and time.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
