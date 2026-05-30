---
id: task-159
type: task
title: init upgrade and seeded asset audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, init, upgrade, seeds]
owners: []
links: []
artifacts: [assets/init, scripts/smoke-init.js, scripts/smoke-upgrade.js]
relates: [epic-28, epic-18]
blocked_by: []
blocks: [task-163, task-164]
refs: [rule-4, rule-6]
aliases: [init-upgrade-seed-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Audit initialization, upgrade, and seeded asset behavior for existing and fresh
workspaces before release. Fresh successful initialization should not require
an immediate upgrade to complete missing managed assets.

# Acceptance Criteria

- Fresh base `mdkg init` creates coherent non-agent startup assets.
- Fresh `mdkg init --agent` creates complete agent bootstrap docs, skills,
  mirrors, registry, event log, and manifest.
- `mdkg upgrade` defaults to dry-run and reports safe writes clearly.
- `mdkg upgrade --apply` repairs legacy managed assets without overwriting
  customized files.
- Init manifests match actual managed files after fresh base and agent init.
- No stale `--llm`, `--agents`, `--claude`, or `--omni` onboarding guidance is
  present in generated docs.

# Files Affected

Read-only audit targets:
- `assets/init/`
- `src/commands/init.ts`
- `src/commands/upgrade.ts`
- `scripts/smoke-init.js`
- `scripts/smoke-upgrade.js`

# Implementation Notes

Use packed-package temp repos where possible so the audit exercises the package
users will install, not only the local source tree.

# Test Plan

- Run `npm run smoke:init`.
- Run `npm run smoke:upgrade`.
- Run `node dist/cli.js validate`.
- Inspect generated temp repo manifests if either smoke fails.

# Links / Artifacts

- `epic-28`
- `epic-18`

# Audit Evidence

- `npm run smoke:init` passed with packaged `mdkg@0.1.4`.
- `npm run smoke:upgrade` passed with packaged `mdkg@0.1.4`.
- `npm run test` passed 361 tests, including init and upgrade unit coverage:
  - base init passes doctor and validate without agent bootstrap
  - agent init creates startup docs, wrapper docs, skills, registry, event log,
    mirrors, and manifest entries
  - removed init flags fail before mutation with `mdkg init --agent` guidance
  - upgrade defaults to dry-run, preserves customizations, repairs legacy
    wrapper-doc gaps, migrates config, and reports safe apply metadata
- Seeded docs in `assets/init/AGENT_START.md`, `assets/init/README.md`, and
  `assets/init/CLI_COMMAND_MATRIX.md` document upgrade, archive, work,
  bundle, import, visibility, and capability surfaces.

# Result

Fresh init, agent init, upgrade dry-run/apply behavior, seeded assets, and
manifest parity are release-ready.
