---
id: task-607
type: task
title: run final mdkg 0.3.9 prepublish gates and push release commits
status: done
priority: 1
parent: goal-43
tags: [release, 0.3.9, prepublish, push]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-608]
refs: [goal-43, goal-42]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Run final prepublish gates for `mdkg@0.3.9`, prove registry availability, and
push the accepted local release history to `origin/main` before real npm
publish.

# Acceptance Criteria

- `origin/main...HEAD` is understood before push and release commits are pushed
  only after local gates pass.
- npm latest is still below `0.3.9` and `mdkg@0.3.9` is unpublished before real
  publish.
- `npm pack --dry-run --json` includes the 0.3.9 runtime payload, including
  `dist/cli.js`, `dist/init/config.json`, `dist/init/core/COLLABORATION.md`,
  `README.md`, `CLI_COMMAND_MATRIX.md`, `CHANGELOG.md`, seeded skills, and
  `scripts/postinstall.js`.
- `npm publish --dry-run` passes immediately before real publish.

# Files Affected

- No source/package/docs changes expected.
- Git remote refs are expected to change after `git push origin main`.

# Implementation Notes

- Treat mdkg.dev/docs.mdkg.dev live-current gaps as deferred to `goal-42`.
- Stop before publish if any local gate, registry check, pack dry-run, or
  publish dry-run fails.

# Test Plan

- `git fetch origin main`
- `git status --short --branch`
- `git rev-list --left-right --count origin/main...HEAD`
- `npm ci`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- `git diff --check`
- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- `git push origin main`

# Links / Artifacts

- `goal-43`
- `goal-42`
