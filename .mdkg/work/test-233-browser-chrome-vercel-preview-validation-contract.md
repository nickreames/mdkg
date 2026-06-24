---
id: test-233
type: test
title: Browser Chrome Vercel preview validation contract
status: done
priority: 1
tags: [mdkg-dev, browser, chrome, vercel]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: [task-496, task-498]
blocked_by: [task-496]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Contract

Browser, Chrome, and Vercel evidence proves hosted `mdkg-dev` and `mdkg-docs` previews redeployed and match the validated local implementation.

# Verification

- Vercel project/deployment inspection.
- Hosted route checks in Browser/Chrome.
- Recorded deployment IDs and URLs.

# Evidence

- Covered by `task-496`, `task-498`, `chk-212`, and `chk-214`.
- Vercel deployments are `READY`:
  - `mdkg-dev`: `dpl_CmCzsZiRJughe2D8U6hyGcRmLNjf`
  - `mdkg-docs`: `dpl_HkLmXo6hfNisHPoHp1Ugk6mtnKqg`
- Hosted Chrome route receipt: `/private/tmp/mdkg-goal30-task498-hosted-vercel-checks.json`.
- Hosted Browser root receipt: `/private/tmp/mdkg-goal30-task498-hosted-browser-roots.json`.
