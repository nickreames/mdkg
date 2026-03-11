---
id: task-94
type: task
title: add root agent start artifact and wrapper docs
status: done
priority: 1
epic: epic-14
tags: [0_0_5, agent, onboarding, docs]
owners: []
links: []
artifacts: [AGENT_START.md, AGENTS.md, CLAUDE.md, llms.txt, assets/init/AGENT_START.md, assets/init/AGENTS.md, assets/init/CLAUDE.md, assets/init/llms.txt]
relates: [dec-17, epic-14]
blocked_by: []
blocks: [test-52, test-55]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Add one shared startup doc and make product-facing wrapper files point to it.

# Acceptance Criteria

- `AGENT_START.md` exists at repo root and init assets
- `AGENTS.md`, `CLAUDE.md`, and `llms.txt` are wrappers pointing to it
- startup guidance references `SOUL.md`, `HUMAN.md`, `.mdkg/README.md`, `CLI_COMMAND_MATRIX.md`, and the first-step skill

# Files Affected

- `AGENT_START.md`
- `AGENTS.md`
- `CLAUDE.md`
- `llms.txt`
- `assets/init/AGENT_START.md`
- `assets/init/AGENTS.md`
- `assets/init/CLAUDE.md`
- `assets/init/llms.txt`

# Implementation Notes

- startup doc should teach both known-task and unknown-task flows
- wrapper docs should stay intentionally thin

# Test Plan

- `test-52`
- `test-55`

# Links / Artifacts

- `dec-17`
