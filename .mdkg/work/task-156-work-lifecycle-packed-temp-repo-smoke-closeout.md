---
id: task-156
type: task
title: work lifecycle packed temp repo smoke closeout
status: done
priority: 1
epic: epic-26
tags: [work, lifecycle, smoke, temp-repo, package]
owners: []
links: []
artifacts: [scripts/smoke-archive-work.js, tests/commands/archive_work.test.ts, tests/commands/bundle_import.test.ts, README.md, CLI_COMMAND_MATRIX.md]
relates: [epic-26, epic-24, epic-25, task-152, task-153, task-155]
blocked_by: []
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

`npm run smoke:archive-work` now packs the current package, installs it into an
isolated temp npm prefix, initializes a fresh git repo with `mdkg init --agent`,
archives source and artifact files, verifies and recompresses archive caches,
creates the contract/order/receipt chain, mutates order and receipt status with
local qids, shows the final order and receipt, validates, indexes, searches,
packs the receipt, verifies all archives, and runs doctor.

# Test Plan

- Full release gate evidence is recorded in `epic-26` closeout.

# Links / Artifacts

- `task-152`
- `task-153`
- `task-155`
- `epic-26`
