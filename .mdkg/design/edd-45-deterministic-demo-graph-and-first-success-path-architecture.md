---
id: edd-45
type: edd
title: deterministic demo graph and first-success path architecture
tags: [mdkg-dev, demo, dx]
owners: []
links: []
artifacts: []
relates: [goal-34, task-539, test-263]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, task-532, task-533]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

The public story is strong, but first-time users need a deterministic path that proves mdkg works without inventing graph state or guessing IDs.

# Architecture

- Provide a tiny known demo path with one goal, one task, one spike, one checkpoint, one decision, one skill, and passing validation.
- Document expected outputs after each command rather than full logs.
- Keep demo preview/subdomain promotion noindex and separate from canonical product claims until explicitly launched.
- Link the demo path from homepage, quickstart, and docs homepage.

# Data model

Demo proof record: repo or fixture source, stable or receipt-derived IDs, commands, expected outputs, validation result, known warnings, and no-secret scan.

# APIs / interfaces

Public examples should use `mdkg init --agent`, `mdkg index`, `mdkg validate`, `mdkg new task`, `mdkg show`, `mdkg pack`, `mdkg task done --checkpoint`, and `mdkg search`.

# Failure modes

- Demo depends on generated numeric IDs but docs hardcode stale IDs.
- Demo graph is linked as canonical proof before validation is stable.
- Demo instructions exceed 10 minutes or require hidden context.

# Observability

Smoke records demo setup time, commands run, expected-output matches, and validation result.

# Security / privacy

Demo fixtures must contain no raw secrets, tokens, private prompts, provider payloads, or user-specific repo details.

# Testing strategy

Add a pass-4 smoke that creates or opens the demo fixture, runs documented commands, checks expected outputs, and validates the graph.

# Rollout plan

Keep the deterministic demo in docs first. Defer polished video/image assets to follow-up work unless explicitly rescoped.
