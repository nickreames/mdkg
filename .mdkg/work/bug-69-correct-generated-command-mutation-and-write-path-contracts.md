---
id: bug-69
type: bug
title: Correct generated command mutation and write path contracts
status: done
priority: 1
tags: [release-0.6.0, current-security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-828, test-492, chk-667]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-29
updated: 2026-09-30
---
# Overview

Goal: make generated command safety metadata truthfully describe existing CLI effects. This is a package-contract blocker under Goal86, not a confirmed security vulnerability or a new CLI feature.

Context: frozen current dist/command-contract.json labels pack, work order, doctor and validate read-only with no write paths, although accepted invocations write packs, authored work orders, derived caches or explicit reports. The generator defaults unknown declarations to read-only. No demonstrated consumer authorization bypass is claimed.

Owner: mdkg-project-agent. Allowed paths: scripts/generate-command-contract.js, generated contract/reference surfaces, source-derived contract checks and direct regression tests, required mdkg evidence/projections. Preserve user instructions and unrelated docs.

Boundaries: generic current behavior only; no new CLI/format/runtime APIs, remote actions, providers, publication, canonical branch/worktree or bundle changes. Preserve protected state and dirty custody.

Done when: actual handler/options are inventoried, mutation categories/write paths are explicit and conservative, discovery/help/docs/MCP/package projections agree, negative and positive Test492 controls pass, and independent readback accepts the bounded diff. Final installed/platform/ladder/seal acceptance remains separate.

# Reproduction Steps

Read installed candidate metadata for pack, work order, doctor and validate and compare its safety declarations with their existing handlers. Static inspection is current; bounded filesystem-effect tests are required before closure.

# Expected vs Actual

- Expected: read-only is claimed only when all supported invocations in that declared entry are observational; mixed commands document conditional writes and actual resources.
- Actual: defaultSafety falls back to read-only for writing surfaces and can generate misleading operational guidance.

# Suspected Cause

Incomplete explicit safety overrides and stale resource maps in the command contract generator. Inventory the entire actual handler surface rather than patching only four examples. Affected version: current 0.6.0 candidate; older published versions unassessed.

# Fix Plan

Extend the existing declarative contract and its completeness checks. Correct mutation modes/write-path inventories and generated references. Do not add an alternative execution wrapper or permission system.

# Test Plan

Test492 compares source handler behavior, conditional flags, default invocations and generated safety fields; verify actual writes for selected positive controls and no writes for retained observational controls. Run command/docs/package parity; broader full suite remains the final boundary.

# Links / Artifacts

- .mdkg/artifacts/goal-86/current-security-audit-20260929.json; Chk667; Test492; Task828.
