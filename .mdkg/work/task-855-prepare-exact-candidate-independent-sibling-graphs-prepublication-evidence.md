---
id: task-855
type: task
title: Prepare exact-candidate independent sibling graphs prepublication evidence
status: progress
priority: 1
parent: goal-90
tags: [cloud-planning, design-only, cloud-implementation]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-90/checks.json, docs/cloud-goal90-design.md]
relates: []
blocked_by: [chk-679]
blocks: []
refs: [test-496]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-03
---

# Overview

Freeze this goal's exact final source/package/harness and tarball digest after
chk-679. Run full appropriate pre-merge/integration
checks and the existing package-profile prepublication ladder, retained coverage
floors, all 37 package smokes, installed init/upgrade/feature contracts, current
security acceptance and declared local runtime/platform matrix. Preserve all 46
repository smoke definitions and run affected site checks when relevant. Recheck
version target against main/registry; no version bump claims shipped functionality
before implementation. Review package/export inventory for scratch/private graph
leaks. Record exact commands, input identities, host/runtime, durations, pass/fail/
not-run counts and remaining gaps. Linux fast CI alone is insufficient; epic-257's
stub and goal-87/bug-46/bug-47 remain honestly unresolved. Requalify changed inputs.
Produce READY_PENDING_APPROVAL or NOT_READY at chk-680.
Stop before npm publication, tags, deploy or adoption; Nick's approval is separate.

# Implementation Notes

Owned by goal-90; follow edd-83. Depends on chk-679.
The planning PR supplied requirements, not execution authority. Nick later
expressly authorized the sequential cloud stack, and parent relayed prerequisite
GO at exact PR12 head 1e5b598. The bounded named-root design follows delegated
selector choices in docs/cloud-goal90-design.md. Independent exact-patch design
and implementation review remains pending; no approval is recorded here.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
chk-680.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Owned cloud Run cloud-goal90-20261003 is active. Source implementation and
bounded synthetic source/installed controls pass on three supported native
runtimes; static and full readiness evidence is retained separately. See docs/cloud-goal90-checkpoint.md for the final
checkpoint. Required independent/owner/full release acceptance is pending.
Original dependency edges stay intact: the explicit prerequisite exception is
recorded separately and does not invent READY or done at chk-677/chk-678.

# Files Affected

src/cli.ts command dispatch, src/core configuration/path ownership and affected src/commands and graph helpers; generated contracts/docs/tests. Exact all-command inventory precedes edits.

# Test Plan

Behavior cases are defined by test-496; prepublication evidence by chk-680. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.

# Independent PR13 Review Correction

Independent review returned NO GO at650f8258495b4904e113830529ed4ffb7b92cc09.
Parent delegated four focused fixes and supplied portable exact reproductions.
The runtime defects reproduce in rejected source and installed bytes on native
24.18.0/24.21.0; the loop contract passes base1e and fails650 on both runtimes.
The active correction preserves private export case normalization, whole-directory
Git exclusion, prior host bindings on unregister, and the loop global flag set.
Current producer qualification is recorded separately at
.mdkg/artifacts/goal-90/review-correction/checks.json and
docs/cloud-goal90-review-correction.md. Original evidence remains unchanged.
Required independent exact corrected-patch re-review, owner/local/platform and
full release acceptance remain pending; no GO, READY or achieved state is inferred.
No status, selected-goal or dependency edge is changed by this record.
