---
id: task-547
type: task
title: run local Browser Chrome E2E across desktop tablet mobile and update pass-4 smoke coverage
status: done
priority: 1
epic: epic-179
parent: goal-34
tags: [mdkg-dev, browser, chrome, smoke]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-pass4-browser-chrome-e2e-2026-06-24]
relates: [goal-34, test-267]
blocked_by: [task-544, task-545, task-546]
blocks: [task-548]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-46]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Run local Browser and Chrome E2E/visual QA across marketing and docs, then add pass-4 smoke coverage for regressions.

# Acceptance Criteria

- Local Browser and Chrome checks cover homepage, quickstart, trust, docs homepage, install, quickstart, work node types, agent workflow, CLI reference, changelog, roadmap, and demo path.
- Viewports include desktop, tablet, and mobile.
- Checks cover console errors, nav, overflow, focus, code blocks, metadata, noindex, no-secret posture, and text endpoints.
- `npm run smoke:mdkg-dev-polish-pass4` exists and passes.

# Files Affected

- `scripts/**`
- `package.json`
- `.mdkg/work/**` evidence checkpoints

# Implementation Notes

- If Browser is unavailable, use Chrome and direct HTTP fallback with the limitation recorded.

# Test Plan

Run local preview/builds, Browser/Chrome route checks, and pass-4 smoke.

# Links / Artifacts

- `test-267`
