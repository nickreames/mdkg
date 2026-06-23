---
id: test-221
type: test
title: origin main push and Vercel project creation proof
status: todo
priority: 1
epic: epic-140
parent: goal-28
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
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that implementation is pushed to `origin/main` and Vercel preview projects are created with correct settings.

# Target / Scope

- `task-477`
- `task-478`
- `task-479`

# Preconditions / Environment

- Local implementation gates passed.
- User has authorized pushing `main` for the future execution pass.
- Chrome/Vercel auth is available.
- GitHub/Vercel repository access is limited to `nickreames/mdkg`; broader repo authorization requires explicit approval.

# Test Cases

- `git push origin main` succeeds without force.
- Vercel team `team_RkZhrKQs9wWs6PAdTcrwZ87z` contains project `mdkg-dev` with root `mdkg-dev`.
- Vercel team contains project `mdkg-docs` with root `docs`.
- Both projects are connected only to GitHub repository `nickreames/mdkg`.
- Both projects use build `npm run build` and output `dist`.
- Both projects have successful preview deployments.

# Results / Evidence

Pending future execution.

# Notes / Follow-ups

- If push requires force or Vercel requires irreversible account/payment choices, stop and re-plan.
- If Vercel or GitHub asks to import, authorize, or expose any repository other than `nickreames/mdkg`, stop and ask for explicit approval.
