---
id: task-844
type: task
title: Lock minimal init contracts and migration decisions
status: backlog
priority: 1
parent: goal-88
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
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

Inventory every fresh/repeated/force/graph-only/legacy upgrade artifact and its
ownership, hashes and links. Reuse goal-81/edd-80 and goal-41/edd-56. Lock AGENTS-only
root generation, canonical startup layout, legacy compatibility window and
managed-section conflict/backup rules. Audit maintained repo source separately
from consumer output. Produce reviewed exact path classification and design
checkpoint; no filename-only deletion. Test plan includes edited/unknown
manifests, malformed markers and authored instructions. Nick resolves compatibility
duration and preservation behavior before the subsequent feature tasks.

# Implementation Notes

Owned by goal-88; follow edd-83. Depends on Nick reviewing and merging this planning PR.
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-494.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Backlog, unclaimed. Implementation and acceptance: NOT_RUN.

# Files Affected

src/commands/init.ts, upgrade.ts, skill_mirror.ts; src/core/config.ts; assets/init; related docs/generated contracts and tests. Exact ownership inventory is required before edits.

# Test Plan

Behavior cases are defined by test-494; prepublication evidence by chk-674. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
