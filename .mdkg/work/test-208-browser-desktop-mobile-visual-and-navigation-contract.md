---
id: test-208
type: test
title: Browser desktop mobile visual and navigation contract
status: done
priority: 1
epic: epic-128
parent: goal-26
tags: [mdkg-dev, browser-e2e, visual-qa]
owners: []
links: []
artifacts: []
relates: [goal-26, task-458]
blocked_by: [task-457]
blocks: []
refs: []
context_refs: [edd-28]
evidence_refs: [chk-196]
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate rendered mdkg-dev pages through local Browser desktop/mobile E2E and visual/navigation checks.

# Target / Scope

- mdkg-dev local static preview
- public alpha routes
- desktop and mobile viewport behavior
- captured screenshots

# Preconditions / Environment

- mdkg-dev build has passed.
- Local preview is running on `127.0.0.1`.
- Browser interactions remain local-only.

# Test Cases

- Visit `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
- Test `1440x900` desktop and `390x844` mobile.
- Assert visible headings and page-specific content.
- Assert no page-level console errors or broken local navigation.
- Assert no incoherent overlaps, obvious overflow, or unreadable code blocks.
- Capture homepage, quickstart, trust, docs, and mobile screenshot evidence.

# Results / Evidence

- Passed. See chk-196 and `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`. Browser HTML checks passed with zero failures at desktop and mobile viewports, and selected viewport screenshots were reviewed.

# Notes / Follow-ups

- Screenshots reviewed before archive handoff; selected files will be archived in task-461.
