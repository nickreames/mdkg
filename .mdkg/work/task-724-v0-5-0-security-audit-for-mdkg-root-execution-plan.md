---
id: task-724
type: task
title: v0.5.0 security audit for mdkg root execution plan
status: done
priority: 1
parent: loop-5
tags: [loop-template, audit, security, loop-fork, loop-child, task]
owners: []
links: []
artifacts: []
relates: [loop-5, spike-30, task-726, task-727, test-397, test-398]
blocked_by: []
blocks: []
refs: [loop-5, template://loops/security-audit, spike-30, dec-71, chk-415, task-726, task-727, test-397, test-398]
context_refs: [root:goal-61, task-688, goal-64]
evidence_refs: [spike-30, dec-71, chk-415, chk-416, chk-417, chk-418, chk-419]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Execute the authorized local-only v0.5.0 security audit over the mdkg root, preserve source-grounded findings, and route validated release risks into owned implementation and regression work.

# Acceptance Criteria

- Source security, credential exposure, public exposure, package exports, and finding triage lanes are completed with repository evidence.
- Dependency advisories and provider-backed scanning remain explicitly waived only for this dogfood run through `dec-71` and `chk-415`; `task-688` remains a Goal 4 gate.
- The graph-target symlink escape and unbounded ZIP inflation findings are represented by `task-726`/`test-397` and `task-727`/`test-398`, then fixed and verified.
- Clean lanes and residual risk are recorded in `spike-30` rather than implied by a generic completion status.
- No network scan, push, publish, deployment, or unrelated functional change occurs.

# Test Plan

Verify `spike-30`, the typed waiver, both implementation checkpoints, both regression checkpoints, loop readiness identity bindings, and full release-candidate gates.

# Execution Evidence

- Local credential and tracked-secret scans found no reportable secret material.
- Process, SQL, public rendering, package export, and postinstall surfaces were reviewed from source.
- `chk-416`/`chk-417` prove graph-target containment; `chk-418`/`chk-419` prove bounded ZIP parsing.
- External advisory and provider scan evidence is intentionally deferred to `task-688` under `goal-64`.

# Files Affected

# Implementation Notes

# Links / Artifacts
