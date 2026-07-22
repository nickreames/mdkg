---
id: task-804
type: task
title: gate release readiness on a complete coverage contract
status: backlog
priority: 1
tags: [audit-followup, coverage, ci, tests]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: []
blocks: [test-464]
refs: [loop-7, spike-32, test-461, chk-541, chk-542]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Turn the currently informational coverage command into a complete,
non-regressing release gate. The audited command passes 658 compiled tests but
excludes 18 root MJS release/security tests, has no threshold, emits no durable
artifact, and runs in neither CI nor prepublish.

# Acceptance Criteria

- One coverage command executes all 676 current test identities, including both
  root MJS suites.
- Enforce minimums of 89% lines, 77% branches, and 96% functions using Node 24
  coverage threshold flags; raising floors remains allowed with evidence.
- Emit V8 coverage JSON to an ignored deterministic local path and retain it as
  a CI artifact without tracking generated output.
- Run the coverage gate in release-readiness CI and before package publication.
- A focused guardrail fails if either MJS suite, any threshold, or the artifact
  step disappears.
- Node 24 local execution passes and no tracked generated path changes.

# Files Affected

- `package.json`
- `.github/workflows/release-readiness.yml`
- focused release/workflow contract tests
- ignore/config paths for local V8 coverage output if needed

# Implementation Notes

- Use current rounded-down coverage as a no-regression floor, not as a claim of
  ideal coverage quality.
- Keep raw per-file coverage out of Git and preserve a concise summary in CI.
- Coordinate final workflow placement with the accepted outcome of
  `root:prop-9` if that proposal changes job topology.

# Test Plan

- Run the complete coverage command, force each threshold failure in a fixture,
  verify 676 tests and the durable artifact, inspect workflow inclusion, then
  run `ci:release`, graph validation, and Git hygiene checks.

# Links / Artifacts

- `root:loop-7`
- `root:test-461`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/command-receipts.md`
