---
id: bug-51
type: bug
title: Snapshot inspection can disclose hashes of files outside the repository
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

Goal: remediate g86-dbwork-003 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. A malicious checkout can cause snapshot verification to read an arbitrary operator-readable external file and disclose its SHA-256 and size in the verification receipt. This does not require the external file to be a valid SQLite database. Whole-file hashing also allocates memory proportional to the external target. No remote access or native SQLite write effect is asserted.

The proven disclosure is hash, size and file presence through a local receipt, not arbitrary plaintext or remote access. It nevertheless violates repository-only read authority.

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

1. Use external sentinels for verify, status and seal; refuse links before native open/hash and prove no digest or bytes enter output.
2. Reject special files and oversized manifest inputs; hash large admitted DBs with bounded streaming.
3. Retain valid portable private snapshot behavior.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: The source's lexical DB layout restrictions do not reject a final state-file symlink. For a supported-shape manifest, native integrity failures are returned as check data rather than stopping hashing, so an arbitrary readable target's digest/size is produced. Sealing separately computes and returns oldHash before replacement. No secret was read and no native-write consequence is claimed.

# Suspected Cause

verifyProjectDbSnapshot resolves the configured state paths lexically, then uses existsSync/statSync without the contained-path authority. A symlink at stateFile passes the non-directory check. With a supported-shape manifest, sqliteIntegrityCheck catches database-opening or integrity errors, after which sha256File unconditionally reads the symlink target. The snapshot-hash error includes the actual SHA-256, and the size error includes its actual size. The independent seal operation also hashes an existing stateFile without checking its final component and returns that hash as old_snapshot_sha256.

Source anchors:
- src/core/project_db_snapshot.ts:435-450 (root_control)
- src/core/project_db_snapshot.ts:481-500 (propagation)
- src/core/project_db_snapshot.ts:167-168 (sink)
- src/core/project_db_snapshot.ts:366-369 (entrypoint)
- src/core/project_db_snapshot.ts:403-409 (outcome)

# Fix Plan

Apply the contained-path authority to every snapshot, manifest, and runtime read in verify/status/seal, including the old snapshot hash. Reject symlink ancestors, final-component links, and non-regular files before native database opens or hashing. Add separate regression cases for verify, status, and seal using external sentinels; confirm no sentinel hash appears in output. Use bounded reads and explicitly read-only SQLite connections for observational operations.

Owned source allowlist:
- src/core/project_db_snapshot.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Use external sentinels for verify, status and seal; refuse links before native open/hash and prove no digest or bytes enter output.
- Reject special files and oversized manifest inputs; hash large admitted DBs with bounded streaming.
- Retain valid portable private snapshot behavior.
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
