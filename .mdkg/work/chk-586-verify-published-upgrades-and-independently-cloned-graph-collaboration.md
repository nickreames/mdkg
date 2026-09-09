---
id: chk-586
type: checkpoint
title: Verify published upgrades and independently cloned graph collaboration
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-progress.json]
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

Real published 0.5.2 upgrades and independently cloned v2 graph collaboration
now execute through existing manifest-backed installed-package smokes. Both
pass on Node 24.18.0 and 26.0.0. This is partial bug-7 evidence, not closure.

# Scope Covered

Owned bug-7 qualification infrastructure; no shipped runtime implementation change.

## Changed Surfaces

- scripts/smoke-upgrade.js and scripts/smoke-branch-conflicts.js
- scripts/published-upgrade-baseline.js and scripts/installed-identity-collaboration.js
- tests/published-upgrade-baseline.test.ts and owned graph evidence/projections

## Boundaries

Pinned local artifacts, disposable local Git clones/commits/reverts and installed
CLI execution only. Canonical migration, bundle refresh, selection/runtime changes,
bug-17 custody, external Git/provider/publication and consumer writes excluded.

# Decisions Captured

No new product decision. Existing contracts remain intact: custom skills require
reviewed preservation; cherry-picked/reverted identities require explicit
reintroduction; decisions-file paths must be contained and relative.

# Implementation Summary

Retained legacy smokes and added historical package upgrades, custom instructions
and skills, natural alias collisions, cross-links, staged/untracked reads,
semantic lifecycle decisions, replay/reverts, reintroduction, stale-plan refusal
and immutable external fixture receipt bytes. Baseline reads are bounded and pinned.

# Test Proof

Intermediate candidate SHA-256:
5d72db2d486ab187eef8da487abd519e31700e6e41bb7420a18850216d3eba05.
Fixtures and compact evidence: /private/tmp/mdkg-bug7-upgrade.63CHpg.
No network access. Minimum runtime and complete matrix remain open.

# Verification / Testing

## Command Evidence

- Existing smoke:upgrade and smoke:branch-conflicts using immutable artifact proxy:
  pass on Node 24.18.0 and 26.0.0.
- npm run build:test and scripts/test-built.js: pass; 1341 tests, zero failures/skips.
- Baseline/release/security-contract subset: 20 pass; not a current security scan.
- CLI/docs parity: pass; 494 checked examples, zero failures.
- Full/changed-only graph and git diff --check: pass before closeout; index/SQLite
  and graph validation rerun after this evidence is present.

## Pass / Fail Status

Milestone verified. Bug-7 stays progress; publication NOT_READY.

## Known Warnings

Three existing imported-bundle age warnings remain preserved. Initial fixture
assumptions were corrected from source-backed behavior; failed logs are retained.

# Known Issues / Follow-ups

Minimum Node 24.15.0, complete installed recovery/delete-modify/evidence-conflict
cases, legacy/old-client behavior, private canonical graph rehearsal, operational
scale and task/goal routing remain open, along with final independent review,
release metadata, full ladder and artifact seal. Bug-17's policy decision is separate.

## Follow-up Refs

bug-7, bug-17, task-826, task-828, task-829, task-830, goal-83, goal-84, goal-85.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-progress.json binds source, artifact and log hashes.
A reviewed local commit may follow; no push or publication authority.

# Raw Content Safety

Only synthetic fixture evidence and compact validation summaries/hashes.
No raw security reports, private application payloads or credentials.
