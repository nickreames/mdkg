---
id: chk-123
type: checkpoint
title: Generated command docs readiness gate added
status: backlog
priority: 9
tags: [cli-spec, docs, smoke, prepublish, 0-3-9]
owners: []
links: []
artifacts: [scripts/smoke-command-docs.js, package.json, scripts/assert-publish-ready.js, dist/command-contract.json]
relates: [task-346]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-346]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Added the generated command docs readiness gate for `epic-73`. The package now
has a packed smoke that reads the shipped `dist/command-contract.json`, renders
a generated command reference with the contract hash embedded, executes
representative documented examples with the installed CLI, and validates the
temp repo.

# Scope Covered

- `task-346`
- `test-131`

# Decisions Captured

- `edd-22`
- The generated reference remains a local/package smoke artifact for now; it is
  not a public mdkg.dev deployment.
- The smoke checks the source marker and contract hash so hand-maintained
  command tables cannot satisfy the gate.

# Implementation Summary

- Added `scripts/smoke-command-docs.js`.
- Added `npm run smoke:command-docs`.
- Added `smoke:command-docs` to `prepublishOnly` immediately after
  `smoke:branch-conflicts`.
- Extended `scripts/assert-publish-ready.js` to require the docs smoke and its
  contract-source assertions.
- The smoke packs and installs mdkg into a temp prefix, loads the packaged
  command contract, writes `.mdkg/generated/command-reference.md` in a fresh
  temp repo, executes representative JSON examples, and runs final validation.

# Verification / Testing

- `npm run smoke:command-docs` passed with temp root
  `/private/tmp/mdkg-command-docs.cztmSx`.
- `npm run test` passed 454/454 tests after the smoke was added.
- `npm run cli:check` passed.
- `npm run cli:contract` passed with contract hash
  `e2218e4a4fc5ad35efa356786b9d54e572555fe81bbcb03a7ea2da667ca737be`.
- `node scripts/assert-publish-ready.js` passed.
- `npm run prepublishOnly` passed end to end, including the new
  `smoke:command-docs` with temp root `/private/tmp/mdkg-command-docs.enIvlL`.

# Known Issues / Follow-ups

- `task-330` remains the planning task for mdkg.dev launch architecture. No
  public website or deployment was implemented in this slice.

# Links / Artifacts

- `scripts/smoke-command-docs.js`
- `dist/command-contract.json`
- generated smoke artifact:
  `/private/tmp/mdkg-command-docs.enIvlL/repo/.mdkg/generated/command-reference.md`
