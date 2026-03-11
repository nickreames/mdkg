---
id: test-38
type: test
title: skill namespace primary and generic removal contract
status: done
priority: 1
epic: epic-10
tags: [v0_5, cli, skills, removal]
owners: []
links: []
artifacts: [src/commands/list.ts, src/commands/search.ts, src/commands/show.ts, src/commands/skill.ts, tests/commands/skill_namespace.test.ts]
relates: [task-74, dec-13, epic-10]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Verify that `mdkg skill ...` is the only supported skill discovery surface and removed generic skill access paths fail with clear guidance.
