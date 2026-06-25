---
id: task-569
type: task
title: run Browser Chrome desktop mobile checks and archive screenshots
status: todo
priority: 1
epic: epic-192
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-568]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Run Browser and Chrome validation against the live production domains and archive selected screenshots.

# Acceptance Criteria

- Browser and Chrome verify marketing home, quickstart/trust where relevant, docs home, docs quickstart, `llms.txt`, robots, and sitemap.
- Desktop and mobile widths are checked.
- Screenshots are public-safe and archived as mdkg evidence.
- No private Vercel account UI, tokens, credentials, or unrelated prompts are archived.

# Files Affected

- `.mdkg/archive/**`
- `.mdkg/work/**` checkpoints/evidence

# Implementation Notes

- Use Browser for automated route inspection and Chrome for logged-in/manual domain confirmation when useful.
- Archive only selected public-site screenshots and sanitized receipts.

# Test Plan

- Screenshot archive verifies.
- Browser/Chrome evidence checkpoint exists.
- `test-286`

# Links / Artifacts

- Future screenshot archive URIs.
