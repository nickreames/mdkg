---
id: task-851
type: task
title: Prepare exact-candidate persistent working storage prepublication evidence
status: backlog
priority: 1
parent: goal-89
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-676]
blocks: []
refs: [test-495]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Freeze this goal's exact final source/package/harness and tarball digest after
chk-676. Run full appropriate pre-merge/integration
checks and the existing package-profile prepublication ladder, retained coverage
floors, all 37 package smokes, installed init/upgrade/feature contracts, current
security acceptance and declared local runtime/platform matrix. Preserve all 46
repository smoke definitions and run affected site checks when relevant. Recheck
version target against main/registry; no version bump claims shipped functionality
before implementation. Review package/export inventory for scratch/private graph
leaks. Record exact commands, input identities, host/runtime, durations, pass/fail/
not-run counts and remaining gaps. Linux fast CI alone is insufficient; epic-257's
stub and goal-87/bug-46/bug-47 remain honestly unresolved. Requalify changed inputs.
Produce READY_PENDING_APPROVAL or NOT_READY at chk-677.
Stop before npm publication, tags, deploy or adoption; Nick's approval is separate.

# Implementation Notes

Owned by goal-89; follow edd-83. Depends on chk-676.
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
chk-677.
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
