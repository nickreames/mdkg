---
id: chk-634
type: checkpoint
title: Verify archive payload ownership and resource isolation before compression
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-57-baseline.json, .mdkg/artifacts/goal-86/bug-57-full-verification.json, .mdkg/artifacts/goal-86/bug-57-installed-verification.json]
relates: [bug-57]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-58]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-633]
aliases: []
skills: []
scope: [bug-57]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

1958 full tests,83 focused tests and114 installed cases pass; blocked context untouched; release remains NOT_READY

# Scope Covered

- Completed node: bug-57 (Compressing an archive can copy or overwrite another workspace's files)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Archive compression resource admission and consistent native path sinks;
  README contract;38 new regressions; Bug57/Goal86 and sanitized receipts.
- SQLite projection remains separate preserved dirty custody, excluded from commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- One writer on main under Goal86; no blocked context, old report recovery,
  remote Git, publication, providers, canonical migration or bundle refresh.
- Preserve explicit external archive-add authority and legitimate cache repair.
  Do not invent a hardlink policy or claim concurrent-ancestor race safety.

# Implementation Summary

- Whole-set metadata admission precedes payload reads; deepest owners include
  disabled/private roots. Protected metadata, shared resources, ancestor overlaps
  and portable aliases refuse. Sidecar authority is reread before payload access.
- One independent review yielded two confirmed/corrected gaps: normalized
  template selectors and legitimate regular dotfile inputs. Parent regression
  proved literal-# filenames must not imply imported projections.

# Verification / Testing

## Command Evidence

- Build/build:test;83 focused tests;1958 full manifest-discovered tests pass,
  0 fail/skip,430682ms, Node26.0.0/macOS arm64.
- Exact installed candidate:38 each on Node24.15.0/24.18.0/26.0.0;114 total.
- CLI/docs/workflow parity, full/changed graph and diff checks pass.
- Intermediate tarball SHA256:
  a861a6e9083c151c6fa039747e0af14f6637305eae737f8e9205978b9638b634.
  All231 package files unchanged. Not the final release seal.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale imported-bundle warnings; no refresh authority.
- An overlapping-build test run was invalidated and fully repeated sequentially;
  it is disclosed in the baseline receipt, not counted as a product pass.

# Known Issues / Follow-ups

- Twelve of14 retained findings have local remedies. Bugs46/47 and adjacent
  Bugs58-60, final Task828/Test488, Linux, coverage ladder and seal remain open.
- Selected Goal73/runtime DB/Demo3 hashes match the baseline receipt; five
  released leases, empty queues/messages, no persistent writer lease acquired.
- Goal86 remains active, Bug57 done, Goal85 paused; release NOT_READY.
- Reused goal/fix/verification skills; candidates:none. No skill authoring.

## Follow-up Refs

- root:bug-58; root:test-488; root:task-828; root:goal-86; root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-57-baseline.json
- .mdkg/artifacts/goal-86/bug-57-full-verification.json
- .mdkg/artifacts/goal-86/bug-57-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
