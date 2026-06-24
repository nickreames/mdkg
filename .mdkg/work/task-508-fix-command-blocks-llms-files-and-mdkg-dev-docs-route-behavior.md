---
id: task-508
type: task
title: fix command blocks llms files and mdkg.dev docs route behavior
status: backlog
priority: 1
tags: [mdkg-dev, p0]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: [task-507]
blocks: [task-509, test-239]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Resolve the P0 trust breakers around terminal blocks, `llms` files, and `/docs` behavior.

# Acceptance Criteria

- Command and terminal blocks preserve line breaks and remain readable on mobile.
- `llms.txt` and `llms-full.txt` are manually rewritten once.
- Marketing `/docs` bridge page is deleted; future redirect is deferred.
- Public renderer/scaffold/meta commentary is removed.

# Files Affected

- `mdkg-dev/`
- `docs/`
- public `llms` files

# Test Plan

- P0 smoke for command blocks, `/docs`, `llms`, and public-meta cleanup.

# Implementation Notes

# Links / Artifacts
