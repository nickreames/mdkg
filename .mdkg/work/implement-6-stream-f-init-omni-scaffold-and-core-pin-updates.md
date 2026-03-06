---
id: implement-6
type: task
title: implement stream f init omni scaffold and core pin updates
status: done
priority: 1
epic: epic-4
tags: [v0_4, implementation, init, omni]
owners: []
links: []
artifacts: [cmd:npm_run_build_ok_2026_03_05, cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [dec-10, prd-1, edd-2, edd-3, edd-4, task-33, task-37, task-38, task-47, test-9, test-17, epic-4]
blocked_by: []
blocks: [test-9, test-17]
refs: []
aliases: [stream-f, init-omni-implementation]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Implement `mdkg init --omni` scaffold behavior and deterministic ID-only core pin insertion.

# Acceptance Criteria

- `init --omni` flag is available in CLI help and command parsing.
- Omni scaffold creates SOUL/HUMAN strict nodes, skills scaffold, and seeded events JSONL.
- SOUL/HUMAN IDs are `rule-soul` and `rule-human`.
- Core pin updates remain ID-only, deterministic, and deduplicated.

# Files Affected

- src/cli.ts
- src/commands/init.ts
- README.md
- .mdkg/core/rule-3-cli-contract.md

# Implementation Notes

- Preserve existing `--llm` compatibility behavior.
- Avoid markdown docs under `.mdkg/work/events/`.

# Test Plan

- Validate with `test-9` and `test-17` scenarios plus full build/test/validate gates.

# Links / Artifacts

- dec-10
- prd-1
- edd-4
- test-9
- test-17
- epic-4
