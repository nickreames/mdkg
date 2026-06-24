---
id: task-526
type: task
title: harden llms sitemap robots noindex canonical metadata og and external links
status: backlog
priority: 1
epic: epic-169
parent: goal-33
tags: [seo, metadata, llms, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33, test-254]
blocked_by: [task-522]
blocks: [task-529, task-530, test-254]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Make crawler, AI-reader, and sharing behavior predictable for preview and future production domains.

# Acceptance Criteria

- `llms.txt` renders with preserved headings, bullets, links, and newlines in browser and curl.
- Preview deployments emit explicit noindex; production domains remain indexable once configured.
- Sitemap and robots behavior is consistent with preview/production policy.
- Metadata and OG policy are validated or a follow-up is recorded.
- External links are checked for target/rel behavior.
- Evidence is recorded in `chk-229`.

# Files Affected

# Implementation Notes

# Test Plan

# Links / Artifacts
