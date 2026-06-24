---
id: task-552
type: task
title: add public command-example validation and copy-paste command ergonomics
status: todo
priority: 1
epic: epic-183
parent: goal-35
tags: [mdkg-dev, commands, docs, validation]
owners: []
links: []
artifacts: []
relates: [test-272]
blocked_by: [task-551]
blocks: [task-553]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Add a reliable way to catch stale, impossible, or confusing public command examples before preview deployment.

# Acceptance Criteria

- Beginner examples use canonical command forms.
- Reference-only variants are moved out of quickstart copy.
- New or updated checks compare examples against the command contract, help output, or known executable fixtures.
- Placeholder examples are clearly marked when not directly executable.

# Test Plan

- `npm run docs:check-commands`
- `npm run smoke:mdkg-dev-polish-pass5`

# Files Affected

# Implementation Notes

# Links / Artifacts
