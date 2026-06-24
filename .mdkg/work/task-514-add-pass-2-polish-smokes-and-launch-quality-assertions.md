---
id: task-514
type: task
title: add pass 2 polish smokes and launch-quality assertions
status: done
priority: 1
tags: [mdkg-dev, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-513]
blocks: [task-515, test-245]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Add regression gates for pass-2 launch quality.

# Acceptance Criteria

- Add pass-2 smoke coverage for command block line breaks, docs nav, no internal public copy, external links, metadata, responsive code blocks, and `llms.txt`.
- Existing mdkg-dev/docs smokes remain passing.
- New smoke is included in Goal 32 required checks; prepublish wiring is optional unless the implementation chooses to make it a durable package gate.

# Files Affected

- `scripts/`
- `package.json`
- site/docs smoke fixtures where needed.

# Test Plan

- `npm run smoke:mdkg-dev-polish-pass2`

# Implementation Notes

# Links / Artifacts
