---
id: task-490
type: task
title: fix P0 product-site copy quickstart docs bridge CTAs alpha trust and llms
status: done
priority: 1
tags: [mdkg-dev, product-site, p0, copy, first-run]
owners: []
links: []
artifacts: []
relates: [test-228]
blocked_by: [task-489]
blocks: [task-491]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Implement the P0 product-site fixes from `US-001` through `US-014`.

# Acceptance Criteria

- Quickstart commands render as separate, copyable lines and match README/docs/`llms.txt`.
- `llms.txt` uses durable placeholders like `WORK_ID`.
- Internal planning language and personal-origin emphasis are removed from first-pass public homepage copy.
- `scope_refs`, `context_refs`, and `evidence_refs` are explained without misleading “Evidence:” labels.
- Docs bridge clearly distinguishes preview docs from future `docs.mdkg.dev`.
- GitHub star/feedback CTAs are visible.
- Trust, alpha, claims, SEO, sitemap/robots, accessibility/performance, and design-system P0 expectations are represented or queued in following scoped tasks.

# Test Plan

- Product-site build.
- Browser inspection of homepage, quickstart, trust, alpha, docs bridge, and `llms.txt`.
- `test-228`.

# Files Affected

- `mdkg-dev/src/pages/index.astro`
- `mdkg-dev/src/pages/quickstart.astro`
- `mdkg-dev/src/pages/docs.astro`
- `mdkg-dev/src/pages/trust.astro`
- `mdkg-dev/src/pages/alpha.astro`
- `mdkg-dev/src/pages/llms.txt.ts`
- `mdkg-dev/src/pages/llms-full.txt.ts`
- `mdkg-dev/src/components/CTAGroup.astro`
- `mdkg-dev/src/components/ClaimEvidenceCard.astro`
- `mdkg-dev/src/components/NavBar.astro`
- `mdkg-dev/src/components/Footer.astro`
- `mdkg-dev/CLAIMS.md`

# Implementation Notes

- Reworked the homepage around the first-run golden loop, why AI coding agents lose durable project memory, work/context/evidence ref separation, handoff flow, public-alpha trust gates, and visible GitHub star / feedback CTAs.
- Updated quickstart command sequences to use separate terminal lines and durable placeholders (`GOAL_ID`, `WORK_ID`, `TASK_ID`) instead of angle-bracket placeholders.
- Updated the docs bridge to distinguish the preview docs URL from future `docs.mdkg.dev` while retaining Starlight and repo-owned docs positioning.
- Expanded trust and alpha pages with explicit local-first boundaries: Markdown remains authoritative, mdkg is not an executor, MCP is read-only, queues are local delivery state, and safety warnings are aids rather than comprehensive DLP.
- Updated `llms.txt`, `llms-full.txt`, and the claims evidence matrix so public claims are source-backed and conservative.
- Left deeper docs golden path, visual polish, SEO/social metadata expansion, link/no-secret gates, Browser/Product Design QA, Vercel preview validation, and commit/push evidence to the already scoped follow-up tasks in goal-30.

# Links / Artifacts

- `npm --prefix mdkg-dev run build` passed.
- `npm run smoke:mdkg-dev` passed.
- `npm run smoke:mdkg-dev-seo` passed.
- Browser inspection passed for `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, and `/llms.txt` on `http://127.0.0.1:4324/` with no console errors, no `GitBook` text, no raw `<id>` placeholders, visible GitHub star / feedback CTAs, and docs bridge links for preview docs plus future `docs.mdkg.dev`.
- `node dist/cli.js validate --summary --json --limit 20` passed with zero warnings/errors.
- `git diff --check` passed.
