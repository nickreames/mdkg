---
id: task-506
type: task
title: commit pass 2 ingestion graph changes locally
status: done
priority: 1
tags: [mdkg-dev, commit]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-505]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Commit the graph-only ingestion as a logical local commit after validation.

# Acceptance Criteria

- The commit includes only pass-2 feedback source evidence, archive sidecars, mdkg graph/design/index state, and no functional source/site/docs implementation.
- Commit message: `graph: ingest mdkg dev preview polish pass 2`.
- Git tree is clean afterward.

# Files Affected

- `.mdkg/`
- `mdkg_preview_polish_pass2/`
- `mdkg_preview_polish_pass2_docs.zip`

# Test Plan

- `git status --short --branch`
- `git diff --check`

# Implementation Notes

# Links / Artifacts
