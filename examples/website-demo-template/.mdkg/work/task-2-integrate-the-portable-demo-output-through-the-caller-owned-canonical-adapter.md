---
id: task-2
type: task
title: Integrate the portable demo output through the caller-owned canonical adapter
status: backlog
priority: 1
epic: epic-1
parent: goal-1
prev: test-1
next: test-2
tags: [demo, integration, portable-output, caller-owned]
owners: []
links: []
artifacts: [artifacts/integration-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2, test-1, chk-3]
evidence_refs: [test-1]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-28
updated: 2026-07-28
---
# Overview

Integrate the accepted portable `DemoOutput.astro` through the caller-owned
canonical static adapter without re-authoring its visual composition.

# Acceptance Criteria

- Require a matching caller-owned shared-source lease whose hash, owner,
  allowlist, baseline, and validity window are supplied outside the child.
- Fail closed when the lease is absent, expired, drifted, or does not include
  every exact path and operation.
- Use `RUN_BINDING.json` for the demo ID, detail/output routes, and component
  key; do not rewrite authored graph content.
- Copy/adapt the portable component mechanically through a thin wrapper and
  register the bound static route/data record.
- Preserve noindex/unlisted, Ocean Flow, source-versus-execution proof,
  Plan → Work → Evidence, what/why/next, quickstart, feedback CTA, accessibility,
  zero JavaScript, privacy, and asset budgets.
- Change only caller-allowed paths and record before/after hashes.
- Write `artifacts/integration-receipt.json` with the lease reference, exact
  changed paths, adapter mapping, source hashes, build identity, authority
  boundary, and next QID.

# Files Affected

- Only exact paths enumerated by the external shared-source lease.
- `artifacts/integration-receipt.json` inside this run.

# Implementation Notes

- Do not install dependencies, add route architecture, or alter provider
  configuration.
- This task does not commit or publish.
- If shared source is already integrated at the accepted hashes, record a
  verified no-change receipt.

# Test Plan

- `test-2`
- one canonical build shared by serial checks
- exact adapter/route/registry inventory and public-safety scan

# Links / Artifacts

- `RUN_BINDING.json`
- `CHILD_INTERFACE.json`
- `IMMUTABLE_CHILD_CONTRACT.json`
- `test-1`
- `test-2`
