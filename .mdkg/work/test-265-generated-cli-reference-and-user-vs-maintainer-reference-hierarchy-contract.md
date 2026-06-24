---
id: test-265
type: test
title: generated CLI reference and user-vs-maintainer reference hierarchy contract
status: todo
priority: 1
epic: epic-176
parent: goal-34
tags: [mdkg-dev, cli-reference]
owners: []
links: []
artifacts: []
relates: [goal-34, task-544]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-43, dec-42]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [generated-reference-freshness, user-facing-cli-reference, maintainer-contract-label]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify command reference docs are useful to users while command contract internals remain clearly maintainer-facing.

# Target / Scope

Generated CLI Reference, Command Contract, Reference index/nav, docs generation scripts.

# Preconditions / Environment

Built CLI contract and docs generation output.

# Test Cases

- Generated reference covers core commands with usage, flags, safety metadata, formats, examples, and related docs.
- Advanced commands are labeled advanced alpha.
- Command Contract page is labeled maintainer/integration-facing.
- `docs:check` fails on stale generated reference.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- None.
