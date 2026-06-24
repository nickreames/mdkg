---
id: task-541
type: task
title: replace cramped tables with responsive docs components for repository layout and command boundaries
status: done
priority: 1
epic: epic-175
parent: goal-34
tags: [mdkg-dev, docs, responsive]
owners: []
links: []
artifacts: []
relates: [goal-34, test-264]
blocked_by: [task-536]
blocks: [task-543]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-44]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Replace cramped docs tables with responsive components that remain readable on mobile and in crawled text.

# Acceptance Criteria

- Repository Layout separates durable source, generated caches, local DB state, skill mirrors, commit/do-not-commit guidance.
- Command-boundary docs explain command, read-only/mutating status, what it writes, and beginner safety.
- No horizontal overflow on common phone widths except unavoidable code blocks with scroll handling.
- `test-264` passes.

# Files Affected

- `docs/src/content/docs/concepts/repository-layout.*`
- `docs/src/content/docs/guides/agent-workflow.*`
- shared docs components if needed

# Implementation Notes

- Prefer semantic sections/cards over tables when tables collapse poorly.

# Test Plan

Browser/Chrome mobile checks, crawled text inspection, and docs smoke assertions.

# Links / Artifacts

- `test-264`
