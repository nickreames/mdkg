---
id: implement-10
type: task
title: implement stream j hard cli simplification and command tiering
status: done
priority: 1
epic: epic-7
tags: [v0_5, implementation, cli, defaults, ux]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, src/cli.ts, .mdkg/core/rule-3-cli-contract.md]
relates: [dec-11, edd-9, task-60, task-61, task-62, task-66, test-28, test-29, test-30, epic-7]
blocked_by: [implement-9]
blocks: [test-28, test-29, test-30]
refs: []
aliases: [stream-j, cli-hard-cut]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Apply the first hard `0.0.4x` simplification pass to CLI flags/defaults and help surfaces while keeping top-level command count stable.

# Acceptance Criteria

- Primary workflow commands become more opinionated and easier to use.
- Advanced command/flag complexity is reduced materially.
- Docs/help parity is updated for the new command model.

# Files Affected

- src/cli.ts
- src/commands/
- README.md

# Implementation Notes

- Flags/defaults first; top-level command removal is deferred.
- `validate` remains stable.

# Test Plan

- Satisfy `test-28`, `test-29`, and `test-30`, plus build/test/validate gates.

# Links / Artifacts

- epic-7
