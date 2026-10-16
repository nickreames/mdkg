---
id: task-845
type: task
title: Implement AGENTS-only fresh init and reviewed legacy migration
status: backlog
priority: 1
parent: goal-88
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-672]
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

Implement only AGENTS-only fresh default/--agent bootstrap and reviewed legacy
root-instruction relocation/removal after the design checkpoint. Keep --graph-only
and ignored/generated output policies compatible. Extend existing provenance
manifest, preview/apply/journal/recovery; preserve custom AGENTS/CLAUDE/AGENT_START
bytes and resolve stale plans/link-complete subsets. Do not delete maintained
root source docs by adopting consumer policy. Positive/negative fixtures must
cover fresh/repeat/upgrade/force conflicts, backups and interrupted recovery.
No assertion about Anthropic support policy; no publication or broad adoption.

# Implementation Notes

Owned by goal-88; follow edd-83. Depends on chk-672.
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
