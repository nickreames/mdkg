---
id: test-468
type: test
title: Verify explicit bootstrap and the post-bootstrap offline boundary
status: backlog
priority: 1
parent: goal-77
prev: task-810
next: task-803
tags: [audit-followup, release, dependencies, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-810]
blocked_by: [task-810]
blocks: [task-803]
refs: [loop-7, task-810, dec-87]
context_refs: [goal-77, task-810, dec-87, loop-7]
evidence_refs: []
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

Attach preflight cases, process instrumentation, bootstrap receipt when
authorized, offline-boundary proof, and before/after Git state to a test-proof
checkpoint.

# Notes / Follow-ups

- Reusable package artifacts and full-ladder offline execution remain owned by
  `root:task-803` and `root:test-463`.
- A missing network approval limits clean-bootstrap proof; it does not permit a
  hidden install or false offline claim.
