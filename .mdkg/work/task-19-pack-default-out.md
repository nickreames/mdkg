---
id: task-19
type: task
title: add default pack output path naming
status: done
priority: 2
epic: epic-2
tags: [pack, cli, output]
links: [cmd:pack]
artifacts: [pack-auto-out]
relates: [rule-2, rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

When `mdkg pack` runs without `--out`, write output to `/tmp` with a deterministic filename that includes pack kind, root id, timestamp (ms), and format extension.

# Acceptance Criteria

- default output path is `.mdkg/pack/pack_<kind>_<id>_<timestamp>.<ext>` when `--out` is omitted
- `<kind>` is `verbose` when `--verbose` is set, otherwise `standard`
- `<id>` is the root id (unqualified), normalized lowercase
- `<timestamp>` includes milliseconds and is safe for filenames
- `<ext>` matches the format (`md`, `json`, `toon`, `xml`)
- `--out` overrides the default path
- CLI prints the output path to stdout

# Files Affected

- src/commands/pack.ts
- src/util/output.ts
- tests/**

# Implementation Notes

- reuse a single naming helper for tests and CLI
- avoid colon characters in timestamps

# Test Plan

- verify default path format with `--verbose` and without
- verify `--out` overrides the default

# Links / Artifacts

- rule-2
- rule-3
