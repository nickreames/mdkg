---
id: task-855
type: task
title: Prepare exact-candidate independent sibling graphs prepublication evidence
status: backlog
priority: 1
parent: goal-90
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-679]
blocks: []
refs: [test-496]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
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
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
chk-680.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Backlog, unclaimed. Implementation and acceptance: NOT_RUN.

# Files Affected

src/cli.ts command dispatch, src/core configuration/path ownership and affected src/commands and graph helpers; generated contracts/docs/tests. Exact all-command inventory precedes edits.

# Test Plan

Behavior cases are defined by test-496; prepublication evidence by chk-680. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
