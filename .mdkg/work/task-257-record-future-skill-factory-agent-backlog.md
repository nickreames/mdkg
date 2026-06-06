---
id: task-257
type: task
title: record future skill factory agent backlog
status: done
priority: 2
epic: epic-44
parent: goal-6
tags: [skill-factory, backlog, future]
owners: []
links: []
artifacts: []
relates: [goal-6, epic-44, test-93]
blocked_by: [task-253, task-256]
blocks: [task-258]
refs: [dec-25, edd-14]
aliases: [future-skill-factory-backlog-task]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Record the future skill-factory-agent backlog without building it.

# Acceptance Criteria

- Future responsibilities are documented.
- Prerequisites are documented.
- Implementation is explicitly deferred.

# Files Affected

- Child mdkg planning nodes only.

# Implementation Notes

- Keep `author-mdkg-skill` as the current implementation target.

# Future Responsibilities

- Detect repeated workflows.
- Propose new skills and SPECs.
- Generate validation tasks and projection adapters.
- Publish skill packs and track skill reputation.
- Sync skills across repos after standards are stable.

# Prerequisites

- Hardened `author-mdkg-skill`.
- Stable SPEC/SKILL templates.
- Codex projection doctrine.
- Root sync mechanism.
- mdkg capability ingestion model.

# Test Plan

- `mdkg capability search "skill factory backlog" --json`

# Links / Artifacts

- `dec-25`
- `edd-14`
