---
id: task-478
type: task
title: create Vercel mdkg-dev project in Chrome
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
