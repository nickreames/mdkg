---
id: bug-35
type: bug
title: Keep observational Git subprocesses from refreshing root and child indexes
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-35-readonly-git-index-reproduction.json, .mdkg/artifacts/goal-84/bug-35-affected-versions.json, .mdkg/artifacts/goal-86/observational-boundary-verification.json]
relates: [bug-7, bug-21, test-480]
blocked_by: [task-834, bug-40]
blocks: []
refs: [dec-94, bug-40, bug-42]
context_refs: [goal-86, dec-96, goal-83, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-11
updated: 2026-09-15
---

# Current Successor Contract - 2026-09-13

After task834 accepts current custody, finish observational Git helper suppression
with caller overrides included. Preserve overlapping Bug17 edits; root/child and
linked-worktree index bytes plus staged entries must remain unchanged. Caller-only
GIT_OPTIONAL_LOCKS controls are diagnostic workarounds, never fix acceptance.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Installed read-only commands can refresh root or registered child Git index
stat metadata. Seven command cases reproduce this on copied legacy graph
fixtures; the same seven preserve both indexes with GIT_OPTIONAL_LOCKS=0.
Staged object/mode/path entries remain identical: no staged content loss is
observed. This violates observational byte-custody and single-writer boundaries,
particularly when a parent only has read authority over its child graph.

Functional publication blocker, not a new Standard security scan finding.
Original scan accounting stays twelve of thirteen locally fixed. Bug21's
cache-persistence fix remains achieved; this is a distinct Git subprocess sink.

# Local Implementation Verification - 2026-09-15

The scoped Git-index remedy is complete locally. Four previously unguarded
subprocess helpers now force GIT_OPTIONAL_LOCKS=0. Existing hardened git inspect
already passed the current-source baseline and remains unchanged. The accepted
Bug17 transport patch in bundle/subgraph was preserved. Historical sections below
retain earlier observations; their unimplemented/custody-pending statements no
longer describe the current run.

Current-source baseline:14 of16 cases refreshed root/child indexes. Afterward,
1,409 tests pass and one immutable intermediate tarball passes288 cases on each
of Node24.15.0,24.18.0 and26.0.0: standalone, linked worktrees, actual submodule and
separate gitdir; unset/1 caller policies; clean and staged/unstaged work. Native
Git positive controls prove the indexes could refresh; mdkg mutation controls
remain intentional and do not stage graph files. Bug40's preview lock/parent
writes were separately corrected and verified before closing this lane.

The actual read-only APFS matrix preserves all36 fixture inventories and sync
previews, but its broader show/search assertions fail12cases due to copied legacy
cache metadata. Bug42 is a separate required release blocker, not a waived test
or a failure of Git-index custody. Bug41's configured-helper execution boundary
also remains open. Neither this bug's closure nor the intermediate tarball grants
final installed/platform/security acceptance or publication authority.

Evidence: .mdkg/artifacts/goal-86/observational-boundary-verification.json.
Main HEAD remains38205296208c23fcfcc6fc821a295040be05c0bb; all source work is
unstaged/uncommitted. Protected selection, runtime DB, Demo3 bundle and Git index
match before/after hashes. Final task828/829/830 and Linux qualification remain.

# Reproduction Steps

1. Use the current installed intermediate candidate and existing smoke-mcp
   synthetic root/registered-child graph. Give both repositories staged files.
2. Copy the fixture so recorded index stat metadata differs from actual files.
   Capture root/child index hashes and git ls-files --stage before each command.
3. In separate copies, run status; show root:task-1; validate; validate
   --changed-only; subgraph list; subgraph audit; git inspect, each with --json.
4. Repeat with optional locks explicitly disabled only in the control process.
   Do not set a global environment workaround or silently weaken the test.

# Expected vs Actual

- Expected: observational commands preserve both Git indexes regardless of stat
  cache freshness and regardless of the caller's optional-lock environment.
- Actual: all seven default-environment cases change at least one index while
  exiting zero. The seven disabled-lock controls preserve both. Staged entries
  are unchanged in all14cases; this is metadata mutation, not proven data loss.

# Suspected Cause

Git status may refresh its index unless optional locks are disabled. Missing
guards occur in src/graph/subgraphs.ts gitOutput (source-path freshness),
src/commands/validate.ts collectChangedPaths, src/commands/git.ts git, and
src/commands/subgraph.ts gitRun (source audit). src/commands/bundle.ts
sourceInfo has the same unguarded read pattern; this last path is a source-audit
candidate requiring its own focused reproduction, not one of the seven cases.
The root status helper already disables optional locks, but nested subgraph
inspection uses a separate helper and still changes the child index.

# Fix Plan

Goal: make read-only Git evidence collection observational without disabling
intentional Git mutations or changing commit/merge/push authority.

Allowed future scope under Goal84: the five helpers above, directly needed
generic helper code and focused regression/installed-fixture evidence. Set
per-child-process Git read policy, not user/global configuration. Keep identity
and transport behavior unchanged; do not add remote operations or blanket
environment overrides to the qualification harness to hide this defect.

Custody decision accepted in dec-94: Nick permits narrowly scoped Git-read
helper edits in src/commands/subgraph.ts and src/commands/bundle.ts while
preserving the existing partial Bug17 patch. Its baseline hashes remain bound
in the reproduction artifact; future fixes need before/after path review.
No source remedy has been applied yet. Bug17 has its own accepted policy and
separate verification requirements; this approval does not waive either.

Next execution: re-inventory, claim this bug, implement all proven
read-only sinks as a coherent unit, verify explicit mutation commands remain
intentional, rebuild/reinstall a new candidate, then rerun affected installed
proof and the full actual-read-only-mount matrix. Changed package bytes invalidate
the previous intermediate candidate for final qualification.

No canonical migration, bundle refresh, remote Git, publish/tag/deploy/provider,
consumer/root/sibling change or history rewrite. Exact-path local commits remain
subject to validation and the approved Goal83/84 contract.

# Test Plan

- Failing-before/passing-after regression on copied stale-stat Git indexes.
- Parent and registered-child source paths; clean and genuinely dirty work;
  unchanged staged entries as well as exact index bytes and unknown files.
- Commands above plus sourceInfo/audit/dry-run consumers; check any new shared
  helper does not suppress explicitly authorized Git state mutations.
- Parent caller GIT_OPTIONAL_LOCKS=1 cannot re-enable optional read writes.
- Installed current package on Node24.15.0,24.18.0 and26.0.0; then legacy/v2,
  JSON/SQLite, stale/fresh/absent caches on a real read-only synthetic mount.
- Full tests, CLI/docs, full/changed graph validation, SQLite and diff review;
  final task828 independent review still required.

Affected version: reproduced on source dfafe500 and intermediate tarball
39575a351ed5eb7b7074721102863aa3000a842630f7ed2597e30d490a1f349b.
Published0.5.2 is not newly reproduced here; assess it explicitly during remedy.

## Completed Affected-Version Assessment

The subsequent 96-case matrix in bug-35-affected-versions.json supersedes the
initial affected-version uncertainty and bundle sourceInfo static-only limit.
Actual published0.5.2 and the current candidate each reproduce all eight paths
on Node24.15.0,24.18.0 and26.0.0. All48 unset-policy runs refresh Git indexes;
all48 disabled-policy controls preserve them. All96 retain staged entries.
The eighth path is bundle creation in disposable synthetic fixtures only:
the requested ZIP output is expected; root Git index mutation is not.

Published show also rewrites subgraphs.json independently of optional Git locks;
the candidate preserves it, consistent with the separate achieved Bug21 fix.
Both installed trees match every file in their retained tarballs (191published,
223candidate files). Package and seed hashes stay unchanged; all96 fixture
copies and two extracted package copies were removed after output verification.
No current source fix, canonical bundle creation or actual mount acceptance is
claimed. The protected-source custody decision remains unanswered.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-35-readonly-git-index-reproduction.json
- chk601; bug7; test480; task826; test483; task828; goals83/84/85.
- Skills: source-grounded-diagnose-and-fix and existing goal/checkpoint skills.
  New skill candidates:none. This belongs in implementation/tests, not a skill.
