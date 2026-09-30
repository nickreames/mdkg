---
id: chk-640
type: checkpoint
title: Preserve qualification outputs and verify local context custody
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-output-custody-progress.json]
relates: [goal-86, task-838, dec-97]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Task838's output-custody increment replaces destructive configured cleanup with
fresh evidence output and preserves existing build/receipt contents. Three
synthetic destructive baseline cases failed before correction. The final61
affected checks pass on each of three required local Node runtimes. Task838 and
Goal86 remain active and incomplete; no release readiness or local commit claimed.

# Scope Covered

Explicit Goal86 continuation, owned Task838, Node.js/TypeScript and local-only
under Dec97. Prior turn was a read-only status restatement; this turn makes
source/test/evidence progress. No new implementation task or goal allocated.

## Changed Surfaces

- scripts/qualification-output.js (new)
- scripts/coverage-contract.js
- scripts/release-ladder.js (extends the prior artifact-custody unit)
- tests/qualification-output.test.mjs (new22 cases)
- tests/ci-topology.test.ts (physical temporary base and exact owned cleanup)
- Task838, Goal86, this checkpoint, frontmatter evidence JSON and required
  index/event projections. Recompiled ignored dist/tests; no runtime source edit.

## Boundaries

- In scope: generic qualification infrastructure, fresh owned synthetic fixtures,
  focused subsystem checks, one read-only reviewer and sanitized mdkg evidence.
- Out of scope: blocked-context access/recovery/reruns, native implementation,
  Rust/Bun, Linux/hosted runs, remotes, publication, providers/deployment, canonical
  migration, bundle/subgraph refresh, history changes and root/sibling writes.
- Raw security reports, prompts, credentials and operational payloads excluded.

# Decisions Captured

Dec97 remains controlling. No change to Bug60's pending temporary-copy design
or its failing regression; no security/platform waiver. Full test/coverage and
installed-artifact acceptance remain required at the declared later boundaries.

# Implementation Summary

Configured paths no longer grant recursive deletion. Standalone coverage uses
fresh retained run directories; the explicit ladder path remains exact and must
be fresh/empty. Full context validates source inputs before creating output,
copies artifacts independently and refuses different existing dist. Matching
dist is reused without replacing file inodes. Context JSON and package leaves
are admitted before reading; FIFO/symlink/hardlink inputs refuse.

# Implementation Details

- MDKG_RELEASE_RECEIPT_DIR names a collection. A fresh run child is returned as
  receipt_dir; existing receipts/progress and workflow-start.json are preserved.
- Source-owned CI recursively uploads that collection and precreates an empty
  context directory. Local tests and review cover these contracts, not hosted CI.
- Overrides require physical paths; arbitrary symlink ancestors are refused.
  Internally selected temporary bases are canonicalized before creation.
- Qualification JSON has a1MiB metadata bound; failed/partial output is retained.
  These admission checks are not an OS sandbox or a Bug47 ancestor-race remedy.
- Helpers/tests remain outside the npm runtime allowlist; no candidate was packed.

# Verification / Testing

## Command Evidence

- npm run build:test passed once to update the changed TypeScript fixture.
- node --test --test-reporter=tap with qualification-output/artifact MJS and
  compiled ci-topology/coverage-contract/release-ladder tests:61/61 pass on each
  of Node24.15.0,24.18.0 and26.0.0/macOS arm64, zero fail/skip/cancel.
  Durations1.526s,2.438s,2.408s. Exact source/log hashes and commands are in JSON.
-22 new cases plus39 existing controls; actual synthetic Node coverage executes
  twice with retained default runs and once with the exact ladder output layout.
  This is not package coverage, installed-candidate proof or the full release ladder.
- Disposable mkfifo fixtures only: no system-tool filesystem bridge in mdkg.
- One independent source reviewer found pre-read, manifest and receipt gaps;
  corrections received a follow-up with no unresolved concrete issue in this unit.
- JavaScript syntax, git diff --check, full169-file discovery and deterministic
  CI workflow projection check pass. No thresholds or workflow bytes changed.
- Required index refresh, full graph validation and changed-only validation pass
  with zero errors. Full graph retains three known stale-import warnings;
  changed-only has zero warnings. SQLite index verify reports all five caches
  fresh and zero failures. git diff --check passes. Source/log hashes match JSON.
- Protected selected-goal, runtime DB and Demo3 hashes match the JSON bookends.
  No mutation/Git index lock remains; runtime lease stats show zero active and
  five released leases. These are observation results, not a standing lease.

## Pass / Fail Status

PARTIAL / NOT_READY. This checkpoint closes a bounded progress unit, not Task838,
Goal86, pre-merge acceptance or publication. Bug60's failing test stays discoverable.

## Known Warnings

Three existing stale-subgraph warnings and goal-next non-actionable checkpoint
routing warnings are not repaired or hidden. Protected bundles are not refreshed.

# Known Issues / Follow-ups

- Task838 still needs Git environment/root admission across mutating fixtures,
  isolated demo scratch cleanup, durable final evidence custody, actual installed
  controls and independent final acceptance. Validation-run Git environment
  filtering is not the missing shared-helper implementation.
- Bug60 design decision and Bugs46/47 remain open; Test487 Linux, final Task828
  review, Task829 ladder and Task830 seal remain outstanding. Goal85 stays paused.

## Follow-up Refs

Task838 remains the next local work item; Goal86 stays active. Chk639 and both
Task838 evidence files retain earlier and current intermediate source identities.

# Links / Artifacts

- Dry-run concise Task838 pack selected Task838/Chk639 without writes.
- HEAD c10113489381badf2845fc378c49b317376f953e, main, nothing staged. No commit,
  push or remote verification. Cached divergence last verified67 ahead/0 behind.
- Prior Bug60 source/test, Task840 skills/projections, Dec97/epic planning and
  protected runtime/selected-goal/Demo3 state remain separate preserved custody.
- Current logs: /private/tmp/mdkg-task838-output-checks-p5EWWd. Synthetic test
  trees were removed by their registered cleanup; log retention is local temporary
  custody, not a permanent artifact seal. Sanitized JSON is retained in the graph.
- Skills: pursue-mdkg-goal, build-pack-and-execute-task,
  source-grounded-diagnose-and-fix, verify-close-and-checkpoint. Candidates:none.
- One writer mdkg-project-agent; no persistent runtime lease acquired. Task838
  ownership is retained for continuation, not a standing exclusive checkout lease.

# Raw Content Safety

Current-source summaries, synthetic outcomes and hashes only. No blocked security
context was opened, reconstructed or recovered; no external state was consulted.
