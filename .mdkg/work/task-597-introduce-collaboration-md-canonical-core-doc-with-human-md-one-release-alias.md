---
id: task-597
type: task
title: introduce COLLABORATION.md canonical core doc with HUMAN.md one release alias
status: done
priority: 1
epic: epic-200
parent: goal-41
tags: [0.3.9, collaboration, core-docs, compatibility]
owners: []
links: []
artifacts: [AGENT_START.md, .mdkg/core/HUMAN.md, assets/init/core]
relates: []
blocked_by: [task-594]
blocks: [test-304, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Introduce `COLLABORATION.md` as the canonical core collaboration profile while
keeping `HUMAN.md` as a one-release compatibility alias.

# Acceptance Criteria

- New agent init/upgrade flows prefer `COLLABORATION.md`.
- Existing `HUMAN.md` customizations are preserved and treated as legacy alias
  content for one release.
- AGENT_START and first-party skills point agents at `COLLABORATION.md` first.
- The transition is aligned with the accepted MANIFEST/SPEC bridge policy.

# Files Affected

- core docs and init assets
- upgrade behavior
- docs/help/skills that reference the collaboration profile

# Implementation Notes

- Do not delete `HUMAN.md` in `0.3.9`.
- A later follow-up goal should fade out both `HUMAN.md` and `SPEC.md` legacy
  aliases after the compatibility window.

# Test Plan

- Fresh init creates/uses the canonical collaboration doc.
- Upgrade fixture with legacy `HUMAN.md` preserves local content.
- `test-304`

# Links / Artifacts

- `dec-53`
- `dec-50`

# Implementation Evidence

- Added `.mdkg/core/COLLABORATION.md` as canonical `rule-7` and pinned it between `rule-soul` and the legacy `rule-human` alias.
- Kept `.mdkg/core/HUMAN.md` as a one-release compatibility alias and updated startup docs, init assets, root LLM hints, README, CLI matrix, and core rules to prefer COLLABORATION first.
- Updated `mdkg init --agent` to seed/pin COLLABORATION, keep HUMAN, write accurate init-manifest hashes after managed pin insertion, and include fallback-created core docs in the manifest only when init created them.
- Updated `mdkg upgrade --apply` to preserve customized protected core docs while allowing known managed seed hashes to refresh safely, including creation of missing COLLABORATION and preservation of custom HUMAN content.
- Added/updated init and upgrade coverage for COLLABORATION creation, HUMAN alias preservation, managed manifest hash accuracy, and the current shipped seed shape.

# Verification Evidence

- `npm run build` passed.
- `npm run build:test` passed.
- `node --test dist/tests/commands/init.test.js` passed: 9 tests.
- `node --test dist/tests/commands/upgrade.test.js` passed: 13 tests.
- `node --test dist/tests/commands/skill_mirrors.test.js` passed: 14 tests.
- `node --test dist/tests/core/config.test.js` passed: 27 tests.
- `npm run cli:check` passed.
- `npm run cli:contract` passed with command contract hash `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1`.
- `npm run smoke:init` passed.
- `npm run smoke:upgrade` passed.
