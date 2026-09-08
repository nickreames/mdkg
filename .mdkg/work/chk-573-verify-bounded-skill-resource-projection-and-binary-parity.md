---
id: chk-573
type: checkpoint
title: Verify bounded skill resource projection and binary parity
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [bug-15]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-15]
created: 2026-09-08
updated: 2026-09-08
---
# Summary

44 focused and installed checks; 1018 source plus 26 contracts pass. Two review issues reproduced and fixed; final task-828 remains. No publish or canonical bundle refresh.

# Scope Covered

- Completed node: bug-15 (Skill projection copies external files through source resource-directory symlinks)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Owner: mdkg-project-agent, sole writer on canonical main.
- Source: src/commands/skill_mirror.ts and src/graph/skills_indexer.ts.
- Regression: tests/commands/skill_resource_containment.test.ts (18 cases).
- Guidance: docs/src/content/docs/start-here/troubleshooting.md.
- Evidence: bug-15, goal-84, this checkpoint and the verification JSON below.
- Required indexes/events are generated local projections; tracked SQLite is
  accepted uncommitted custody, not part of the source fix commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Reuse configurable index limits for resource snapshots; reject explicitly
  before mirror sync writes, without truncation. Keep scripts inert.
- Preserve selected Goal 73, runtime DB and protected bundle hashes. No bundle
  refresh, canonical skill sync, remote Git, publication or consumer changes.

# Implementation Summary

- Snapshot all canonical documents/resources with contained no-follow reads;
  parse those same bounded bytes, then materialize and compare binary-exact data.
- Preserve empty directories, legacy docs, custom targets, force/prune behavior,
  literal native filenames and existing permissions. Never reopen source paths
  during target writes. One prepatch and one candidate security review used.

# Verification / Testing

## Command Evidence

- Build: passed. Focused suites: 44 passed. Offline installed candidate: 44
  passed with unchanged installed runtime hashes. Full standalone test:built:
  1,018 source tests plus 26 release/security-contract checks passed.
- CLI/docs checks: passed; 494 examples across 63 files. Full/changed-only graph,
  project DB/index verification and git diff --check passed.
- Initial original-code regressions: 10 failures/1 control pass. Candidate
  review identified two additional issues, both reproduced then corrected.
- Invalid full-suite attempt: overlapping docs build removed dist files;
  discarded MODULE_NOT_FOUND/ENOENT attempt, isolated full rerun passed.

## Pass / Fail Status

- status: done

## Known Warnings

- Three inherited stale-subgraph age warnings; zero changed-only warnings.

# Known Issues / Follow-ups

- bug-17 remains the last sealed security fix. bug-7/full behavior and installed
  qualification, task-828 exact-range review, release ladder and seal remain.
- No supported Node 24, Windows, extended ACL or active ancestor-race guarantee
  from this fix. Source-only published 0.5.2 affected-version assessment.

## Follow-up Refs

- root:bug-17, root:bug-7, root:task-828, root:goal-83, root:goal-84, root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-15-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
