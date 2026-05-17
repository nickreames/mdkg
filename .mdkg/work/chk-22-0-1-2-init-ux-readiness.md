---
id: chk-22
type: checkpoint
title: 0.1.2 init UX readiness
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-131]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-131]
created: 2026-05-12
updated: 2026-05-12
---
# Summary

Completed the `mdkg@0.1.2` init UX and upgrade parity implementation. Fresh `mdkg init --agent` now creates the complete agent bootstrap in one pass, removed init flags fail before mutation, and base/agent init manifests are mode-aware.

# Scope Covered

- `task-131`
- init command behavior and receipts
- upgrade mode filtering
- public and seeded onboarding docs
- packed-package temp smoke coverage
- prepublish dry-run gate

# Decisions Captured

- `mdkg init --agent` is the only canonical AI-agent bootstrap flag.
- Base `mdkg init` remains available for non-agent markdown graph initialization.
- `mdkg upgrade` repairs legacy agent workspaces but does not implicitly add agent docs or default skills to base workspaces.
- `mdkg init` remains non-transactional in this patch release, guarded by preflight checks and partial-init failure receipts.

# Implementation Summary

- Added mode-aware init manifest creation.
- Added mirror collision preflight before seed writes.
- Expanded init success output to include manifest, ignore files, agent docs, core pins, event log, registry, and mirror sync actions.
- Added `scripts/smoke-init.js` and wired it into `prepublishOnly`.
- Updated README, command matrix, root agent docs, seeded init docs, and changelog for `0.1.2`.

# Verification / Testing

- Passed `npm run test`.
- Passed `npm run cli:check`.
- Passed `node dist/cli.js validate`.
- Passed `npm run smoke:consumer`.
- Passed `npm run smoke:matrix`.
- Passed `npm run smoke:upgrade`.
- Passed `npm run smoke:init`.
- Passed `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`.
- Passed `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`.
- Passed `git diff --check`.

# Known Issues / Follow-ups

- Real publish was intentionally not run in this pass.
- Local `~/.npm` still has the known cache ownership issue; release checks used `/private/tmp/mdkg-npm-cache`.

# Links / Artifacts

- dry-run publish result: `+ mdkg@0.1.2`
