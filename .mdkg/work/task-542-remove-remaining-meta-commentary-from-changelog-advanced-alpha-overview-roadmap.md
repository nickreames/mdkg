---
id: task-542
type: task
title: remove remaining meta commentary from changelog advanced alpha overview roadmap and reference nav
status: done
priority: 1
epic: epic-175
parent: goal-34
tags: [mdkg-dev, docs, public-copy]
owners: []
links: []
artifacts: []
relates: [goal-34, test-264]
blocked_by: [task-536]
blocks: [task-544]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [dec-42]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Remove public copy that reads like internal planning or maintainer scaffolding.

# Acceptance Criteria

- Changelog reads as product-level release notes.
- Advanced Alpha overview gives "use when" guidance instead of documentation TODOs.
- Roadmap is product-oriented and excludes deployment chores.
- Command Contract is clearly maintainer/integration-facing and not the beginner default.
- Public pages avoid scaffold phrases from the pass-4 audit.

# Files Affected

- `docs/src/content/docs/project/changelog.*`
- `docs/src/content/docs/advanced-alpha/overview.*`
- `docs/src/content/docs/project/roadmap.*`
- reference nav/config files

# Implementation Notes

- Preserve alpha caveats without sounding aspirational or unfinished.

# Test Plan

Search public output for blocked meta phrases and run docs smokes.

# Links / Artifacts

- `test-264`
