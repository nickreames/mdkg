---
id: chk-550
type: checkpoint
title: Goal 77 publishable-runtime coverage contract verified
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-464, task-804]
blocked_by: []
blocks: []
refs: [goal-77, task-804, test-464, test-463, chk-549, dec-88]
context_refs: [goal-77, task-804, test-464, test-463, chk-549, dec-88]
evidence_refs: [test-464]
aliases: []
skills: []
scope: [test-464]
created: 2026-07-25
updated: 2026-07-25
---
# Summary

Node 24 coverage and release guardrails passed: 711 tests across 95 files, 105 runtime files at 89.30/77.43/96.26 against 89/77/96 thresholds; integrated prepublish and ci:release passed with unchanged Git, lockfile, and selected-goal boundaries.

# Scope Covered

- Completed node: test-464 (verify coverage scope thresholds and durable local evidence)
- Node type: test
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: test-464
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `root:dec-88` defines the publishable-runtime denominator, exclusions,
  provisional floors, evidence format, exactly-once prepublish placement, and
  the boundary that leaves provider-side coverage work to Goal 78.

# Implementation Summary

- Dynamic discovery covers 92 compiled TypeScript tests and all three root MJS
  tests without hard-coding the current count as policy.
- Coverage measures 105 runtime files across CLI, commands, core, graph, pack,
  templates, and utilities. Tests, init payloads, scripts, dependencies, docs,
  and mdkg-dev are explicit exclusions.
- Source-owned baseline evidence binds the whole-number ratchet at `89/77/96`
  for lines, branches, and functions.
- The optimized prepublish ladder runs coverage exactly once and retains the
  normal test command in CI mode.

# Verification / Testing

## Command Evidence

- focused guardrails: 12/12 coverage and release tests passed
- thresholded coverage: 711/711 tests across 95 files; 105 runtime files at
  `89.30%` lines, `77.43%` branches, and `96.26%` functions
- raw evidence: 1,724 per-process V8 JSON files plus manifest, structured event,
  and concise summary under
  `/private/tmp/mdkg-goal77-prepublish-coverage-v1/coverage/`
- evidence SHA-256: manifest
  `3fdbc4a108d3c0629c51554bb0a2ee6b74edb4def6f53431ab9de3573a3dadf2`;
  event
  `2b6547f7f00213a8e7cdb81045a85825b9af2bb3b9b42035919ff377db91b2e5`;
  summary
  `ee34ffdbb93fff30f8105a951c3dab3d93b9213755ee1ba7ecdd58831c024899`
- integrated prepublish: passed in `291.843s`; coverage ran exactly once in
  `102.015s`; receipt
  `/private/tmp/mdkg-goal77-prepublish-coverage-v1/receipt.json`; receipt
  SHA-256
  `8a332bedff2c7c288f322f8479746c61daa2d58167e20e341b254f4d0b208391`
- CI release: passed in `122.416s`; receipt
  `/private/tmp/mdkg-goal77-ci-coverage-v1/receipt.json`; receipt SHA-256
  `400226288abfeb34d1236a5ca5eb8685d172170061f293316994a8d1a71f2316`
- both modes produced package SHA-256
  `f387f93d18d44db99ffb090734079beeb149fd7294f3203fd851f0ceeb652aa3`

## Pass / Fail Status

- status: done

## Known Warnings

- Full graph validation retains only the accepted stale-subgraph warnings for
  `demo_agentic_coding` and `template_mdkg_dev`; archive refresh remains
  outside Goal 77.

# Known Issues / Follow-ups

- Provider-side workflow placement and uploaded coverage artifacts remain
  explicitly outside this local-only goal.

## Follow-up Refs

- `root:goal-78`

# Links / Artifacts

- Compact source-owned evidence is in `scripts/coverage-baseline.json`.
- Bulky raw coverage and ladder receipts remain ignored under `/private/tmp`.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
