---
id: test-161
type: test
title: archived legacy goal contract
status: done
priority: 1
epic: epic-86
parent: goal-16
tags: [0.3.3, archived]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-375, task-376]
blocks: []
refs: []
aliases: []
skills: []
cases: [Archived goals validate., Archived goals are excluded from default actionable routing., Archived goals remain show/search/list accessible with explicit filters.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate archived legacy goal contract.

# Target / Scope

- task-375
- task-376

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Archived goals validate.
- Archived goals are excluded from default actionable routing.
- Archived goals remain show/search/list accessible with explicit filters.

# Expected Evidence

- CLI test and validation output.

# Notes / Follow-ups

- 2026-06-16 evidence:
  - Parser and command tests cover archived goal-only status/state support, routing exclusion, mutation rejection, and explicit list/search/show access.
  - `node dist/cli.js goal archive goal-11 --json`, `goal archive goal-12 --json`, and `goal archive goal-15 --json` produced archive receipts.
  - `node dist/cli.js validate --json` passed with 0 warnings/errors after archival.
  - `node dist/cli.js list --type goal --status archived --json` returned exactly three archived goals: `goal-11`, `goal-12`, and `goal-15`.
  - `node dist/cli.js search "deferred execution" --type goal --status archived --json` returned archived `goal-11`.
  - `node dist/cli.js show goal-15 --json` preserved body and supersession note.
  - `node dist/cli.js goal next goal-11 --json` returned no actionable node and emitted an archived warning.
  - `node dist/cli.js goal activate goal-11 --json` failed with `cannot activate archived goal root:goal-11`.
  - `node dist/cli.js goal current --json` continued to select `goal-16`.
