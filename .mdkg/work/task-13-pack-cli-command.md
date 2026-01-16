---
id: task-13
type: task
title: wire mdkg pack CLI command and flags
status: done
priority: 2
epic: epic-2
tags: [cli, pack]
owners: []
links: [cmd:pack]
artifacts: [pack-cli]
relates: [rule-2, rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Add the `mdkg pack` command with format/edge/depth/verbose/output flags and wire it into the core pack engine.

# Acceptance Criteria

- `mdkg pack <id-or-qid>` generates a pack using the global index
- flags supported: `--format`, `--depth`, `--edges`, `--verbose`, `--out`, `--ws`, `--no-cache`, `--no-reindex`
- `--edges` adds to default edges (duplicates ignored)
- invalid format or edge names produce a clear usage error
- output defaults to stdout; `--out` writes to file and creates parent dirs

# Files Affected

- src/cli.ts
- src/commands/pack.ts

# Implementation Notes

- keep CLI parsing consistent with existing commands
- use config defaults when flags are omitted

# Test Plan

- run `mdkg pack task-1 --format md --verbose`

# Links / Artifacts

- rule-2
- rule-3
