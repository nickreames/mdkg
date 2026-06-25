---
id: task-570
type: task
title: verify Vercel deployments domains and logs for mdkg-dev and mdkg-docs
status: done
priority: 1
epic: epic-192
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-569]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify Vercel production deployments, custom-domain routing, and build logs for both projects after push/redeploy.

# Acceptance Criteria

- `mdkg-dev` has a successful production deployment serving `mdkg.dev`.
- `mdkg-docs` has a successful production deployment serving `docs.mdkg.dev`.
- Build logs show no unresolved errors.
- Domain pages show valid configuration and SSL health.
- Evidence includes deployment IDs/URLs and relevant log summaries.

# Files Affected

- mdkg checkpoints/evidence.

# Implementation Notes

- Use Vercel tools for deployment/log metadata.
- Use Chrome UI if domain status needs visual confirmation.

# Test Plan

- Vercel deployment/log receipts.
- Hosted route validation after deployment.
- `test-287`

# Links / Artifacts

- Vercel project `mdkg-dev`
- Vercel project `mdkg-docs`
