---
id: chk-532
type: checkpoint
title: handoff verified Git materialization to mdkg v0.5.2 release
checkpoint_kind: handoff
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-751, goal-66, goal-67, test-450]
blocked_by: []
blocks: []
refs: [edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-65, goal-71]
evidence_refs: [chk-525, chk-526, chk-527, chk-528, chk-529, chk-530, chk-531]
aliases: []
skills: []
scope: [goal-66, task-751, test-450, goal-67]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

ready for goal-67 v0.5.2 release execution. Baseline d78892a53c72c85f1c74489e5b057074f5a1b8bb; implementation f657a1b3e82388050aeeef39a188d4eaca0a2bf9. Version-neutral mdkg@0.5.1 package has 191 files, 425438 bytes, npm shasum 9a667d7b7a2e331e43e772219ccb4430212ed1e3, actual tarball SHA-256 3bb169fa58ee28553f40fc5f224fa8d617b863c5173c608c8842a02c19af9728, command-contract hash 35e7a82190d09c19eb3c8823980d8f2b33b6a3aadfc4cf7f8c6f8249fadcdd71, and schemas mdkg.git.materialize.request.v1 / mdkg.git.materialize.receipt.v1. Full prepublish, docs, security verifier, pack/publish dry-run, installed consumer, clone compatibility, graph, and diff gates pass. Codex Security failed and is explicitly out of scope. No version bump, publish, push, tag, deploy, global replacement, or root upgrade occurred.

# Scope Covered

- Goal-66 implementation and local readiness work from `task-746` through
  `task-751`, including tests `test-411` through `test-415`, security
  regressions `test-452` through `test-454`, and audit contract `test-450`.
- Baseline commit:
  `d78892a53c72c85f1c74489e5b057074f5a1b8bb`.
- Implementation commit:
  `f657a1b3e82388050aeeef39a188d4eaca0a2bf9`.

## Changed Surfaces

- Added `mdkg git materialize --request <file|-> [--json]` and preserved
  existing `mdkg git clone` behavior.
- Added strict request parsing, bounded redacted receipts, external auth
  capability preflight, exact commit/tree verification, SHA-1/SHA-256 support,
  submodule and project-memory policies, cancellation cleanup, and contained
  same-parent atomic publication.
- Added generated command-contract metadata, package lifecycle integration,
  installed-tarball consumer proof, advanced-alpha docs, command matrix and
  README guidance, safety documentation, and `CHANGELOG.md` `Unreleased` notes.

## Boundaries

- in scope: local implementation, docs, tests, package payload proof, graph
  evidence, and Goal-67 handoff.
- out of scope: version bump, npm publication, push, tag, deployment, global
  replacement, and real-root upgrade.
- Codex Security is excluded by operator decision after scan
  `4956a227-c1c0-4309-98d0-1e65687fab71` failed before finalization. Its partial
  candidate evidence is retained in `chk-530` without a clean-scan claim.
- Raw secrets, raw prompts, provider payloads, raw Git output, repository
  contents, absolute source paths, and bulky traces are excluded.

# Decisions Captured

- `mdkg.git.materialize.request.v1` is the strict JSON request schema.
- `mdkg.git.materialize.receipt.v1` is the bounded receipt schema.
- Git authentication stays external; receipts record capability availability
  only.
- System Git runs by argv without a shell, prompts, hooks, push, or recursive
  submodules.
- Only a verified contained temporary checkout can be atomically renamed into
  the accepted destination.

# Implementation Summary

- Implementation commit `f657a1b3e82388050aeeef39a188d4eaca0a2bf9`
  contains 54 changed files and remains local on `main`.
- The version-neutral package remains `mdkg@0.5.1`; Goal 67 owns the `0.5.2`
  metadata, release commit, final version-specific replay, publication, and
  post-publish validation.

# Verification / Testing

## Command Evidence

- `npm ci`: passed.
- `npm run prepublishOnly`: passed, including 658/658 source tests and 13/13
  public-release/security tests plus the complete installed-package smoke
  matrix.
- Focused materialization suite: 17/17 passed, covering strict parsing,
  pre-EOF stdin bounds, auth classes, credential-safe refs, moved/missing refs,
  commit/tree mismatch, SHA-1/SHA-256, depth, submodules, containment/symlinks,
  project-memory policies, no-push behavior, cancellation, and cleanup.
- `npm run security:verify`: passed its canonical 51-finding remediation
  matrix.
- CLI snapshot, generated command contract, docs checks, docs 33-page build,
  graph full/changed-only validation, and `git diff --check`: passed.
- Isolated pack and publish dry-runs: passed for the equivalent version-neutral
  payload.
- Actual tarball install: passed materialization acceptance, representative
  `commit_mismatch`, bounded no-local-path receipt, help/contract parity, and
  `git clone` compatibility.

## Pass / Fail Status

- status: ready for goal-67 v0.5.2 release execution.

## Known Warnings

- Codex Security produced no sealed report. It is terminally failed and out of
  scope, not a zero-finding result.
- Goal-66 package proof is intentionally version-neutral at `0.5.1`. Registry
  availability and all `0.5.2`-specific evidence must be replayed by Goal 67.
- The temporary tarball is not durable; its content identity is preserved by
  the hashes below and can be reproduced from the implementation commit.

# Known Issues / Follow-ups

- Goal 67 must move materialization notes into `0.5.2`, bump package/lock and
  generated release metadata, replay final gates, verify npm availability/auth,
  publish, validate temporary/global installs and safe root upgrade, then push
  and verify CI/Vercel/docs according to its approved boundary.
- Any post-publication failure is fix-forward. No Git tag is authorized.

## Follow-up Refs

- `goal-67`, `task-753`, `test-416`, `test-417`, `task-755`, `task-756`,
  `task-789`, `test-418`, `task-790`, `test-451`, `task-757`, and `test-419`.

# Links / Artifacts

- Package: `mdkg@0.5.1`, 191 files, 425438 packed bytes.
- npm pack shasum: `9a667d7b7a2e331e43e772219ccb4430212ed1e3`.
- Actual tarball SHA-256:
  `3bb169fa58ee28553f40fc5f224fa8d617b863c5173c608c8842a02c19af9728`.
- Generated command-contract SHA-256:
  `35e7a82190d09c19eb3c8823980d8f2b33b6a3aadfc4cf7f8c6f8249fadcdd71`.
- Payload includes `dist/cli.js`, `dist/commands/git_materialize.js`,
  `dist/command-contract.json`, `README.md`, `CLI_COMMAND_MATRIX.md`,
  `CHANGELOG.md`, and `scripts/postinstall.js`.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
