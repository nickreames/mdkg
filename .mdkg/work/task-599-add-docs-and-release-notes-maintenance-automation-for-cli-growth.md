---
id: task-599
type: task
title: add docs and release notes maintenance automation for CLI growth
status: done
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, docs, automation, release-notes, changelog]
owners: []
links: []
artifacts: [scripts, CLI_COMMAND_MATRIX.md, CHANGELOG.md, docs]
relates: []
blocked_by: [task-594]
blocks: [test-305, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Add or extend checks that keep CLI command docs, first-party skills, changelog
release notes, and public release-note inputs current as mdkg capabilities grow.

# Acceptance Criteria

- Automation catches command examples that no longer match the CLI.
- Publish-readiness checks can detect stale public version/release-note drift.
- Changelog/release-note inputs are structured enough for the `0.4.0` public
  release notes page.
- Existing docs checks remain deterministic and runnable locally.

# Files Affected

- scripts and docs-checking helpers
- `CLI_COMMAND_MATRIX.md`
- generated docs inputs/outputs as required
- `CHANGELOG.md` checks, not release content unless implementation requires it

# Implementation Notes

- Prefer checks that fail with actionable diagnostics.
- Avoid duplicating release copy outside `CHANGELOG.md` unless generated or
  reconciled.

# Test Plan

- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- focused check fixtures for command and changelog drift
- `test-305`

# Links / Artifacts

- `edd-57`

# Implementation Evidence

- Added `scripts/generate-release-notes-data.js`, a deterministic `CHANGELOG.md` parser/checker that generates `docs/_generated/release-notes.json` with package version, latest release, unreleased item count, per-release sections, highlights, and legacy undated release support.
- Added public changelog freshness checks requiring the recent generated releases to be represented in both docs changelog summary pages.
- Updated `docs/src/content/docs/project/changelog.md` and `docs/project/changelog.md` to include the already-shipped `0.3.8` release summary.
- Updated `docs/_generated/README.md` to name `release-notes.json` as generated from `CHANGELOG.md`.
- Added package scripts:
  - `docs:release-notes`
  - `docs:release-notes:check`
  - expanded `docs:generate`
  - expanded `docs:check`
- `docs:check` now verifies generated CLI docs, generated release-notes data, and public command examples in one gate.
- `prepublishOnly` now runs `npm run docs:check` between command-contract validation and graph validation.
- `scripts/assert-publish-ready.js` now enforces the docs script wiring, release-notes generator presence, command-example checking in `docs:check`, and `prepublishOnly` docs-gate order.

# Verification Evidence

- `node scripts/generate-release-notes-data.js --write` passed and generated `docs/_generated/release-notes.json`.
- `npm run docs:check` passed:
  - generated CLI docs check passed.
  - release notes data check passed.
  - command-example check passed with `scanned_files: 50`, `checked_examples: 392`, `failed_examples: 0`.
- `node scripts/assert-publish-ready.js` passed.
