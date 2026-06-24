---
id: task-500
type: task
title: archive pass 2 feedback bundle and verify provenance
status: done
priority: 1
tags: [mdkg-dev, archive]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2, mdkg_preview_polish_pass2_docs.zip]
relates: []
blocked_by: [task-499]
blocks: [task-501]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Archive the pass-2 zip and keep the readable feedback folder as committed source evidence.

# Acceptance Criteria

- Archive URI exists and verifies.
- The source folder remains readable in the repo.
- Product/design nodes reference the archive URI.

# Files Affected

- `.mdkg/archive/`
- `mdkg_preview_polish_pass2/`
- `mdkg_preview_polish_pass2_docs.zip`

# Test Plan

- `node dist/cli.js archive verify archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24 --json`

# Implementation Notes

# Links / Artifacts
