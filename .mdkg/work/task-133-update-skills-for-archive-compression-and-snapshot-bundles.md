---
id: task-133
type: task
title: update skills for archive compression and snapshot bundles
status: done
priority: 2
epic: epic-22
tags: [skills, compression, snapshot-bundle, archive, commit-cadence]
owners: []
links: []
artifacts: [.mdkg/skills/verify-close-and-checkpoint/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, assets/init/skills/default/verify-close-and-checkpoint/SKILL.md, assets/init/skills/default/build-pack-and-execute-task/SKILL.md, scripts/assert-publish-ready.js, scripts/smoke-init.js]
relates: [epic-22, epic-24, epic-27]
blocked_by: []
blocks: []
refs: [rule-4, edd-3, edd-8]
aliases: [snapshot-skills-update]
skills: []
created: 2026-05-17
updated: 2026-05-17
---

# Overview

Updated internal and seeded mdkg skills so configured commit and closeout
workflows refresh archive compression and full `.mdkg` graph snapshot bundles
before commit.

# Acceptance Criteria

- Commit-cadence guidance includes configured archive compression before durable
  commit boundaries.
- Closeout guidance includes configured full `.mdkg` snapshot bundle refresh.
- Skills distinguish private-local tracked bundles from public/export-safe
  bundles.
- Skills continue to preserve one durable writer per run and avoid commit spam.
- Init and upgrade-managed default skills carry the same guidance.
- Publish readiness and init smoke checks assert the seeded guidance is present.

# Files Affected

- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
- `.mdkg/skills/build-pack-and-execute-task/SKILL.md`
- `assets/init/skills/default/*`

# Implementation Notes

- `verify-close-and-checkpoint` now recommends `mdkg archive compress --all`,
  `mdkg archive verify --json`, `mdkg bundle create --profile private`, and
  bundle verification before commits when the repo tracks archive caches or
  bundles.
- `build-pack-and-execute-task` remains patch-only and hands archive/bundle
  refresh back to the orchestrator stage.
- Official npm docs stay generic and do not mention Omni.

# Test Plan

- `mdkg skill sync`
- `node dist/cli.js skill validate`
- `npm run build && npm run build:test && node --test dist/tests/commands/init.test.js dist/tests/commands/upgrade.test.js`
- `npm run smoke:init`
- `node scripts/assert-publish-ready.js`

# Links / Artifacts

- `epic-22`
- `epic-24`
- `epic-27`
