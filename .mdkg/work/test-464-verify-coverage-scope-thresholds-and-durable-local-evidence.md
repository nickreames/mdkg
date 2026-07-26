---
id: test-464
type: test
title: verify coverage scope thresholds and durable local evidence
status: backlog
priority: 1
parent: goal-77
prev: task-804
tags: [audit-followup, coverage, release, test]
owners: []
links: []
artifacts: []
relates: [loop-7, task-804]
blocked_by: [task-804]
blocks: []
refs: [goal-77, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-88, test-463, task-804]
context_refs: [goal-77, loop-7, chk-544, dec-88, test-463, task-804]
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

- Dynamic discovery proves every compiled TypeScript family and both root MJS
  paths execute; the current count is a receipt rather than permanent policy.
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

Attach scoped baseline, bound thresholds, test-family inventory, raw/summary
manifest, negative cases, exactly-once receipt, and final Git boundary to a
test-proof checkpoint.

# Notes / Follow-ups

- CI workflow placement, provider artifact upload, and remote execution remain
  Goal 2 authority; this local proof makes no provider claim.
