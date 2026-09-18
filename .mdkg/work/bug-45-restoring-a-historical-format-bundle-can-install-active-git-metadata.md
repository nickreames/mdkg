---
id: bug-45
type: bug
title: Restoring a historical-format bundle can install active Git metadata
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-45-local-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, test-488, test-487, task-839]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-18
---
# Overview

Goal: remediate g86-baseline-002 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: medium. Graph clone/fork and subgraph materialization accept policy-less bundles with owning configuration and write arbitrary non-excluded manifest entries. An attacker can install .git metadata in the new destination, enabling later native Git operations to consume attacker-selected configuration.

Later native Git configuration can execute commands, but exploitation requires importing the crafted bundle and using native Git in the resulting repository. mdkg's own observational Git disables fsmonitor.

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

1. Reject .git/config, full .git trees, .git indirection files, nested administrative paths and filesystem aliases before any write.
2. Reject unrelated root payloads even with matching manifest hashes and an owning config.
3. Retain supported owned graph, archive and deliberately portable private-snapshot materialization.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: A bundle author controls manifest paths, bytes and hashes and may include valid .mdkg/config.json while omitting transport_policy. .git/config is syntactically relative and does not match state exclusions. The graph writer and subgraph entry loop then create it under the target. The empty-target guard prevents overwriting an existing checkout, not creating a new attacker-configured one.

# Suspected Cause

Bundle integrity establishes relative path syntax, inventory and self-consistent hashes, not authority to install those paths. With transport_policy absent, admission falls back to configuredBundleTransportState, an exclusion classifier whose default permits unknown paths. Both graph and subgraph writers consume that result without forbidding Git administration or restricting entries to graph-owned roots.

Source anchors:
- src/commands/bundle.ts:150-156 (propagation)
- src/commands/bundle.ts:264-290 (propagation)
- src/graph/transport_policy.ts:110-111 (root_control)
- src/graph/transport_policy.ts:150-155 (root_control)
- src/graph/identity_transport.ts:16-24 (propagation)
- src/graph/transport_state.ts:167-210 (propagation)
- src/commands/graph.ts:511-525 (propagation)
- src/commands/subgraph.ts:1207-1233 (propagation)

# Fix Plan

Apply positive graph ownership admission and unconditional Git administrative-path refusal to every transport path, including policy-less historical bundles. Keep unverifiable historical snapshots inspect-only rather than inferring restoration authority from owning configuration alone.

Owned source allowlist:
- src/commands/bundle.ts
- src/graph/transport_policy.ts
- src/graph/identity_transport.ts
- src/graph/transport_state.ts
- src/commands/graph.ts
- src/commands/subgraph.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Reject .git/config, full .git trees, .git indirection files, nested administrative paths and filesystem aliases before any write.
- Reject unrelated root payloads even with matching manifest hashes and an owning config.
- Retain supported owned graph, archive and deliberately portable private-snapshot materialization.
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

Local remedy verified on2026-09-18; final release clearance remains separate.
Shared transport admission now checks complete path inventories, Git
administrative spellings, deepest enabled/selected ownership and root-config
cache destinations before extraction or clone/fork index rebuilding. Owned graph
assets, private snapshots, custom caches and optional historical owner labels
remain supported. Historical inputs without proven transport authority remain
inspect-only.

The original source failed72/106 boundary cases. One independent read-only
candidate review found configured cache destinations bypassing entry admission.
Parent reproduced54 such refusals plus3 historical-label compatibility failures
in167 expanded cases before refining the remedy. Final167 cases pass against the
same installed package on each of Node24.15.0,24.18.0 and26.0.0, macOS arm64.
The focused source suite passed154/154 without skips; build, CLI/docs/workflow
parity, full/changed graph validation, SQLite verification and diff checks pass.
Protected Demo3, selected Goal73 and runtime DB hashes match; no remote action.

Exact source/runtime hashes, intermediate artifact identity, findings disposition
and limits: .mdkg/artifacts/goal-86/bug-45-local-verification.json.
This is not a final seal or Linux qualification. Test487/488, Task828, the full
ladder and final artifact seal remain required. Goal85 stays paused. No active
Git payload execution or earlier-release exposure is claimed.
