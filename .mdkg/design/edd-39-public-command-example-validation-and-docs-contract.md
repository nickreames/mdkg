---
id: edd-39
type: edd
title: public command example validation and docs contract
tags: [mdkg-dev, docs, commands, validation, pass-3]
owners: []
links: []
artifacts: []
relates: []
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
aliases: [public-command-example-contract]
created: 2026-06-24
updated: 2026-06-24
---
# Context

Pass-3 feedback calls out command syntax as a trust boundary. A public docs example that is ambiguous or stale damages confidence before the user installs mdkg.

# Contract

- Public command blocks must be validated against `mdkg help`, generated command contract output, or a dedicated smoke.
- Beginner docs use canonical first forms before variants.
- Advanced variants stay in reference pages and explain why they differ.
- Multi-line command blocks must preserve line breaks in rendered HTML and crawled text.
- Generated command docs remain the reference source for broad command surfaces; hand-authored docs curate beginner paths.

# Minimum Coverage

- `mdkg goal current`
- `mdkg goal next`
- `mdkg goal next GOAL_ID`
- `mdkg goal claim`
- `mdkg task done`
- `mdkg checkpoint new`
- `mdkg handoff create`
- `mdkg pack`
- `mdkg fix plan`

# Acceptance

- `task-521` records how each public example was checked.
- `task-529` adds a smoke that fails on known invalid examples, collapsed command blocks, or stale public command wording.
- Public homepage examples only use beginner-safe commands.

# Overview

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
