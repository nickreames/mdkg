---
id: task-596
type: task
title: implement arbitrary skill mirror target paths with defaults preserved
status: done
priority: 1
epic: epic-199
parent: goal-41
tags: [0.3.9, skill-mirrors, config, agents, claude]
owners: []
links: []
artifacts: [src/commands/skill_mirror.ts, src/commands/init.ts, CLI_COMMAND_MATRIX.md]
relates: []
blocked_by: [task-594]
blocks: [test-303, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Make skill mirrors configurable as arbitrary repo-local paths while preserving
the existing `.agents/skills` and `.claude/skills` defaults.

# Acceptance Criteria

- Config can declare additional mirror target paths.
- `mdkg skill sync`, audit, and prune behavior respects configured targets.
- Unsafe or outside-repo paths fail closed.
- Existing default mirrors remain unchanged for `init --agent`.

# Files Affected

- `src/commands/skill_mirror.ts`
- `src/commands/init.ts`
- config schema and focused tests
- CLI docs/help snapshots as required

# Implementation Notes

- Do not require custom targets to be named agent surfaces.
- Mirror outputs remain generated projections; `.mdkg/skills/` stays canonical.
- Keep default product wrappers as compatibility behavior.

# Implementation Summary

- `src/commands/skill_mirror.ts` now resolves mirror roots from
  `customization.skill_mirrors.targets` in `.mdkg/config.json`, with
  `.agents/skills` and `.claude/skills` retained as defaults.
- `mdkg skill new`, `mdkg skill sync`, mirror preflight, validation audit,
  pruning, and scaffold helpers now share the configured target resolver.
- `mdkg init --agent` loads config before scaffolding mirrors so existing custom
  target configuration is honored.
- `mdkg upgrade` reports configured mirror paths in skill-mirror side effects
  and continues to preserve custom overlay policy.
- CLI help, `CLI_COMMAND_MATRIX.md`, and the skills registry wording now describe
  configured skill mirror targets rather than product-only mirrors.

# Verification Evidence

- `npm run build`: passed.
- `npm run build:test`: passed.
- `node --test dist/tests/commands/skill_mirrors.test.js`: 14 passed.
- `node --test dist/tests/commands/init.test.js`: 9 passed.
- `node --test dist/tests/commands/upgrade.test.js`: 12 passed.
- `node --test dist/tests/core/config.test.js`: 27 passed.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- `npm run smoke:init`: passed.
- `npm run smoke:upgrade`: passed.
- Custom temp repo `/private/tmp/mdkg-custom-mirror-smoke-kttLut`: `init
  --agent`, configured `.codex/skills`, `skill sync --json` reported `targets:
  3`, `.codex/skills/.../SKILL.md` files existed, `upgrade --json` reported
  customization overlay preservation, `index` then `validate --json` returned
  `ok: true` with zero warnings/errors.
- `node dist/cli.js validate --changed-only --json`: `ok: true`.
- `git diff --check`: clean.

# Test Plan

- Temp-repo smoke with a custom mirror path.
- Regression smoke for `.agents/skills` and `.claude/skills`.
- `test-303`

# Links / Artifacts

- `dec-52`
- `edd-56`
