---
id: goal-85
type: goal
title: Publish and verify mdkg 0.6.0
status: blocked
priority: 1
goal_state: paused
goal_condition: Under fresh explicit publication authority publish the exact qualified 0.6.0 artifact after independent blocker and identity rechecks and verify its registry and installed behavior.
scope_refs: [task-831, task-832]
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, git diff --check]
max_iterations: 75
blocked_after_attempts: 3
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-74, goal-77, goal-78, goal-81, goal-82, goal-75, goal-83, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Objective

Under fresh explicit publication authority publish the exact qualified 0.6.0 artifact after independent blocker and identity rechecks and verify its registry and installed behavior.

# End Condition

task-831 and task-832 have fresh approval, exact artifact and independently observed registry/install evidence. Current pass cannot achieve this goal.

# Non-Goals

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Recursive Algorithm

Dependency gates live on task-831 (`blocked_by: [chk-570, task-828]`),
not on this goal's compatibility edges. Goal references remain context-only:
generic goal scope expansion must not import the audit/blocker work or Goal 75.
The publication task cannot become eligible until both gates are done, and
eligibility still grants no publication authority.

1. Wait for a new explicit publication approval; this planning record and goal completion are not approval.
2. Independently recheck chk-570, task-828, goal-84 and exact sealed candidate under task-831.
3. Publish and verify only the approved exact tarball under task-832 and release-mdkg-package.
4. Keep Git push/tag, deployment/provider and consumer-upgrade authority distinct.

# Required Skills

Reuse select-work-and-ground-context, pursue-mdkg-goal and verify-close-and-checkpoint. Codex Security Standard and later diff workflows are plugin-owned capabilities, not new public mdkg skills. Future publication uses release-mdkg-package only after fresh approval.

# Required Checks

Full tests and manifest-backed ladder; coverage floors 89/77/96 unchanged; CLI/docs/skill/package parity; all six installed fixture families; source and artifact provenance; graph full/changed-only, SQLite and diff checks. Node 24.15.0, available supported 24 and Node 26 exact versions. Missing proof is a blocker, not a waiver.

# Acceptance Criteria

- Preserve compact default init, graph-only/--agent compatibility, explicit v2 adoption, stable identities with numeric aliases and reviewed reconciliation.
- Use actual 0.5.2 upgrade, offline branch cross-links, semantic conflicts, replay/revert, recovery, ownership, legacy/old-client, clone/fork, archive/work, packs/MCP, large graph and complete lifecycle routing fixtures.
- Review source and package delta separately from demo/history-only evidence.
- Keep source reviewers read-only and freeze each exact reviewed snapshot.
- Keep private canonical graph rehearsal private and report unsupported historical evidence without inventing identity.
- Bind each blocker to regression and independent verification; do not silently waive missing coverage.
- Seal one immutable artifact; any package-input change invalidates qualification.

# Definition Of Done

The end condition is supported by exact artifacts and checks, not just report-only goal evaluation. No current execution authority exists.

# Stop Conditions

Unknown dirty ownership, writer collision, baseline movement, global configuration changes, materially new decisions or excluded actions. Publication remains a distinct gate.

# Current State

Planning complete at creation; paused, blocked and unclaimed awaiting future publication approval. Canonical main is 9d7e0d3fdbcfbc3908b7d3983b4957f15d17cb2b, two ahead of cached origin/main; no remote verification. Only pre-existing dirty SQLite projection was accepted before these isolated planning nodes. Selection is achieved Goal 73. Runtime leases released, queues empty; obsolete worktree metadata remains untouched.

# Iteration Log

- 2026-09-07: User-approved full qualification plan recorded. Frozen Standard source audit is sealed in chk-571; its findings are not remediated yet.

# Skill Improvement Candidates

None. Findings belong in source/regression contracts, not procedural skill creation.

# Completion Evidence

Pending full end-condition evidence.
