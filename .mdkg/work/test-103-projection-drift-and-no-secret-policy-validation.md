---
id: test-103
type: test
title: projection drift and no secret policy validation
status: done
priority: 1
epic: epic-49
parent: goal-8
tags: [projection, drift, security, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-273]
blocked_by: [task-273]
blocks: [task-279]
refs: []
aliases: [projection-drift-no-secret-validation]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that projection drift and no-secret policies are decision-complete.

# Test Cases

- Projection source metadata is required.
- Manual drift creates diagnostics or repair work.
- Secrets, credentials, local auth, and provider config are forbidden.

# Validation Evidence

- `task-273` is done and defines projection source metadata, drift classes,
  no-secret export policy, diagnostics, repair expectations, and future command
  boundaries.
- `chk-51` records projection drift/no-secret closeout evidence.
- `node dist/cli.js capability search "projection drift policy" --json`
  resolves `edd-14`.
- The policy forbids raw secrets, credentials, local auth state, provider
  credential values, production controls, private keys, wallet or ledger state,
  hidden form values, personal host paths, and runtime database contents.
