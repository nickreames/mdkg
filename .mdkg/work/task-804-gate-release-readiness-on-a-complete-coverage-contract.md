---
id: task-804
type: task
title: gate release readiness on a complete coverage contract
status: backlog
priority: 1
parent: goal-77
prev: test-463
next: test-464
tags: [audit-followup, coverage, release, tests]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: [test-463]
blocks: [test-464]
refs: [goal-77, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-88, test-463]
context_refs: [goal-77, loop-7, chk-544, dec-88, test-463]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-17
updated: 2026-07-25
---
# Overview

Turn the currently informational coverage command into a complete,
non-regressing local release gate after deterministic prepublish execution is
proven. The audited command omitted the root MJS family, had no stable
production denominator or threshold, emitted no durable machine-readable
summary, and did not run before publication.

# Acceptance Criteria

- One coverage contract discovers and executes every compiled TypeScript test
  family and both root MJS paths without permanently hard-coding today's exact
  test count.
- Measure only the publishable runtime surface declared by `root:dec-88`.
- Capture the scoped baseline before binding thresholds.
- When scoped lines, branches, or functions meet their provisional audit
  floors, bind each whole-number floor to the measured baseline.
- Stop rather than silently lower a threshold when the scoped baseline is below
  a provisional audit floor.
- Clean and emit raw V8 files, a manifest, and a deterministic concise JSON
  summary to ignored paths.
- Factor a build-free coverage runner plus a convenience build wrapper so the
  local publication ladder executes tests and coverage exactly once.
- Run the coverage gate before local publication readiness.
- Focused guardrails fail if a test family, threshold, measured path,
  exclusion, evidence file, or exactly-once placement disappears.
- Node 24 local execution passes and no tracked generated path changes.

# Files Affected

- `package.json`
- coverage runner/summary helpers
- focused local release and coverage contract tests
- ignore/config paths for local V8 coverage output if needed

# Implementation Notes

- Keep raw coverage out of Git and preserve a deterministic local summary.
- Do not describe raw per-process V8 files as a merged report.
- Release/security/docs scripts outside the publishable runtime denominator
  remain covered by focused behavior tests.
- CI job placement and provider artifacts belong to Goal 2 after
  `root:test-464` and the measured topology decision.

# Test Plan

- Run the complete test-family discovery and scoped coverage command.
- Force each threshold failure independently in bounded fixtures.
- Prove missing test-family, measured-path, exclusion, summary, or exactly-once
  integration causes a focused failure.
- Run one optimized `prepublishOnly`, `ci:release`, graph validation, and Git
  hygiene checks.

# Links / Artifacts

- `root:loop-7`
- `root:test-461`
- `root:goal-77`
- `root:dec-88`
- `root:test-463`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/command-receipts.md`
