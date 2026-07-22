---
id: test-463
type: test
title: verify clean offline prepublish bootstrap and bounded build amplification
status: backlog
priority: 1
tags: [audit-followup, release, prepublish, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-803]
blocked_by: [task-803]
blocks: []
refs: [loop-7, spike-32, test-461, chk-541, chk-542, task-803]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Verify `root:task-803` makes the full publication ladder clean-install
reproducible, network-closed after bootstrap, and bounded in build work.

# Target / Scope

- dependency bootstrap for root, docs, and mdkg-dev
- reusable local package artifact and all installed-package smokes
- root/docs/mdkg-dev build counters and tracked-output boundary

# Preconditions / Environment

- `root:task-803` is done.
- Use a disposable clean checkout/fixture under `/private/tmp`.
- Network, when separately authorized, is allowed only during the explicit
  lockfile install phase; the verification phase is forced offline.

# Test Cases

- A missing docs or mdkg-dev tree fails the preflight with the documented
  bootstrap command before any smoke starts.
- Explicit root/docs/mdkg-dev installs reproduce their lockfiles without
  extraneous packages.
- Offline `npm run prepublishOnly` reaches all 47 effective smoke aliases and
  performs no nested install or registry request.
- Instrumented counts are at most three root builds, one docs build, and one
  mdkg-dev build, with one reusable package artifact.
- The command finishes within 60 minutes and `git diff --check` plus tracked
  path comparison are clean.

# Results / Evidence

Attach install/offline/build-count receipts and a full smoke map to a test-proof
checkpoint.

# Notes / Follow-ups

- Keep provider-matrix/sharding policy separate in `root:prop-9`.
