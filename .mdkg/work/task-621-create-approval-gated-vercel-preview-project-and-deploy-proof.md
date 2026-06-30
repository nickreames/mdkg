---
id: task-621
type: task
title: create approval gated Vercel preview project and deploy proof
status: blocked
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, vercel, preview, approval, deploy]
owners: []
links: []
artifacts: [/private/tmp/mdkg-task-621-vercel-preview-pack.md, /private/tmp/mdkg-task-621-vercel-preview-pack.md.stats.json, examples/demo-runs/demo-001/dist/index.html]
relates: []
blocked_by: []
blocks: [task-622, test-324]
refs: [dec-57, edd-59]
context_refs: [dec-57, edd-59]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

After explicit approval, create or verify the dedicated Vercel preview project
and deploy the first demo preview from this repo.

# Acceptance Criteria

- The intended project name is `mdkg-demo-previews`.
- The deployment source is this repo and the branch-path demo run.
- Vercel project id, deployment id, preview URL, commit SHA, build logs,
  screenshots, and noindex state are recorded.
- The task does not create DNS records, aliases, custom domains, durable
  `demo-N` hosting, git tags, npm publishes, or analytics activation.
- If approval or Vercel access is missing, the task records a blocker instead
  of improvising.

# Files Affected

- mdkg evidence/checkpoint nodes
- local artifact receipts under `/private/tmp` when Browser/Chrome/Vercel proof
  is collected

# Implementation Notes

- Real Vercel mutation must be separately approved at execution time.
- Treat preview URLs as public unless protected by Vercel access.
- Local preflight is complete:
  `/private/tmp/mdkg-task-621-vercel-preview-pack.md`,
  `/private/tmp/mdkg-task-621-vercel-preview-pack.md.stats.json`, and
  `examples/demo-runs/demo-001/dist/index.html` are attached artifacts.
- The remaining blocker is explicit approval to use Vercel project/deployment
  mutation paths. Without that approval, this task must remain blocked.
- Any approved execution must record the Vercel project id, deployment id,
  preview URL, commit SHA, build-log summary, screenshots, console health,
  responsive checks, noindex state, no-secret/public-claims result, and a
  closeout recommendation.

# Test Plan

- Vercel project/deployment inspection
- Browser/Chrome preview validation
- `test-324`

# Links / Artifacts

- `dec-57`
- `edd-59`
