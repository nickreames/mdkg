---
id: bug-48
type: bug
title: Inspecting repository config or bundle sources can block on special files
status: backlog
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-17
---
# Overview

Goal: remediate g86-baseline-005 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. Configuration loading and bundle freshness verification follow repository symlinks and perform unbounded whole-file reads before adequate type/size admission. A device or FIFO target can exhaust memory or block local CLI/MCP inspection.

The demonstrated effect is availability loss of a local process after the operator selects malicious repository or bundle input; no network service or broader privilege gain was established.

Context: frozen source e42f1d93497119c9a1f8684df926510da91dea42,
draft package0.6.0. This is source-validated evidence, not executed exploit proof.
Earlier published versions were not assessed by that offline current-source scan.
Establish affected-version bounds from exact local package/source evidence during
remediation; do not assume published0.5.2 is affected.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use synthetic, owned disposable fixtures only. Reproduce the source-bound
failure before changing its control, retain passing controls, and bind the
commands/results to exact source and installed artifact hashes. Never run
malicious inputs against canonical state or recovered Demo3 payloads.

1. Reject config/source symlinks to devices, FIFOs and outside sentinels without blocking.
2. Reject oversized regular files and post-stat growth within timeout-bounded fixtures.
3. Exercise CLI and fixed-root MCP while proving subsequent valid requests still work.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: Repository input can supply a config symlink to a special file; bundle verification can reference a similarly linked local source. fs.readFileSync follows those links, so a FIFO can block and /dev/zero or oversized data can consume unbounded memory before parsing or hashing finishes. MCP index inspection calls the same config loader.

# Suspected Cause

loadConfig follows existsSync with readFileSync before any schema or configured limits. verifyBundle independently hashes manifest paths using the same pattern and does not stop when payload errors exist. Neither path uses available contained, nonblocking regular-file admission or a fixed bootstrap byte ceiling.

Source anchors:
- src/core/config.ts:1171-1186 (root_control)
- src/commands/mcp.ts:258-268 (propagation)
- src/commands/bundle.ts:961-970 (propagation)
- src/core/filesystem_authority.ts:362-398 (propagation)

# Fix Plan

Use contained non-following regular-file readers with a fixed bootstrap size ceiling for config and appropriate bounded source hashing for bundle verification. Fail before source reads when payload integrity is invalid.

Owned source allowlist:
- src/core/config.ts
- src/commands/mcp.ts
- src/commands/bundle.ts
- src/core/filesystem_authority.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Reject config/source symlinks to devices, FIFOs and outside sentinels without blocking.
- Reject oversized regular files and post-stat growth within timeout-bounded fixtures.
- Exercise CLI and fixed-root MCP while proving subsequent valid requests still work.
- Failing-before/passing-after controls with no unintended filesystem, Git-index,
  selected-state or runtime-state effects; record all skips and missing proof.
- Current-source tests and exact installed package on Node24.15.0/24.18.0/26,
  macOS and Linux x86_64/ARM64 where the case is platform-sensitive.
- Bind this finding to test488 and relevant existing installed families; Task828
  independently reviews the complete remediation range after fixes are frozen.
- Local bug completion requires a verified remedy; final release clearance still
  requires independent review, full qualification and the new exact artifact seal.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:task-837; root:test-488; root:task-828; root:test-487
- Canonical raw finding/report remains plugin-owned; only sanitized evidence,
  hashes and regression/disposition references belong in this graph.

## Current State

Planned / backlog. Source finding accepted; no remediation or runtime
verification has been performed for this new record. Goal85 remains paused.
