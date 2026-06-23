---
id: test-222
type: test
title: live preview Browser Chrome validation contract
status: todo
priority: 1
epic: epic-141
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
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that live preview deployments are usable before DNS or production promotion.

# Target / Scope

- `task-480`
- Vercel preview URLs for `mdkg-dev` and `mdkg-docs`

# Preconditions / Environment

- Both Vercel preview projects have successful deployments.
- Preview URLs are available.

# Test Cases

- Marketing preview routes render: `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`.
- Docs preview renders Starlight landing, start-here, concepts, guides, reference, generated CLI reference, search UI, metadata, dark mode, and code blocks.
- Desktop and mobile checks pass in Browser/Chrome.
- No page-level console errors.
- No preview URL appears in production sitemap/canonical metadata.

# Results / Evidence

Pending future execution.

# Notes / Follow-ups

- Do not click external links or submit forms during preview validation.
