---
id: task-838
type: task
title: Bind release fixtures to isolated Git state owned cleanup and immutable candidate bytes
status: backlog
priority: 1
tags: [release-0.6.0, qualification]
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

Goal: make final qualification evidence trustworthy and its destructive fixture
operations confined to independently verified owned roots.

Context: Task837 reviewed all149 current test files and79 executable scripts.
It found correctness/qualification gaps, not additional shipped vulnerabilities:
ambient Git variables can redirect synthetic Git operations, cleanup accepts
overbroad configured paths, and hard-linked candidate delivery does not prove
immutable final bytes. Existing intermediate passes remain historical evidence.

# Acceptance Criteria

- All mutating fixture Git subprocesses clear ambient GIT_DIR, GIT_WORK_TREE,
  GIT_INDEX_FILE and related redirect/config variables, disable configured
  helpers and bind the expected fixture root/gitdir before mutation.
- Cleanup uses created or explicitly accepted owned temporary roots, exact
  paths and safe containment. MDKG_COVERAGE_DIR/config and scratch-prefix
  values never authorize deleting a repository, home, parent or unrelated tree.
- Hash the exact candidate before delivery and again after each relevant
  consumer and at final sealing. Hard-link delivery is not immutability.
  Changed bytes fail the gate and invalidate qualification.
- Preserve inherited-environment behavior only when a test explicitly isolates
  and tests it. Do not silently claim process env filtering is OS network or
  credential isolation; record actual sandbox controls.
- Retain full test discovery and existing coverage thresholds89/77/96; no
  deletion of required tests or fabricated compatibility limits.

# Files Affected

- scripts/npm-smoke-proxy.js
- scripts/release-ladder.js
- scripts/coverage-contract.js and its configuration/contract tests
- scripts/smoke-demo-graph.js and directly affected owned fixture helpers
- Existing installed-* and smoke-* scripts and tests that perform synthetic
  native Git mutation; prefer a shared small helper over duplicated policy.
- Sanitized Goal86 qualification evidence; no production/root/consumer state.

# Implementation Notes

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

Inventory actual call sites before implementation. Separate package-affecting
changes from validation-only inputs; both invalidate the relevant evidence.
Do not execute an unsafe cleanup probe outside a created disposable tree.
Missing host/platform capabilities remain explicit gates, not source fixes.

# Test Plan

- Poison inherited Git variables toward an outside sentinel repository; verify
  the helper refuses or isolates them and every sentinel byte/index is preserved.
- Unsafe coverage/scratch paths refuse before deletion; exact owned roots clean
  successfully. Link/ancestor replacement follows the shared filesystem policy.
- Deliberately alter a delivered synthetic candidate and require final hash
  rejection, including same-size changes and hard-linked delivery.
- Execute the existing proxy/ladder/coverage contracts and installed positive
  controls with exact outputs; Task828 reviews affected trust boundaries.
- Task829's full ladder and Task830's final seal depend on this work, not vice versa.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:test-488; root:task-828; root:task-829; root:task-830

## Current State

Planned / backlog. No qualification-harness correction executed yet.
