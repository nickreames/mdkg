---
id: test-40
type: test
title: stage tagged skill discovery json contract
status: done
priority: 1
epic: epic-10
tags: [v0_5, cli, skills, json, stage]
owners: []
links: []
artifacts: [src/commands/skill.ts, tests/commands/json_discovery.test.ts]
relates: [task-75, dec-13, epic-10]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Verify that orchestrator-style stage-tagged skill discovery works through `mdkg skill ... --json` without adding a dedicated stage field.
