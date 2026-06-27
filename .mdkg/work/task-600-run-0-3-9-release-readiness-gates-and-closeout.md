---
id: task-600
type: task
title: run 0.3.9 release readiness gates and closeout
status: done
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, release-readiness, prepublish, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-595, task-596, task-597, task-598, task-599, test-302, test-303, test-304, test-305]
blocks: []
refs: [task-595, task-596, task-597, task-598, task-599]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Run the full `0.3.9` change audit and release-readiness ladder after
implementation tasks and contracts pass.

# Acceptance Criteria

- Build, tests, CLI checks, docs checks, publish-readiness assertions, pack
  dry-run, and publish dry-run pass.
- Git/changelog audit maps every publish-bound change to release notes,
  version references, tests, docs, and package payload.
- Temp-repo proof covers config overlays, custom mirror targets,
  `COLLABORATION.md`/`HUMAN.md`, and MANIFEST/SPEC compatibility.
- A checkpoint records command evidence, known warnings, package payload
  summary, registry state, and no-publish/no-tag/no-push boundaries.
- The closeout recommends either `publish ready pending explicit approval` or
  lists exact remaining gaps.
- `goal-41` can be marked achieved only after the dry-run ladder is clean.

# Files Affected

- mdkg graph/checkpoint evidence
- generated index state

# Implementation Notes

- This task may run publish dry-run only; real npm publish is a later explicit
  approval boundary.
- Use isolated npm cache under `/private/tmp/mdkg-npm-cache`.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `git log --oneline origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- changelog/release note mapping for every publish-bound change
- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`
- `npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- `node dist/cli.js validate --json`
- `git diff --check`

# Results / Evidence

Release-readiness outcome: publish ready pending explicit approval.

Change audit:

- Target package version is `0.3.9` in `package.json` and
  `package-lock.json`.
- Public version references in `README.md`, `CLI_COMMAND_MATRIX.md`, generated
  command docs, and init assets were updated or checked for drift.
- `CHANGELOG.md` has a `0.3.9 - 2026-06-27` section covering config overlays,
  arbitrary skill mirrors, the `COLLABORATION.md` bridge, refreshed skills,
  release-note data automation, and release-readiness gates.
- Release notes data generation produced
  `docs/_generated/release-notes.json`; docs changelog pages were checked for
  recent release coverage.

Registry state:

- `npm view mdkg version --registry=https://registry.npmjs.org/` returned
  `0.3.8`.
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`
  returned npm `E404`; `0.3.9` was not already published at audit time.

Gate evidence:

- `npm run test`: passed, 528 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed, command contract hash
  `3c13c572c740f1e40db33fa5867fa227a8347df0750ef3beb0696d5931761a6c`.
- `npm run docs:check`: passed; command examples check scanned 50 files and
  validated 392 examples with 0 failures.
- `node scripts/assert-publish-ready.js`: passed.
- `npm run smoke:init`: passed for version `0.3.9`.
- `npm run smoke:upgrade`: passed for version `0.3.9`.
- Custom temp-repo overlay and custom mirror smoke passed after `mdkg index`,
  preserving config overlays and syncing three mirror targets.
- `node dist/cli.js validate --json`: `ok: true`, 1 accepted warning for
  legacy `.mdkg/work/mdkg-cli/SPEC.md` compatibility.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, 0 warnings,
  0 errors.
- `git diff --check`: passed.

Package dry-run:

- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed for `mdkg-0.3.9.tgz`.
- Payload summary: 176 files, unpacked size 1,803,915 bytes, shasum
  `dfbb65267a87f963e05a90705e44f7ae029e9ffd`.
- Required payload files were present: `dist/cli.js`, `dist/init/config.json`,
  `dist/init/core/COLLABORATION.md`,
  `dist/init/skills/default/author-mdkg-skill/SKILL.md`, `README.md`,
  `CLI_COMMAND_MATRIX.md`, `CHANGELOG.md`, and `scripts/postinstall.js`.

Publish dry-run:

- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
  passed with status 0.
- The npm lifecycle executed the full `prepublishOnly` chain, including the
  build/test/CLI/docs/smoke ladder and final `node scripts/assert-publish-ready.js`.
- npm reported `Publishing to https://registry.npmjs.org/ with tag latest and
  default access (dry-run)` and ended with `+ mdkg@0.3.9`.
- No real npm publish, tag, push, deploy, or downstream repo mutation was run.

Known warning:

- `root:spec.mdkg-cli` still emits `manifest.compat.spec_legacy` for legacy
  `SPEC.md`. This is expected under the one-release compatibility bridge and is
  not a `0.3.9` publish blocker.

# Links / Artifacts

- `goal-41`
- `test-306`
