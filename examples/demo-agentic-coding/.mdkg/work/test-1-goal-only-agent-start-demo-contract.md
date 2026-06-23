---
id: test-1
type: test
title: Goal only agent start demo contract
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, validation, agent-start]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-1]
blocks: []
refs: []
context_refs: [goal-1, spike-1, task-1, edd-3, dec-1]
evidence_refs: [chk-1]
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that an agent can start from `goal-1`, discover the required context, execute the demo task, and close with evidence without external deployment.

# Target / Scope

- goal-1
- spike-1
- task-1
- edd-3
- dec-1

# Preconditions / Environment

- Local mdkg CLI available.
- No network, deploy, production credentials, or parent repo context required.

# Test Cases

- `mdkg goal next goal-1 --json` returns `spike-1` or the next unblocked scoped node.
- `mdkg pack goal-1 --profile concise` includes the goal, spike, task, test, design, decision, and checkpoint context.
- The demo artifact check passes locally.
- `mdkg validate --json` returns ok.

# Results / Evidence

Record outcomes in a checkpoint after implementation.

# Notes / Follow-ups

- Future smoke automation can copy this example to a temp directory and verify the same commands.
