---
id: task-378
type: task
title: add 0.3.3 goal lifecycle temp-repo smoke
status: done
priority: 1
epic: epic-88
parent: goal-16
tags: [0.3.3, smoke, temp-repo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-377]
blocks: [test-159, test-160, test-161, task-379]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Add a temp-repo smoke proving single-active, archived-goal, subgraph, and strict doctor behavior from a packed CLI.

# Acceptance Criteria

- Smoke creates a fresh repo and exercises goal activation.
- Smoke proves archived goals are non-actionable but readable.
- Smoke proves subgraph active goals remain independent.
- Smoke is included in prepublish gates.

# Files Affected

- scripts/**
- package.json
- tests/**

# Implementation Notes

- Use installed packed CLI, not internal imports.
- Keep stdout JSON clean for JSON commands.

# Test Plan

- Run new smoke directly.
- Run `npm run prepublishOnly`.

# Links / Artifacts

- 2026-06-16 implementation:
  - Added `scripts/smoke-goal-lifecycle.js`.
  - Added `npm run smoke:goal-lifecycle`.
  - Added `smoke:goal-lifecycle` to `prepublishOnly` immediately after `smoke:spike`.
  - Extended `scripts/assert-publish-ready.js` to require the new smoke gate and updated stale `goal select` onboarding assertions to `goal activate`.
- Smoke coverage:
  - Packs mdkg, installs it into a temp npm prefix, and uses only the installed CLI.
  - Creates a fresh temp repo and proves `goal activate` pauses the prior local active goal.
  - Proves archived goals are list/search/show readable but rejected from select/activate and return no actionable `goal next`.
  - Creates a child mdkg graph with its own active goal, bundles it, registers it as a root subgraph, and proves root validation still passes while the imported active goal remains read-only context.
  - Runs strict doctor in the temp root after the lifecycle/subgraph flow.
- Verification:
  - `npm run smoke:goal-lifecycle` passed with `smoke:goal-lifecycle ok`.
  - `npm run cli:contract` passed with command contract hash `b5752d6b367616471f18af7240260005ccc58c45c0f70e4a27fa5f0e4a7e7b6f`.
  - `node scripts/assert-publish-ready.js` passed.
  - `node dist/cli.js validate --json` passed with 0 warnings/errors.
  - `git diff --check` passed.
