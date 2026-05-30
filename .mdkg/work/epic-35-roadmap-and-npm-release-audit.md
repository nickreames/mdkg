---
id: epic-35
type: epic
title: roadmap and npm release audit
status: done
priority: 1
tags: [roadmap, release, audit, npm, pre-v1]
owners: []
links: [npm:mdkg]
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, package.json, package-lock.json]
relates: [epic-13, epic-17, epic-18, epic-20, epic-21, epic-29, epic-30, epic-31, epic-32, epic-33, epic-34]
blocked_by: []
blocks: [task-194, task-195, task-196, task-197, task-198, task-199, task-200, task-201, task-202]
refs: [rule-3, rule-4, rule-5, rule-6]
aliases: [roadmap-audit, release-roadmap-audit, pre-v1-release-audit]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Goal

Reconcile the current `0.1.3` npm release state, triage outstanding mdkg work,
and lock the next pre-v1 release order before starting the next implementation
phase.

# Locked Direction

- Future npm releases stay in the `0.1.x` line for now.
- Release-state cleanup happens before new feature work.
- `epic-21` subgraph orchestration is the next implementation priority after
  cleanup.
- Project application DB work under `epic-29` through `epic-34` follows after
  subgraph capability orchestration is stable.
- Source behavior changes are out of scope unless the audit finds a release
  blocker.
- No real npm publish happens during the audit.

# Scope

- Audit npm, git, package, changelog, docs, command matrix, and graph state.
- Triage active, stale, duplicate, blocked, and future mdkg epics/tasks.
- Verify completed `0.1.2` and `0.1.3` feature coverage is represented in
  graph, docs, tests, and smoke scripts.
- Produce an ordered `0.1.x` roadmap with release themes, blockers, and publish
  criteria.
- Prepare `epic-21` for the next implementation pass.

# Milestones

- Baseline npm/git/package/changelog state is recorded.
- Outstanding graph backlog is classified.
- Release metadata and completed-feature coverage are reconciled.
- Publish-readiness gates are run and recorded.
- Consumer handoff prompts are ordered.
- Next release sequence and exact next work item are approved.

# Out of Scope

- No source implementation unless a release blocker is discovered.
- No consumer repo edits.
- No real npm publish.
- No project DB implementation before `epic-21` readiness is resolved.

# Risks

- Local dirty work may not match the already-published `mdkg@0.1.3` package.
- Older residual epics may distract from the current roadmap unless explicitly
  classified.
- Release docs may lag the published CLI/package behavior.

# Audit Result

The audit gate passed for the local `0.1.3` release line after reconciling the
changelog heading from unreleased to the registry publish date.

Release blockers found:

- None for local package correctness.

Residual risks:

- Current repo state is still dirty and should be committed before starting
  `epic-21`.
- The local package version is already published as `mdkg@0.1.3`; do not publish
  the same version again.
- Git tags for recent releases are not present locally beyond `v0.0.7`; release
  tag reconciliation should be handled separately from npm package correctness.

Next implementation focus:

- `epic-21`, starting with `task-172`.

# Links / Artifacts

- `task-194`
- `task-195`
- `task-196`
- `task-197`
- `task-198`
- `task-199`
- `task-200`
- `task-201`
- `task-202`
