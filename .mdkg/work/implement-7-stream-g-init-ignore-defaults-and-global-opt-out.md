---
id: implement-7
type: task
title: implement stream g init ignore defaults and global opt out
status: done
priority: 1
epic: epic-4
tags: [v0_4, implementation, init, safety]
owners: []
links: []
artifacts: [cmd:npm_run_build_ok_2026_03_05, cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [dec-10, prd-1, edd-4, task-34, test-9, epic-4]
blocked_by: []
blocks: [test-9]
refs: []
aliases: [stream-g, init-ignore-defaults]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Implement default ignore-file updates for init with global opt-out `--no-update-ignores` and explicit-flag precedence.

# Acceptance Criteria

- `init` defaults to updating `.gitignore` and `.npmignore`.
- `--no-update-ignores` disables default ignore writes.
- Explicit update flags still force writes when provided.
- `.mdkg/work/events/*.jsonl` is included in gitignore default updates.

# Files Affected

- src/cli.ts
- src/commands/init.ts
- README.md
- .mdkg/core/rule-4-repo-safety-and-ignores.md

# Implementation Notes

- Keep `--update-dockerignore` explicit-only.
- Preserve deterministic append behavior and no duplicate entries.

# Test Plan

- Validate init default/opt-out precedence behavior in init command tests.

# Links / Artifacts

- dec-10
- prd-1
- task-34
- test-9
- epic-4
