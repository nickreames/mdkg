---
id: task-1
type: task
title: add AGENTS.md and CLAUDE.md generation to init
status: done
priority: 1
epic: epic-1
tags: [init, llm]
owners: []
links: []
artifacts: [init-llm]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Add init-time generation for AGENTS.md and CLAUDE.md so LLM consumers get guidance without reading the README.

# Acceptance Criteria

- `mdkg init --agents` creates `AGENTS.md`.
- `mdkg init --claude` creates `CLAUDE.md`.
- `mdkg init --llm` creates both files.
- Help text documents the flags.
- Tests cover creation behavior.

# Files Affected

- assets/init/AGENTS.md
- assets/init/CLAUDE.md
- scripts/copy-init-assets.js
- src/commands/init.ts
- src/cli.ts
- src/util/argparse.ts
- tests/commands/init.test.ts
- .mdkg/core/rule-3-cli-contract.md

# Implementation Notes

- Seed AGENTS/CLAUDE from dist/init assets and copy into repo root on request.
- `--llm` enables both files; `--force` overwrites when needed.

# Test Plan

- `npm run test`
- `mdkg init --llm --root .context/init-smoke`

# Links / Artifacts

- init-llm
