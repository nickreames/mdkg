---
id: task-479
type: task
title: create Vercel mdkg-docs project in Chrome
status: done
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
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Create the Starlight docs Vercel preview project through Chrome UI.

# Acceptance Criteria

- Project name is `mdkg-docs`.
- Team is `Nicholas Reames' projects` / `team_RkZhrKQs9wWs6PAdTcrwZ87z`.
- Repository is `nickreames/mdkg`.
- Only GitHub repository `nickreames/mdkg` is selected/imported/authorized for this project setup.
- Root directory is `docs`.
- Framework preset is Astro if offered.
- Build command is `npm run build`.
- Output directory is `dist`.
- A preview deployment succeeds.

# Files Affected

List files/directories expected to change.

- Vercel project configuration, not repo files unless Vercel creates safe metadata that is intentionally committed later.

# Implementation Notes

- If Vercel or GitHub asks for broader repository access than `nickreames/mdkg`, stop and ask for explicit approval.
- Do not bind `docs.mdkg.dev` in this task.
- Do not store deployment bypass tokens or cookies in mdkg.

# Test Plan

- Vercel project list includes `mdkg-docs`.
- Vercel deployment/build logs show success.
- Browser opens the preview URL.

# Links / Artifacts

- `edd-32`
- `test-221`

# Completion Evidence

- Chrome UI created Vercel project `mdkg-docs` in team `Nicholas Reames' projects` (`team_RkZhrKQs9wWs6PAdTcrwZ87z`).
- Import source was limited to GitHub repository `nickreames/mdkg`.
- Root directory selected in Chrome: `docs`.
- Framework preset selected by Vercel: Astro.
- Build/output defaults confirmed in Chrome: `npm run build`, output `dist`.
- Vercel project id: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`.
- Deployment id: `dpl_BSRCqokvScb8Uvot4cHBu27bmKg2`.
- Deployment state: `READY`.
- Preview aliases verified by Vercel: `https://mdkg-docs.vercel.app`, `https://mdkg-docs-nicholas-reames-projects.vercel.app`, and `https://mdkg-docs-git-main-nicholas-reames-projects.vercel.app`.
- Build logs show clone from `github.com/nickreames/mdkg`, branch `main`, commit `1240f86`, static Starlight output directory `/vercel/path0/docs/dist/`, Pagefind search index generation, sitemap generation, 19 pages built, and `Deployment completed`.
