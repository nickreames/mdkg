---
id: task-467
type: task
title: specify preview validation checklist for Browser Chrome Vercel logs routes metadata secrets and responsive UI
status: done
priority: 1
epic: epic-134
parent: goal-27
tags: [mdkg-dev, validation, browser, chrome]
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

Define the preview evidence that must exist before DNS or production promotion can be considered.

# Acceptance Criteria

- Browser and Chrome validation covers desktop and mobile.
- Marketing routes cover `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
- Docs preview validation covers Starlight nav, search, code highlighting, dark mode, generated CLI reference, sitemap, and metadata.
- Vercel logs/build status are captured.
- No-secret and no-raw-prompt/payload checks are required.

# Files Affected

- `.mdkg/work/task-467-*`
- Optional future smoke scripts in a later implementation goal.

# Implementation Notes

- Do not click external links during validation; inspect hrefs only.
- Archive only sanitized screenshots/receipts.

# Test Plan

`test-216` verifies the checklist is complete enough for a follow-up Browser/Chrome execution run.

# Links / Artifacts

- `epic-134`
- `test-216`
- `chk-196`
- `chk-199`
