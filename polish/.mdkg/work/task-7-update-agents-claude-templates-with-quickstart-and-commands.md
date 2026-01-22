---
id: task-7
type: task
title: update AGENTS/CLAUDE templates with quickstart and commands
status: done
priority: 2
epic: epic-1
tags: [agents, onboarding]
owners: []
links: []
artifacts: [agent-docs]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-21
---
# Overview

Update AGENTS/CLAUDE templates with quickstart and command list.

# Acceptance Criteria

- Templates include quickstart steps.
- Templates list core commands.

# Files Affected

- assets/init/AGENTS.md
- assets/init/CLAUDE.md

# Implementation Notes

- Added quickstart and core command blocks to both files.

# Test Plan

- `mdkg init --llm --root .context/smoke-init`

# Links / Artifacts

- agent-docs
