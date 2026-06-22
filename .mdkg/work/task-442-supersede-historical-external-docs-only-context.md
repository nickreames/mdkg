---
id: task-442
type: task
title: supersede historical external docs only context
status: done
priority: 1
epic: epic-119
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-441]
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

Update older external-docs-only records so they remain auditable but no longer contradict the approved in-repo source ownership decision.

# Acceptance Criteria

- prd-2 and dec-14 include supersession notes.
- Old mdkg.dev external handoff tasks retain history and point to the new canonical records.
- No historical nodes are deleted.

# Files Affected

- .mdkg/design/prd-2-*.md
- .mdkg/design/dec-14-*.md
- .mdkg/work/task-39-*.md
- .mdkg/work/task-44-*.md
- .mdkg/work/task-46-*.md
- .mdkg/work/task-59-*.md
- .mdkg/work/task-86-*.md

# Implementation Notes

- Append supersession notes rather than rewriting history.
- Keep old records searchable as historical context.

# Test Plan

- rg Supersession .mdkg/design .mdkg/work finds the updated records.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-119
- context: prd-2
- context: dec-14
- context: task-39
- context: task-44
- context: task-46
- context: task-59
- context: task-86
