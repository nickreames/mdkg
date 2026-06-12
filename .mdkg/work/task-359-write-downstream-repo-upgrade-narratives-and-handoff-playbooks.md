---
id: task-359
type: task
title: write downstream repo upgrade narratives and handoff playbooks
status: todo
priority: 2
epic: epic-82
parent: goal-15
tags: [mdkg-dev, downstream-upgrades, handoff, no-cross-repo-mutation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Write downstream repo upgrade narratives and handoff playbooks so adopters can
plan mdkg upgrades safely. The default posture is dry-run-first and no
cross-repo mutation unless explicitly requested.

# Acceptance Criteria

- Document the upgrade flow: inspect current graph, run `mdkg upgrade --dry-run
  --json`, review receipts, apply only in the target repo, then validate.
- Provide handoff prompts for child repos that preserve repo boundaries and
  avoid root-driven mutation.
- Include guidance for stale indexes, generated caches, selected goals, and
  subgraph snapshots.
- Identify when downstream migration automation remains deferred.

# Files Affected

- future mdkg.dev upgrade guides
- handoff prompt examples
- downstream planning nodes

# Implementation Notes

- Keep narratives separate from automation until the automation goal resumes.
- Make every mutation step local to the repo being upgraded.
- Capture child-repo caveats as explicit assumptions in handoff prompts.

# Test Plan

- Review playbooks against temp repo upgrade behavior.
- Run downstream narrative contract checks.
- Validate graph state after creating handoff artifacts.

# Links / Artifacts

- Validated by `test-150`.
