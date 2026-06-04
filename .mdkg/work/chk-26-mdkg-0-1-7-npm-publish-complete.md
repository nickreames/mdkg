---
id: chk-26
type: checkpoint
title: mdkg 0.1.7 npm publish complete
status: done
priority: 1
tags: [release, npm, 0_1_7]
owners: []
links: [npm:mdkg]
artifacts: [npm publish, npm view mdkg@latest version, npm view mdkg dist-tags, npm pack --dry-run --json, npm publish --dry-run, npm run prepublishOnly]
relates: []
blocked_by: []
blocks: []
refs: [rule-5, goal-2, task-242, task-231]
aliases: []
skills: []
scope: []
created: 2026-06-04
updated: 2026-06-04
---
# Summary

Published `mdkg@0.1.7` to npm on 2026-06-04.

The release ships the DB command namespace, project DB migration/verify/stats foundation, sealed project DB snapshot commands, subgraph sync/materialization work, and the documented packaging/readiness updates already closed under `goal-1`, `goal-2`, `task-231`, and `task-242`.

# Scope Covered

- npm package `mdkg@0.1.7`
- source release docs and generated package assets
- full npm `prepublishOnly` release gate
- npm registry publication and post-publish verification

# Decisions Captured

- `rule-5` remains the release/versioning authority.
- `goal-2` and `task-242` are the latest DB snapshot/readiness closeout anchors for this release.
- `task-231` remains the packed-install DB foundation smoke anchor.

# Implementation Summary

- Updated `CHANGELOG.md` from `0.1.7 - Unreleased` to `0.1.7 - 2026-06-04`.
- Used a temporary npm user config at `/private/tmp/mdkg-npm-token.npmrc` containing only the literal `${NPM_TOKEN}` placeholder so the exported token stayed out of command output.
- Published with default npm access and `latest` dist-tag.

# Verification / Testing

- `npm run prepublishOnly`: passed. Included 405 tests, `npm run cli:check`, `node dist/cli.js validate`, consumer/matrix/upgrade/init/capability/DB/DB snapshot/archive-work/bundle/subgraph/visibility/SQLite/parallel/goal smokes, and `node scripts/assert-publish-ready.js`.
- `npm pack --dry-run --json`: passed. Produced `mdkg-0.1.7.tgz`, 139 files, 206.8 kB package size, 989.6 kB unpacked size, shasum `d8fbd4821aa4ea0f28b8797981294050efa22ea3`.
- `npm publish --dry-run --registry=https://registry.npmjs.org/`: passed with `+ mdkg@0.1.7`.
- `npm whoami --registry=https://registry.npmjs.org/` with token config: authenticated as `nickreames`.
- `npm publish --registry=https://registry.npmjs.org/`: passed with `+ mdkg@0.1.7`.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`: verified `latest` is `0.1.7`.
- `npm view mdkg@latest version --prefer-online --registry=https://registry.npmjs.org/`: verified `0.1.7`.
- `npm view mdkg@0.1.7 version --prefer-online --registry=https://registry.npmjs.org/`: verified `0.1.7`.

# Known Issues / Follow-ups

- Some unqualified npm metadata reads can briefly return stale cached values immediately after publish; `mdkg@latest`, explicit `mdkg@0.1.7`, and dist-tags verified correctly after publication.
- Commit, tag, and push release bookkeeping still need to be done after final repo validation.

# Links / Artifacts

- npm:mdkg
- `CHANGELOG.md`
- `package.json`
- `package-lock.json`
- `scripts/assert-publish-ready.js`
