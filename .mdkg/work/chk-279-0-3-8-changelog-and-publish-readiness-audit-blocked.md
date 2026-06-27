---
id: chk-279
type: checkpoint
title: 0.3.8 changelog and publish readiness audit blocked
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, package.json, package-lock.json, scripts/assert-publish-ready.js, scripts/check-doc-command-examples.js]
relates: [goal-38, task-585, test-297]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-38, task-585, test-297, goal-37]
evidence_refs: [goal-39]
aliases: []
skills: []
scope: [goal-38, task-585, test-297, goal-39]
created: 2026-06-26
updated: 2026-06-26
---
# Summary

Read-only-against-source audit of the local `mdkg@0.3.8` release candidate is
complete.

Outcome: not publish-ready yet. The package version is available on npm and
most local gates pass, but changelog/version metadata and docs command-example
checking block the publish dry-run. Follow-up `goal-39` was created for the
required source/docs/package-readiness changes.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Added and closed audit goal `goal-38`.
- Added audit task `task-585` and audit test `test-297`.
- Added paused follow-up polish goal `goal-39` with tasks `task-586`,
  `task-587`, `task-588` and tests `test-298`, `test-299`.
- Regenerated `.mdkg/index/mdkg.sqlite`.

## Boundaries

- in scope: mdkg graph evidence, npm registry read checks, local package gates,
  dry-run package/publish checks, and follow-up graph planning.
- out of scope: editing `CHANGELOG.md`, source, docs, package files, generated
  docs, readiness scripts, real npm publish, tag, push, deploy, DNS, analytics,
  or downstream repos.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `0.3.8` remains the intended next npm publish target.
- Because readiness gaps are source/docs/package changes, this audit created
  `goal-39` instead of fixing them in-place.
- The default npm cache EPERM is local-environment noise; isolated-cache pack
  passed and is the expected release gate style.

# Implementation Summary

- No publish-bound files changed.
- The follow-up goal is decision-complete and paused.
- `goal-38` is ready to be marked achieved because it produced the required
  blocked-readiness audit and follow-up lane.

# Audit Findings

- Reviewed surfaces: `origin/main..HEAD`, `CHANGELOG.md`, `README.md`,
  `CLI_COMMAND_MATRIX.md`, generated docs, `package.json`, `package-lock.json`,
  `scripts/assert-publish-ready.js`, `scripts/check-doc-command-examples.js`,
  npm registry metadata, package dry-run, and publish dry-run.
- Finding 1: MANIFEST/SPEC release note is still under `## Unreleased`; for
  target `0.3.8`, the note should be folded into the `0.3.8` section.
- Finding 2: `README.md` and `CLI_COMMAND_MATRIX.md` still advertise `0.3.7`
  while package metadata and generated docs say `0.3.8`.
- Finding 3: `scripts/assert-publish-ready.js` passes despite stale public
  version references, so it should gain a targeted drift assertion.
- Finding 4: `scripts/check-doc-command-examples.js` rejects real
  `mdkg manifest list/show` examples, causing `smoke:mdkg-dev-docs` and the
  full publish dry-run to fail.
- Residual risk: after `goal-39` fixes these gaps, rerun the full isolated-cache
  publish dry-run before any real publish decision.

# Verification / Testing

## Command Evidence

- command: `git fetch origin main`
- result: passed.
- command: `git rev-list --left-right --count origin/main...HEAD`
- result: `0 15`.
- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result: `0.3.7`.
- command: `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`
- result: npm `E404` / version not found.
- command: `npm run build`
- result: passed.
- command: `npm run test`
- result: passed, 518 tests, 0 failures.
- command: `npm run cli:check`
- result: passed.
- command: `npm run cli:contract`
- result: passed, contract hash
  `7731504607851c08dd0b6fe1c29f58cc47271fdc20073e9ca0a010eefa9c2a77`.
- command: `npm run docs:check`
- result: passed.
- command: `node scripts/assert-publish-ready.js`
- result: passed.
- command: `npm pack --dry-run --json`
- result: failed with local default npm cache `EPERM`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- result: passed; tarball `mdkg-0.3.8.tgz`, 174 files.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- result: failed in `smoke:mdkg-dev-docs` because `npm run docs:check-commands`
  rejected `mdkg manifest list/show` examples.
- command: `node dist/cli.js manifest list --json`
- result: passed.
- command: `node dist/cli.js manifest show spec.mdkg-cli --json`
- result: passed.
- command: `npm run docs:check-commands`
- result: failed with two README example failures for `mdkg manifest list` and
  `mdkg manifest show`.
- command: `node dist/cli.js validate --json`
- result: passed with one expected `manifest.compat.spec_legacy` warning.
- command: `node dist/cli.js validate --changed-only --json`
- result: passed with no warnings.
- command: `git diff --check`
- result: passed.

## Pass / Fail Status

- status: blocked for publish, audit achieved by creating follow-up `goal-39`.

## Known Warnings

- `root:spec.mdkg-cli` intentionally remains a legacy `SPEC.md` dogfood record
  during the one-compatibility-release bridge.
- Local default `~/.npm` cache has root-owned files; use
  `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for release dry-runs.

# Known Issues / Follow-ups

- `goal-39`: implement the release metadata and docs command-checker polish.
- Rerun isolated-cache pack and publish dry-run after `goal-39` changes.

## Follow-up Refs

- `goal-39`
- `task-588`
- `task-586`
- `task-587`
- `test-299`
- `test-298`

# Links / Artifacts

- `origin/main..HEAD`
- `CHANGELOG.md`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `scripts/check-doc-command-examples.js`
- `scripts/assert-publish-ready.js`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
