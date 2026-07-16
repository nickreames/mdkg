---
id: test-415
type: test
title: packed package neutral consumer materialization contract
status: done
priority: 1
parent: goal-66
tags: [goal-66, test, package, consumer]
owners: []
links: []
artifacts: []
relates: [task-746, task-750, task-751]
blocked_by: [task-750]
blocks: []
refs: [goal-66, goal-67]
context_refs: [edd-73]
evidence_refs: []
aliases: [materialize-packed-consumer-test]
skills: []
cases: [tarball-files, installed-help, local-bare-success, negative-matrix, clone-compatibility, no-product-dependency]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Prove the packed npm artifact, not only the source checkout, carries the full
generic materialization contract.

# Target / Scope

- Npm tarball contents and clean temporary installed consumer.

# Preconditions / Environment

- All source tests and docs/contract parity pass.

# Test Cases

- Required schema/command files are present in the tarball.
- Installed help and generated contract match source.
- Neutral local bare success and representative closed failures pass.
- Existing clone behavior passes from the same install.
- No downstream repository, package, fixture, or product name is required.

# Results / Evidence

- `npm run smoke:git-materialize` creates a real npm tarball, installs it under
  an isolated `/private/tmp` prefix, and verifies the compiled CLI,
  materialization command module, generated command contract, README, command
  matrix, and changelog payload files.
- The installed package help/contract match source; a neutral local source is
  accepted at the exact commit/tree; a wrong commit closes with
  `commit_mismatch` and no destination; existing `mdkg git clone` succeeds from
  the same install.
- The receipt omits the absolute source path, materialization public metadata is
  product-neutral, and installed package dependencies remain empty.

# Notes / Follow-ups

- This test is the publication handoff gate.
