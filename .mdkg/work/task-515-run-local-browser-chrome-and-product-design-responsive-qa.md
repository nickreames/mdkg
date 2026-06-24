---
id: task-515
type: task
title: run local Browser Chrome and Product Design responsive QA
status: backlog
priority: 1
tags: [mdkg-dev, browser, product-design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-514]
blocks: [task-516, test-244]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Validate the local marketing and docs sites in Browser, Chrome, and Product Design review.

# Acceptance Criteria

- Desktop `1440x900`, mobile `390x844`, and one tablet-ish viewport are checked.
- Homepage, docs home, quickstart, install, trust, roadmap, `llms.txt`, robots, sitemap, and advanced docs routes are covered.
- No console errors, visible overflows, broken local nav, unreadable code blocks, or raw secret/prompt/token/payload markers.
- Product Design findings are recorded in mdkg checkpoints only.

# Files Affected

- `.mdkg/work/` checkpoints.

# Test Plan

- Browser/Chrome manual and scripted route checks.

# Implementation Notes

# Links / Artifacts
