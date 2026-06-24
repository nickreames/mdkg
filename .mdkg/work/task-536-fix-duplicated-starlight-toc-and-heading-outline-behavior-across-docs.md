---
id: task-536
type: task
title: fix duplicated Starlight TOC and heading outline behavior across docs
status: done
priority: 1
epic: epic-175
parent: goal-34
tags: [mdkg-dev, starlight, accessibility]
owners: []
links: []
artifacts: []
relates: [goal-34, test-260]
blocked_by: [task-535]
blocks: [task-540, task-541, task-542]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-44, dec-42]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Remove duplicated TOC/outline noise and make Starlight page structure accessible and crawlable.

# Acceptance Criteria

- No public docs page renders duplicate "On this page" blocks.
- Each page has exactly one meaningful H1 and a logical H2/H3 outline.
- Short pages hide or simplify TOC when anchors are not useful.
- `test-260` passes.

# Files Affected

- `docs/src/content/docs/**`
- `docs/astro.config.mjs` if TOC config changes are needed
- docs smoke scripts if needed

# Implementation Notes

- Preserve useful Starlight navigation and search.
- Verify crawled text, not only visible desktop layout.

# Test Plan

Run docs build, docs checks, route HTML/text inspection, and Browser/Chrome outline checks.

# Links / Artifacts

- `test-260`
