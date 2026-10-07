---
id: task-846
type: task
title: Preserve both native skill mirrors and validate additional destinations
status: progress
priority: 1
parent: goal-88
tags: [cloud-planning, cloud-implementation]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-845]
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

Reuse customization.skill_mirrors.targets and existing sync and internal audit/pruning. Keep
canonical .mdkg/skills and BOTH .agents/skills and .claude/skills; configured
additional harness destinations require no root wrappers. Define reviewed
additive defaults while preserving custom existing target lists. Prove bytes
match across all targets including resources; unmanaged files survive. Refuse
unsafe paths, symlinks, Git metadata, overlaps/case aliases and unreviewed slug
conflicts. Reuse test-303/test-474 and bug-59 regressions; do not rebuild an already
delivered configurable-mirror capability or change unrelated runtime surfaces.

# Implementation Notes

Owned by goal-88; follow edd-83. Depends on task-845.
Nick expressly authorized the sequential cloud implementation before PR10 merge.
The follow-up asks continued Goal88 work. Only the preservation-first slice is
implemented: no new legacy retirement, compatibility expiry or approval is inferred.
The named design checkpoint remains for review of any removal policy.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-494.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Progress. Both native defaults and configured extras use the existing projection.
The full target policy now refuses canonical/nested/case-alias/duplicate overlaps
before effects; sync and authoring preflight late unmanaged collisions. Existing
custom policy is preserved with visible missing-default guidance. Qualification
and independent review remain pending.

# Files Affected

src/commands/init.ts, upgrade.ts, skill_mirror.ts; src/core/config.ts; assets/init; related docs/generated contracts and tests. Exact ownership inventory is required before edits.

# Test Plan

Behavior cases are defined by test-494; prepublication evidence by chk-674. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
