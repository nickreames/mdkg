---
id: chk-673
type: checkpoint
title: Locally verified minimal init acceptance boundary
status: backlog
priority: 1
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [test-494]
blocks: []
refs: [goal-88]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
scope: [task-844, task-845, task-846, test-494]
created: 2026-10-02
updated: 2026-10-02
checkpoint_kind: task
---

# Summary

FUTURE CHECKPOINT — NOT_RUN. Expected milestone: Installed local feature cases and full applicable integration checks with preserved hashes.
This placeholder must remain backlog until its actual milestone has evidence;
authoring the planning node does not satisfy it.

# Scope Covered

task-844, task-845, task-846, test-494 under goal-88 and edd-83.
Depends on test-494. Implementations remain sequential and separately authorized.

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
