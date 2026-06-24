---
id: epic-192
type: epic
title: Browser Chrome and Vercel production-domain validation
status: done
priority: 1
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
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Prove the production domains through live Browser, Chrome, and Vercel evidence.

# Scope

- Desktop and mobile Browser/Chrome validation.
- Vercel deployment, domain, and build-log verification.
- Route checks for apex, www redirect, docs, robots, sitemap, and metadata.

# Milestones

- `task-569` records Browser/Chrome screenshot evidence.
- `task-570` records Vercel deployment/log evidence.
- `test-286` and `test-287` validate proof quality.

# Out of Scope

- Analytics activation.
- Public announcement.
- Clicking or mutating unrelated Vercel projects.

# Risks

- Screenshots may accidentally capture private account UI; archive only public site screenshots or sanitized receipts.
- Vercel deployment state can lag a push.

# Links / Artifacts

- `https://mdkg.dev/`
- `https://docs.mdkg.dev/`
- `archive://archive.goal36-browser-chrome-production-evidence-2026-06-24`
- `chk-263`
- `chk-265`

# Closeout

Completed under `goal-36`. Browser desktop/mobile checks, Chrome checks,
screenshots, Vercel deployment metadata, and build logs verified the custom
domains and `/docs` redirect on the final deployed source commit `790060a`.
