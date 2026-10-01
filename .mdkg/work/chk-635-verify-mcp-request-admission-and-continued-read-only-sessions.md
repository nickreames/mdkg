---
id: chk-635
type: checkpoint
title: Verify MCP request admission and continued read-only sessions
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-58-baseline.json, .mdkg/artifacts/goal-86/bug-58-full-verification.json, .mdkg/artifacts/goal-86/bug-58-installed-verification.json]
relates: [bug-58]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-59]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-634]
aliases: []
skills: []
scope: [bug-58]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

1993 full tests,41 focused cases and105 installed cases pass; blocked context untouched; release NOT_READY

# Scope Covered

- Completed node: bug-58 (Keep malformed MCP requests from terminating the local serving session)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Shared MCP envelope admission;35 new wire/session/limit regressions;
  Bug58/Goal86 lifecycle and sanitized qualification receipts.
- SQLite projection remains separate preserved dirty custody, not commit scope.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- One writer on main under Goal86. No blocked context, old report recovery,
  remote Git, publication, providers, canonical migration or bundle refresh.
- Adjacent correctness blocker only; preserve the fourteen-finding count and
  existing transport framing, version and bounded read-only tool surface.

# Implementation Summary

- Unknown values are validated before field access; non-object/array envelopes,
  invalid versions/methods/IDs and unstructured params refuse before dispatch.
- Fresh baseline:22 pass/13 fail. Fixed cases retain subsequent ping/show and
  complete filesystem inventories. One read-only reviewer found no concrete
  surviving malformed-wire route; not final release Security acceptance.

# Verification / Testing

## Command Evidence

- Build/build:test;41 focused tests;1993 complete manifest-discovered tests pass,
  0 fail/skip,434385ms, Node26.0.0/macOS arm64.
- Exact installed candidate:35 each on Node24.15.0/24.18.0/26.0.0;105 total.
- CLI/docs/workflow parity, full/changed graph and diff checks pass.
- Intermediate tarball SHA256:
  13cd35c621ffe000c8ffae0823e1718a04ba0d9414b37d1a8c2dfc4b971c7ffd.
  All231 installed files unchanged; not the final release artifact seal.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale imported-bundle warnings; refresh remains excluded.
- Linux and final security/coverage/artifact gates are unverified here.

# Known Issues / Follow-ups

- Twelve of14 security findings have local remedies. Bugs46/47 and adjacent
  Bugs59/60, final Task828/Test488, Linux, coverage ladder and seal remain open.
- Selected Goal73/runtime DB/Demo3 hashes match baseline. No persistent lease
  acquired; five released runtime leases and no active lease at inventory.
- Goal86 active, Bug58 done, Goal85 paused; release NOT_READY. Next: Bug59.
- Existing goal/diagnose/verification skills reused; candidates:none.

## Follow-up Refs

- root:bug-59; root:test-488; root:task-828; root:goal-86; root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-58-baseline.json
- .mdkg/artifacts/goal-86/bug-58-full-verification.json
- .mdkg/artifacts/goal-86/bug-58-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
