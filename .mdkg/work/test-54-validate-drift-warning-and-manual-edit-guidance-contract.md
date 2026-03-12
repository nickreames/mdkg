---
id: test-54
type: test
title: validate drift warning and manual edit guidance contract
status: done
priority: 1
epic: epic-14
tags: [0_0_5, skills, mirrors, validate]
owners: []
links: []
artifacts: [src/commands/validate.ts, src/commands/skill_mirror.ts, tests/commands/skill_mirrors.test.ts]
relates: [task-95, task-97, epic-14]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [mirror-drift-warning, missing-manifest-warning, unmanaged-collision-guidance]
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Validate that mirror drift and manual-edit conflicts surface as warnings and guidance instead of destructive mutation.
