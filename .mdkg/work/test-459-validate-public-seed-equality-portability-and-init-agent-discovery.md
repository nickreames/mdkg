---
id: test-459
type: test
title: Validate public seed equality portability and init agent discovery
status: done
priority: 1
epic: epic-254
tags: [public-seed, init, portability, deterministic]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: []
relates: [goal-74, task-798, task-800]
blocked_by: [task-798, task-800]
blocks: []
refs: [goal-74, task-798, task-800, edd-79, dec-85]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: []
cases: []
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Prove the public default lifecycle is the canonical portable body and an
initialized agent fixture can discover it.

# Target / Scope

- Canonical and public default `pursue-mdkg-goal` skill files.
- Configured agent mirrors.
- Disposable `mdkg init --agent` fixture.

# Preconditions / Environment

Run from repository root using the local built CLI after refreshing ignored
`dist/init` from `assets/init`. Use a unique `/private/tmp` fixture and remove it
after assertions.

# Test Cases

- `cmp` canonical, `.agents`, `.claude`, and public seed lifecycle files.
- Run `mdkg skill validate pursue-mdkg-goal --json`.
- Scan the public seed for named repositories, customers, and unrelated
  products; expect no matches.
- Initialize a clean temporary repo with `mdkg init --agent`, show the installed
  lifecycle skill, and assert explicit-QID and stale-selection clauses exist.
- Remove the fixture and assert its path no longer exists.

# Results / Evidence

- Canonical, `.agents`, `.claude`, and public default lifecycle files are exact
  matches with SHA-256
  `3b8493ee443a289ba257ed0e30045be84e9b647ef7ebfd88782319382f489776`.
- Public forbidden-name scan for named repositories, customers, and unrelated
  products returned no matches.
- Local `mdkg init --agent` created a disposable 77-file fixture and
  `skill show --meta --json` discovered `pursue-mdkg-goal` version `0.2.0` with
  the explicit-QID description.
- Fixture canonical and both configured mirrors matched the public seed.
- Fixture contained no `release-mdkg-package` skill.
- Fixture path was removed and verified absent after the test.
- Existing startup discovery succeeded, so no wrapper or startup doc edit was
  required.

# Notes / Follow-ups

- Add no wrapper change if the existing init discovery path passes.
