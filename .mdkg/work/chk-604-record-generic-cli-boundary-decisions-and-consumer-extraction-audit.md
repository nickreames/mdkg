---
id: chk-604
type: checkpoint
title: Record generic CLI boundary decisions and consumer extraction audit
checkpoint_kind: audit
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [task-827]
blocked_by: []
blocks: []
refs: [dec-95, edd-82, goal-83, goal-84, goal-85, task-826, test-478, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-833, bug-36, bug-37, test-484]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

Nick's no-compatibility decisions are recorded in dec95. Edd82 is a source-
grounded generic/consumer classification, not an executed removal or consumer
handoff. Bugs36/37 and test484 block final publication qualification through
task828; task833 must capture extraction context before removals. Implementation
stays backlog/unclaimed; the existing task827 claim was reaffirmed for this
bounded planning pass only. No selected-goal or runtime lease mutation.

# Scope Covered

Goal83/84 planning and review only, sole writer mdkg-project-agent. One bounded
independent read-only source scout, no additional writers or consumer access.

## Changed Surfaces

- New: dec95, edd82, bugs36/37, task833, test484 and this checkpoint.
- Updated: goals83/84, tasks826/827/828, test478 and required index projections.
- All remain unstaged/uncommitted. Pre-existing18dirty paths were inventoried;
  overlapping planning nodes receive additive edits, all partial Bug17 source
  and existing unrelated/protected work is preserved.

## Boundaries

- In scope: current Git/mdkg/source inspection, planning nodes, required indexes,
  supported current-task claim and graph/diff validation.
- Out of scope: source/docs/skills edits, implementation/test/scan launch,
  canonical migration, worktree or branch creation, stage/commit/push/remotes,
  bundle/subgraph refresh, provider/deployment/publication, root/sibling writes.
- No raw operational payloads, secrets, scan reports or executable export copied.

# Decisions Captured

Dec95 supplements dec94. No Git mutation-wrapper deprecation bridge and no
Omni-specific compatibility tooling. Native Git owns individual-project
worktrees; reviewed merges preserve ancestry. Generic optional local DB/semantic
receipts are not removed merely because a consumer uses them. Edd82 recommendations
are distinguished from accepted decisions and implemented/verified behavior.

# Implementation Summary

No CLI implementation changed. The new export-first dependency chain is
task833 -> bugs36/37 -> test484/task827 -> task828 -> existing publish gate task831.
Goal85 remains paused/blocked. No goals were put into unsupported scope_refs.
Large-transaction optimization is documented as a later bounded goal proposal;
no new goal/loop/skill allocated. Existing Goals77/78 evidence is reused.

# Audit Findings

- Reviewed: validate, skills_indexer/skill/pack/query_output, agent_file_types,
  work, Git/materialization, local project DB/queue/materializer and published
  seed/help source. Edd82 names concrete symbols and semantics.
- Remove/export profile predicates and privileged product metadata. Genericize
  enum-only room topology; recommend remove mandatory pricing/defaults. Retain
  generic manifests, refs and structural receipt checks. Review adjacent Git
  orchestration wrappers for export, preserving internal observational helpers.
- Residual: no exhaustive package projection proof, runtime execution, consumer
  adoption, actual worktree qualification or final security clearance yet.

# Verification / Testing

## Command Evidence

- Before: main cd0eb6fcc3f5945cfa3c29fe0cb356d9805e518c; eighteen dirty paths,
  no staged changes or mutation lock. Five DB writer leases released; queue0.
  Selected achieved Goal73 unchanged. Scoped goal-next returns owned task827;
  pack preview and skill discovery are read-only. No DB init or invented lease.
- Index refresh completed. Full graph:zero errors,three inherited stale-subgraph
  warnings. Changed graph:zero errors/warnings. SQLite verify:all five cache checks
  pass,zero failures. git diff --check passes. Exact baseline comparison shows
  only the five already-dirty planning nodes changed; Bug17/35/7, dec94/chk603,
  partial source/test/artifact bytes, selection, runtime DB, config and Demo3
  bundle remain byte-identical. Task828 and seven new nodes are owned additions;
  SQLite and ignored index projections are derived outputs.

## Pass / Fail Status

- Planning/audit PASS; source removal/export execution NOT_STARTED. Final rerun
  after checkpoint completion must preserve these results. This is not release
  qualification, a runtime test, security clearance or consumer acceptance.

## Known Warnings

- Three existing stale subgraph warnings and old worktree metadata preserved.
  Scope-routing notices for existing checkpoint references are not new authority.

# Known Issues / Follow-ups

- Next: task833 source-bound local extraction context, then reviewed removal
  inventories for bugs36/37 and installed test484/worktree qualification.
- Consumer implementation and delivery require separately scoped receiving-repo
  authority. No deprecation decision remains open; exact generic successor/API
  inventories must remain evidence-backed and bounded.

## Follow-up Refs

- task833; bugs36/37; test484; task826/test478; task827/828; goals83/84/85.

# Links / Artifacts

- Edd82 carries the detailed audit and export specification. No final export
  pack or new commit exists. Earlier performance artifacts are explicitly dated
  intermediate-candidate evidence, not newly rerun benchmarks.

# Raw Content Safety

Source findings and distilled planning only. Skills used: select-work-and-ground-
context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-
check and verify-close-and-checkpoint. Existing skill searches support reuse;
skill candidates:none. Consumer logic is not a new public mdkg skill candidate.
