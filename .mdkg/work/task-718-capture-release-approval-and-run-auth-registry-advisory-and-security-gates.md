---
id: task-718
type: task
title: Capture release approval and run auth registry advisory and security gates
status: done
priority: 1
epic: epic-233
prev: task-717
next: task-719
tags: [release, approval, security, registry]
owners: []
links: []
artifacts: [artifact://codex-security/scan/1fed2fe1-d81f-41d1-9f1c-470fb669ff4c/available-findings]
relates: [goal-64, goal-69, test-389]
blocked_by: [task-717]
blocks: [task-719]
refs: [test-389, goal-69, edd-75, dec-80, dec-81]
context_refs: [goal-64, goal-69, epic-233, edd-72, dec-69, edd-75, dec-80, dec-81, task-717]
evidence_refs: [chk-496, chk-497, chk-511, chk-512]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-12
---
# Overview

Present the complete local readiness receipt, obtain one explicit bounded
approval, then run all external read-only release gates before any push or publish.

# Acceptance Criteria

- Approval explicitly covers registry/auth/advisory/security access, first push,
  npm publish, `/opt/homebrew` replacement, activation push, and production deploy.
- Approval explicitly records that no Git tag will be created.
- Npm auth is valid, latest is below 0.5.0, and `mdkg@0.5.0` is absent.
- Dependency advisories are clean and the repository security gate is executed.
- If the repository scan finds a blocker, all findings are durably transferred,
  downstream mutation remains blocked, and this task closes as a failed-closed
  gate execution rather than a clean security pass.

# Files Affected

List files/directories expected to change.

- Mdkg approval/checkpoint/evidence nodes
- Temporary npm/security receipts outside committed secrets

# Implementation Notes

- If target version exists, auth fails, or a blocker is found, stop before push.
- Never print or commit tokens or raw private provider payloads.

# Test Plan

Attach sanitized auth, registry, advisory, and security receipts. `test-389`
remains the clean release-gate proof and could close only after Goal 69 resolved
all findings and `dec-81` accepted manual source-backed requalification for
v0.5.0. Those conditions are now satisfied; no second plugin scan is required.

# Results / Evidence

- `chk-496` records the operator's explicit approval for the complete bounded
  sequence, including both pushes, npm publication, global replacement,
  production deployment, no-tag behavior, and fix-forward rules.
- The default npm userconfig returned `E401`; the exported `NPM_TOKEN` was
  present and a mode-`0600` temporary userconfig was created at
  `/private/tmp/mdkg-npm-publish.npmrc` with a literal environment reference,
  not an expanded credential.
- Authenticated `npm whoami` passed as `nickreames`, and `npm owner ls mdkg`
  confirmed that account owns the package.
- Registry `latest` remains `0.4.2`; `mdkg@0.5.0` returned the expected `E404`
  absence receipt.
- `npm audit --json` passed with zero info, low, moderate, high, or critical
  vulnerabilities across the resolved dependency graph.
- Repository security audit execution completed against revision
  `8ac683599cd2765e7f33fa93113dbace8ed77543`: 58/58 assigned reviews, 75 raw
  candidates, 73 canonical validation candidates, and 51 findings after attack-
  path policy (5 high, 28 medium, 18 low).
- Plugin-derived final report sealing was blocked by the platform classifier.
  `chk-497` records the available evidence and transfer limitation; no finding is
  treated as waived or clean because derived reporting did not complete.
- All findings are transferred to active `goal-69`, with exact implementation and
  regression ownership. Goal 69 subsequently closed all 51 findings, `test-434`
  passed, and `test-389` was revalidated under `dec-81`. `chk-512` records the
  resulting unblocked handoff to `task-719`.

# Links / Artifacts

- `dec-69`
- `edd-72`
- `goal-69`
- `edd-75`
- `dec-80`
- `chk-497`
- `dec-81`
- `chk-511`
- `chk-512`
