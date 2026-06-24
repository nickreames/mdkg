---
id: task-495
type: task
title: add launch polish smokes and parity checks
status: todo
priority: 1
tags: [mdkg-dev, smoke-tests, parity]
owners: []
links: []
artifacts: []
relates: [test-228, test-229, test-230, test-232]
blocked_by: [task-494]
blocks: [task-496]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Add or update deterministic smokes so future changes cannot regress feedback fixes silently.

# Acceptance Criteria

- Smokes cover product route inventory, docs route inventory, no-secret scan, metadata, links, README/docs/site parity, generated/reference docs freshness, and preview-safe content.
- Output is bounded and useful for closeout evidence.
- Existing package and mdkg checks still pass.

# Test Plan

- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run docs:check`
- `npm run test`

# Files Affected

# Implementation Notes

# Links / Artifacts
