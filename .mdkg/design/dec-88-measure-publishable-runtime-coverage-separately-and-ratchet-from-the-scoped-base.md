---
id: dec-88
type: dec
title: Measure publishable runtime coverage separately and ratchet from the scoped baseline
status: accepted
tags: [coverage, tests, release, local-only]
owners: []
links: []
artifacts: []
relates: [loop-7]
refs: [loop-7, chk-544, dec-86]
aliases: []
created: 2026-07-25
updated: 2026-07-25
---
# Context

The audited coverage command executed the compiled TypeScript suite but did
not run the root MJS release/security test family, enforce thresholds, produce
durable machine-readable evidence, or participate in publication readiness.
Its observed percentages were calculated from a noisy denominator containing
compiled tests, helpers, and scripts.

Coverage completeness and the coverage denominator are separate contracts:
all relevant tests must execute, while release thresholds must measure a
stable production surface.

# Decision

## Measured Production Surface

The enforced coverage denominator is the publishable runtime:

- the CLI entry point;
- commands;
- core;
- graph;
- pack;
- templates; and
- utilities.

Tests, test helpers, fixtures, copied init payloads, generated artifacts,
documentation builds, and site builds are excluded from that denominator.
Root MJS release/security tests still execute as part of the complete test
contract, but their implementation scripts are verified through focused
behavior tests rather than silently mixed into the runtime percentage.

## Evidence Format

- Clean a deterministic ignored coverage directory before every run.
- Retain raw per-process V8 coverage files.
- Produce a deterministic concise JSON summary and a manifest identifying the
  runtime, command, measured paths, exclusions, and raw files.
- Do not describe raw V8 files as one merged report. A future merger requires
  an explicit dependency and contract change.

## Threshold Ratchet

The Loop 7 values of 89% lines, 77% branches, and 96% functions are provisional
audit floors rather than accepted measurements of the new denominator.

- First measure the scoped runtime baseline.
- When a scoped metric meets or exceeds its provisional audit floor, bind its
  whole-number floor to the measured baseline.
- When a scoped metric is below its provisional audit floor, stop the coverage
  lane and either add justified tests or obtain a separate accepted decision.
- Never silently lower a floor.
- A future threshold decrease requires accepted decision authority and current
  evidence.

## Placement Boundary

`root:goal-77` owns local coverage execution and exactly-once
`prepublishOnly` integration. Checked-in CI jobs, provider artifacts, sharding,
and remote execution belong to the successor governed-infrastructure goal
after measured local receipts exist.

# Alternatives considered

- Preserve the noisy all-process denominator. Rejected because changes to tests
  or helpers could move the release percentage without changing production
  risk.
- Freeze 89/77/96 immediately. Rejected because those numbers have not been
  re-proven against the chosen runtime surface.
- Require a merged third-party report now. Rejected until the simpler raw plus
  summary contract proves insufficient.
- Couple coverage implementation directly to workflow edits. Rejected to break
  the `root:task-804` and `root:prop-9` dependency cycle.

# Consequences

- `root:task-804` and `root:test-464` become local coverage-contract work.
- Exact test counts remain receipts, not permanent hard-coded policy.
- Test-family discovery and both TypeScript and root MJS execution paths become
  guarded independently.
- A later CI task may upload the same evidence, but local completion makes no
  provider-run claim.

# Links / references

- `root:goal-77`
- `root:loop-7`
- `root:task-804`
- `root:test-464`
- `root:chk-544`
- `root:dec-86`
