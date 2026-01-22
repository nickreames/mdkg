---
id: test-1
type: test
title: polish cli help and init smoke
status: done
priority: 2
tags: []
owners: []
links: []
artifacts: [help-smoke, init-smoke]
relates: [task-1, task-2]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [help-smoke, init-smoke]
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Validate that CLI help output is discoverable and that init creates agent docs.

# Target / Scope

- `polish:task-1`
- `polish:task-2`

# Preconditions / Environment

- Node 18+
- local repo root

# Test Cases

- help-smoke
- init-smoke

# Results / Evidence

- `mdkg help` and `mdkg help new` show the test type and cases flag.
- `mdkg init --llm --root .context/smoke-init` creates AGENTS.md + CLAUDE.md.

# Notes / Follow-ups

- none
