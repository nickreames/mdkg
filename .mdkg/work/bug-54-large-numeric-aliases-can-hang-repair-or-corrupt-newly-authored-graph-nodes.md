---
id: bug-54
type: bug
title: Large numeric aliases can hang repair or corrupt newly authored graph nodes
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

Goal: remediate g86-identity-001 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. Graph documents can supply decimal IDs that parse correctly but exceed JavaScript's precise integer range. Legacy repair can then loop indefinitely; ordinary creation, checkpoint creation and loop forks can instead author duplicate or invalid aliases, disrupting subsequent graph operations.

This crosses a repository-content-to-CLI availability and graph-integrity boundary, but requires the operator to invoke creation or repair on supplied graph data. No remotely exposed service or code execution is established.

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

1. Run repair preview in a timeout-bounded subprocess with two valid task-9007199254740992 documents; require deterministic refusal rather than timeout.
2. Cover Number.MAX_SAFE_INTEGER, the first unsafe integer, leading-zero forms, and a occupied next candidate.
3. Verify refused apply leaves authored bytes and Git index unchanged and releases its mutation lock.
4. Retain ordinary small-ID allocation and v2 refusal coverage.
5. Cover checkpoint duplicate alias, ordinary new and loop exponent notation, legacy and explicit v2 graphs, and JSON/SQLite backends.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: Two small legacy documents with task-9007199254740992 reach the non-progressing repair loop, including Git-stage repair and locked apply. With JSON allocation, an existing chk-9007199254740992 permits a different-title checkpoint with the same alias; task-1000000000000000000000 can generate task-1e+21. Creation writes precede full graph validation. These routes share the missing safe numeric-allocation contract and one effective centralized remedy.

# Suspected Cause

`isCanonicalId` admits any decimal suffix. Legacy repair and creation allocators convert that string to `Number` without requiring a safe representable successor. The repair loop keeps testing the same occupied value at 2^53. Checkpoint creation checks only the title-derived filename before writing, while ordinary creation and loop allocation can emit exponent notation at 1e21. Later indexing is too late to prevent the durable invalid graph.

Source anchors:
- src/util/id.ts:1-7 (user_input)
- src/commands/fix.ts:784-790 (root_control)
- src/commands/fix.ts:1132 (propagation)
- src/commands/fix.ts:1278 (propagation)
- src/commands/fix.ts:1585-1586 (entrypoint)
- src/commands/checkpoint.ts:89-108 (root_control)
- src/commands/checkpoint.ts:330-362 (sink)
- src/commands/new.ts:234-255 (root_control)
- src/commands/new.ts:567-583 (sink)
- src/commands/loop.ts:318-357 (root_control)
- src/commands/loop.ts:1100-1107 (sink)
- src/graph/identity_authoring.ts:54-62 (propagation)

# Fix Plan

Centralize numeric alias admission and allocation using bounded BigInt or an explicitly enforced safe-integer range. Require a representable successor, syntactically valid unused alias and complete prospective node/group validation before reservation or writes. Reuse this contract in legacy repair, ordinary creation, checkpoint and loop allocation; do not rewrite Git history.

Owned source allowlist:
- src/util/id.ts
- src/commands/fix.ts
- src/commands/checkpoint.ts
- src/commands/new.ts
- src/commands/loop.ts
- src/graph/identity_authoring.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Run repair preview in a timeout-bounded subprocess with two valid task-9007199254740992 documents; require deterministic refusal rather than timeout.
- Cover Number.MAX_SAFE_INTEGER, the first unsafe integer, leading-zero forms, and a occupied next candidate.
- Verify refused apply leaves authored bytes and Git index unchanged and releases its mutation lock.
- Retain ordinary small-ID allocation and v2 refusal coverage.
- Cover checkpoint duplicate alias, ordinary new and loop exponent notation, legacy and explicit v2 graphs, and JSON/SQLite backends.
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
