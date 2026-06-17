---
id: test-167
type: test
title: template graph starts from selected goal only contract
status: done
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, template, demo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-389]
blocks: []
refs: []
aliases: []
skills: []
cases: [Template graph contains a selected goal., Agent handoff can start from that goal alone., No hidden chat context is required.]
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Validate template graph starts from selected goal only contract.

# Target / Scope

- task-389

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Template graph contains a selected goal.
- Agent handoff can start from that goal alone.
- No hidden chat context is required.
- `graph fork --start-goal` selects the preserved start goal in the target.
- `graph import-template --start-goal --select-goal --apply` selects the
  rewritten start goal in the current repo.

# Expected Evidence

- `tests/commands/graph.test.ts`
- `node --test dist/tests/commands/graph.test.js`
- `goal current --json` receipts from fork/import temp graphs.

# Notes / Follow-ups

- Passing graph command tests prove the start-from-one-goal contract for both
  preserved-ID fork and rewritten-ID import-template workflows.
- The broader website-template-mdkg repo is planned under `goal-20`, not created
  in this 0.3.5 goal.
