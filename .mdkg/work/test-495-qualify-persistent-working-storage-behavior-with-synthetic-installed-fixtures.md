---
id: test-495
type: test
title: Qualify persistent working storage behavior with synthetic installed fixtures
status: review
priority: 1
parent: goal-89
tags: [cloud-planning, design-only, cloud-implementation-draft]
owners: [mdkg-project-agent]
links: []
artifacts: [docs/cloud-goal89-contract-delta.md, .mdkg/artifacts/goal-89/implementation/checks.json]
relates: []
blocked_by: [task-850]
blocks: []
refs: []
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
cases: [fresh-or-selection, preservation-and-isolation, negative-boundaries, interruption-recovery, installed-artifact, persistence-or-export]
created: 2026-10-02
updated: 2026-10-03
---

# Overview

Meaningful future automated acceptance for goal-89, bound to edd-83.
Use synthetic data only and install the exact retained candidate tarball into
isolated consumer fixtures; source imports alone are insufficient.

# Test Cases

1. Working artifacts persist across CLI/process restart and repeated operations;
   interrupted writes do not lose accepted entries or turn scratch into nodes.
   Existing ad hoc/custom directories require previewed adoption and preserve bytes.
2. Ordinary search/index/capabilities/pack/bundle/npm payload excludes scratch;
   explicit selected working search works. Reviewed promotion records source hash
   and canonical evidence, with originals retained and no silent duplication.
3. Default cleanup does nothing; scoped preview is nonmutating. Selected inactive
   entries quarantine with retained originals; active/pinned/current goal work
   remains protected, including activity changes between preview and apply.
4. Cleanup interrupted at every journal/rename boundary resumes or recovers
   deterministically; repeated cleanup/purge/recovery handles completed state.
   Stale plans, unknown journal entries, expired/foreign owner and suspended
   work refuse. Missing PID or old timestamp is not proof of safe deletion.
5. Retention expiry does not silently purge. Explicit retained recovery restores
   exact bytes; explicit scoped purge records loss of recovery. Unrelated files,
   sibling graphs and canonical nodes remain byte-identical.
6. Absolute/traversal/symlink/hardlink/native-Git and renamed-parent boundaries
   fail closed with in-boundary positive controls. Admit portable limits rather
   than claiming an unavailable race/ACL guarantee (goal-87).
7. Synthetic export/restore of explicitly tracked/archive/artifact evidence;
   delete/recreate disposable checkout to prove ignored scratch is unavailable
   without chosen persistence. Verify cloud restart/save is distinct from host
   loss and worktree removal, with honest retention/persistence documentation.

# Results / Evidence

Use existing supported tests/smokes and add behavior tests only during the later
implementation. Record case IDs, inputs/digests, exact commands, runtime/OS/arch,
native/emulated host, durations, positive/negative controls and pass/fail/not-run
counts. Full repository pre-merge checks and final package/platform/security
gates remain obligations of task-851. Current fast CI is not full
Linux portable qualification; missing proof means NOT_READY.

# Current State

NOT_RUN. This documentation PR creates test requirements, not executable
feature tests or a passing implementation receipt.

# Target / Scope

goal-89 and its two bounded feature tasks; no company or unrelated graph data.

# Preconditions / Environment

Later accepted implementation, exact installed tarball, supported Node engine and isolated synthetic fixture custody. Required platform evidence remains explicit.

# Notes / Follow-ups

Do not claim these future cases passed from documentation or fast CI results.

## Current authorized implementation boundary — 2026-10-03

This section supersedes historical planning-only and mandatory-v2 execution gates
for this cloud experiment. Nick expressly authorized the sequential implementation
stack while PR10 stays unmerged, then accepted immediate use after fresh init and
an explicit safe path for existing legacy graphs. The parent reports independent
Goal88 ce53 correction review complete for the bounded prerequisite. No release
or merge authority follows. Contract: working-host-anchor-v1 in
docs/cloud-goal89-design.md and docs/cloud-goal89-contract-delta.md.

0.6.2 source now implements independent legacy host binding outside ignored
working, strict canonical v2 reuse, explicit preview/hash-bound apply, owned local
entries, owner/pin/selected-work guards, indefinite quarantine/recover/confirmed
purge, exact journal resume and sanitized private archive promotion. Custom bytes
remain preserved. No implicit node migration, automatic cleanup or store-based
host bootstrap. A pre-journal killed anchor/lock has no admissible journal and
refuses automatic takeover; unknown custody remains preserved.

Focused draft source/installed evidence is recorded at
.mdkg/artifacts/goal-89/implementation/checks.json after actual execution. Old
design/Goal88 receipts remain historical. This is a reviewable bounded draft,
not complete pre-merge/prepublication qualification. Chk675 exact current-patch
review, Chk676 owner/local acceptance and Chk677 release readiness remain pending;
Goal89 is not achieved and release is NOT_READY. Required full ladder, platform
and local owner checks are not silently waived. Parent review precedes Goal90.
Selected-goal state is unchanged; no new numeric IDs or approvals are allocated.
