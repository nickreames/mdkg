---
id: task-847
type: task
title: Prepare exact-candidate minimal init prepublication evidence
status: progress
priority: 1
parent: goal-88
tags: [cloud-planning, cloud-implementation]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-88/qualification-2/checks.json, .mdkg/artifacts/goal-88/CONTINUATION.md, .mdkg/artifacts/goal-88/qualification-4/checks.json, .mdkg/artifacts/goal-88/qualification-4/COMPARISON.md, .mdkg/artifacts/goal-88/qualification-3/checks.json]
relates: []
blocked_by: [chk-673]
blocks: []
refs: [test-494]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Freeze this goal's exact final source/package/harness and tarball digest after
chk-673. Run full appropriate pre-merge/integration
checks and the existing package-profile prepublication ladder, retained coverage
floors, all 37 package smokes, installed init/upgrade/feature contracts, current
security acceptance and declared local runtime/platform matrix. Preserve all 46
repository smoke definitions and run affected site checks when relevant. Recheck
version target against main/registry; no version bump claims shipped functionality
before implementation. Review package/export inventory for scratch/private graph
leaks. Record exact commands, input identities, host/runtime, durations, pass/fail/
not-run counts and remaining gaps. Linux fast CI alone is insufficient; epic-257's
stub and goal-87/bug-46/bug-47 remain honestly unresolved. Requalify changed inputs.
Produce READY_PENDING_APPROVAL or NOT_READY at chk-674.
Stop before npm publication, tags, deploy or adoption; Nick's approval is separate.

# Implementation Notes

Owned by goal-88; follow edd-83. Depends on chk-673.
Nick expressly authorized the sequential cloud implementation before PR10 merge.
The follow-up asks continued Goal88 work. Only the preservation-first slice is
implemented: no new legacy retirement, compatibility expiry or approval is inferred.
The named design checkpoint remains for review of any removal policy.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
chk-674.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Progress, preparation only. Source/lock/release metadata target unpublished0.6.1.
A frozen candidate will receive bounded full/package checks with exact retained
artifact custody. Chk673 is not approved or complete. This does not claim
prepublication readiness, local platform acceptance or publication authority.

# Files Affected

src/commands/init.ts, upgrade.ts, skill_mirror.ts; src/core/config.ts; assets/init; related docs/generated contracts and tests. Exact ownership inventory is required before edits.

# Test Plan

Behavior cases are defined by test-494; prepublication evidence by chk-674. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.

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
