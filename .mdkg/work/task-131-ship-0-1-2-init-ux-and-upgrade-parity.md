---
id: task-131
type: task
title: Ship 0.1.2 init UX and upgrade parity
status: done
priority: 1
tags: [init, upgrade, release, ux]
owners: []
links: []
artifacts: [npm run test, npm run cli:check, node dist/cli.js validate, npm run smoke:consumer, npm run smoke:matrix, npm run smoke:upgrade, npm run smoke:init, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-12
updated: 2026-05-12
---
# Overview

Prepare `mdkg@0.1.2` as a patch release focused on init UX, removed flag clarity, and init/upgrade parity.

# Acceptance Criteria

- `mdkg init --agent` is the single canonical complete AI-agent bootstrap path.
- Removed init flags fail before mutation with guidance to use `mdkg init --agent`.
- Fresh base init and fresh agent init write mode-aware manifests matching actual managed files.
- Fresh `mdkg init --agent` does not require immediate `mdkg upgrade --apply` to create missing bootstrap docs.
- Packed-package temp smoke covers init, removed flags, idempotency, doctor, validate, upgrade dry-run, task creation, and pack generation.

# Files Affected

- `src/commands/init.ts`
- `src/commands/init_manifest.ts`
- `src/commands/upgrade.ts`
- `src/commands/skill_mirror.ts`
- `src/cli.ts`
- `scripts/smoke-init.js`
- `scripts/smoke-command-matrix.js`
- `scripts/smoke-consumer.js`
- `scripts/smoke-upgrade.js`
- `scripts/assert-publish-ready.js`
- `tests/commands/*`
- `README.md`, `CLI_COMMAND_MATRIX.md`, `CHANGELOG.md`, `AGENT_START.md`
- `assets/init/*`
- `.mdkg/core/*`

# Implementation Notes

- Added mode-aware init manifests so base init claims only base assets and agent init claims startup docs, wrapper docs, and default skills.
- Changed `mdkg init --agent` to create `AGENTS.md`, `CLAUDE.md`, `AGENT_START.md`, `llms.txt`, `CLI_COMMAND_MATRIX.md`, skills, registry, events, core pins, and mirrors in one pass.
- Added preflight validation for seed config parseability and unmanaged skill mirror collisions before writing repo seed files.
- Kept non-transactional init writes but added partial-init failure receipt output for unexpected late failures.
- Updated upgrade filtering so non-agent workspaces do not acquire agent docs or default skills implicitly, while legacy agent workspaces can be repaired.
- Added packed init smoke coverage and included it in `prepublishOnly`.

# Test Plan

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm run smoke:init`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- npm dry-run tarball: `mdkg-0.1.2.tgz`
- dry-run publish result: `+ mdkg@0.1.2`
