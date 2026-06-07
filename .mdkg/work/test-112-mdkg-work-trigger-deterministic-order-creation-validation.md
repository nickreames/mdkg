---
id: test-112
type: test
title: mdkg work trigger deterministic order creation validation
status: done
priority: 1
epic: epic-57
parent: goal-9
prev: test-111
next: test-113
tags: [work, trigger, deterministic]
owners: []
links: []
artifacts: []
relates: [goal-9, task-291]
blocked_by: [task-291]
blocks: []
refs: [dec-27]
aliases: [work-trigger-order-validation]
skills: []
cases: [trigger-order-json, deterministic-path]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Prove `mdkg work trigger` creates deterministic order mirrors.

# Test Cases

- Triggering a dogfood work ref creates a `WORK_ORDER.md`.
- Repeated deterministic inputs produce stable refs and hashes.
- The command does not execute work.
