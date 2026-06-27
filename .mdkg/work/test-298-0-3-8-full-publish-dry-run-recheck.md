---
id: test-298
type: test
title: 0.3.8 full publish dry-run recheck
status: done
priority: 5
tags: [release, polish, test, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [package.json, package-lock.json, CHANGELOG.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-39, goal-38, task-585]
context_refs: [goal-38, task-585, task-586, task-587, task-588, test-299]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [docs-check-commands, smoke-mdkg-dev-docs, npm-pack-isolated-cache, npm-publish-dry-run-isolated-cache, mdkg-validate-clean]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate that the complete `0.3.8` release candidate can pass package dry-run
and publish dry-run gates after the polish tasks are complete.

# Target / Scope

- `goal-39`
- `task-586`
- `task-587`
- `task-588`
- `test-299`

# Preconditions / Environment

- Use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` because the default
  `~/.npm` cache was root-owned during the audit and caused `npm pack` EPERM.
- No real publish, tag, push, deploy, or downstream mutation is allowed.

# Test Cases

- `docs-check-commands`: `npm run docs:check-commands` exits 0.
- `smoke-mdkg-dev-docs`: `npm run smoke:mdkg-dev-docs` exits 0.
- `npm-pack-isolated-cache`: isolated-cache `npm pack --dry-run --json` exits 0
  and reports `mdkg-0.3.8.tgz`.
- `npm-publish-dry-run-isolated-cache`: isolated-cache `npm publish --dry-run`
  exits 0 without real publish.
- `mdkg-validate-clean`: full mdkg validation is ok with only accepted
  compatibility warnings, and changed-only validation is clean.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If publish dry-run fails after these fixes, keep this test open and record
  the new failing gate exactly.
