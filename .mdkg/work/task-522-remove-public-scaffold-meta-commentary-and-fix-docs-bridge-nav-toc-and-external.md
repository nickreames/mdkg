---
id: task-522
type: task
title: remove public scaffold meta commentary and fix docs bridge nav toc and external links
status: backlog
priority: 1
epic: epic-166
parent: goal-33
tags: [mdkg-dev, docs, meta-cleanup, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33, test-251]
blocked_by: [task-521]
blocks: [task-523, task-524, task-525, test-251]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Remove remaining user-facing scaffold language and make docs bridge/navigation behavior feel intentional.

# Acceptance Criteria

- Public pages do not lead with future-host, preview-bridge, placeholder, generator, DNS, deployment, or analytics implementation commentary.
- `/docs` is a minimal docs bridge or redirect with no Starlight/GitBook/scaffold copy.
- External docs/GitHub/npm links open in new tabs where appropriate and include `rel="noopener noreferrer"`.
- Claims Evidence Matrix is absent from public docs nav or marked noindex/internal if reachable.
- Short Starlight pages avoid useless TOCs; real pages have useful H2/H3 anchors.
- Evidence is recorded in `chk-226`.

# Files Affected

# Implementation Notes

# Test Plan

# Links / Artifacts
