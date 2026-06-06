---
id: task-265
type: task
title: packed global temp E2E and npm publish closeout
status: done
priority: 1
epic: epic-29
parent: goal-7
tags: [project-db, queue, e2e, npm, release]
owners: []
links: []
artifacts: []
relates: [goal-7, epic-29, task-264, test-97]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Run final release gates, publish `mdkg@0.2.0`, install it globally from npm, and
prove public queue behavior in a fresh temp repo.

# Acceptance Criteria

- Registry guard confirms npm latest is below `0.2.0` before publish.
- Full prepublish/dry-run gate passes with `smoke:db-queue-cli`.
- Real npm publish succeeds using exported `NPM_TOKEN`.
- `/opt/homebrew/bin/mdkg --version` reports `0.2.0` after npm global install.
- Temp E2E uses only the global binary and covers queue lifecycle plus snapshot
  drain/paused policies.
- Goal completion evidence includes temp path and command gate summary.

# Files Affected

- `.mdkg/work/goal-7-*.md`
- `.mdkg/work/task-265-*.md`
- optional checkpoint closeout node

# Implementation Notes

- Do not tag or push.
- Stop if npm denies publish or `/opt/homebrew` global install.

# Completion Evidence

- `npm view mdkg@latest version --prefer-online` returned `0.1.10` before the
  publish attempt, so `0.2.0` was still clear at the registry guard.
- `npm publish --dry-run` passed after the full `prepublishOnly` ladder,
  including `smoke:db-queue-cli`, `smoke:db-events`, `smoke:db-materializer`,
  and `smoke:db-snapshot`.
- A local tarball install placed `mdkg@0.2.0` at `/opt/homebrew/bin/mdkg` and
  `npm list -g mdkg --depth=0` reported `mdkg@0.2.0`.
- Global temp E2E passed at
  `/private/tmp/mdkg-public-queue-0.2.0.647Lzo/repo` using only
  `/opt/homebrew/bin/mdkg`.
- A temporary npm userconfig mapped the exported `NPM_TOKEN` to npm registry
  auth and `npm whoami` reported `nickreames`.
- Real `npm publish --registry=https://registry.npmjs.org/` succeeded with
  `+ mdkg@0.2.0`.
- `npm view mdkg@0.2.0 version --prefer-online` returned `0.2.0` and
  `npm view mdkg dist-tags --json --prefer-online` reported
  `{ "latest": "0.2.0" }`.
- `npm install -g mdkg@0.2.0 --registry=https://registry.npmjs.org/
  --foreground-scripts` installed the public package into `/opt/homebrew`.
- Registry-installed global E2E passed at
  `/private/tmp/mdkg-public-queue-registry-0.2.0.ks9F87/repo` using only
  `/opt/homebrew/bin/mdkg`.

# Test Plan

- `npm view mdkg@latest version --prefer-online`
- `npm publish`
- `npm install -g mdkg@0.2.0`
- temp repo E2E using `mdkg db queue ...`

# Links / Artifacts

- checkpoint: `chk-39`
