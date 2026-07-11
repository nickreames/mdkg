---
id: test-380
type: test
title: Loop descriptor help flags and side effects remain truthful
status: done
priority: 1
epic: epic-227
tags: [loop, descriptor, help, contract]
owners: []
links: []
artifacts: [npm run cli:check (pass), npm run cli:contract (pass), npm run docs:check (pass), node --test command_contract cli cli_runtime (31/31 pass)]
relates: [goal-61, task-707]
blocked_by: []
blocks: []
refs: [task-707]
context_refs: [goal-61, epic-227, edd-70, dec-67, prop-4]
evidence_refs: [chk-413]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Keep parser behavior, descriptors, help, generated contracts, and real side
effects aligned for every loop command.

# Target / Scope

`task-707`; loop command registration, public flags, JSON envelopes, and docs.

# Preconditions / Environment

Built CLI with regenerated snapshots/contracts and read/write state fixtures.

# Test Cases

- Compare descriptor flags with accepted parser flags including global options.
- Verify read and dry-run commands have zero durable writes.
- Verify committed fork declares and performs only documented writes.
- Run CLI snapshot, contract, and docs drift checks.

# Results / Evidence

PASS on 2026-07-10. Loop descriptor flags, root/workspace/cache options, fork
side effects, dry-run zero-write declarations, rendered help, generated docs,
and command-contract metadata agree. Evidence: `chk-413`.

# Notes / Follow-ups

- Broader descriptor rollout remains `goal-60`.
