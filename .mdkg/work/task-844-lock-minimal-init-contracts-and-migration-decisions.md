---
id: task-844
type: task
title: Lock minimal init contracts and migration decisions
status: review
priority: 1
parent: goal-88
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-88/design-proposal.md, .mdkg/artifacts/goal-88/baseline-init.json, .mdkg/artifacts/goal-88/checks.json, docs/cloud-goal88-experiment.md]
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

Owned by goal-88; follow edd-83's bounded technical scope. Nick's current
instruction expressly authorizes the sequential cloud implementation stack
before PR10 merge, superseding the original merge/git-gud execution gate for
this cloud experiment. The compatibility/preservation choice remains a named
design decision at chk672 before behavior changes; no approval is inferred.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-494.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Claimed root:task-844 by mdkg-project-agent; review. Source-built baseline audit
and concrete path/migration proposal are present at chk672. Awaiting the named
compatibility/preservation decision; not marked done. No feature implementation
or installed0.6.1 acceptance. See attached artifacts for actual results/gaps.

# Files Affected

src/commands/init.ts, upgrade.ts, skill_mirror.ts; src/core/config.ts; assets/init; related docs/generated contracts and tests. Exact ownership inventory is required before edits.

# Test Plan

Behavior cases are defined by test-494; prepublication evidence by chk-674. All are NOT_RUN.

# Links / Artifacts

edd-83 is historical planning context. The current source-grounded proposal and
baseline evidence are attached in artifacts and summarized by chk672.
