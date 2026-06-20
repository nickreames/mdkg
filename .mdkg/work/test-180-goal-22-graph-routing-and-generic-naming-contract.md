---
id: test-180
type: test
title: goal-22 graph routing and generic naming contract
status: done
priority: 1
epic: epic-105
parent: goal-22
tags: [graph, routing, naming]
owners: []
links: []
artifacts: []
relates: [task-413]
blocked_by: [task-413]
blocks: []
refs: []
aliases: [goal-22-routing-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate that the goal-22 graph alignment is coherent, generic, and routes to the intended first node.

# Target / Scope

- goal-22
- spike-11
- epic-105 through epic-112
- task-413 through task-426
- test-180 through test-189

# Preconditions / Environment

- mdkg repo only.
- No downstream repo edits.

# Test Cases

- `node dist/cli.js validate --json` returns ok.
- `node dist/cli.js goal current --json` returns goal-22.
- `node dist/cli.js goal next goal-22 --json` returns spike-11.
- Node titles do not encode product-specific naming.

# Results / Evidence

- `node dist/cli.js validate --json` returned ok with zero errors and zero warnings.
- `node dist/cli.js goal activate goal-22 --json` selected goal-22.
- `node dist/cli.js goal next goal-22 --json` routed to spike-11 before alignment closeout.
- Node titles created for goal-22 scope use generic mdkg naming; the external runtime path is mentioned only in task-425 body as a deliverable target.

# Notes / Follow-ups

- Next actionable work is spike-11.
