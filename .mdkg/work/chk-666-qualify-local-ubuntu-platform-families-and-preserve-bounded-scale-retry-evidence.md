---
id: chk-666
type: checkpoint
title: Qualify local Ubuntu platform families and preserve bounded scale retry evidence
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-487-local-platform-composition.json, .mdkg/artifacts/goal-86/test-487-macos-capability-umask.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-retry.json, .mdkg/artifacts/goal-86/test-487-final-executor-identities.json, .mdkg/artifacts/goal-86/test-487-cleanup.json, .mdkg/artifacts/goal-86/requirement-coverage.json, .mdkg/artifacts/goal-86/test-487-local-commit.json]
relates: [goal-86, test-487, test-481, task-828, task-829, task-830]
blocked_by: []
blocks: []
refs: [dec-99, dec-100, goal-85, goal-87]
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-goal, verify-close-and-checkpoint, build-pack-and-execute-task]
scope: [test-487, test-481]
created: 2026-09-29
updated: 2026-09-29
---
# Summary

Completed the selected installed Ubuntu platform-family executions for Goal86,
not final release acceptance. All 18 family groups pass on native Linux ARM64
and Rosetta-emulated Linux x86_64. Matching 28 installed capability/umask
controls pass on native macOS ARM64. Node24.18.0 and the retained candidate
SHA2566154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca
are unchanged; 269 package inputs and 234 shipped files remain bound.

# Scope Covered

Owner mdkg-project-agent; Goal86 active node Test487. Nick authorized the
existing local Ubuntu executor. Canonical main began at36e075b8 with 245
accepted unstaged paths; no remote Git verification or operation occurred.

## Changed Surfaces

- Test487/Test481 evidence, requirement ledger, this checkpoint and necessary
  event/index projections; no selected-goal or runtime-DB mutation.
- Two non-shipping scale-harness files add validated backend selection and an
  explicit bounded emulation allowance. Default180000ms, graph size and
  integrity assertions remain unchanged. Package inputs did not change.
- Private hash-bound capsules, reproducible fixture drivers and sanitized
  family/failure/cleanup receipts; no raw security report or consumer payload.

## Boundaries

- Ubuntu24.04.4 userspace on the existing LinuxKit kernel, offline non-root
  containers, read-only roots and owned ext4 volumes. No host/socket mounts.
- Nine owned containers/volumes, seven image tags and three scratch roots
  removed after evidence capture. Shared base/build cache and unrelated
  Docker/Lima resources preserved. Raw disposable streams are not recoverable;
  retained hashes, source manifests and assertions support reproduction.
- No source feature change, repack, canonical migration/worktree/branch change,
  bundle refresh, push/fetch/tag/publication, provider/deployment or sibling write.

# Decisions Captured

Dec99/100 remain controlling. Bugs46/47 stay deferred/unresolved under Goal87.
Windows, hosted CI, Ubuntu host-kernel behavior, native x86_64 performance and
the cold-cache/read-only cross-product remain unqualified. Website case5 remains
deferred under Epic258, not passed. No new product decision or skill candidate.

# Implementation Summary

The original Node26 loader failure was corrected only in disposable images;
runtime controls then passed on both architectures. Count 19 expected safe
controls separately from two known unsupported old0.5.2 init observations.

The first x64 scale run timed out at600064ms during SQLite migration. A reviewed
SQLite-only retry passed 11 cases/239 commands in718362ms; migration took593517ms
under the explicit900000ms allowance. Four prior JSON rows plus 11 retry rows
give 15 unique cases. Two duplicate prior SQLite rows are excluded. All 2000
task identities, exact plan writes and 20000-event preservation checks remain.
The failure stays recorded; this is neither a product fix nor a new SLA.

# Test Proof

- Real installed retained tarball, native linked worktrees and independent
  gitdir/submodule fixtures; no canonical source-import substitution.
- Bootstrap/real0.5.2 upgrades, identity/integration/recovery, transport,
  containment/remedies, compatibility, packs/MCP/work, runtime, generic/option
  refusal, actual EROFS observations and scale/routing have explicit receipts.
- Mixed installed CLI/internal-module regressions are labeled. Added inert
  tests/metadata preserve all original package bytes and refuse canonical imports.
- Bounded independent read-only harness review prompted stronger assertions
  and failure accounting. It is not Task828 security clearance.

# Verification / Testing

## Command Evidence

- Focused scale helper suite: 18 passed, zero failed/skipped, 81.94ms.
- Runner failure-accounting controls: five passed, including progress-only
  output, launch/persistence/custody and preflight failures.
- Platform composition verifies 18 groups per Linux architecture, 15 unique
  scale rows and exact artifact/input bindings. Mac supplement: 28 passed.
- Post-checkpoint full and changed-only graph validation pass with zero errors;
  SQLite/index verification passes all five checks. Git diff whitespace checks
  pass. Full validation retains only three known stale-subgraph warnings.

## Pass / Fail Status

Current ledger: 19 of26 bounded requirements passed-current; seven still lack
final acceptance. This is not a weighted readiness percentage. Goal86 remains
35 completed/16 open scope records pending family/aggregate closeout. Goal85
stays paused. Overall release status: NOT_READY, not published.

## Known Warnings

Three existing stale imported-graph warnings remain; no subgraph refresh.

# Known Issues / Follow-ups

1. Complete family/aggregate acceptance from current case evidence without
   blanket reruns (Tests477-488, Task826/Bug7 as applicable).
2. Task828 fresh independent frozen-current-source and complete remediation-diff
   acceptance, without opening or recovering blocked historical reports.
3. Task829 full package ladder/37 smokes, package parity and89/77/96 coverage.
4. Task830 exact seal, final protected-state/custody/local-commit closeout and
   amended Goal83/84/86 acceptance. Publication remains separate authority.

## Follow-up Refs

Tests481/487, Tasks826/828/829/830, Bug7, Goals83/84/85/86/87.

# Links / Artifacts

See attached composition, family, original-failure/retry, executor, cleanup and
requirement-ledger receipts. Local commit72a3c8780af7d4c2888590b02158ddc60476facc
contains only scripts/installed-scale-goal.js and tests/installed-scale-goal.test.mjs.
Exact staged paths and diff were reviewed; no hooks or unexpected staged work.
Remaining owned source/guidance/mdkg/index work stays unstaged. Main is71 ahead
of cached origin/main with zero behind; no remote verification or push.

# Raw Content Safety

No secrets, blocked security context, raw operational payloads or external
consumer data. Protected Demo3 bundle, selected Goal73, runtime DB and draft
public-release record match their pre-run hashes. No live lease was acquired;
transient command locks ended. Test487 remains the incomplete durable pointer,
not standing concurrent-writer authority. Skills reused; candidates: none.
