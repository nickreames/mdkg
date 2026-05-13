---
id: chk-21
type: checkpoint
title: v0.1.1 upgrade fallback readiness
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-130]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-130]
created: 2026-05-12
updated: 2026-05-12
---
# Summary

Prepared the v0.1.1 patch for upgrade/schema fallback readiness. Older
workspaces can now use packaged built-in template schemas when local templates
for newly introduced mdkg types are missing, and upgrade receipts now expose
safe apply metadata before any mutation.

# Scope Covered

- `task-130`
- v0.1.1 package metadata and release notes
- bundled template schema fallback
- upgrade receipt safety fields and ignored event-log handling
- packed-package smoke coverage for old-template and ignored-event workspaces

# Decisions Captured

- Local templates remain authoritative when present.
- Missing built-in templates can fall back to installed package defaults.
- Explicit missing custom template sets remain fatal so custom workflows do not
  accidentally scaffold from the built-in default set.
- Preserved local customizations are safe to apply around when writes are only
  managed creates/updates.
- Ignored event logs are skipped; users can opt in with `mdkg event enable`.

# Implementation Summary

Added a shared built-in template resolver, wired schema loading and default
`mdkg new` paths through bundled fallback, and made doctor/validate surface
fallback warnings. Explicit `--template <set>` misses remain fatal. Upgrade
receipts now include `safe_to_apply`, `will_write_paths`,
`preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`.

# Verification / Testing

- `npm run test` passed with 319 tests.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- `npm run smoke:consumer` passed for version 0.1.1.
- `npm run smoke:matrix` passed for version 0.1.1.
- `npm run smoke:upgrade` passed for version 0.1.1.
- `mdkg new ... --template custom` now fails with `template not found` when
  the custom set is missing.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed and included `dist/templates/builtin.js` plus `dist/init/templates`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed.

# Known Issues / Follow-ups

- `omni-web` no longer fails on missing local agent workflow templates, but its
  current graph still has a separate strict error in `task-156`:
  `blocked_by invalid id reference: backend-login-session-contract`.
- `mdkg show task-157` in `omni-web` remains blocked by that unrelated invalid
  node until the repo fixes or canonicalizes the `blocked_by` value.

# Links / Artifacts

- `task-130`
- `cmd:npm_publish_dry_run_ok_2026_05_12`
- `omni-web:task-157`
