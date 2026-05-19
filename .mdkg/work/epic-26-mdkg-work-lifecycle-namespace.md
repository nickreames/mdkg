---
id: epic-26
type: epic
title: mdkg work lifecycle namespace
status: done
priority: 3
tags: [future, cli, work, work-order, receipt, lifecycle]
owners: []
links: []
artifacts: [src/commands/work.ts, src/cli.ts, tests/commands/archive_work.test.ts, tests/commands/bundle_import.test.ts, scripts/smoke-archive-work.js, README.md, CLI_COMMAND_MATRIX.md, CHANGELOG.md]
relates: [epic-24, epic-25]
blocked_by: []
blocks: []
refs: [rule-3, edd-3, edd-8]
aliases: [mdkg-work-namespace, work-lifecycle-helpers]
skills: []
created: 2026-05-17
updated: 2026-05-18
---

# Goal

Add future lifecycle helpers under `mdkg work ...` for reusable contracts,
orders, receipts, and artifact registration.

# Scope

This namespace should make the reusable workflow loop ergonomic while keeping
mdkg as semantic memory and discovery rather than the canonical execution
database.

Intended command family:
- work contract discovery and inspection
- work order semantic mirror creation and status updates
- receipt semantic mirror creation and verification updates
- artifact/source registration against receipts and work orders

# Milestones

- Design `mdkg work ...` around hardened `WORK.md`, `WORK_ORDER.md`, and
  `RECEIPT.md` schemas.
- Commands mutate semantic mirror files only.
- Receipts can register artifact refs and archive sidecar refs without implying
  ledger or payment mutation.
- Packs include linked contract, order, receipt, feedback, dispute, proposal,
  and target context when appropriate.

# Current State

Epic-25 contract hardening is complete and the lifecycle namespace closeout is
done. The implemented command family supports semantic mirror contract, order,
receipt, and artifact registration workflows while preserving the canonical
system boundary outside mdkg.

Closeout completed:
- `task-155`: local id-or-qid mutation parity, append-dedupe behavior, explicit
  imported-qid read-only errors, deterministic JSON receipts, and docs/help
  parity.
- `task-156`: packed-package temp-repo smoke coverage for init, archive
  add/verify/compress, work contract/order/receipt creation, qid-based order and
  receipt updates, artifact registration, validate, index, show, pack, archive
  verify, and doctor.

# Out of Scope

- No ledger, payment, inventory, or marketplace mutation.
- No direct runtime execution engine inside mdkg.
- No canonical replacement for Postgres-backed production state.

# Risks

- A broad command namespace can expand the primary CLI surface too quickly.
- Operators may mistake semantic mirror updates for canonical execution state
  unless receipts and docs make the boundary explicit.
- Lifecycle helpers should not make manual Markdown review impossible.

# Links / Artifacts

- `epic-25`
- `epic-24`
- Future implementation should add command matrix and fixture coverage.
- Verification gate:
  - `node --test dist/tests/commands/archive_work.test.js dist/tests/commands/bundle_import.test.js`
  - `npm run test`
  - `npm run cli:check`
  - `node dist/cli.js validate`
  - `npm run smoke:archive-work`
  - `npm run smoke:matrix`
  - `npm run smoke:init`
  - `npm run smoke:visibility`
  - `npm pack --dry-run --json`
  - `npm publish --dry-run`
  - `git diff --check`
