---
id: test-468
type: test
title: Verify explicit bootstrap and the post-bootstrap offline boundary
status: done
priority: 1
parent: goal-77
prev: task-810
next: task-803
tags: [audit-followup, release, dependencies, test]
owners: [root]
links: []
artifacts: []
relates: [loop-7, task-810]
blocked_by: [task-810]
blocks: [task-803]
refs: [loop-7, task-810, dec-87]
context_refs: [goal-77, task-810, dec-87, loop-7]
evidence_refs: [chk-548]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [current_trees_pass, missing_tree_fails_before_smoke, extraneous_tree_fails_before_smoke, no_hidden_install, explicit_bootstrap_receipt, offline_boundary]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Prove the three dependency domains have an explicit reproducible bootstrap and
that normal smoke/release verification cannot install dependencies implicitly.

# Target / Scope

- `root:task-810`
- root, docs, and mdkg-dev dependency-tree preflight
- shared site/smoke bootstrap helpers
- the boundary between explicit bootstrap and offline verification

# Preconditions / Environment

- `root:task-810` is done.
- Use Node 24 and disposable fixtures under `/private/tmp`.
- Positive preflight cases use current installed dependency trees.
- A separately authorized clean-install proof may use registry access only
  during the explicit bootstrap phase.
- The verification phase uses offline mode, an empty cache, an unreachable
  registry, and an isolated `TMPDIR`.

# Test Cases

- Current root, docs, and mdkg-dev trees pass the built-in-only preflight.
- Removing each nested tree independently fails before a smoke begins and
  names the exact bootstrap command.
- An extraneous dependency is reported against the correct lockfile owner.
- Instrumentation proves no smoke helper launches `npm ci` or another
  registry-backed install.
- Explicit bootstrap emits a bounded receipt for all three dependency domains.
- After bootstrap, an unreachable registry does not affect focused
  verification.

# Results / Evidence

- Node `24.18.0` current-tree preflight passed root, docs, and mdkg-dev with
  zero issues and a machine-readable no-network/no-mutation receipt.
- Focused fixtures passed `8/8`: positive three-owner validation, one
  independent missing-tree failure for each owner, owner-attributed extraneous
  dependency failure, bounded bootstrap dry-run, no-hidden-install source
  enforcement, and help-boundary assertions.
- Each failure receipt names the exact repair command
  `npm run deps:bootstrap`; no fixture launches a smoke or `npm ci`.
- The explicit bootstrap dry-run listed `npm ci`, `npm ci --prefix docs`, and
  `npm ci --prefix mdkg-dev`, reported `executed: false`, and made no
  dependency change.
- Registry-capable bootstrap execution was intentionally not performed because
  no external-network authority was granted. The current installed trees are
  the accepted local bootstrap state for subsequent verification.
- With `NPM_CONFIG_OFFLINE=true`, an empty dedicated cache, registry
  `http://127.0.0.1:9`, and isolated `TMPDIR`, root build, preflight, all eight
  focused tests, and publish-readiness assertions passed without a registry
  request.
- Before/after SHA-256 values were identical for all lockfiles:
  root `5625b8b9422af460209395f1f4f4c72615d23c5acadc57efae5cac56e1e09957`,
  docs `5b28b767ac1cda7c2ba27473ee49bde6f2241e68de4a7375011eb2705f9e937c`,
  and mdkg-dev
  `4988e006ace3eab2b1ce8ef5566fe2d4ae89c3566b1357288d776d4cf28120e5`.
- Git showed no lockfile, `.mdkg/init-manifest.json`, workflow, skill, or
  generated tracked-output change.

# Notes / Follow-ups

- Reusable package artifacts and full-ladder offline execution remain owned by
  `root:task-803` and `root:test-463`.
- A missing network approval limits clean-bootstrap proof; it does not permit a
  hidden install or false offline claim.
