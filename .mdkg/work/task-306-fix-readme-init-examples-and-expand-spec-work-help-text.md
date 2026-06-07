---
id: task-306
type: task
title: fix README init examples and expand spec work help text
status: done
priority: 1
epic: epic-64
parent: goal-10
prev: task-305
tags: [docs, help, polish, cli]
owners: []
links: []
artifacts: [tests://cli-check, tests://commands-help, scripts://smoke-cli-ux-polish]
relates: []
blocked_by: [task-305]
blocks: [task-307, test-119]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Fix the visible UX polish gaps in docs and CLI help for optional SPEC and work
invocation before publishing 0.3.0.

# Acceptance Criteria

- README and init README examples use coherent trigger/order/receipt ids.
- Manual `work order new` examples are separated from trigger-created orders.
- `mdkg work --help` lists `work order status` and `work receipt verify`.
- `mdkg work trigger --help` includes a complete example and accepted target
  rules.
- `mdkg work order status --help`, `mdkg work receipt verify --help`, and
  `mdkg spec validate --help` state read-only/no-execution and output behavior.
- Command matrix, init command matrix, help snapshots, and help tests are
  updated together.

# Files Affected

- `README.md`
- `assets/init/README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `src/cli.ts`
- help snapshot tests

# Implementation Notes

- Keep behavior changes limited to CLI/help/docs polish unless tests reveal a
  real command bug.

# Test Plan

- `npm run cli:check`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `node dist/cli.js validate --json`

# Links / Artifacts

- `test-119`
