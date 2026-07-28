---
id: test-20
type: test
title: Verify exact-SHA production and live URL evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: test-19
next: test-21
tags: [ai-native-sdlc, presentation-demo, phase-7, step-9]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-19]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-19]
evidence_refs: []
aliases: [phase-7-step-9]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [success_branch, fallback_branch, event_authority, complete_push_range, pushed_sha, mdkg_deployment_ready, docs_deployment_ready, detail_url, output_url]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify exact-sha production and live url evidence as step 9 of Goal 7. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-7
- epic-7
- test-19

# Preconditions / Environment

- Goal 7 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- On Demo 3 success, the child goal is achieved with local/integration
  evidence; canonical safety gates pass; the actual pushed range satisfies
  policy; and both production projects plus live routes pass for the exact
  final SHA.
- On Demo 2 fallback, require the exact blocker, last completed child node,
  truthful unachieved child state, deadline compliance, partial-side-effect
  inventory, and no fabricated push/deployment/route success. Audit any
  success receipt that exists and mark absent success-only fields
  `not_applicable`.
- The actual pushed range, when present, is a linear descendant of the clean
  baseline and its stable range hash satisfies the human-accepted prospective
  policy; no future range was invented during Goal 6.
- Fix-forward attempts, external waits, interventions, and elapsed time agree
  across the ledger and receipts.
- Reveal selection states Demo 3 success or Demo 2 fallback truthfully.
- This test specifically proves: Verify exact-SHA production and live URL evidence.
- Any applicable skipped or unavailable check is a failure or explicit
  blocker; explicitly non-applicable fallback fields are neither passes nor
  failures.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-21 until the required result is evidenced.
