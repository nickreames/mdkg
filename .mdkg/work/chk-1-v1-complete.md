---
id: chk-1
type: checkpoint
title: v1 complete (bootstrap summary)
status: backlog
priority: 9
epic: epic-1
tags: [checkpoint, v1]
links: [npm:mdkg, release:v0.1.0]
artifacts: []
relates: [epic-1]
blocked_by: []
blocks: []
refs: [rule-1, rule-2, rule-3, rule-4, rule-5, rule-6, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, dec-7]
aliases: []
scope: [task-1, task-2, task-3, task-4, task-5, task-6, task-7, task-8, task-9, task-10]
created: 2026-01-06
updated: 2026-01-06
---

# Summary

This checkpoint will be updated when mdkg v1 is shipped. It should summarize the completed bootstrap work, verification steps, and key links.

# Scope Covered

See `scope` frontmatter for the initial intended coverage.

# Decisions Captured

- dec-1 (config migrations)
- dec-2 (root-only + registered workspaces)
- dec-3 (cache default + auto reindex)
- dec-4 (strict frontmatter, flexible body)
- dec-5 (global templates only)
- dec-6 (next = chain then priority)
- dec-7 (checkpoints)

# Implementation Summary

Describe:
- CLI command set delivered
- index/global cache behavior
- pack exporter details
- validate/format behavior

# Verification / Testing

Record:
- how `mdkg index` and `mdkg validate` were run
- how packs were generated and checked
- how publishing safety was verified (`npm pack` contents)
- install verification from tarball

# Known Issues / Follow-ups

- item 1
- item 2

# Links / Artifacts

- release tag
- changelog entry
- demo pack output
- e2e scripts