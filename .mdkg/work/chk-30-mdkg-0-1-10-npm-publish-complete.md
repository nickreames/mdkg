---
id: chk-30
type: checkpoint
title: mdkg 0.1.10 npm publish complete
status: done
priority: 9
tags: [release, npm, project-db, materializer]
owners: []
links: []
artifacts: [npm-publish-mdkg-0.1.10, global-e2e-mdkg-global-0.1.10-iAbx9j]
relates: [goal-5, epic-33, task-250, task-251]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: []
created: 2026-06-05
updated: 2026-06-05
---
# Summary

Published `mdkg@0.1.10` to npm, installed the registry version globally on this
machine, and verified the global binary through a fresh temp-repo project DB E2E.
The npm `latest` dist-tag now resolves to `0.1.10`, and `/opt/homebrew/bin/mdkg`
also reports `0.1.10`.

# Scope Covered

- Source release metadata moved from already-published `0.1.9` to `0.1.10`.
- The changelog now separates `0.1.9` event/reducer foundations from the
  `0.1.10` materializer release.
- The `0.1.10` package contains the internal project DB queue, event, receipt,
  reducer, writer lease/CAS, snapshot, and materializer helper surfaces.

# Decisions Captured

- Used the exported `NPM_TOKEN` by writing a temporary token-backed npm user
  config under `/private/tmp`; removed that config after publish and install.
- Kept queue/event/reducer/lease/materializer helpers internal-only; no public
  `mdkg db queue`, `mdkg db event`, `mdkg db reducer`, `mdkg db lease`, or
  `mdkg db materializer` command was added.

# Implementation Summary

- Bumped `package.json`, `package-lock.json`, README, command matrix metadata,
  and changelog release notes to `0.1.10`.
- Published `mdkg@0.1.10` to the public npm registry after a successful dry-run.
- Installed `mdkg@0.1.10` globally through npm at the existing Homebrew prefix.

# Verification / Testing

- `npm ci`
- `npm run build`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- real `npm publish`
- `npm view mdkg version --registry=https://registry.npmjs.org/ --prefer-online`
  returned `0.1.10`.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/
  --prefer-online` returned `{"latest":"0.1.10"}`.
- `command -v mdkg` returned `/opt/homebrew/bin/mdkg`.
- `mdkg --version` returned `0.1.10`.
- `npm list -g mdkg --depth=0` showed `mdkg@0.1.10`.
- Fresh temp repo `/private/tmp/mdkg-global-0.1.10-iAbx9j/repo` passed global
  command E2E: `init --agent`, `db init/migrate/verify/stats`, snapshot
  seal/verify, task creation/start/update, search/show/pack/index/validate,
  ignore-policy checks, globally packaged internal materializer helper execution,
  post-materializer `db verify`, `db stats`, and `db snapshot verify`.
- Final local checks: `node dist/cli.js validate` and `git diff --check`.

# Known Issues / Follow-ups

- Commit/tag/push were not performed in this pass.
- The materializer helper remains internal; harden public path containment and
  ack/snapshot failure semantics before exposing a public worker or CLI surface.

# Links / Artifacts

- npm package: `mdkg@0.1.10`
- global E2E repo: `/private/tmp/mdkg-global-0.1.10-iAbx9j/repo`
