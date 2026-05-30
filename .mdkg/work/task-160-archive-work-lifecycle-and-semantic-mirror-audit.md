---
id: task-160
type: task
title: archive work lifecycle and semantic mirror audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, archive, work, receipt]
owners: []
links: []
artifacts: [src/commands/archive.ts, src/commands/work.ts, scripts/smoke-archive-work.js]
relates: [epic-28, epic-24, epic-25, epic-26]
blocked_by: []
blocks: [task-163, task-164]
refs: [rule-3, rule-4, edd-3, edd-8]
aliases: [archive-work-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Audit archive sidecars, deterministic ZIP caches, work lifecycle helpers, and
semantic mirror boundary language before release.

# Acceptance Criteria

- `mdkg archive add/list/show/verify/compress` behavior matches docs and
  templates.
- `mdkg validate` and `mdkg archive verify` both enforce ZIP hash, payload
  hash, payload byte size, and readable ZIP integrity.
- Archive sidecars redact outside-repo source paths and warn about large ZIP
  caches through doctor.
- Work contract, order, receipt, and artifact commands create validation-clean
  semantic mirror chains.
- Work order and receipt update commands accept local ids or local qids,
  append refs without duplicates, and reject imported qids.
- Docs/templates clearly state mdkg mirrors are not canonical Postgres,
  payment, ledger, marketplace, fulfillment, execution, or secret state.

# Files Affected

Read-only audit targets:
- `src/commands/archive.ts`
- `src/commands/work.ts`
- `.mdkg/templates/default/archive.md`
- `.mdkg/templates/default/work.md`
- `.mdkg/templates/default/work_order.md`
- `.mdkg/templates/default/receipt.md`

# Implementation Notes

Keep `artifact://...` and `archive://...` separate in all audit evidence.
`artifact://...` identifies external/runtime artifacts; `archive://...` names
committed mdkg archive sidecars.

# Test Plan

- Run `npm run smoke:archive-work`.
- Run `node --test dist/tests/commands/archive_work.test.js`.
- Run `node dist/cli.js validate`.
- Confirm package docs and seeded docs describe the same semantic boundary.

# Links / Artifacts

- `epic-24`
- `epic-25`
- `epic-26`

# Audit Evidence

- `npm run smoke:archive-work` passed with packaged `mdkg@0.1.4`.
- `npm run test` passed archive and work lifecycle coverage for:
  - deterministic archive sidecars and ZIP caches
  - missing raw source with valid committed ZIP cache
  - missing ZIP, corrupt ZIP, payload SHA-256 mismatch, and byte-size mismatch
  - outside-repo source path redaction to `external:<basename>`
  - large archive ZIP doctor warning threshold and `0` disable behavior
  - local archive ref validation for `archive://...`
  - work contract/order/receipt semantic mirror creation and update
  - `receipt_status: superseded`
  - local id-or-qid mutation for order, receipt, and artifact commands
  - imported qid mutation rejection with read-only guidance
- Docs and templates preserve the semantic mirror boundary: mdkg stores
  committed reviewable mirrors only, while production order, receipt, feedback,
  dispute, payment, ledger, marketplace, fulfillment, and execution state remain
  canonical outside mdkg.
- The `artifact://...` and `archive://...` split is documented and covered:
  runtime artifacts remain external refs, while archive refs point to committed
  mdkg sidecars.

# Result

Archive sidecars, strict ZIP integrity, work/order/receipt mirrors, and
semantic boundary docs are release-ready.
