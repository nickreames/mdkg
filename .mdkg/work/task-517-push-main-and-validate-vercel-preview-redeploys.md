---
id: task-517
type: task
title: push main and validate Vercel preview redeploys
status: backlog
priority: 1
tags: [mdkg-dev, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: []
blocked_by: [task-516]
blocks: [task-518, test-246, test-247]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Push validated changes and prove the existing Vercel previews redeploy.

# Acceptance Criteria

- `main` is pushed to `origin/main` without force.
- Vercel projects `mdkg-dev` and `mdkg-docs` redeploy from the pushed commit.
- Vercel deployment IDs, states, logs, preview URLs, and Browser/Chrome hosted route checks are recorded.
- No DNS, production promotion, npm publish, tag, analytics activation, or public launch occurs.

# Files Affected

- Remote `origin/main` after local gates pass.
- mdkg checkpoints.

# Test Plan

- Vercel deployment/log checks.
- Hosted Browser/Chrome route checks.

# Implementation Notes

# Links / Artifacts
