---
id: edd-46
type: edd
title: measured performance accessibility Browser Chrome and Vercel validation contract
tags: [mdkg-dev, qa, vercel]
owners: []
links: []
artifacts: []
relates: [goal-34, task-545, task-547, task-548, test-266, test-267, test-268]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-42]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

The sites are mostly static and promising, but launch-quality claims require measured proof: Browser/Chrome visual QA, accessibility checks, performance budgets, and Vercel deployment/log verification.

# Architecture

- Build marketing and docs locally.
- Run automated a11y/performance checks on homepage, quickstart, trust, docs homepage, install, docs quickstart, work node types, and agent workflow.
- Use Browser and Chrome for local route QA at desktop, tablet, and mobile widths.
- After push, verify Vercel deployments/logs for `mdkg-dev` and `mdkg-docs` and check hosted preview URLs match local proof.

# Data model

QA receipt: route, viewport, tool, result, screenshot or receipt refs, console errors, a11y findings, performance metrics, noindex/canonical state, and known exceptions.

# APIs / interfaces

Future scripts include `npm run smoke:mdkg-dev-a11y`, `npm run smoke:mdkg-dev-perf`, and `npm run smoke:mdkg-dev-polish-pass4`. Vercel connector verifies deployments, logs, and preview state. Chrome is used for profile/manual inspection when needed.

# Failure modes

- Local Browser unavailable: use Chrome and direct HTTP as fallback, recording the limitation.
- Preview deploy lags after push: wait on deployment status/logs before claiming hosted proof.
- Lab performance metrics vary: set practical budgets and record environment.

# Observability

Capture LCP, TBT or INP proxy, CLS, total JS/CSS/image weight where feasible, and no critical a11y violations.

# Security / privacy

Preview QA must not click external mutation flows, submit forms, store secrets, or upload private files.

# Testing strategy

Automated route checks plus screenshot-backed Product Design audit and Vercel deployment receipts.

# Rollout plan

Add local proof before push, then compare live preview results after Vercel redeploys.
