---
id: test-3
type: test
title: Verify Demo 2 exact SHA deployments and live routes
status: backlog
priority: 1
epic: epic-1
parent: goal-1
prev: task-3
tags: [demo, demo-002, test, exact-sha, live-verification]
owners: [demo-002-agent]
links: []
artifacts: [artifacts/live-verification-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, task-3, prd-2, edd-1, dec-2]
context_refs: [goal-1, task-3, prd-2, edd-1, dec-2]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [exact_sha, mdkg_dev_ready, docs_mdkg_dev_ready, detail_live, output_live, desktop_mobile, noindex_unlisted, zero_client_javascript, accessibility, accepted_checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Under Goal 5 only, prove both production projects are READY for the exact pushed
SHA and both Demo 2 routes pass public verification.

# Target / Scope

- `task-3`
- existing mdkg.dev and docs.mdkg.dev deployments
- `/demo/2/`
- `/demo/2/output/`

# Preconditions / Environment

- `task-3` has an accepted normal-push receipt.
- Provider visibility is available.
- No provider mutation is authorized.

# Test Cases

- Both existing production projects report READY for the exact pushed SHA.
- Desktop and mobile detail/output checks pass.
- Noindex/unlisted, zero-JavaScript, accessibility, source-versus-specialized
  proof, and public-safety claims pass.
- An accepted checkpoint records what completed, why, and what comes next.

# Results / Evidence

No Goal 4 evidence. This node must remain untouched until Goal 5.

# Notes / Follow-ups

- Goal 4 must not claim or mutate this test.
