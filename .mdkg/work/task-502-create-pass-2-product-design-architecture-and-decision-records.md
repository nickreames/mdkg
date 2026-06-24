---
id: task-502
type: task
title: create pass 2 product design architecture and decision records
status: done
priority: 1
tags: [mdkg-dev, design]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: [task-501]
blocks: [task-503]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create the architecture and decision records Goal 32 will use.

# Acceptance Criteria

- `edd-36` defines Starlight docs IA and content model.
- `edd-37` defines responsive, accessibility, and code-block QA.
- `edd-38` defines SEO, noindex, metadata, and `llms` expectations.
- `dec-37` keeps Claims Evidence Matrix internal.
- `dec-38` deletes `/docs` now and defers redirect.

# Files Affected

- `.mdkg/design/`

# Test Plan

- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
