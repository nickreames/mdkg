---
id: chk-291
type: checkpoint
title: goal-41 publish dry-run readiness proof
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-306]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-306]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

`test-306` passed. The `0.3.9` publish dry-run readiness contract is satisfied:
registry availability was checked, package dry-run passed, npm publish dry-run
passed, mdkg validation passed, and the no-real-publish boundary held.

# Scope Covered

`test-306`, with refs to `task-600`, `test-302`, `test-303`, `test-304`, and
`test-305`.

## Changed Surfaces

- mdkg test/checkpoint evidence for publish-readiness closeout.
- No source, docs, package, npm, tag, push, deploy, or downstream mutation was
  performed by this checkpoint itself.

## Boundaries

- in scope: test-proof summary for the completed dry-run readiness contract.
- out of scope: real npm publish, tag, push, deploy, post-publish validation,
  and downstream repo updates.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- Publish readiness can be recommended only after npm pack dry-run and npm
  publish dry-run both pass.
- Real publish remains a separate explicit approval boundary.

# Implementation Summary

No implementation happened in this test-proof checkpoint. The checkpoint records
the readiness proof for the completed `goal-41` implementation.

# Test Proof

- Test target: `mdkg@0.3.9` publish-readiness before explicit publish approval.
- Fixtures or temp repos: custom overlay/mirror temp-repo smoke covered
  config overlay preservation and configured skill mirror targets; npm pack and
  publish dry-runs used isolated cache `/private/tmp/mdkg-npm-cache`.
- Coverage gaps: real publish and post-publish temp global install were not run
  because they require a later explicit approval.

# Verification / Testing

## Command Evidence

- `npm run test`: passed, 528 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed with command contract hash
  `3c13c572c740f1e40db33fa5867fa227a8347df0750ef3beb0696d5931761a6c`.
- `npm run docs:check`: passed.
- `node scripts/assert-publish-ready.js`: passed.
- `npm run smoke:init`: passed for version `0.3.9`.
- `npm run smoke:upgrade`: passed for version `0.3.9`.
- `node dist/cli.js validate --json`: `ok: true`, with one accepted legacy
  `SPEC.md` compatibility warning.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, 0 warnings,
  0 errors.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: `0.3.8`.
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`: npm
  `E404`; target was not already published.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`:
  passed, producing `mdkg-0.3.9.tgz` with 176 files and required payload files
  present.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`:
  passed with status 0 and ended with `+ mdkg@0.3.9`.

## Pass / Fail Status

- status: pass. Final recommendation is publish ready pending explicit approval.

## Known Warnings

- Accepted warning: `root:spec.mdkg-cli` legacy SPEC compatibility warning.

# Known Issues / Follow-ups

- Real publish is still pending explicit approval.
- Post-publish validation must verify registry latest/dist-tags and a temp-dir
  global install of the latest package.

## Follow-up Refs

- `task-600`
- `goal-41`
- future publish/post-publish validation goal

# Links / Artifacts

- `chk-290`
- `task-600`
- local commit `84f920d feat: prepare mdkg 0.3.9 extensibility release`
- package dry-run shasum `dfbb65267a87f963e05a90705e44f7ae029e9ffd`

# Raw Content Safety

Evidence is summarized by command result, hashes, paths, and graph refs. No raw
secrets, raw prompts, provider payloads, npm tokens, or bulky execution traces
are stored here.
