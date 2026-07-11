---
id: test-381
type: test
title: Installed tarball loop smoke CI and release gates cover all seeded templates
status: done
priority: 1
epic: epic-228
tags: [loop, package, smoke, ci]
owners: []
links: []
artifacts: [Node 24.16 ci:release: 572/572 tests plus CLI/docs/contract/smoke/publish gates passed, npm run smoke:loop passed all 7 installed SQLite templates, npm pack dry-run: 189 entries including loop modules templates and skill]
relates: [goal-61, task-708]
blocked_by: []
blocks: []
refs: [task-708]
context_refs: [goal-61, epic-228, edd-70, dec-67]
evidence_refs: [chk-414]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove published-package shape and supported Node environments exercise the loop
surface that source-checkout tests previously missed.

# Target / Scope

`task-708`; tarball payload, seven seeds, SQLite, CI, and publish readiness.

# Preconditions / Environment

Packed artifact installed into clean temporary workspaces under supported Node
versions with SQLite enabled.

# Test Cases

- Verify all seven templates list and fork.
- Run dry-run/real fork, plan, next, runs, and pack from installed CLI.
- Confirm missing loop payload/generated drift/changelog mismatch fail gates.
- Reproduce CI matrix locally where practical.

# Results / Evidence

PASS on 2026-07-10. The packed tarball installed into an isolated prefix and
exercised all seven seeded templates on SQLite through dry-run, real fork with
ID reuse, plan, next, pack, and validate. Node 24 minimum/current CI and
publish-readiness gates passed. Evidence: `chk-414`.

# Notes / Follow-ups

- No version bump occurs in this test.
