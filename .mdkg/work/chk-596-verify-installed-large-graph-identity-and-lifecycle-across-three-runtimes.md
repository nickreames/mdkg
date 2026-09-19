---
id: chk-596
type: checkpoint
checkpoint_kind: test-proof
title: Verify installed large-graph identity and lifecycle across three runtimes
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json]
relates: [bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, test-481, test-482, task-826, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-481, test-482]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

The strengthened installed scale/lifecycle matrix passes on Node 24.15.0,
24.18.0 and 26.0.0: 45 cases, 798 commands and 27 removed disposable graph
fixtures. Each large graph contains 2000 tasks plus ten seeded rules and 20000
events. This closes the representative scale execution gap, not Bug7 or Goal83.

# Scope Covered

Bug7's installed qualification infrastructure and test481/test482 evidence.
Owner: mdkg-project-agent. No shipped runtime behavior changes in this unit.

# Decisions Captured

The original 180-second default remains; the runner explicitly selects a bounded
600-second per-command test allowance. No production limit, SLA, custody check
or coverage floor changed. Old-writer adoption, killed-writer recovery and legacy
public-bundle policies remain unaccepted. No release authority is inferred.

# Implementation Summary

The harness checks successful applied state and exact plan identity, persisted
v2 graph format, every public plan after-hash, complete unique stable identities,
and exact original event-history bytes. Task-only counts are kept separate from
the complete inventory. Existing scale, limit and lifecycle cases remain intact.

Independent review identified missing identity/history assertions and temporary
runner failure-evidence loss. Corrections were verified. A small installed
preflight exposed an internal/public plan-shape mismatch; the harness now uses
public after_hash values. Older 262-command runs remain supplemental only.

# Verification / Testing

- All three exact runtimes pass 15 strengthened installed cases and 266 commands
  each. Six large migrations verify 2010 identities and 2012 planned writes.
- Eight scale combinations per runtime cover JSON/SQLite, legacy/v2 and warm/cold
  reads. Cross-linked packs, list/show/search, validation and read-only snapshots
  pass. Original 3660000-byte event histories remain identical across migration.
- Above-threshold node/event/history refusals retain exact diagnostics and bytes.
  Four lifecycle combinations verify checkpoint/dependency routing, reopening
  gates, non-executing evaluation and unchanged Git index/selection.
- Fresh Node 24.18.0 full build/test: 1383 pass, zero failures/skips. Fifteen
  harness tests pass on each runtime; combined Node26 release contracts: 41 pass.
- CLI/docs checks pass, including 494 checked command examples. Full and
  changed-only graph validation and SQLite verification pass at closeout;
  three pre-existing stale subgraph warnings remain. git diff --check passes.
- Independent source/receipt review has no remaining bounded finding. This is
  not the separate final task828 security review.

Reproduce using scripts/installed-scale-goal.js runInstalledScaleGoal with an
installed candidate CLI path, an owned disposable tempBase, nodeCount: 2000 and
commandTimeoutMs: 600000, under each recorded runtime. Verify candidate/package
hashes and canonical bookends before and after. Never point fixtures at a real
consumer graph. Private run receipts bind exact commands and output hashes.

# Known Issues / Follow-ups

- Bug7 still requires old-client adoption and killed-writer recovery decisions,
  historical task309 migration-evidence disposition and full installed-family
  aggregation. Bug17 is still blocked on its legacy public-bundle decision.
- test481/test482 remain open for task826 and final independent acceptance.
- Draft 0.6.0 metadata, final security review, full release ladder and exact
  artifact seal remain required. The tested package is 0.5.2 development and
  includes incomplete Bug17 work; it is not a final 0.6.0 candidate seal.
- These are representative scale measurements, not exhaustive threshold or
  performance certification. Goal routing does not enforce external artifact
  verification or publication approval.
- Package-input changes from remaining fixes or metadata require appropriate
  requalification before the final seal. No risk waiver is recorded.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json binds the 45 cases,
runtime/command/receipt hashes, package identity, limitations and remaining gates.
The preceding progress artifact preserves the review corrections and failed
preflight disposition. Raw diagnostics stay under /private/tmp.

Canonical main was 375265f208bb50b3af05440d6491e27488f98862 before this local
commit unit, 39 ahead of cached origin/main with no remote verification. Selected
Goal73, runtime DB, protected Demo3 bundle and eight partial Bug17 paths match
their recorded hashes. Generated SQLite custody remains separate and uncommitted.
All runtime leases remain released and queues empty; mutation locks are transient.
Existing Bug7 ownership remains for scoped continuation. No push, tag, publication,
provider/deployment action, canonical migration or bundle refresh. Skill candidates:
none. Authority used: approved local qualification, evidence and exact-path commit.
