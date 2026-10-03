---
id: chk-675
type: checkpoint
title: Reviewed persistent working storage design boundary
status: backlog
priority: 1
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-848]
blocks: []
refs: [goal-89]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
scope: [task-848]
created: 2026-10-02
updated: 2026-10-02
checkpoint_kind: review
---

# Summary

FUTURE CHECKPOINT — NOT_RUN. Expected milestone: Approved exact contracts, migration boundaries, open decisions and synthetic test plan.
This placeholder must remain backlog until its actual milestone has evidence;
authoring the planning node does not satisfy it.

Current cloud audit boundary: a concrete proposal is available in
docs/cloud-goal89-design.md and docs/cloud-goal89-validation-plan.md on
cloud/goal89-persistent-working, based on exact independently reviewed
1a3cf4f45621cd67b51aba482966927aeea17419. Nick's design review is PENDING.
This checkpoint stays backlog because the required approved contract is absent.
Implementation authority is granted; the original plan-merge prerequisite is
superseded, and the independent Goal88 prerequisite safety GO is recorded in
Task848. No new release readiness or design approval is claimed.

The parent explicitly requires this human decision gate to remain in force while
Nick is asleep. docs/cloud-goal89-morning-decision.md presents the exact pending
choice and distinguishes already supplied instructions. A checked design-only
draft PR is authorized; publishing it does not satisfy this checkpoint.

## Revised Binding Decision Pending — 2026-10-03

PENDING_REVISED_BINDING_REVIEW for canonical-v2-host-binding-v1. The prior
legacy-working store UUID is not independent host identity and is superseded.
The proposed correction requires existing canonical v2 identity for managed
storage, preserves legacy/custom data with nonmutating refusal, and requires
separate reviewed canonical migration before opting in. Copies cannot bootstrap
host identity; data-only adoption preserves source/provenance and never trusts
incoming owner approvals or replaces destination graph metadata.

Indefinite quarantine with explicit recovery/purge/no automatic deletion is
accepted policy direction from Nick's parent relay. It does not approve the
material compatibility change or complete this checkpoint. Chk675 stays backlog;
Task848 stays review. Test-only reader/equality controls are design evidence;
actual store schema, ownership/journal/adoption and installed acceptance remain
NOT_RUN. No 0.6.2 runtime source or version bump is authorized in this turn.

# Scope Covered

task-848 under goal-89 and edd-83.
Depends on task-848. Implementations remain sequential and separately authorized.

# Decisions Captured

Nick reviews unresolved names/grammar/compatibility/persistence policy, exact owned paths and accepted tests before feature work.
Do not attach invented results or copy earlier candidate passes onto changed bytes.

# Known Issues / Follow-ups

Original implementation/git-gud gates and cloud/Mac reconciliation remain.
goal-87 deferred filesystem limits and epic-257 hosted qualification remain
separate honest gaps. This checkpoint currently provides no implementation pass.

# Implementation Summary

No feature implementation or future acceptance was performed by this planning PR.

# Verification / Testing

NOT_RUN; attach actual milestone commands, input identities, results and retained gaps before completion.

Audit-only baseline checks passed: supported build and test compilation,
sequential built-only CLI parity/docs499 examples, graph zero errors and
eight-skill validation. These are not Test495 feature acceptance or Chk676/677
readiness evidence. No feature source or version metadata has changed yet.

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

## Independent review correction — 2026-10-03

Parent's4c55758/base ce53 review was NO-GO for Goal90 on three concrete regressions.
Corrected managed-child cache/pack boundaries, managed-only repeat-init ignore
rules and explicit empty-ignore adoption. See docs/cloud-goal89-review-correction.md
and .mdkg/artifacts/goal-89/review-correction/checks.json for exact current inputs,
controls,672pass0fail/1skip and retained failures/superseded candidate. Worker tests
do not clear Chk675 independent review. Goal90 remains held; Chk676 owner/local
and Chk677 full publication readiness remain pending. Goal89 is not achieved.
No new approvals, numeric IDs, selected-goal changes or broader CI work.
