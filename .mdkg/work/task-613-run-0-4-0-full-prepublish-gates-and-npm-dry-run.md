---
id: task-613
type: task
title: run 0.4.0 full prepublish gates and npm dry run
status: done
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, npm, prepublish, dry-run, registry, release-gate]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-612, test-316]
blocks: [test-317, task-614, task-606, test-312]
refs: [task-612, test-316, task-606, test-312]
context_refs: []
evidence_refs: [chk-313]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Run the complete local and registry prepublish gate for `mdkg@0.4.0` without
publishing.

# Acceptance Criteria

- Registry checks prove `mdkg@0.4.0` is still unpublished and npm latest is
  below `0.4.0` before any real publish attempt.
- Full local gates pass from the `0.4.0` source state: build, tests, CLI checks,
  contract checks, docs checks, publish-readiness script, mdkg validation, and
  website/docs smoke checks.
- `npm pack --dry-run --json` proves the payload includes expected runtime,
  init, docs, changelog, command matrix, skill, and postinstall assets.
- `npm publish --dry-run --registry=https://registry.npmjs.org/` passes with
  isolated npm cache.
- Npm auth is checked only through a temp userconfig that references
  `${NPM_TOKEN}`; no token value is printed or committed.
- Real publish remains blocked until `task-614` and explicit approval.

# Files Affected

- command receipts and mdkg evidence only

# Implementation Notes

- This task may write local cache/temp artifacts but must not publish, tag,
  push, deploy, or change provider state.
- If package version is not `0.4.0`, stop and record the version drift as a
  blocker instead of treating dry-run output as publish readiness.

# Test Plan

- `git fetch origin main`
- `git status --short --branch`
- `git log --oneline origin/main..HEAD`
- `npm ci`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- `test-317`

# Links / Artifacts

- `task-612`
- `test-316`
- `task-614`
