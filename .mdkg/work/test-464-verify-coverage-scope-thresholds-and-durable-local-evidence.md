---
id: test-464
type: test
title: verify coverage scope thresholds and durable local evidence
status: done
priority: 1
parent: goal-77
prev: task-804
tags: [audit-followup, coverage, release, test]
owners: [root]
links: []
artifacts: []
relates: [loop-7, task-804]
blocked_by: [task-804]
blocks: [spike-33, task-812, task-813]
refs: [goal-77, goal-78, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-88, test-463, task-804, spike-33, task-812, task-813]
context_refs: [goal-77, goal-78, loop-7, chk-544, dec-88, test-463, task-804, spike-33, task-812, task-813]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [test_family_discovery, scoped_runtime_denominator, baseline_and_thresholds, raw_v8_manifest_summary, threshold_negative_fixtures, exactly_once_prepublish, no_tracked_output]
created: 2026-07-17
updated: 2026-07-25
---
# Overview

Prove the complete coverage contract created by `root:task-804` is enforced
locally, produces durable ignored evidence, and executes exactly once in the
optimized publication ladder.

# Target / Scope

- publishable-runtime coverage denominator and exclusions
- all compiled TypeScript and root MJS test paths
- Node threshold behavior, raw V8 inventory, manifest, and concise summary
- exactly-once local publication-ladder inclusion

# Preconditions / Environment

- `root:task-804` is done.
- Node 24.16 or the current supported 24.x runtime.
- `root:test-463` has proven deterministic offline prepublish execution.
- Dedicated ignored coverage output and temporary negative fixtures.

# Test Cases

- Dynamic discovery proves every compiled TypeScript family and every root MJS
  test executes; the current count is a receipt rather than permanent policy.
- The measured denominator contains only the publishable runtime paths and
  declared exclusions from `root:dec-88`.
- Each bound line, branch, and function threshold independently fails below its
  floor.
- Raw V8 files, a manifest, and a concise deterministic summary are produced
  and untracked.
- The optimized local publication ladder invokes the coverage contract exactly
  once.
- Removing a test family, threshold, measured path, exclusion, evidence file,
  or placement makes a focused contract test fail.
- `ci:release`, graph validation, and tracked-path checks pass.

# Results / Evidence

- Focused coverage and release guardrails passed `12/12`. They cover dynamic
  test discovery, every Decision 88 include and exclusion, independent line,
  branch, and function threshold failures, missing evidence files, and the
  exactly-once prepublish placement.
- The thresholded build-free run discovered 92 compiled TypeScript tests and
  all three root MJS tests across command, core, graph, pack, root, and utility
  families. All 711 tests passed.
- The integrated Node `v24.18.0` prepublish run measured 105 publishable
  runtime files at `89.30%` lines (`32044/35885`), `77.43%` branches
  (`6942/8966`), and `96.26%` functions (`2448/2543`). The bound whole-number
  thresholds are `89/77/96`.
- That run produced 1,724 raw per-process V8 files plus a manifest, structured
  Node event, and concise summary under
  `/private/tmp/mdkg-goal77-prepublish-coverage-v1/coverage/`. Their SHA-256
  values are `3fdbc4a108d3c0629c51554bb0a2ee6b74edb4def6f53431ab9de3573a3dadf2`,
  `2b6547f7f00213a8e7cdb81045a85825b9af2bb3b9b42035919ff377db91b2e5`,
  and `ee34ffdbb93fff30f8105a951c3dab3d93b9213755ee1ba7ecdd58831c024899`.
- The integrated prepublish ladder passed in `291.843s`, invoked coverage
  exactly once in `102.015s`, mapped all 47 aliases to 46 canonical
  executions, reused package SHA-256
  `f387f93d18d44db99ffb090734079beeb149fd7294f3203fd851f0ceeb652aa3`
  across 34 consumers, and stayed within every build bound. Receipt SHA-256:
  `8a332bedff2c7c288f322f8479746c61daa2d58167e20e341b254f4d0b208391`.
- The one final `ci:release` run passed in `122.416s`: 711 tests, CLI parity
  and contract checks, docs and security checks, publish-readiness assertion,
  and both CI smoke aliases were green. Its package SHA matched prepublish.
  Receipt SHA-256:
  `400226288abfeb34d1236a5ca5eb8685d172170061f293316994a8d1a71f2316`.
- Both ladder receipts prove unchanged branch, HEAD, porcelain state, tracked
  tree, selected achieved `root:goal-73`, root/docs/mdkg-dev lockfiles, and
  clean `git diff --check`. Coverage evidence stayed ignored and no tracked
  generated path appeared.

# Notes / Follow-ups

- CI workflow placement, provider artifact upload, and remote execution remain
  Goal 2 authority; this local proof makes no provider claim.
- Neither full ladder was retried after its accepted run.
