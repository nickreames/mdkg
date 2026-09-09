---
id: chk-588
type: checkpoint
title: Evaluate published legacy writer barriers and init bypasses
checkpoint_kind: audit
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-legacy-writer-barrier.json]
relates: [goal-83, goal-84]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Actual published 0.5.2 has a usable configuration-version refusal, but it is
not a complete v2 writer barrier. Seventy-six warm-cache probes across Node
24.15.0 and 26.0.0 establish identical behavior. No source policy was adopted.

# Scope Covered

Bug-7 legacy-writer compatibility investigation under Goal 83/84. Canonical
branch remains main; mdkg-project-agent owns the already-active bug-7 lane.

## Changed Surfaces

Temporary fixture harness, sanitized evidence, this checkpoint, bug-7/Goal84
narrative and required local index projections. This milestone also reviews the
previously uncommitted chk-587 recovery fixtures; no shipped runtime edit here.

## Boundaries

Only owned synthetic fixtures and local graph evidence. No canonical migration,
config change, bundle refresh, remote Git, provider, deployment or publication.
Raw diagnostic logs remain temporary; durable evidence contains hashes and
synthetic path/status classifications, not private operational data.

# Decisions Captured

No new policy decision. Recommend explicit v2-adoption configuration fencing
plus all-writers-upgraded/no-mixed-version writes, with the old-init bypass
disclosed. Nick's acceptance remains required before adopting that contract.

# Implementation Summary

Configuration schema 2 was used only as a fixture experiment. Published 0.5.2
already rejects versions newer than 1 through migrateConfig. Current candidate
also rejects config version 2; this is not a completed feature or migration.

# Audit Findings

- Reviewed published config migration and new/init/upgrade paths against exact
  cached package bytes, plus 19 command invocations under two config versions.
- All 16 non-init commands with experimental schema 2 refuse without changes.
- Old init writes its manifest; init --agent adds files before version refusal;
  init --force overwrites config/core and restores schema 1. These bypasses
  prevent claiming a complete portable old-client barrier.
- With a warm index and schema 1, new partially writes; task update changes an
  existing node before error while preserving its identities; checkpoint creates
  a legacy checkpoint successfully. Cold-cache parser refusal is not protection.

# Verification / Testing

## Command Evidence

The same fixture probe runs with official Node 24.15.0 and installed Node 26.0.0:
38 cases each. Result classifications match exactly; warm-cache positive controls
reproduce old new partial writes and successful old show. Full result hashes,
command matrix, source hashes and harness hash are in the artifact.

The prior chk-587 source suite remains 1341 passing tests; its three fixture
source hashes are unchanged. Fresh checks after this evidence update pass:
20 baseline/release/security-contract tests, fixture JavaScript syntax checks,
CLI parity, docs parity (494 examples, zero failures), full and changed-only
graph validation, SQLite verification and git diff --check. Full graph validation
retains three imported-bundle age warnings. No fresh full-suite claim is made.

## Pass / Fail Status

Investigation verified; bug-7 and publication remain NOT_READY. An experimentally
effective partial guard does not close the compatibility finding.

## Known Warnings

Initial 38 copied-cache exploratory probes did not reproduce the warm-cache
hazard; final harness explicitly rebuilds the candidate index before every old
command. Preserve that distinction. Canonical imported bundles remain stale and
unchanged; this does not authorize refresh.

# Known Issues / Follow-ups

Obtain the version-adoption policy decision, then implement and qualify the
accepted complete contract. Continue independent graph-recovery/installed matrix
work; bug-17's public materialization decision and final review remain separate.

## Follow-up Refs

bug-7, bug-17, task-826, task-828, task-829, task-830, goal-83, goal-84.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-legacy-writer-barrier.json;
chk-587 and .mdkg/artifacts/goal-84/bug-7-recovery-runtime.json.

# Raw Content Safety

Synthetic fixtures only. No raw scan report, credentials, consumer receipts or
provider payloads committed. Skill coverage reuses existing grounding, goal,
pack and verification skills; candidates none.
