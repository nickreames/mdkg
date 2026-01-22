---
id: task-4
type: task
title: subdir command smoke
status: done
priority: 3
epic: epic-1
tags: [smoke, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Smoke task created to validate `mdkg new` behavior in the polish workspace.

# Acceptance Criteria

- Task is created in `polish/.mdkg/work/`.
- Frontmatter is valid and indexed.

# Files Affected

- polish/.mdkg/work/task-4-subdir-command-smoke.md

# Implementation Notes

- Created via `mdkg new task "subdir command smoke" --ws polish --status todo --priority 3 --epic epic-1 --tags smoke,test`.

# Test Plan

- `mdkg list --ws polish --type task`
- `mdkg show polish:task-4 --body`

# Links / Artifacts

- subdir-smoke
