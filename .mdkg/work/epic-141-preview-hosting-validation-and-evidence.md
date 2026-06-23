---
id: epic-141
type: epic
title: preview hosting validation and evidence
status: todo
priority: 1
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Validate hosted Vercel preview URLs with Browser, Chrome, and Vercel deployment/log evidence.

# Scope

- Verify marketing preview routes and docs preview routes.
- Inspect Vercel deployments and logs.
- Record preview URLs and validation receipts in mdkg without secrets.

# Milestones

- Marketing preview validates on desktop and mobile.
- Docs preview validates on desktop and mobile.

# Out of Scope

- No production domain testing because DNS is deferred.

# Risks

- Deployment protection or auth may block automated Browser checks; use share URLs only if they are safe to record as non-secret artifacts.

# Links / Artifacts

- `task-480`
- `test-222`
