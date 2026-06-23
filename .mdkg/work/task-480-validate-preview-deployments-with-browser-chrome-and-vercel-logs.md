---
id: task-480
type: task
title: validate preview deployments with Browser Chrome and Vercel logs
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
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate the live preview deployments before any DNS or production work is considered.

# Acceptance Criteria

- Marketing preview validates routes `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
- Docs preview validates Starlight landing, start-here, concepts, guides, reference, generated CLI reference, search UI presence, metadata, dark mode, and code blocks.
- Desktop and mobile checks pass in Browser/Chrome.
- Vercel logs show successful builds.
- No preview URL is written into production canonical metadata or sitemap.

# Files Affected

List files/directories expected to change.

- preview evidence only

# Implementation Notes

- Do not click external links or submit forms during validation.

# Test Plan

- Browser and Chrome manual/automated checks.
- Vercel deployment/log inspection.
- no-secret marker review of generated artifacts and mdkg evidence.

# Links / Artifacts

- `test-222`
