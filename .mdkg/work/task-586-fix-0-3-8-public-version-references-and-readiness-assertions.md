---
id: task-586
type: task
title: fix 0.3.8 public version references and readiness assertions
status: todo
priority: 2
tags: [release, polish, version, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js]
relates: []
blocked_by: []
blocks: []
refs: [goal-39, goal-38, task-585]
context_refs: [goal-38, task-585]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Update public source-version references to `0.3.8` and harden publish-readiness
assertions so this drift is caught before future dry-run or publish attempts.

# Acceptance Criteria

- `README.md` line 17 says `Current package version in source: \`0.3.8\``.
- `CLI_COMMAND_MATRIX.md` frontmatter says `package_version_in_source: 0.3.8`.
- `scripts/assert-publish-ready.js` reads `package.json` and fails if either
  public source-version reference does not match the package version.
- Existing generated docs that already report `0.3.8` remain unchanged unless
  regeneration is required by the normal docs gate.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `scripts/assert-publish-ready.js`

# Implementation Notes

- Keep the assertion narrow: compare the explicit current-version strings only.
- Do not require historical changelog entries to stop mentioning older
  versions.
- Do not bump `package.json` beyond `0.3.8`.

# Test Plan

- `node scripts/assert-publish-ready.js`
- `npm run docs:check`
- `npm run cli:check`
- `git diff --check`

# Links / Artifacts

- `goal-38`
- `task-585`
