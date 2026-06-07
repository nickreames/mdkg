---
id: task-307
type: task
title: add packed temp-repo CLI UX polish smoke
status: done
priority: 1
epic: epic-64
parent: goal-10
tags: [smoke, cli, temp-repo, polish]
owners: []
links: []
artifacts: [scripts://smoke-cli-ux-polish.js, tests://smoke-cli-ux-polish, temp://mdkg-cli-ux-polish.TZ03Kz]
relates: []
blocked_by: [task-306]
blocks: [task-308, test-120]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add a packed temp-repo smoke proving the polished 0.3.0 UX works from an
installed tarball rather than repo internals.

# Acceptance Criteria

- Add `scripts/smoke-cli-ux-polish.js`.
- Add `npm run smoke:cli-ux-polish`.
- Add the smoke to `prepublishOnly` after `smoke:work-invocation`.
- The smoke packs/installs mdkg into a temp prefix and uses only the installed
  `mdkg` binary against `/private/tmp/mdkg-cli-ux-polish.XXXXXX/repo`.
- The smoke covers no-SPEC validation, SPEC/WORK creation/discovery,
  trigger/order/receipt verification, queue enqueue bridge, search/show, and
  help text assertions.

# Files Affected

- `scripts/smoke-cli-ux-polish.js`
- `package.json`
- `package-lock.json`

# Implementation Notes

- Reuse smoke helper patterns from existing packed smokes.
- Do not import internal TypeScript helpers in the smoke.

# Test Plan

- `npm run smoke:cli-ux-polish`
- `npm run prepublishOnly`

# Links / Artifacts

- `test-120`
