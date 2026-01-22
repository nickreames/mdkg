---
id: task-2
type: task
title: verify subdirectory workspace discovery across commands
status: done
priority: 2
epic: epic-1
tags: [test, workspace]
owners: []
links: []
artifacts: [subdir-smoke]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Confirm all CLI commands work with a registered subdirectory workspace.

# Acceptance Criteria

- Commands resolve `--ws polish` correctly.
- `polish:` qualified IDs resolve across commands.
- Pack, validate, and format include polish docs.

# Files Affected

- polish/.mdkg/work/*
- .mdkg/config.json

# Implementation Notes

Manual command checks (all run from repo root):

- `mdkg list --ws polish --type task`
- `mdkg show polish:task-2 --body`
- `mdkg search "publish" --ws polish`
- `mdkg pack polish:task-2 -f md -o .mdkg/pack/polish-task-2.md`
- `mdkg next --ws polish`
- `mdkg new task "subdir command smoke" --ws polish --status todo --priority 3 --epic epic-1 --tags smoke,test`
- `mdkg checkpoint new "polish subdir command smoke" --ws polish --relates epic-1 --scope task-1,task-2,task-3,task-4`
- `mdkg validate`
- `mdkg format`

# Test Plan

- Manual smoke run (see Implementation Notes).

# Links / Artifacts

- subdir-smoke
