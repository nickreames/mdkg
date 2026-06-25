---
id: task-551
type: task
title: remove duplicate Starlight TOC output and improve page outlines
status: done
priority: 1
epic: epic-182
parent: goal-35
tags: [mdkg-dev, docs, starlight, accessibility]
owners: []
links: []
artifacts: []
relates: [test-271]
blocked_by: [task-550]
blocks: [task-552]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Fix duplicated Starlight TOC/outline behavior and make docs pages easier to scan with assistive technology.

# Acceptance Criteria

- Each major docs page has one coherent page outline.
- No visible duplicate TOC or scaffold navigation appears.
- Heading levels are logical and screen-reader friendly.
- Code blocks remain readable and copyable after layout changes.

# Test Plan

- `npm --prefix docs run build`
- Docs smoke and Browser/Chrome checks at desktop, tablet, and mobile widths.

# Files Affected

# Implementation Notes

# Links / Artifacts
