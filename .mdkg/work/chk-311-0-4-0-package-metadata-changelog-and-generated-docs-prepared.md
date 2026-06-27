---
id: chk-311
type: checkpoint
title: 0.4.0 package metadata changelog and generated docs prepared
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-612]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-612]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Prepared the source release target for `mdkg@0.4.0`.

`package.json`, `package-lock.json`, source-visible version references,
`CHANGELOG.md`, generated CLI docs, generated release-note data, docs changelog
pages, and mdkg.dev launch copy now agree on the `0.4.0` release target.
Public npm availability and live production claims remain gated on later
postpublish and postdeploy evidence.

# Scope Covered

- `task-612`
- `test-316`
- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `docs/_generated/`
- `docs/src/content/docs/project/changelog.md`
- `docs/project/changelog.md`
- `mdkg-dev/src/pages/index.astro`
- `mdkg-dev/CLAIMS.md`
- `scripts/smoke-mdkg-dev.js`
- `scripts/smoke-mdkg-dev-seo.js`

## Changed Surfaces

- Bumped source package metadata and lockfile to `0.4.0`.
- Added a dated `0.4.0` section to `CHANGELOG.md`.
- Regenerated CLI reference and release-note data from the current build and
  changelog.
- Updated public changelog pages so `0.4.0` is the latest card/detail while
  required historical releases remain present.
- Updated mdkg.dev launch copy from old published-baseline wording to
  release-target wording with explicit postpublish/postdeploy gates.
- Updated mdkg-dev smokes to assert the new release-target copy.

## Boundaries

- in scope: local source release-prep edits and generated docs.
- out of scope: real npm publish, git push/tag, Vercel deploy, DNS, analytics,
  and live production validation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Source metadata may target `0.4.0` before publish, but public copy must not
  claim npm or live production availability until later postpublish/postdeploy
  proof exists.

# Implementation Summary

`0.4.0` now describes the public launch readiness surface: package/source
version alignment, changelog/release-note coverage, docs and mdkg.dev launch
copy, Vercel currentness blockers, Chrome live-validation blockers, and explicit
approval boundaries.

# Implementation Details

- Code or graph surfaces changed: package metadata, changelog, README, command
  matrix, generated docs, public changelog pages, mdkg.dev homepage/claims, and
  mdkg-dev smoke scripts.
- Architecture or data-shape notes: generated release-note data now reports
  `package_version: "0.4.0"` and `latest_release: "0.4.0"`.
- Compatibility notes: historical `0.3.9`, `0.3.8`, and `0.3.7` changelog
  coverage remains visible so generated release-note checks pass.

# Verification / Testing

## Command Evidence

- command: `npm run docs:generate`
- result: pass after restoring the required `0.3.7` public changelog mention.
- command: `npm run docs:check`
- result: pass; 402 command examples checked with zero failures.
- command: `node scripts/assert-publish-ready.js`
- result: pass.
- command: `npm --prefix docs run build`
- result: pass; 28 pages built.
- command: `npm --prefix mdkg-dev run build`
- result: pass.
- command: `npm run smoke:mdkg-dev-docs`
- result: pass; 62 required files.
- command: `npm run smoke:mdkg-dev`
- result: pass after updating release-target smoke expectations.
- command: `npm run smoke:mdkg-dev-seo`
- result: pass.
- command: `node dist/cli.js validate --changed-only --json`
- result: pass.
- command: `node dist/cli.js validate --json`
- result: pass with one accepted legacy `SPEC.md` compatibility warning.
- command: `git diff --check`
- result: pass.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: full graph validation still reports the accepted legacy
  `.mdkg/work/mdkg-cli/SPEC.md` compatibility warning.

# Known Issues / Follow-ups

- Real npm publish is still not performed and remains approval-gated.
- Vercel deployment and Chrome live validation are still future blockers.

## Follow-up Refs

- `test-316`
- `task-613`
- `test-317`
- `task-614`
- `task-615`
- `test-318`
- `task-616`
- `test-319`
- `task-617`
- `test-320`

# Links / Artifacts

- `docs/_generated/release-notes.json`
- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
