---
id: chk-674
type: checkpoint
title: Prepublication readiness decision for minimal init
status: blocked
priority: 1
tags: [cloud-planning, design-only, readiness:not-ready]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-847]
blocks: []
refs: [goal-88]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
scope: [task-844, task-845, task-846, test-494, task-847]
created: 2026-10-02
updated: 2026-10-02
checkpoint_kind: goal
---

# Summary

FUTURE CHECKPOINT — NOT_RUN. Expected milestone: Exact-candidate readiness decision with full package gates and retained platform/security gaps.
This placeholder must remain backlog until its actual milestone has evidence;
authoring the planning node does not satisfy it.

# Scope Covered

task-844, task-845, task-846, test-494, task-847 under goal-88 and edd-83.
Depends on task-847. Implementations remain sequential and separately authorized.

# Decisions Captured

Record exact input/source/artifact hashes, commands, host/runtime, case counts and failures/gaps. Distinguish local acceptance, integration readiness and prepublication readiness.
The final receipt must say READY_PENDING_APPROVAL or NOT_READY; no publication or professional adoption is authorized. Recheck registry/main version and all required platform/security evidence; current fast CI does not qualify Linux portable behavior.

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

# Partial Cloud Attempt — NOT_READY

A preservation-first0.6.1 implementation and bounded checks now exist. This
checkpoint stays backlog: its complete installed/platform/readiness milestone
is not satisfied. See .mdkg/artifacts/goal-88/candidate-checks.json and
CONTINUATION.md for real passed/failed/rechecked/cancelled/not-run evidence.
The first retained tarball is superseded and unqualified; no approval inferred.

# Continued Cloud Qualification

Actual installed acceptance:18synthetic cases/51CLIinvocations passed on the
retained0.6.1 artifact, including real official0.6.0 upgrades and mirror/path
controls. Package definitions:37executed,36passed/1failed. The demo failure
reproduces with identical103semantic rows on pristine planning base and candidate;
its required gate remains failed. Full coverage/ladder, site/platform matrix
and independent local owner review remain unmet. No task/checkpoint is completed
or approved from these results. Goal88 staysNOT_READY; Goal89/90 not started.
See .mdkg/artifacts/goal-88/qualification-2/checks.json and CONTINUATION.md.

# Independent Review Correction — NOT_READY

The parent reported two P2 findings againstc13/17fe: stale authored CLAUDE
routing assertions (two cases) and a positive changelog fixture pinned to0.6.0.
Cloud reproduced23pass/3fail of26, then corrected only the two test files.
Exact CLAUDE preservation, repeated-init byte inventory and positive/negative
runtime-version changelog controls now pass. Runtime/package source is unchanged.
Affected45/45 on24.19.0 and26/26 on24.18.0 passed. Complete unchanged thresholded
coverage ran185files:2403pass/0fail/1skip, exit0 in548470ms; coverage
92.59/84.27/97.58 exceeds89/77/96. Frozen input/custody checks passed.

Cloud package36/37 and site8/9 retain their inherited demo mode and public-command
assertion failures. The parent's local37/37 package and27 installed results are
separate reported evidence. Hostedc13 raw coverage remains unclassified after
archive transfer was blocked by CONNECT proxy403. Required complete ladder,
platform/portable-filesystem proof, corrected-candidate independent review and
prepublication acceptance remain pending. This note closes no goal/task/checkpoint
and infers no approval. Goal89 remains paused for parent review.

Evidence: .mdkg/artifacts/goal-88/qualification-4/COMPARISON.md and checks.json;
qualification-3/checks.json records sites/minimum runtime and hosted access gap.

# Enforced Readiness Dependency

NOT_RUN stays non-done. A completed assessment reporting NOT_READY must remain
blocked or review, with readiness:not-ready, preserving downstream blockers.
Only evidenced independent READY_PENDING_APPROVAL acceptance may become done
with readiness:ready-pending-approval; this grants no publication or adoption.
Parser/goal-next and the docs plan guard enforce this distinction.

# Current P2 Correction

The independent assessment is NOT_READY; status is now explicitly blocked with
readiness:not-ready. Both historical qualification narratives and the new
enforced dependency contract survive the normal stack merge. No approval or
complete readiness is inferred from recording this decision.
