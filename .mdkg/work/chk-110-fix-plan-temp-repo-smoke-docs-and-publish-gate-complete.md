---
id: chk-110
type: checkpoint
title: fix plan temp repo smoke docs and publish gate complete
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-339]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-339]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-339` is complete. `mdkg fix plan` is documented, covered by a packed
temp-repo smoke, included in `prepublishOnly`, and enforced by publish-readiness
assertions.

# Scope Covered

- `task-339`
- `test-136`
- `epic-70`

# Decisions Captured

- `fix plan` is release-facing as a dry-run planning surface.
- `fix apply` remains intentionally deferred and unavailable.
- Publish readiness now requires the fix-plan smoke and documentation contract.

# Implementation Summary

- Added `scripts/smoke-fix-plan.js`.
- Added `npm run smoke:fix-plan`.
- Added `smoke:fix-plan` to `prepublishOnly` after operator-health.
- Extended `scripts/assert-publish-ready.js` to require the compiled fix command,
  smoke script, docs, CLI matrix entries, and explicit apply deferral language.
- Updated root and init README docs plus command matrices with `mdkg fix plan`
  usage and receipt-shape expectations.

# Verification / Testing

- `npm run smoke:fix-plan`
  - passed with temp root `/private/tmp/mdkg-fix-plan.j7VQjS`
  - packed tarball `/private/tmp/mdkg-fix-plan.j7VQjS/pack/mdkg-0.3.0.tgz`
- `node scripts/assert-publish-ready.js`
- `npm run cli:check`
- `npm run prepublishOnly`
  - passed; included `smoke:fix-plan` with temp root
    `/private/tmp/mdkg-fix-plan.4U9DIF`
  - completed through `smoke:goal` and publish readiness.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  - passed; tarball id `mdkg@0.3.0`
  - package included `dist/commands/fix.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
  - passed; included `smoke:fix-plan` with temp root
    `/private/tmp/mdkg-fix-plan.Y2c8V1`
  - completed with `+ mdkg@0.3.0`
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `git diff --check`

# Known Issues / Follow-ups

- Future repair apply mode remains deferred until a separate design and safety
  gate.
- No npm publish, tag, or push was performed in this checkpoint.

# Links / Artifacts

- `scripts/smoke-fix-plan.js`
- `scripts/assert-publish-ready.js`
- `package.json`
- `README.md`
- `assets/init/README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
