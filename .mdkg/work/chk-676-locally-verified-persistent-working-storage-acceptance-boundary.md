---
id: chk-676
type: checkpoint
title: Locally verified persistent working storage acceptance boundary
status: backlog
priority: 1
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [test-495]
blocks: []
refs: [goal-89]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
scope: [task-848, task-849, task-850, test-495]
created: 2026-10-02
updated: 2026-10-02
checkpoint_kind: task
---

# Summary

FUTURE CHECKPOINT — NOT_RUN. Expected milestone: Installed local feature cases and full applicable integration checks with preserved hashes.
This placeholder must remain backlog until its actual milestone has evidence;
authoring the planning node does not satisfy it.

# Scope Covered

task-848, task-849, task-850, test-495 under goal-89 and edd-83.
Depends on test-495. Implementations remain sequential and separately authorized.

# Decisions Captured

Record exact input/source/artifact hashes, commands, host/runtime, case counts and failures/gaps. Distinguish local acceptance, integration readiness and prepublication readiness.
Do not attach invented results or copy earlier candidate passes onto changed bytes.

# Known Issues / Follow-ups

Original implementation/git-gud gates and cloud/Mac reconciliation remain.
goal-87 deferred filesystem limits and epic-257 hosted qualification remain
separate honest gaps. This checkpoint currently provides no implementation pass.

# Implementation Summary

No feature implementation or future acceptance was performed by this planning PR.

# Verification / Testing

NOT_RUN; attach actual milestone commands, input identities, results and retained gaps before completion.

# Links / Artifacts

edd-83; docs/cloud-planning-experiment.md. Future artifact references must be added after they exist.

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
