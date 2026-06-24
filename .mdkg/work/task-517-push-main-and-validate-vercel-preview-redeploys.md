---
id: task-517
type: task
title: push main and validate Vercel preview redeploys
status: done
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

- Pushed `main` to `origin/main` without force:
  - before push: `origin/main` at `b83fe72`
  - pushed head: `b6061af932077d10d3d19a54875dc40bf08a79d2`
  - command: `git push origin main`
- Vercel team: `Nicholas Reames' projects` / `team_RkZhrKQs9wWs6PAdTcrwZ87z`.
- Marketing preview:
  - project: `mdkg-dev`
  - project id: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
  - deployment id: `dpl_524cCFF6BWbw2MsS4ioVcwxwUhcJ`
  - state: `READY`
  - commit: `b6061af932077d10d3d19a54875dc40bf08a79d2`
  - preview alias: `https://mdkg-dev.vercel.app/`
  - Vercel log proof: cloned `github.com/nickreames/mdkg`, branch `main`, commit `b6061af`, ran `npm run build`, output `/vercel/path0/mdkg-dev/dist/`, and completed deployment.
- Docs preview:
  - project: `mdkg-docs`
  - project id: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
  - deployment id: `dpl_85Si5nKQ1zvcLKgd7uhnFTh4ETcc`
  - state: `READY`
  - commit: `b6061af932077d10d3d19a54875dc40bf08a79d2`
  - preview alias: `https://mdkg-docs.vercel.app/`
  - Vercel log proof: cloned `github.com/nickreames/mdkg`, branch `main`, commit `b6061af`, ran `npm run build`, output `/vercel/path0/docs/dist/`, generated 28 pages, built Pagefind search, created sitemap, and completed deployment.
- Vercel alias fetch proof:
  - `https://mdkg-dev.vercel.app/`: HTTP 200, current homepage title `Markdown Knowledge Graph - Git-native project memory for AI coding agents`, last-modified after push.
  - `https://mdkg-docs.vercel.app/`: HTTP 200, current Starlight docs title `Markdown Knowledge Graph Docs | mdkg Docs`, last-modified after push.
  - `https://mdkg-dev.vercel.app/llms.txt`: HTTP 200, current manually rewritten agent guidance.
  - `https://mdkg-dev.vercel.app/llms-full.txt`: HTTP 200, current manually rewritten full agent primer.
  - `https://mdkg-dev.vercel.app/robots.txt`: HTTP 200, production-allow robots text.
  - `https://mdkg-dev.vercel.app/sitemap.xml`: HTTP 200, canonical `https://mdkg.dev/` URLs and no `/docs/` bridge entry.
  - `https://mdkg-docs.vercel.app/sitemap-index.xml`: HTTP 200, canonical `https://docs.mdkg.dev/sitemap-0.xml`.
- Browser hosted route proof:
  - Checked marketing `/`, `/quickstart/`, `/trust/`, `/alpha/`, and `/docs/`.
  - Marketing `/docs/` returns Vercel 404 as intended after bridge deletion.
  - Checked docs `/`, `/start-here/install/`, `/start-here/quickstart/`, `/concepts/plan-work-evidence/`, `/advanced-alpha/read-only-mcp/`, `/advanced-alpha/demo-graphs/`, and `/reference/generated-cli-reference/`.
  - No Browser console errors on checked HTML routes.
  - No `GitBook` or public `Claims Evidence Matrix` text in checked hosted pages.
- Chrome hosted spot check:
  - Checked `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/`.
  - Both loaded expected current titles/H1s with no console errors and no `GitBook` or public `Claims Evidence Matrix` copy.
- Known caveat: Vercel reports target `production` for `.vercel.app` aliases because these projects auto-deploy the `main` branch to their project aliases. This goal still did not bind `mdkg.dev`, `www.mdkg.dev`, or `docs.mdkg.dev`, did not change DNS, and did not perform a custom-domain public launch.

# Links / Artifacts

- `https://mdkg-dev.vercel.app/`
- `https://mdkg-docs.vercel.app/`
- `https://vercel.com/nicholas-reames-projects/mdkg-dev/524cCFF6BWbw2MsS4ioVcwxwUhcJ`
- `https://vercel.com/nicholas-reames-projects/mdkg-docs/85Si5nKQ1zvcLKgd7uhnFTh4ETcc`
