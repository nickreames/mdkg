---
id: task-585
type: task
title: audit 0.3.8 changelog and publish readiness
status: done
priority: 1
tags: [release, audit, changelog, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, package.json, package-lock.json, README.md, CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js]
relates: []
blocked_by: []
blocks: []
refs: [goal-38]
context_refs: [goal-23, goal-37, task-436, task-573, test-296]
evidence_refs: [chk-279, goal-39]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Run a read-only release audit for the local `mdkg@0.3.8` candidate and record
whether it is ready to publish or needs a follow-up polish goal.

This task may update mdkg graph evidence only. It must not edit release notes,
source, docs, package metadata, generated docs, or publish-readiness scripts.

# Acceptance Criteria

- Inventory `origin/main..HEAD` and map publish-bound changes to
  `CHANGELOG.md`.
- Confirm registry state allows `mdkg@0.3.8`.
- Confirm version references in public docs/generated surfaces either match
  `0.3.8` or are intentionally version-neutral.
- Run full local and npm dry-run package gates.
- Produce either a ready audit checkpoint or a follow-up polish goal with exact
  source/docs/package changes.

# Files Affected

- Expected graph-only changes: this task, `goal-38`, `test-297`, audit
  checkpoint, optional follow-up polish goal, and regenerated mdkg index/event
  state.
- Explicitly out of scope: `CHANGELOG.md`, `README.md`,
  `CLI_COMMAND_MATRIX.md`, source, docs, package files, generated docs, and
  `scripts/assert-publish-ready.js`.

# Implementation Notes

- Treat changelog/version drift as publish blockers even if
  `scripts/assert-publish-ready.js` passes.
- If `npm view mdkg@0.3.8 version` returns a version, the audit is blocked by
  registry immutability.
- If `npm publish --dry-run` fails only because of a confirmed readiness gap,
  record the exact failure in the follow-up polish goal.
- No real publish, tag, push, deploy, or downstream mutation is allowed.

# Test Plan

- Execute `test-297`.
- Run the required checks listed on `goal-38`.
- Finish with `node dist/cli.js validate --changed-only --json`,
  `git diff --check`, `git diff --cached --check`, and staged name-status proof.

# Results / Evidence

- Result: blocked for publish, audit objective satisfied by creating follow-up
  `goal-39`.
- Audit checkpoint: `chk-279`.
- Git freshness: `git fetch origin main` passed, and
  `git rev-list --left-right --count origin/main...HEAD` returned `0 15`.
- Registry: latest `mdkg` is `0.3.7`; `mdkg@0.3.8` returned `E404`.
- Changelog blocker: MANIFEST/SPEC notes are under `## Unreleased`, not in the
  `0.3.8` section.
- Version blocker: `README.md` and `CLI_COMMAND_MATRIX.md` still advertise
  `0.3.7`.
- Command-checker blocker: `npm run docs:check-commands` reports two failures
  for `mdkg manifest list --json` and `mdkg manifest show ... --json`.
- CLI confirmation: `node dist/cli.js manifest list --json` and
  `node dist/cli.js manifest show spec.mdkg-cli --json` both pass.
- Package gates before the blocker: build, tests, CLI check, contract, docs
  check, readiness assertions, isolated-cache pack, and many prepublish smokes
  passed before publish dry-run stopped at `smoke:mdkg-dev-docs`.

# Links / Artifacts

- `CHANGELOG.md`
- `package.json`
- `package-lock.json`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `scripts/assert-publish-ready.js`
- `origin/main..HEAD`
- `chk-279`
- `goal-39`
