---
id: epic-83
type: epic
title: future mdkg graph update and compatibility train
status: todo
priority: 1
tags: [graph-upgrade, compatibility, future, alignment-002]
owners: []
links: []
artifacts: []
relates: [task-363, test-151, goal-82, goal-81, edd-81, dec-93]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-09-05
---

# Goal

Hold the generic graph identity, migration and compatibility train. The existing
container is reused for goal-82 instead of creating a duplicate roadmap.
The historic 0.3.5-plus framing is context, not the current release target.

# Scope

- task-363 planning package, edd-81 identity/reconciliation contract and dec-93.
- task-819 -> task-820 -> task-821 -> task-822 implementation sequence.
- test-151 observational safety, test-475 compatibility and test-476 integration.
- Bootstrap goal-81 is a related independent lane, not a migration prerequisite.

# Milestones

1. Approved mdkg-only planning package (chk-563).
2. Separately authorized ancestor-aware conflict classification increment.
3. Complete format/identity, ordinary command parity and reviewed reconciliation.
4. Fixture verification before any separately authorized canonical adoption.

# Out of Scope

Full federation, remote skills, Runtime scheduling, private orchestration,
canonical repo/child migrations, source implementation during planning, release,
Git integration/commit/push, providers and deployment.

# Risks

Aliases without identity can conflate independent creation and same-node edits.
Re-indexing alone cannot restore provenance. Compatibility and exact evidence
must precede migration; roadmap status is never execution authority.

# Links / Artifacts

- goal-82, goal-81, task-363, test-151, edd-81, dec-93, chk-563.
- Goal 17 stays achieved as historical repair evidence.
