---
id: task-106
type: task
title: reframe task commands as structured helpers
status: done
priority: 1
epic: epic-16
tags: [0_0_6, task, ux, docs]
owners: []
links: []
artifacts: [AGENT_START.md, CLI_COMMAND_MATRIX.md, src/commands/task.ts, src/cli.ts, README.md, assets/init/AGENT_START.md, AGENT_PROMPT_SNIPPET.md, .mdkg/README.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, .mdkg/skills/author-mdkg-skill/SKILL.md, assets/init/skills/default/select-work-and-ground-context/SKILL.md, assets/init/skills/default/verify-close-and-checkpoint/SKILL.md]
relates: [dec-19, epic-16, epic-15]
blocked_by: []
blocks: [test-60, test-61]
refs: []
aliases: []
skills: []
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Clarify that task commands are best for structured field changes and event persistence, while manual markdown editing remains the right tool for narrative bodies and manual parent updates.

# Acceptance Criteria

- startup/help/docs no longer imply task commands replace manual markdown editing
- command guidance explicitly splits structured field edits from narrative/body edits
- parent closeout remains checkpoint-first guidance plus manual parent editing

# Files Affected

- `AGENT_START.md`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `.mdkg/README.md`
- internal skills that teach the task workflow

# Implementation Notes

- do not change the `mdkg task start|update|done` runtime interface in this wave
- keep future ergonomics redesign as an explicitly deferred question

# Test Plan

- `test-60`
- `test-61`

# Links / Artifacts

- `dec-19`
