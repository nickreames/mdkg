---
id: test-463
type: test
title: verify clean offline prepublish bootstrap and bounded build amplification
status: backlog
priority: 1
parent: goal-77
prev: task-803
next: task-804
tags: [audit-followup, release, prepublish, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-803]
blocked_by: [task-803]
blocks: [task-804]
refs: [goal-77, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, chk-545, dec-87, task-810, test-468, task-803]
context_refs: [goal-77, loop-7, chk-544, chk-545, dec-87, task-810, test-468, task-803]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [preflight_before_smokes, explicit_three_domain_bootstrap, offline_empty_cache, alias_map_47_to_46, one_tarball_hash, profile_build_bounds, sixty_minute_bound, no_tracked_drift]
created: 2026-07-17
updated: 2026-07-25
---
# Overview

Verify `root:task-803` makes the full publication ladder clean-install
reproducible, network-closed after bootstrap, and bounded in build work.

# Target / Scope

- dependency bootstrap for root, docs, and mdkg-dev
- source-owned 47-alias/46-execution manifest
- reusable immutable package artifact and all installed-package smokes
- root/docs/mdkg-dev build counters and tracked-output boundary

# Preconditions / Environment

- `root:task-803` is done.
- `root:test-468` has proven the explicit bootstrap/preflight boundary.
- Use a disposable snapshot of HEAD plus the owned Goal 1 diff under
  `/private/tmp`; exclude `.git`, dependencies, generated builds, caches, and
  unrelated untracked files.
- Network, when separately authorized, is allowed only during the explicit
  lockfile install phase; the verification phase is forced offline.

# Test Cases

- A missing docs or mdkg-dev tree fails the preflight with the documented
  bootstrap command before any smoke starts.
- Explicit root/docs/mdkg-dev installs reproduce their lockfiles without
  extraneous packages.
- Offline `npm run prepublishOnly` maps all 47 aliases, executes all 46
  canonical identities once, and performs no nested install or registry
  request.
- Every installed-package smoke consumes the same recorded tarball SHA-256.
- Instrumented counts are at most three root builds and one actual site build
  per declared normalized profile, with all distinct profile assertions run.
- The command finishes within 60 minutes and `git diff --check` plus tracked
  path comparison are clean.

# Results / Evidence

Attach install, offline, alias expansion, tarball hash, per-profile build,
duration, and tracked-path receipts to a test-proof checkpoint. Raw logs and
temporary installs remain under `/private/tmp`.

# Notes / Follow-ups

- Keep provider-matrix/sharding policy separate in `root:prop-9`.
- A command failure is evidence; it does not authorize an unrelated code fix or
  a whole-ladder retry.
