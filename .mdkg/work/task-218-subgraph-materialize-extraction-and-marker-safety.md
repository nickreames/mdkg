---
id: task-218
type: task
title: subgraph materialize extraction and marker safety
status: done
priority: 1
epic: epic-38
prev: task-217
next: task-219
tags: [subgraph, materialize, extraction, safety]
owners: []
links: []
artifacts: []
relates: [edd-11]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [subgraph-materialize]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Add `mdkg subgraph materialize` for generated read-only inspection trees backed
by configured subgraph bundles.

# Acceptance Criteria

- Materialize extracts each selected alias under `<target>/<alias>`.
- Extraction uses temp directory plus atomic rename.
- ZIP path traversal is rejected.
- Existing alias dirs are replaced only with `--clean` and a valid marker.
- `.mdkg-materialized.json` records alias, bundle path/hash/profile,
  `source_repo`, source head, generated time, and mdkg version.
- `--gitignore` creates or maintains a target ignore file.

# Files Affected

- `src/commands/subgraph.ts`
- `src/cli.ts`
- tests

# Implementation Notes

Materialized files are inspection-only and must never be mutated by normal mdkg
commands.

# Test Plan

- Extract bundle and verify marker contents.
- Refuse clean of a non-marker directory.
- Refuse unsafe ZIP entries.

# Links / Artifacts

- `edd-11`
- Implemented `mdkg subgraph materialize` safe extraction, path traversal rejection, marker manifest, `--clean` marker protection, and optional `.gitignore`.
- Evidence: focused subgraph tests cover extraction, marker manifest, clean replacement, and non-marker refusal.
