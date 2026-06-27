---
id: chk-315
type: checkpoint
title: mdkg 0.4.0 published to npm
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [https://www.npmjs.com/package/mdkg/v/0.4.0]
relates: [task-614]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-614]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Published `mdkg@0.4.0` to npm after explicit user approval.

The release commits were pushed to `origin/main` first, then the real npm
publish ran through the full `prepublishOnly` gate and uploaded `mdkg@0.4.0`
with the `latest` dist-tag.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Remote `main` advanced to `28ff45f`.
- npm registry now contains `mdkg@0.4.0`.
- `task-614` closed as done.

## Boundaries

- in scope: approved `git push origin main` and approved real npm publish.
- out of scope: git tag, Vercel deploy, DNS, analytics, Chrome live production
  validation, and final website launch closeout.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Website deployment remains blocked until `task-615` and `test-318`
  postpublish validation pass, then separate Vercel/deploy approval is given.

# Implementation Summary

`mdkg@0.4.0` is now published to npm from the pushed release commit.

# Implementation Details

- Code or graph surfaces changed: npm registry and pushed `origin/main`.
- Architecture or data-shape notes: none.
- Compatibility notes: the package still includes MANIFEST/SPEC compatibility
  templates and legacy `HUMAN.md` bridge assets.

# Verification / Testing

## Command Evidence

- command: `git push origin main`
- result: pushed `main` from `5e425ee` to `28ff45f`.
- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result before publish: `0.3.9`.
- command: `npm view mdkg@0.4.0 version --registry=https://registry.npmjs.org/`
- result before publish: expected npm 404, target unpublished.
- command: `npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- result: `nickreames`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- result: pass; npm reported `+ mdkg@0.4.0`.
- prepublish gate result: 528 tests passed; `cli:check`, `cli:contract`,
  `docs:check`, mdkg validation, all configured package smoke checks, and
  `node scripts/assert-publish-ready.js` passed.
- package upload details: filename `mdkg-0.4.0.tgz`, 176 files, package size
  about 341.6 kB, unpacked size about 1.8 MB, shasum
  `7571e07ef5fc671618c5737bdf096a5dc3df1f7b`.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: full graph validation during prepublish emitted the accepted legacy
  `SPEC.md` compatibility warning.

# Known Issues / Follow-ups

- `task-615` must validate npm registry state and temp install behavior.
- Vercel deployment and Chrome live production proof remain separate approval
  gates.

## Follow-up Refs

- `task-615`
- `test-318`
- `task-616`
- `task-617`

# Links / Artifacts

- npm package: `https://www.npmjs.com/package/mdkg/v/0.4.0`
- published commit: `28ff45f`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
