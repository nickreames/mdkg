---
id: chk-1
type: checkpoint
title: polish subdir command smoke
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [epic-1]
blocked_by: []
blocks: []
refs: []
aliases: []
scope: [task-1, task-2, task-3, task-4]
created: 2026-01-21
updated: 2026-01-22
---
# Summary

Completed manual smoke testing for subdirectory workspace commands in `polish/`.

# Scope Covered

- task-1
- task-2
- task-3
- task-4

# Decisions Captured

None.

# Implementation Summary

- Verified `polish` workspace registration and command behavior.
- Generated a pack for `polish:task-2`.
- Created a subdir smoke task and this checkpoint.

# Verification / Testing

- `mdkg list --ws polish --type task`
- `mdkg show polish:task-2 --body`
- `mdkg search "publish" --ws polish`
- `mdkg pack polish:task-2 -f md -o .mdkg/pack/polish-task-2.md`
- `mdkg next --ws polish`
- `mdkg new task "subdir command smoke" --ws polish --status todo --priority 3 --epic epic-1 --tags smoke,test`
- `mdkg checkpoint new "polish subdir command smoke" --ws polish --relates epic-1 --scope task-1,task-2,task-3,task-4`
- `mdkg validate`
- `mdkg format`

# Known Issues / Follow-ups

- None found.

# Links / Artifacts

- subdir-smoke
