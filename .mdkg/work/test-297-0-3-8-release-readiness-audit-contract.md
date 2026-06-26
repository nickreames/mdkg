---
id: test-297
type: test
title: 0.3.8 release readiness audit contract
status: done
priority: 1
tags: [release, audit, changelog, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, package.json, package-lock.json, README.md, CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js]
relates: []
blocked_by: []
blocks: []
refs: [goal-38, task-585]
context_refs: [goal-23, goal-37, task-436, test-296]
evidence_refs: [chk-279, goal-39]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [changelog-mapping, version-reference-parity, registry-availability, publish-dry-run, graph-boundary-clean]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate the audit decision for `mdkg@0.3.8`: either publish-ready with
evidence, or blocked with a complete follow-up polish goal.

# Target / Scope

- `goal-38`
- `task-585`
- `origin/main..HEAD`
- release-facing docs, package metadata, registry state, and npm dry-run gates

# Preconditions / Environment

- Current date is 2026-06-26.
- No real publish, tag, push, deploy, or package/source edit is allowed.
- Network access is required only for npm registry read checks and publish
  dry-run.

# Test Cases

- `changelog-mapping`: every outgoing commit is represented by `0.3.8` release
  notes or captured as a follow-up polish change.
- `version-reference-parity`: public version references agree with
  `package.json` or are captured as a follow-up polish change.
- `registry-availability`: npm latest is below `0.3.8` and `0.3.8` is not
  already published.
- `publish-dry-run`: isolated-cache `npm publish --dry-run` passes without
  real publish.
- `graph-boundary-clean`: final staged diff is mdkg graph/index evidence only.

# Results / Evidence

- `changelog-mapping`: failed; MANIFEST/SPEC release note remains under
  `## Unreleased` while the MANIFEST/SPEC implementation commits are in the
  outgoing `0.3.8` stack.
- `version-reference-parity`: failed; `README.md` and `CLI_COMMAND_MATRIX.md`
  still advertise `0.3.7`, while `package.json`, `package-lock.json`, and
  generated docs report `0.3.8`.
- `registry-availability`: passed; npm latest is `0.3.7`, and `mdkg@0.3.8`
  returned `E404`.
- `publish-dry-run`: failed; isolated-cache publish dry-run stopped in
  `smoke:mdkg-dev-docs` because `docs:check-commands` rejected real
  `mdkg manifest list/show` README examples.
- `graph-boundary-clean`: passed for the audit phase; changed-only validation
  is clean for mdkg graph/index changes, and no source release files were edited.

# Notes / Follow-ups

- Follow-up implementation lane: `goal-39`.
