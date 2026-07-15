---
id: task-750
type: task
title: align CLI contract docs package and neutral consumer smokes
status: todo
priority: 1
parent: goal-66
prev: task-749
tags: [goal-66, docs, package, contract, smoke, docs-mdkg-dev]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-749]
blocks: [test-411, test-414, test-415]
refs: [goal-66, dec-75]
context_refs: [edd-73, goal-52, goal-67]
evidence_refs: []
aliases: [materialize-cli-package-parity]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Make source help, generated command contract, command matrix, docs.mdkg.dev,
package payload, security/readiness scripts, and neutral installed-consumer
behavior agree before the final local release-candidate audit.

# Acceptance Criteria

- Add `mdkg git materialize --request <file|-> [--json]` to CLI dispatch/help
  with exact request/policy guidance and unchanged clone help/snapshots.
- Generated contract truthfully records write paths, locking, atomicity,
  unsupported dry-run behavior, bounded receipts, and danger level.
- Add `npm run smoke:git-materialize`; include it in appropriate test,
  `prepublishOnly`, CI/release, and readiness assertions.
- Add a dedicated docs.mdkg.dev advanced-alpha/reference materialization guide
  with request examples, receipt semantics, auth/redaction boundaries,
  containment/failure behavior, project-memory modes, and clone compatibility.
- Link the guide from docs navigation/reference/safety surfaces, update generated
  CLI docs, and record source-backed materialization notes under `Unreleased`.
- Do not add a `0.5.2` release heading or bump package/version metadata; those
  belong to `goal-67`.
- Do not edit any `mdkg-dev` source or copy.
- Packed temp consumer proves representative success/failure cases, clone
  compatibility, package file presence, and no downstream product dependency.

# Test Plan

- `test-411` through `test-415`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:git-materialize`

# Completion Evidence

- Attach help/contract/docs/package parity and clean installed-tarball receipts.

# Files Affected

- CLI/help and generated contract, package scripts, docs.mdkg.dev source and
  navigation, changelog `Unreleased`, and neutral consumer smokes.

# Implementation Notes

- Keep package/source version `0.5.1`; Goal 67 alone owns the `0.5.2` bump and
  public release metadata.

# Links / Artifacts

- `goal-67`, `test-411` through `test-415`, and the future docs guide path.
