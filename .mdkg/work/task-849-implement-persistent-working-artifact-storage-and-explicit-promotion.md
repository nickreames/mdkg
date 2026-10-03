---
id: task-849
type: task
title: Implement persistent working artifact storage and explicit promotion
status: review
priority: 1
parent: goal-89
tags: [cloud-planning, design-only, cloud-implementation-draft]
owners: [mdkg-project-agent]
links: []
artifacts: [docs/cloud-goal89-contract-delta.md, .mdkg/artifacts/goal-89/implementation/checks.json, .mdkg/artifacts/goal-89/review-correction/checks.json, docs/cloud-goal89-review-correction.md]
relates: []
blocked_by: [chk-675]
blocks: []
refs: [test-495]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-03
---

# Overview

Implement graph-local manifest-owned persistent work entries, list/inspect and
explicit promotion using the approved names/schema. Keep ordinary graph/index,
capability, pack, bundle and package outputs free of unpromoted scratch. Use
existing node/archive authoring for reviewed findings with source digest/ref;
retain originals. Preserve user files and explicit tracking/ignore policy.
Implement only local durability across commands/restarts; external artifact
provider setup/upload is separate. Synthetic restart/export/restore tests must
expose checkout deletion and host-loss limits; no automatic graph migration.

# Implementation Notes

Owned by goal-89; follow edd-83. Depends on chk-675.
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-495.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Backlog, unclaimed. Implementation and acceptance: NOT_RUN.

# Files Affected

A new selected working-storage command/helper family under src, its local manifest/ignore policy, docs/contracts and synthetic tests. Directory/CLI names are locked at the design checkpoint; existing scratch is preserved.

# Test Plan

Behavior cases are defined by test-495; prepublication evidence by chk-677. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.

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

## Independent review correction — 2026-10-03

Parent's4c55758/base ce53 review was NO-GO for Goal90 on three concrete regressions.
Corrected managed-child cache/pack boundaries, managed-only repeat-init ignore
rules and explicit empty-ignore adoption. See docs/cloud-goal89-review-correction.md
and .mdkg/artifacts/goal-89/review-correction/checks.json for exact current inputs,
controls,672pass0fail/1skip and retained failures/superseded candidate. Worker tests
do not clear Chk675 independent review. Goal90 remains held; Chk676 owner/local
and Chk677 full publication readiness remain pending. Goal89 is not achieved.
No new approvals, numeric IDs, selected-goal changes or broader CI work.
