---
id: task-286
type: task
title: add mdkg spec list show validate command surface
status: done
priority: 1
epic: epic-55
parent: goal-9
prev: task-285
next: task-287
tags: [spec, cli, list, show, validate]
owners: []
links: []
artifacts: [src/cli.ts, src/commands]
relates: [goal-9, epic-55]
blocked_by: [task-285]
blocks: [task-287, test-110]
refs: [edd-15]
aliases: [mdkg-spec-command-surface]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Expose focused SPEC discovery and validation commands or an equivalent explicit
command surface.

# Acceptance Criteria

- Target interface is `mdkg spec list`, `mdkg spec show <spec-id>`, and `mdkg spec validate [<spec-id>]`.
- JSON output is deterministic.
- Help text explains that SPEC is optional and reusable-capability oriented.

# Files Affected

- `src/cli.ts`
- `src/commands`
- `tests`

# Implementation Notes

- Reuse capability/index validation logic rather than duplicating graph parsing.

# Test Plan

- CLI command tests.
- `npm run cli:check`
- `node dist/cli.js spec list --json`

# Links / Artifacts

- `test-110`
