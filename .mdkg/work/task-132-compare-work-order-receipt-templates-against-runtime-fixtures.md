---
id: task-132
type: task
title: compare work order receipt templates against runtime fixtures
status: done
priority: 1
epic: epic-25
tags: [templates, work-order, receipt, runtime-contract, audit]
owners: []
links: []
artifacts: [.mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md, tests/fixtures/agent/valid/runtime-receipt/RECEIPT.md, npm run test, omni-room-runtime room-trio validate]
relates: [epic-25, epic-26]
blocked_by: []
blocks: [task-148]
refs: [edd-3, edd-8]
aliases: [runtime-template-comparison]
skills: []
created: 2026-05-17
updated: 2026-05-18
---

# Overview

Audit mdkg's generic `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md` templates
against the current `omni-room-runtime` fixture contracts before schema
hardening.

# Acceptance Criteria

- Current mdkg templates are compared against real runtime fixture fields.
- The audit distinguishes generic mdkg schema needs from consumer-specific
  runtime overlay needs.
- Gaps are captured for input refs, output descriptors, artifact refs, cost
  refs, proof or attestation refs, and verification status.
- The resulting recommendation keeps official npm package language generic and
  unbranded.

# Files Affected

- `.mdkg/templates/default/work.md`
- `.mdkg/templates/default/work_order.md`
- `.mdkg/templates/default/receipt.md`
- `src/graph/agent_file_types.ts`
- `tests/commands/agent_file_types.test.ts`

# Implementation Notes

- Use `/Users/nick/git/omni-room-runtime` as consumer evidence, not as public
  naming for mdkg.
- Preserve Postgres as canonical for production orders, receipts, disputes,
  ledger, payment, and marketplace state.
- Keep mdkg mirrors focused on committed semantic records, demos, fixtures,
  proposals, and reviewable evidence.

# Comparison Findings

The current mdkg templates already align with most runtime fixture needs:

- `WORK.md` supports dependency refs for skills, tools, models, WASM
  components, runtime images, subagents, required capabilities, input
  descriptors, output descriptors, pricing model, and receipt requirements.
- `WORK_ORDER.md` supports concrete request mirrors through `work_id`,
  `work_version`, `requester`, `order_status`, `request_ref`, `input_refs`,
  `requested_outputs`, `constraint_refs`, and `artifact_policy`.
- `RECEIPT.md` supports committed semantic result mirrors through
  `work_order_id`, `receipt_status`, `outcome`, `cost_ref`, `artifacts`,
  `proof_refs`, `attestation_refs`, `input_hashes`, and `output_hashes`.

The real `omni-room-runtime` room-trio fixture workspace validates with current
mdkg. Its committed fixtures are slightly older than the latest mdkg templates:
orders and receipts do not yet emit the richer optional frontmatter fields, but
those fields can be adopted by the runtime after the next mdkg publish.

# Decisions

- Add `receipt_status: superseded` to mdkg because runtime has a superseded
  receipt status and it is generic.
- Runtime-generated receipts should emit `input_hashes` and `output_hashes` in
  frontmatter when available, while keeping human-readable hash evidence in the
  body.
- Tool receipt evidence remains represented through optional `proof_refs` for
  now; no required `tool_receipts` field is added in this pass.
- `artifact://...` and `archive://...` stay separate. `artifact://...` names
  external or runtime-managed artifacts; `archive://...` names committed mdkg
  archive sidecars.
- Crate-local fixture-root strategy remains a runtime project decision.

# Results

- Added `receipt_status: superseded` support.
- Added generic runtime-style mdkg fixtures covering dependency refs, concrete
  work-order input/output metadata, receipt artifacts, proof refs, and hashes.
- Added invalid receipt-status fixture coverage so unsupported statuses still
  fail validation.
- Created `task-148` for post-publish repo handoff prompts.

# Test Plan

- This audit task should produce a schema proposal and fixture comparison.
- Later implementation should add validation fixtures before command helpers.

# Verification

- `npm run build && npm run build:test && node --test dist/tests/commands/agent_file_types.test.js`
- `node dist/cli.js --root /Users/nick/git/omni-room-runtime/tests/fixtures/runtime-images/room-trio/workspace validate --json`

The runtime fixture validation passed with one non-fatal bundled-template
fallback warning for the missing local `archive` template.

# Links / Artifacts

- `epic-25`
- `task-148`
- `/Users/nick/git/omni-room-runtime`
