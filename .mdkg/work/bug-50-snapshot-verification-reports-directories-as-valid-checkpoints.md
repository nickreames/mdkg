---
id: bug-50
type: bug
title: Snapshot verification reports directories as valid checkpoints
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

Goal: remediate g86-dbwork-002 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. A malformed repository checkpoint can bypass all substantive verification and receive a successful machine-readable validity receipt, despite containing no usable SQLite snapshot or manifest. This is a checkpoint-validation bypass, not external execution or attestation forgery.

Malformed repository state receives an incorrect structural validity result; no automatic restore or external authorization consumer was established.

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

1. Either/both configured paths as nonempty directories must produce invalid status and failing verify exit.
2. Require every mandatory check to execute and pass, independent of whether error strings were populated.
3. Retain regular valid/missing/corrupt snapshot positive and negative controls.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: When both configured paths exist and at least one is a directory, admission has a failed check but zero errors. No manifest-dependent checks run; the receipt therefore claims valid and the CLI exits successfully. This independently confirms a fail-open verification defect.

# Suspected Cause

An existing directory at stateFile or stateManifest produces a check with ok:false but errors:[] because errors depend only on existence. checks.every(check.ok) then prevents manifest loading and all subsequent integrity/hash/queue checks. Final ok and status depend only on the flattened error strings, so when both paths exist the result is ok:true, failure_count:0, status:"valid". The CLI trusts payload.ok and exits successfully.

Source anchors:
- src/core/project_db_snapshot.ts:435-450 (root_control)
- src/core/project_db_snapshot.ts:454-457 (propagation)
- src/core/project_db_snapshot.ts:581-595 (outcome)
- src/commands/db.ts:898-907 (sink)

# Fix Plan

Require regular files and generate an explicit error for every failed mandatory check. Derive overall success and failure_count from failed checks as well as diagnostics, and require the manifest and mandatory integrity checks to have actually run. Add cases where either or both configured paths are nonempty directories and require invalid status and a failing verify exit.

Owned source allowlist:
- src/core/project_db_snapshot.ts
- src/commands/db.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Either/both configured paths as nonempty directories must produce invalid status and failing verify exit.
- Require every mandatory check to execute and pass, independent of whether error strings were populated.
- Retain regular valid/missing/corrupt snapshot positive and negative controls.
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
