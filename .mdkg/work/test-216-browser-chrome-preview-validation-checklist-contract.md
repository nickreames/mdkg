---
id: test-216
type: test
title: Browser Chrome preview validation checklist contract
status: done
priority: 1
epic: epic-134
parent: goal-27
tags: [mdkg-dev, browser, chrome, validation]
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
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Verify the preview validation checklist is sufficient for a live critique loop.

# Target / Scope

- `task-467`
- `task-470`
- `epic-134`

# Preconditions / Environment

- Graph-only inspection; no Browser/Chrome preview validation is run during this alignment pass.

# Test Cases

- Browser and Chrome are both named.
- Desktop and mobile checks are included.
- Marketing and docs preview routes are covered.
- Vercel deployment logs/status are included.
- Metadata, sitemap, robots, `llms.txt`, no-secret, console error, and responsive UI checks are included.
- External links are inspected but not clicked.

# Results / Evidence

Record pass/fail in `task-471` or closeout checkpoint.

# Notes / Follow-ups

- The execution pass should archive sanitized screenshots only after raw-marker review.
