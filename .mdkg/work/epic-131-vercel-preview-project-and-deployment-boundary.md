---
id: epic-131
type: epic
title: Vercel preview project and deployment boundary
status: backlog
priority: 1
tags: [mdkg-dev, vercel, preview]
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
# Goal

Define the preview-only Vercel project boundary for the mdkg.dev marketing site.

# Scope

- Vercel project name: `mdkg-dev`.
- Root directory: `mdkg-dev/`.
- Framework: Astro static.
- Build command: `npm run build`.
- Output directory: `dist`.
- First deploy target: Vercel preview URL only.

# Milestones

- Verify current Vercel team/project inventory before creating anything.
- Record all project settings needed for a Chrome UI setup.
- Define validation evidence expected from Vercel logs and preview URL.

# Out of Scope

- Creating the Vercel project.
- Deploying any preview or production build.
- Assigning `mdkg.dev`.
- Enabling analytics.

# Risks

- Selecting the repo root instead of `mdkg-dev/` would deploy the wrong package.
- Deploying from unaccepted local work would make preview evidence harder to trust.

# Links / Artifacts

- `task-464`
- `task-465`
- `test-213`
- https://vercel.com/docs/frameworks/frontend/astro
- https://vercel.com/docs/monorepos
