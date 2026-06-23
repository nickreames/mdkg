---
id: task-474
type: task
title: migrate current docs inventory into Starlight navigation and content
status: todo
priority: 1
epic: epic-138
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Populate Starlight docs navigation and content from the current repo-first docs inventory.

# Acceptance Criteria

- Starlight docs include start-here, concepts, guides, advanced alpha, reference, and project sections.
- Generated command reference is linked from the Starlight reference section.
- Navigation mirrors the intent of `docs/SUMMARY.md`.
- Content keeps public-alpha safety boundaries and does not overclaim worker execution, hosted queues, or public internal DB helper CLI.

# Files Affected

List files/directories expected to change.

- `docs/src/content/docs/`
- `docs/astro.config.mjs`

# Implementation Notes

- Preserve existing source docs as canonical repo files unless the implementation intentionally updates scripts.
- Avoid duplicating the full CLI reference manually; link or import generated content where practical.

# Test Plan

- `npm --prefix docs run build`
- Browser/Chrome local preview inspection for nav/search/page content.

# Links / Artifacts

- `docs/SUMMARY.md`
- `docs/_generated/cli-reference.md`
