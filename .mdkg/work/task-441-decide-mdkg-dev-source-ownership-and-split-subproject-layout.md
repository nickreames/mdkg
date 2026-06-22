---
id: task-441
type: task
title: decide mdkg.dev source ownership and split subproject layout
status: done
priority: 1
epic: epic-119
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-440]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-21
---
# Overview

Record the source ownership decision needed before future implementation starts.

# Acceptance Criteria

- dec-30 records repo ownership and split /mdkg-dev, /docs, /examples layout.
- Decision states GitBook is a renderer/sync target while repo files remain canonical.
- Decision defers subgraph registration until each subproject graph validates.

# Files Affected

- .mdkg/design/dec-30-*.md

# Implementation Notes

- Use split source layout from user-approved planning.
- Do not create the directories in this goal.

# Test Plan

- node dist/cli.js show dec-30 --json resolves.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-119
- context: edd-24
- context: edd-26
- context: edd-27
