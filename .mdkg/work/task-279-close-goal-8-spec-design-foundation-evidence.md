---
id: task-279
type: task
title: close goal 8 SPEC design foundation evidence
status: done
priority: 1
epic: epic-52
parent: goal-8
tags: [closeout, evidence, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-278, test-105]
blocked_by: [task-278, test-98, test-99, test-100, test-101, test-102, test-103, test-104, test-105]
blocks: []
refs: [edd-14]
aliases: [goal-8-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Close `goal-8` only after all design, validation, projection, agent, migration,
and adoption evidence is recorded.

# Acceptance Criteria

- `mdkg validate` passes.
- `mdkg goal next goal-8 --json` returns no actionable child node.
- Required capability searches are discoverable.
- Product-name grep over the new lane returns no matches.
- Source implementation and exporter work remain deferred.

# Test Plan

- Goal required checks.
- `git diff --check`

# Files Affected

- mdkg closeout evidence only.

# Implementation Notes

- Close only after every scoped task and validation node is complete.

# Closeout Evidence

- Scoped tasks `task-266` through `task-278` are done.
- Scoped validation nodes `test-98` through `test-105` are done.
- Scoped epics `epic-46` through `epic-52` have closeout evidence recorded.
- Required searches resolved the generic `edd-14` design anchor for section
  contract, validation diagnostics, projection drift policy, runtime-agent
  manifest, and orchestrator-agent concepts.
- Additional validation searches resolved SPEC frontmatter, template taxonomy,
  example fixtures, capability-index discovery, TriggerEvent, FinalReceipt,
  implementation sequence, backcompat plan, and downstream adoption anchors.
- Product-name grep over the new goal-8 lane returned no matches.
- Source implementation, exporter work, package publish, root sync, downstream
  sync, and all-repo sync remain deferred.

# Links / Artifacts

- `goal-8`
- `epic-52`
