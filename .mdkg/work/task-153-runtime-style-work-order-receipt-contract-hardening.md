---
id: task-153
type: task
title: runtime style work order receipt contract hardening
status: done
priority: 1
epic: epic-25
tags: [runtime-contract, work-order, receipt, fixtures, schema]
owners: []
links: []
artifacts: [tests/fixtures/agent/valid/runtime-work/WORK.md, tests/fixtures/agent/valid/runtime-order/WORK_ORDER.md, tests/fixtures/agent/valid/runtime-receipt/RECEIPT.md, omni-room-runtime room-trio validate, npm run test]
relates: [epic-25, epic-24, epic-26, task-132, task-152, task-154]
blocked_by: [task-152]
blocks: [task-154, task-155, task-156]
refs: [edd-3, edd-8]
aliases: [runtime-style-contract-hardening]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Finish generic runtime-style `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md`
contract hardening using the room-trio fixture as read-only design evidence.

# Acceptance Criteria

- Generic fixtures cover dependency refs, capability refs, input refs,
  requested outputs, constraint refs, artifact policy, proof refs,
  attestation refs, artifacts, and input/output hashes.
- `artifact://...` remains an external or runtime-managed artifact identity.
- `archive://...` remains only for committed mdkg archive sidecars and is
  validated against local archive nodes.
- `pack` includes the linked spec, work contract, work order, receipt, and
  related archive sidecar context where appropriate.
- The public package surface stays generic; any `omni-room-runtime` details stay
  in graph evidence or comments for test fixture provenance.

# Files Affected

- `src/graph/agent_file_types.ts`
- `src/graph/validate_graph.ts`
- `tests/commands/agent_file_types.test.ts`
- `tests/fixtures/agent/valid/`
- `tests/fixtures/agent/invalid/`
- `.mdkg/templates/default/work.md`
- `.mdkg/templates/default/work_order.md`
- `.mdkg/templates/default/receipt.md`

# Implementation Notes

Use `/Users/nick/git/omni-room-runtime/tests/fixtures/runtime-images/room-trio/workspace`
as read-only inspiration only. Do not edit that repository in this task.

# Results

- Confirmed generic runtime-style fixtures cover dependency refs, capability
  refs, input refs, requested outputs, constraint refs, artifact policy, proof
  refs, attestation refs, artifacts, and input/output hashes.
- Confirmed `artifact://...` remains an external/runtime-managed artifact
  identity while `archive://...` remains a local mdkg archive sidecar ref that
  validation resolves locally.
- Confirmed `pack` includes the linked runtime-style spec, work contract, work
  order, receipt, and archive sidecar context through the existing pack
  traversal.
- Compared against the `omni-room-runtime` room-trio fixture read-only; no
  consumer repo files were modified.

# Test Plan

- Run focused agent workflow fixture tests.
- Run `node dist/cli.js --root /Users/nick/git/omni-room-runtime/tests/fixtures/runtime-images/room-trio/workspace validate --json`.
- Run `npm run test`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Verification

- `npm run test`
- `node dist/cli.js --root /Users/nick/git/omni-room-runtime/tests/fixtures/runtime-images/room-trio/workspace validate --json`
- `node dist/cli.js validate`

# Links / Artifacts

- `task-132`
- `task-152`
- `task-154`
- `/Users/nick/git/omni-room-runtime`
