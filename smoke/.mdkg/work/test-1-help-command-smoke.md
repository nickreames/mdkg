---
id: test-1
type: test
title: help command smoke
status: done
priority: 3
tags: []
owners: []
links: []
artifacts: [help-smoke]
relates: [polish:test-1]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [help-smoke]
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Smoke test for global CLI help output.

# Target / Scope

- `polish:test-1`

# Preconditions / Environment

- Node 18+

# Test Cases

- help-smoke

# Results / Evidence

- `mdkg help` lists commands.
- `mdkg help new` shows test type and cases flag.

# Notes / Follow-ups

- none
