---
id: test-2
type: test
title: init command smoke
status: done
priority: 3
tags: []
owners: []
links: []
artifacts: [init-smoke]
relates: [polish:test-1]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [init-smoke]
created: 2026-01-21
updated: 2026-01-22
---
# Overview

Smoke test for `mdkg init --llm` asset creation.

# Target / Scope

- `polish:test-1`

# Preconditions / Environment

- Node 18+

# Test Cases

- init-smoke

# Results / Evidence

- `mdkg init --llm --root .context/smoke-init` created `.mdkg/` plus AGENTS.md + CLAUDE.md.

# Notes / Follow-ups

- none
