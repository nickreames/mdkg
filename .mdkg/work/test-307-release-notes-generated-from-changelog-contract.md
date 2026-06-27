---
id: test-307
type: test
title: release notes generated from changelog contract
status: todo
priority: 2
epic: epic-202
parent: goal-42
tags: [0.4.0, release-notes, changelog, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-601]
blocks: []
refs: [task-601]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate that public release notes are reconciled with `CHANGELOG.md`.

# Target / Scope

`task-601`, `CHANGELOG.md`, docs/site release notes page.

# Preconditions / Environment

Run after release notes page implementation.

# Test Cases

- Each public release card maps to a changelog version/date.
- Detail pages or sections include the correct compatibility notes.
- Publish-bound changes are not left only under `Unreleased`.
- Docs/site builds pass.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- The public page may be generated or checked, but it must not drift.
