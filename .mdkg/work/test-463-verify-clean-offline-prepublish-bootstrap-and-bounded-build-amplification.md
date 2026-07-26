---
id: test-463
type: test
title: verify clean offline prepublish bootstrap and bounded build amplification
status: done
priority: 1
parent: goal-77
prev: task-803
next: task-804
tags: [audit-followup, release, prepublish, test]
owners: [root]
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
- Run the verification from the real checkout against the already-installed
  dependency trees, while keeping its cache, temporary files, artifact, and
  raw receipts under a dedicated `/private/tmp` directory. The runner records
  and compares the complete tracked worktree boundary before and after.
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

## One-shot result

- The single automatic `npm run prepublishOnly` attempt used Node `24.18.0`,
  forced offline mode, an empty cache, registry `http://127.0.0.1:9`, and an
  isolated `TMPDIR`.
- It passed preflight, the complete test gate, built-only CLI/docs gates, graph
  validation, security verification, package construction, and canonical
  smokes 1–29 in `226.138s`.
- Both root compiler invocations were recorded before the smoke suffix.
- The run stopped at `smoke:mdkg-dev-docs`. Astro rejected symlinked
  `docs/node_modules` in the disposable snapshot because virtual-module
  metadata resolved across the snapshot and original absolute paths. This is a
  fixture isolation defect, not a registry request or docs-source failure.
- The failed receipt and raw logs are under
  `/private/tmp/mdkg-goal77-prepublish-v1/`. No automatic whole-ladder retry was
  performed.

## Targeted recovery evidence

- Reusing the same immutable artifact against the real dependency paths,
  `smoke:mdkg-dev-docs` passed immediately, followed by the previously
  unexecuted smoke suffix.
- The suffix exposed a real baseline incompatibility:
  `smoke:demo-graph` rejected the two accepted stale-subgraph warnings despite
  zero errors. The smoke now accepts only warning-only bundle-age staleness and
  still fails any subgraph error or other warning; its targeted rerun passed.
- Focused runner tests now pass `6/6`, including the warning-only stale
  subgraph contract and tracked-boundary drift detection.
- Across the original prefix and targeted suffix, all 46 canonical identities
  executed, all 34 artifact-consuming canonical smokes used SHA-256
  `53e2d7a33398a7cbcaaab8d6468f7ca93e30d25fc7b4edcdaf5ba30fd0ea80d8`,
  and no nested install or registry request occurred.
- Targeted site receipts performed one actual build for each of four docs
  profiles and five mdkg-dev profiles; every repeated build was a cache hit.
- Root/docs/mdkg-dev lockfile hashes, selected achieved `root:goal-73`, and
  tracked non-owned paths remain unchanged.
- The release runner now fails closed unless branch, HEAD, exact Git porcelain
  status, the aggregate content hash of every tracked path, all three lockfile
  hashes, the selected `root:goal-73` hash, and `git diff --check` remain
  unchanged. Successful and failed receipts both retain the comparison.

## Authorized replacement result

- After explicit user approval, exactly one replacement
  `npm run prepublishOnly` ran from the real checkout under Node `24.18.0`.
  The runner remained offline with an empty dedicated cache, registry
  `http://127.0.0.1:9`, and isolated `/private/tmp` outputs.
- The command passed in `275.557s`, within the 60-minute budget. Its receipt is
  `/private/tmp/mdkg-goal77-prepublish-v2/receipt.json`.
- All 47 aliases mapped to 46 successful canonical executions. All 34
  artifact-consuming canonical smokes used the same immutable package artifact,
  SHA-256
  `53e2d7a33398a7cbcaaab8d6468f7ca93e30d25fc7b4edcdaf5ba30fd0ea80d8`.
- Root compiled twice. Each of four docs profiles and five mdkg-dev profiles
  performed exactly one actual build; subsequent requests were cache hits.
- The receipt proves unchanged branch, HEAD, exact Git porcelain status, the
  aggregate content hash of all 3,490 tracked paths, all three lockfiles,
  selected achieved `root:goal-73`, and clean `git diff --check`.
- No additional retry, install, registry request, tracked change, goal
  selection change, or remote/publication action occurred.

# Notes / Follow-ups

- Keep provider-matrix/sharding policy separate in `root:prop-9`.
- A command failure is evidence; it does not authorize an unrelated code fix or
  a whole-ladder retry.
