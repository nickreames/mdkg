---
id: task-339
type: task
title: add fix plan temp repo smoke docs and publish gate
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, smoke, docs, publish-readiness, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-336, task-337, task-338]
blocks: [test-136]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Add release-facing docs, command matrix entries, publish-readiness checks, and a
temp-repo smoke for `mdkg fix plan --json`.

# Acceptance Criteria

- `README.md`, `CLI_COMMAND_MATRIX.md`, and init assets document `mdkg fix plan`
  as a dry-run planning command.
- A temp-repo smoke creates broken or stale repair scenarios and proves
  `fix plan --json` writes nothing.
- `package.json` exposes a smoke script for the fix-plan surface.
- `prepublishOnly` and publish-readiness assertions include the smoke after it
  is stable.
- The smoke covers at least one index/cache, one refs, and one duplicate-id
  planning scenario.

# Files Affected

- `scripts/smoke-fix-plan.js`
- `package.json`
- `scripts/assert-publish-ready.js`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/README.md`
- `assets/init/CLI_COMMAND_MATRIX.md`

# Implementation Notes

- Use a fresh `/private/tmp/mdkg-fix-plan.XXXXXX/repo` and the built CLI.
- Hash or snapshot the repo before and after the smoke to prove no mutation.
- Keep examples focused on plan output, not apply behavior.

# Test Plan

- `npm run smoke:fix-plan`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `git diff --check`

# Links / Artifacts

- `edd-19`
- `test-136`
- `chk-110`
