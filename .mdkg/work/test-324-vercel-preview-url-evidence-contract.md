---
id: test-324
type: test
title: short path demo route evidence contract
status: done
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, mdkg-dev, astro, route, evidence]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal44-demo-routes, mdkg-dev/dist/demos/index.html, mdkg-dev/dist/demo/1/index.html, mdkg-dev/dist/demo/1/output/index.html]
relates: []
blocked_by: [task-630]
blocks: [task-622, test-325]
refs: [dec-58, dec-59, edd-60, edd-61]
context_refs: [dec-58, dec-59, edd-60, edd-61]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [preview deploy runs only after explicit approval., evidence records vercel project and deployment ids., evidence records preview url commit sha build logs screenshots and noindex state., preview is not promoted to demo-n hosting in this goal.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that the local mdkg-dev short-path demo routes have enough evidence for
review before any push or deployment.

# Target / Scope

- `task-630`
- `/demos`
- `/demo/1`
- `/demo/1/output`

# Preconditions / Environment

- Demo route implementation exists locally.
- Sanitized Demo 1 snapshot exists.
- mdkg-dev local build is available.

# Test Cases

- `npm --prefix mdkg-dev run build` passes.
- `npm run smoke:mdkg-dev` passes.
- Browser and Chrome can open `/demos`, `/demo/1`, and `/demo/1/output`
  locally at desktop and mobile widths.
- Evidence records screenshots, console health, responsive rendering, route
  status, no-secret result, public-claims result, and noindex/canonical behavior
  where relevant.
- No Vercel project, deployment, DNS, push, tag, npm publish, alias, custom
  domain, provider mutation, or production promotion occurs.

# Results / Evidence

Pending.

# Notes / Follow-ups

- This test is local-only. Live validation belongs to a separately approved
  push/deploy lane.
