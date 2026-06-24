---
id: task-558
type: task
title: add accessibility reduced-motion contrast performance noindex canonical link and asset-budget checks
status: todo
priority: 1
epic: epic-186
parent: goal-35
tags: [mdkg-dev, accessibility, performance, seo, checks]
owners: []
links: []
artifacts: []
relates: [test-278]
blocked_by: [task-557]
blocks: [task-559]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Strengthen automated quality gates for launch-ready preview confidence.

# Acceptance Criteria

- A11y, contrast, reduced-motion, link, metadata, noindex/canonical, performance, and asset-budget checks are added or strengthened.
- Checks are practical for local CI-style runs and Vercel preview closeout.
- Preview noindex applies to previews only; production indexing remains a later launch decision.

# Test Plan

- `npm run smoke:mdkg-dev-a11y`
- `npm run smoke:mdkg-dev-perf`
- `npm run smoke:mdkg-dev-seo`

# Files Affected

# Implementation Notes

# Links / Artifacts
