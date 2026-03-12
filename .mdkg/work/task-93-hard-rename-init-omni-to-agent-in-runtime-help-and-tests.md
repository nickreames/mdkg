---
id: task-93
type: task
title: hard rename init omni to agent in runtime help and tests
status: done
priority: 1
epic: epic-14
tags: [0_0_5, agent, init, cli]
owners: []
links: []
artifacts: [src/cli.ts, src/commands/init.ts, src/util/argparse.ts, tests/commands/init.test.ts, tests/commands/cli.test.ts, tests/util/argparse.test.ts]
relates: [dec-16, epic-14]
blocked_by: []
blocks: [test-51]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Replace the published product-specific init flag with a generic AI-agent bootstrap flag.

# Acceptance Criteria

- `mdkg init --agent` is the supported bootstrap flag
- `mdkg init --omni` fails with a clear migration message
- help and parser behavior match the runtime contract

# Files Affected

- `src/cli.ts`
- `src/commands/init.ts`
- `src/util/argparse.ts`
- `tests/commands/init.test.ts`
- `tests/commands/cli.test.ts`
- `tests/util/argparse.test.ts`

# Implementation Notes

- `--agent` stays independent from `--llm`
- removal is immediate because package usage is still minimal

# Test Plan

- `test-51`
- targeted init/cli/argparse tests

# Links / Artifacts

- `dec-16`
