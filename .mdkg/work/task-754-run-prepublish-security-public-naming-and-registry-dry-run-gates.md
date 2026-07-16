---
id: task-754
type: task
title: replay v0.5.2 prepublish security naming and registry dry-run gates
status: done
priority: 1
parent: goal-67
prev: task-753
tags: [goal-67, prepublish, security, naming, 0.5.2]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [task-753]
blocks: [test-416, test-417]
refs: [goal-67, goal-66]
context_refs: [goal-66, edd-73]
evidence_refs: []
aliases: [materialize-release-gates]
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Replay every version-sensitive local, package, graph, docs, security, public
naming, tarball, registry, and publish dry-run gate against the exact local
`0.5.2` release commit.

# Acceptance Criteria

- `npm ci`, `npm run prepublishOnly`, security verification, CLI checks and
  contract, docs checks/build, graph validation, readiness assertion, and
  `git diff --check` pass from the release commit.
- The Goal-66 security receipt remains applicable; a focused review of the
  release-only metadata delta finds no new security, secret, local-path, public
  naming, or downstream-product issue.
- Npm latest is `0.5.1`; `0.5.2` returns the expected 404.
- Isolated-cache pack and publish dry-runs pass and record exact file inventory,
  size, shasum/integrity inputs, and no unintended payload.
- The release commit remains local and `origin/main` has not advanced since the
  freshness baseline.
- No push, real publish, global replacement, root apply, or deployment occurs.

# Test Plan

- `test-416`
- `test-417`

# Completion Evidence

- Attach bounded gate, registry, tarball, and release-delta audit receipts.

# Files Affected

- Evidence/checkpoint nodes only after release metadata is finalized.

# Implementation Notes

- Stop rather than waive any failed gate; do not mutate registry, origin,
  global installation, real root, or providers.

# Links / Artifacts

- `test-416`, `test-417`, and Goal-66 security/readiness receipts.
