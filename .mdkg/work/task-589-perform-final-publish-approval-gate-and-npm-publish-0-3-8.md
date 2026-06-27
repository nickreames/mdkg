---
id: task-589
type: task
title: perform final publish approval gate and npm publish 0.3.8
status: backlog
priority: 1
parent: goal-40
tags: [release, publish, npm, 0-3-8]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-592, test-301]
blocks: []
refs: [goal-39, chk-280]
context_refs: [goal-39, chk-280]
evidence_refs: []
aliases: [publish-0-3-8-gate, npm-publish-0-3-8]
skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Run the final approval and release gate for `mdkg@0.3.8`, then perform the
real npm publish only after explicit human approval. This task is blocked until
the upgrade migrator proves safe `SPEC.md` to `MANIFEST.md` renames.

# Acceptance Criteria

- `task-592` and `test-301` are done before this task starts.
- The repo is clean and release metadata still targets `0.3.8`.
- `origin/main` contains the exact publish commit, or the approval turn
  explicitly authorizes pushing `main` first.
- npm latest is below `0.3.8` and `mdkg@0.3.8` is not already published before
  the real publish.
- The full local build/test/docs/package gate passes.
- The final `npm publish --dry-run --registry=https://registry.npmjs.org/`
  passes immediately before the real publish.
- A human explicitly authorizes `npm publish` in the execution turn.
- The real publish succeeds and the bounded receipt records registry state,
  package version, tarball summary, and no raw credentials or bulky logs.

# Files Affected

- No source files should change during the publish command itself.
- mdkg graph evidence/checkpoints may be written.
- Git refs may be pushed or tagged only with explicit approval.

# Implementation Notes

- Treat npm publish, git push, and git tag as separate public side effects.
- Required remote-origin rule: do not publish from a commit that is not present
  on `origin/main` unless the approval explicitly includes pushing it first.
- Prefer recording npm output summaries, package hashes, and registry queries
  instead of raw logs.
- If npm reports that `0.3.8` already exists, stop and create a follow-up
  release recovery goal instead of republishing.

# Test Plan

- `git status --short --branch`
- `git fetch origin main`
- `git rev-list --left-right --count origin/main...HEAD`
- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/`
- after explicit approval: `npm publish --registry=https://registry.npmjs.org/`
- post-publish registry check: `npm view mdkg version
  --registry=https://registry.npmjs.org/`

# Links / Artifacts

- `goal-39`
- `chk-280`
- `task-592`
- `test-301`
