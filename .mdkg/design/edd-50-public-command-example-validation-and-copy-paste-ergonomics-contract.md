---
id: edd-50
type: edd
title: public command example validation and copy-paste ergonomics contract
tags: [mdkg-dev, commands, docs, validation]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

mdkg.dev is increasingly command-led. Public examples must be accurate enough for humans and agents to copy without private repo context.

# Contract

- Beginner examples prefer canonical, validated command forms.
- Variants move to reference pages, not quickstart copy.
- Generated command docs and command contract remain the source for validation where possible.
- Example checks reject stale flags, impossible command sequences, and ambiguous placeholders unless marked illustrative.

# Acceptance

`task-552` adds validation coverage, and `test-272` proves examples are canonical, validated, and copy-safe.

# Overview

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
