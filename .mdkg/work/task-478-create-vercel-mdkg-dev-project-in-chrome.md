---
id: task-478
type: task
title: create Vercel mdkg-dev project in Chrome
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

Create the marketing Vercel preview project through Chrome UI.

# Acceptance Criteria

- Project name is `mdkg-dev`.
- Team is `Nicholas Reames' projects` / `team_RkZhrKQs9wWs6PAdTcrwZ87z`.
- Repository is `nickreames/mdkg`.
- Only GitHub repository `nickreames/mdkg` is selected/imported/authorized for this project setup.
- Root directory is `mdkg-dev`.
- Framework preset is Astro if offered.
- Build command is `npm run build`.
- Output directory is `dist`.
- A preview deployment succeeds.

# Files Affected

List files/directories expected to change.

- Vercel project configuration, not repo files unless Vercel creates safe metadata that is intentionally committed later.

# Implementation Notes

- Use Chrome for setup because project/root settings need visual confirmation.
- If Vercel or GitHub asks for broader repository access than `nickreames/mdkg`, stop and ask for explicit approval.
- Do not bind `mdkg.dev` or `www.mdkg.dev` domains in this task.

# Test Plan

- Vercel project list includes `mdkg-dev`.
- Vercel deployment/build logs show success.
- Browser opens the preview URL.

# Links / Artifacts

- `edd-31`
- `test-221`

# Completion Evidence

- Chrome UI created Vercel project `mdkg-dev` in team `Nicholas Reames' projects` (`team_RkZhrKQs9wWs6PAdTcrwZ87z`).
- Import source was limited to GitHub repository `nickreames/mdkg`.
- Root directory selected in Chrome: `mdkg-dev`.
- Framework preset selected by Vercel: Astro.
- Build/output defaults confirmed in Chrome: `npm run build`, output `dist`.
- Vercel project id: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`.
- Deployment id: `dpl_7oq5idj6rjsamgPt1DgXXyiMb2VT`.
- Deployment state: `READY`.
- Preview aliases verified by Vercel: `https://mdkg-dev.vercel.app`, `https://mdkg-dev-nicholas-reames-projects.vercel.app`, and `https://mdkg-dev-git-main-nicholas-reames-projects.vercel.app`.
- Build logs show clone from `github.com/nickreames/mdkg`, branch `main`, commit `1240f86`, static Astro output directory `/vercel/path0/mdkg-dev/dist/`, and `Deployment completed`.
