---
id: task-156
type: task
title: work lifecycle packed temp repo smoke closeout
status: todo
priority: 1
epic: epic-26
tags: [work, lifecycle, smoke, temp-repo, package]
owners: []
links: []
artifacts: []
relates: [epic-26, epic-24, epic-25, task-152, task-153, task-155]
blocked_by: [task-155]
blocks: []
refs: [edd-3, edd-8, rule-3]
aliases: [work-lifecycle-packed-smoke]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Prove the full work lifecycle through a packed-package temp repo before the next
publish readiness pass.

# Acceptance Criteria

- The smoke packs the current mdkg package and installs it into an isolated temp
  npm prefix.
- A fresh temp repo runs `mdkg init --agent`.
- The installed CLI creates and verifies an archive sidecar, creates a work
  contract, creates a work order, creates a receipt, registers an artifact, and
  updates order and receipt status.
- The temp repo passes `mdkg validate`, `mdkg index`, `mdkg show`, and
  `mdkg pack <receipt-id> --dry-run --stats`.
- `npm run smoke:archive-work` covers this path and is included in the
  prepublish gate.

# Files Affected

- `scripts/smoke-archive-work.js`
- `package.json`
- `tests/commands/archive_work.test.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

This task should be completed after `task-155` so the smoke reflects the final
work lifecycle command surface. Keep the smoke deterministic and local; no
network, registry publish, runtime execution, payment, ledger, marketplace, or
Postgres mutation.

# Test Plan

- Run `npm run smoke:archive-work`.
- Run `npm run test`.
- Run `npm run cli:check`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Links / Artifacts

- `task-152`
- `task-153`
- `task-155`
- `epic-26`
