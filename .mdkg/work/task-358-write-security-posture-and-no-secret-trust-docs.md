---
id: task-358
type: task
title: write security posture and no-secret trust docs
status: todo
priority: 2
epic: epic-81
parent: goal-15
tags: [mdkg-dev, security, trust, no-secrets]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354, task-370]
blocks: []
refs: [spike-3, spike-5, task-370, task-371]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Write the mdkg.dev security and trust posture docs. These docs should explain
what mdkg stores, what it refuses to store, how local project DB/runtime state is
handled, and how subgraph safety works.

# Acceptance Criteria

- Document local-first boundaries, no-secret policy, generated cache behavior,
  project DB runtime/state policy, snapshot/queue policy, and subgraph no-mutate
  guarantees.
- Explain public/private/internal visibility semantics and archive/bundle risks.
- Include an audit checklist for docs/examples so secrets, raw tokens, and
  machine-specific sensitive paths are not published.
- Identify future hardening work as explicit follow-up nodes, not hidden
  assumptions.

# Files Affected

- future mdkg.dev security/trust docs
- release-readiness and docs-readiness checklists

# Implementation Notes

- Reuse existing security posture from command metadata, visibility rules,
  subgraph hardening, and release docs.
- Keep docs precise about internal helper surfaces versus public CLI surfaces.
- Avoid publishing raw local paths from temp proofs unless sanitized.

# Test Plan

- Run a no-secret docs audit.
- Run `npm run smoke:command-docs`.
- Run `node dist/cli.js validate --json`.

# Links / Artifacts

- Validated by `test-149`.
- Spike evidence: `spike-3`, `spike-5`.
- Evidence matrix and architecture visuals: `task-370`, `task-371`.
