---
id: test-51
type: test
title: init agent flag and omni removal contract
status: done
priority: 1
epic: epic-14
tags: [0_0_5, agent, init]
owners: []
links: []
artifacts: [tests/commands/init.test.ts, tests/commands/cli.test.ts, src/commands/init.ts, src/cli.ts]
relates: [task-93, epic-14]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [init-agent-primary, init-omni-removed, init-agent-llm-independent]
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Validate the runtime, parser, and help contract for `mdkg init --agent` and the removal of `--omni`.
