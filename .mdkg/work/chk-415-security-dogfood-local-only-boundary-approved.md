---
id: chk-415
type: checkpoint
title: Security dogfood local-only boundary approved
checkpoint_kind: audit
status: done
priority: 1
tags: [loop, security, dogfood, approval]
owners: []
links: []
artifacts: [user-approved-local-cache-writes, goal-61-typed-waiver-contract]
relates: [loop-5]
blocked_by: []
blocks: []
refs: [loop-5, dec-71, task-688, goal-64]
context_refs: [goal-61, dec-71]
evidence_refs: [dec-71]
aliases: []
skills: []
scope: [loop-5]
created: 2026-07-10
updated: 2026-07-10
---
# Summary

Records the accepted local-only execution boundary for `loop-5`. Local source,
tests, builds, static checks, package inspection, and mdkg evidence writes are
authorized. External advisory and security-provider workflows are not
authorized in this dogfood run.

# Scope Covered

`loop-5` only.

## Changed Surfaces

- No functional source or deployment surface changed.
- `dec-71` records all pre-run answers and the bounded dependency-advisory
  waiver rationale.

## Boundaries

- in scope: local read-only audit and mdkg evidence nodes.
- out of scope: `npm audit`, Codex Security/provider scans, downstream calls,
  push, publish, and deploy.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- `dec-71` is accepted.
- Final external security/advisory proof remains `task-688` / `goal-64` work.

# Implementation Summary

This checkpoint is approval evidence for the local-only boundary and the typed
`dependency_advisories` waiver. It is not evidence that external checks ran.

# Audit Findings

- Reviewed surfaces: pre-run authorization and release-goal boundaries.
- Findings: local lanes are authorized; external lanes are deferred.
- Residual risk: current dependency advisories remain unknown until Goal 4.

# Verification / Testing

## Command Evidence

- command: `mdkg loop fork security-audit --scope goal-61 --dry-run --json`
- result: receipt surfaced four required decisions and six evidence lanes.

## Pass / Fail Status

- status: approved for local-only dogfood execution.

## Known Warnings

- warning: do not interpret this checkpoint as provider or registry approval.

# Known Issues / Follow-ups

- Complete the formal external scan/advisory gate in `task-688` / `goal-64`.

## Follow-up Refs

- `task-688`
- `goal-64`

# Links / Artifacts

- `loop-5`
- `dec-71`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
