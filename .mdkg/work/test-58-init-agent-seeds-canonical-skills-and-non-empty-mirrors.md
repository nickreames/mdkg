---
id: test-58
type: test
title: init agent seeds canonical skills and non empty mirrors
status: done
priority: 1
epic: epic-16
tags: [0_0_6, init, skills, mirrors]
owners: []
links: []
artifacts: [tests/commands/init.test.ts, tests/commands/skill_mirrors.test.ts]
relates: [task-104, task-108, epic-16]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [seeded-canonical-skills, mirrored-product-skills, seeded-registry]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Validate that `mdkg init --agent` produces real default skills, not an empty skill framework.

# Target / Scope

- `task-104`
- `task-108`

# Preconditions / Environment

- fresh temp repo
- installed or built mdkg binary

# Test Cases

- init seeds the three canonical mdkg usage skills under `.mdkg/skills/`
- `.agents/skills/` and `.claude/skills/` contain mirrored copies after bootstrap
- registry describes the seeded skills

# Results / Evidence

- attach temp-repo smoke evidence and updated unit tests

# Notes / Follow-ups

- none once green
