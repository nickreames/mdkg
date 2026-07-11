---
id: test-353
type: test
title: mdkg loop command structured output contract
status: done
priority: 1
epic: epic-217
parent: goal-58
tags: [loop, cli, json, contract]
owners: []
links: []
artifacts: [src/cli.ts, src/commands/loop.ts, tests/commands/loop.test.ts, tests/commands/cli.test.ts, tests/commands/cli_runtime.test.ts]
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-345, task-682, chk-388]
context_refs: []
evidence_refs: [chk-388, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate the semantic `mdkg loop` command surface and structured receipts.

# Target / Scope

- `task-682`
- CLI dispatch/help/JSON output

# Preconditions / Environment

Loop nodes exist in a fixture graph.

# Test Cases

- `mdkg loop list --json` returns loop nodes.
- `mdkg loop show <loop> --json` returns mode, scope, lineage, and child refs.
- `mdkg loop plan <loop> --json` reports planning state without executing
  agents.
- `mdkg loop runs <loop> --json` or equivalent reports linked evidence.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Command shape may use an equivalent evidence-inspection name if documented.
