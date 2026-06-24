---
id: epic-151
type: epic
title: automation Browser QA and Vercel preview validation
status: done
priority: 1
tags: [mdkg-dev, automation, browser, vercel]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: [task-495, task-496, task-497, task-498, test-233]
blocked_by: [task-494]
blocks: [task-495, task-496, task-497, task-498, test-233]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Goal

Prove the polish locally, commit it, push it, and validate hosted preview redeploys.

# Scope

Smokes, Browser E2E, Product Design QA, logical commits, non-force push, Vercel deployment/log checks, and hosted route validation.

# Milestones

# Out of Scope

# Risks

# Links / Artifacts

- `task-495`
- `task-496`
- `task-497`
- `task-498`
- `test-233`
- `chk-213`
- `chk-214`
- `https://mdkg-dev.vercel.app/`
- `https://mdkg-docs.vercel.app/`

# Closeout Evidence

Completed as part of `goal-30`.

- Site/docs parity, launch-readiness, no-secret, link, metadata, README/docs parity, Browser E2E, Product Design QA, push, and Vercel preview validation were completed.
- `test-233` is done and covers Browser, Chrome, and Vercel preview validation.
- `origin/main` was pushed without force and both Vercel projects redeployed successfully.
