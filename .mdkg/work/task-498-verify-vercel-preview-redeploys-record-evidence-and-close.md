---
id: task-498
type: task
title: verify Vercel preview redeploys record evidence and close
status: done
priority: 1
tags: [mdkg-dev, vercel, preview, closeout]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: [test-233, test-234]
blocked_by: [task-497]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Verify the pushed implementation caused existing Vercel preview projects to redeploy and close Goal 30 without public launch side effects.

# Acceptance Criteria

- `mdkg-dev` and `mdkg-docs` latest deployments are `READY`.
- Preview URLs validate in Browser/Chrome and through Vercel deployment/log tools.
- Deployment IDs, commit SHAs, route checks, and screenshot/receipt evidence are recorded.
- DNS, production promotion, analytics activation, npm publish, git tag, and GitHub settings mutation remain deferred.

# Test Plan

- Vercel project/deployment inspection.
- Hosted Browser route checks.
- `node dist/cli.js validate --summary --json --limit 20`

# Evidence

- Push source: `origin/main` at commit `64c2925774bc173093217df715247dd294d891b0`.
- Vercel team: `team_RkZhrKQs9wWs6PAdTcrwZ87z`.
- `mdkg-dev` deployment:
  - deployment id: `dpl_CmCzsZiRJughe2D8U6hyGcRmLNjf`
  - project id: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
  - state: `READY`
  - alias: `https://mdkg-dev.vercel.app/`
  - source: git `main`, commit `64c2925774bc173093217df715247dd294d891b0`
  - build log showed `npm run build`, Astro static output, 5 pages built, and deployment completed.
- `mdkg-docs` deployment:
  - deployment id: `dpl_HkLmXo6hfNisHPoHp1Ugk6mtnKqg`
  - project id: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
  - state: `READY`
  - alias: `https://mdkg-docs.vercel.app/`
  - source: git `main`, commit `64c2925774bc173093217df715247dd294d891b0`
  - build log showed Astro/Starlight static output, 22 pages built, Pagefind index built, sitemap generated, and deployment completed.
- HTTP header checks returned `200` from Vercel for `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/` with fresh `last-modified` timestamps after the push.
- Hosted Chrome route receipt: `/private/tmp/mdkg-goal30-task498-hosted-vercel-checks.json`.
  - Checked `mdkg-dev` homepage, quickstart, trust, docs bridge.
  - Checked `mdkg-docs` homepage, install, quickstart, claims matrix, roadmap.
  - All route checks passed with expected H1, canonical URL, required text, no raw-marker findings, no horizontal overflow, and no console errors.
- Hosted Browser root receipt: `/private/tmp/mdkg-goal30-task498-hosted-browser-roots.json`.
  - Checked `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/`.
  - Both passed expected text and raw-marker checks.
- Final local gates passed after deployment validation:
  - `npm run smoke:demo-graph`
  - `npm run cli:check`
  - `npm run cli:contract`
  - `node dist/cli.js validate --summary --json --limit 20`
  - `node dist/cli.js doctor --strict --json` with expected local-only project DB runtime warning and `ok: true`
  - `git diff --check`
- Deferred side effects confirmed: no DNS cutover, production domain promotion, npm publish, git tag, analytics activation, GitHub settings mutation, or public launch announcement.

# Files Affected

- `.mdkg` closeout evidence only.

# Implementation Notes

- The Vercel connector project listing returned no projects for the listed team, but direct deployment lookup by alias succeeded and returned authoritative deployment/project metadata.
- The Vercel deployments currently report target `production` because the `.vercel.app` aliases are the active Vercel project aliases. This goal still did not configure `mdkg.dev`, `www.mdkg.dev`, or `docs.mdkg.dev` DNS and did not promote custom-domain public launch.

# Links / Artifacts

- `https://mdkg-dev.vercel.app/`
- `https://mdkg-docs.vercel.app/`
- `/private/tmp/mdkg-goal30-task498-hosted-vercel-checks.json`
- `/private/tmp/mdkg-goal30-task498-hosted-browser-roots.json`
