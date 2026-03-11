---
id: task-91
type: task
title: align docs help and internal skills to 0.0.4 task event flows
status: done
priority: 1
epic: epic-12
tags: [0_0_4, docs, skills, help]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, AGENTS.md, CLI_COMMAND_MATRIX.md, .mdkg/core/rule-3-cli-contract.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, .mdkg/skills/author-mdkg-skill/SKILL.md, .mdkg/skills/registry.md]
relates: [dec-14, dec-15, epic-12]
blocked_by: []
blocks: [test-49]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Align the command matrix, root onboarding docs, and internal skills to the released task/event workflow surface.

# Acceptance Criteria

- root docs teach the task/event workflow correctly
- internal skills reinforce the same workflow without drift

# Files Affected

- `README.md`
- `llms.txt`
- `AGENT_PROMPT_SNIPPET.md`
- `CLI_COMMAND_MATRIX.md`
- `.mdkg/skills/`

# Implementation Notes

- `mdkg skill ...` remains the only skill namespace
- `CLI_COMMAND_MATRIX.md` is the canonical local CLI reference

# Test Plan

- `test-49`
- `npm run cli:check`

# Links / Artifacts

- `dec-15`
