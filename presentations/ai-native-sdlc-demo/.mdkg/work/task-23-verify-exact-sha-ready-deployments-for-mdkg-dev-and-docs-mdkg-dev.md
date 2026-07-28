---
id: task-23
type: task
title: Verify exact-SHA READY deployments for mdkg.dev and docs.mdkg.dev
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: task-22
next: task-24
tags: [ai-native-sdlc, presentation-demo, phase-5, step-3]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/deployment-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-22]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-22]
evidence_refs: []
aliases: [phase-5-step-3]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Verify exact-SHA READY deployments for mdkg.dev and docs.mdkg.dev. This is step 3 of 9 in Goal 5; it owns only the outcome named here and the authority granted by goal-5.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-5.
- Read the exact pushed SHA from task-22 and inspect the existing mdkg.dev and docs.mdkg.dev production projects through read-only Vercel queries.
- For each project record project name, opaque project ID, environment, deployment ID, deployment URL, provider Git SHA field, state, observation time, and the redacted tool/query receipt.
- Require both deployments to be `READY` and their provider Git SHA fields to equal the task-22 pushed SHA; recency or success for another SHA is not evidence.
- Poll read-only at a bounded cadence for at most fifteen minutes. Do not create a deployment, redeploy, change project settings, DNS, aliases, analytics, or environment variables.
- Write `artifacts/demo-002/deployment-receipt.json` with pushed SHA, both project/deployment records, polling attempts, final comparison, and any precise access/provider blocker.
- Attach the verified deployment receipt to the still-open child
  exact-SHA/live-URL test without completing it; task-24 owns live-route proof
  and child closeout.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-24 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-5 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Both production projects are READY for the exact final pushed SHA.
- Project, deployment, environment, SHA, state, time, and query fields are present for both observations and contain no credential material.
- No provider mutation occurred; timeout, missing project identity, missing SHA, or non-READY state leaves the node incomplete with exact evidence.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
