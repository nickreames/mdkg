---
id: chk-548
type: checkpoint
title: Goal 77 explicit dependency boundary verified
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [root]
links: []
artifacts: []
relates: [test-468]
blocked_by: []
blocks: []
refs: [goal-77, task-810, test-468, dec-87]
context_refs: [goal-77, task-810, test-468, dec-87]
evidence_refs: []
aliases: []
skills: []
scope: [task-810, test-468]
created: 2026-07-25
updated: 2026-07-25
---
# Summary

Root, docs, and mdkg-dev ownership preflight and hostile-network focused
verification passed. The hidden nested install was removed; bootstrap remained
explicit and unexecuted without external-network authority.

# Scope Covered

- Completed nodes: `root:task-810` and `root:test-468`.
- Owners: root package, docs site, and mdkg-dev site remain independent
  lockfile and dependency-tree domains.
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Added local-only dependency inspection and explicit bootstrap commands.
- Integrated preflight ahead of build, CI release, prepack, and
  prepublish-only ladders.
- Removed nested install behavior from site smoke utilities.
- Added focused dependency-boundary fixtures and publish-readiness assertions.

## Boundaries

- in scope: root/docs/mdkg-dev ownership, local preflight, bootstrap command
  declaration, offline focused verification, and mdkg evidence
- out of scope: registry access, lockfile replacement, workflows, skills,
  package versions, remotes, providers, and publication
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `root:dec-87` preserves three independent lockfiles.
- `npm run deps:bootstrap` is the only registry-capable repair command.
- Verification may not install dependencies and must fail closed through the
  local-only preflight.

# Implementation Summary

- `scripts/dependency-boundary.js` compares manifests, lockfile package
  inventories, and installed trees with Node built-ins.
- Machine receipts distinguish local read-only preflight from mutating,
  registry-capable bootstrap.
- All smoke aliases enter through the preflighted build; site helpers perform
  a direct preflight before Astro and contain no install path.

# Verification / Testing

## Command Evidence

- Current preflight: zero issues across root, docs, and mdkg-dev.
- Bootstrap dry-run: three domains listed, `executed: false`.
- Hostile-network focused suite: `8/8` passed with offline mode, empty cache,
  unreachable registry, and isolated temp directory.
- Root build and publish-readiness assertions passed in that environment.
- Root/docs/mdkg-dev lockfile hashes were identical before and after.
- Changed-only graph validation: zero warnings and errors.
- `git diff --check`: passed.

## Pass / Fail Status

- status: passed for the authorized dependency and offline boundary

## Known Warnings

- A clean registry-backed bootstrap was not executed because external network
  access was not authorized. This is not evidence that a provider was
  unavailable and does not weaken the no-hidden-install contract.

# Known Issues / Follow-ups

- Continue with `root:task-803` and `root:test-463` for the smoke manifest,
  immutable package artifact, profile-aware build bounds, and one integrated
  offline ladder.

## Follow-up Refs

- `root:task-803`
- `root:test-463`

# Links / Artifacts

- Concise receipts are stored here and on the completed task/test nodes; empty
  cache and disposable fixtures remain under `/private/tmp`.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
