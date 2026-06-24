---
id: task-521
type: task
title: validate and normalize all public command examples against CLI help and contract
status: done
priority: 1
epic: epic-166
parent: goal-33
tags: [mdkg-dev, commands, docs, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33, test-250]
blocked_by: [task-520]
blocks: [task-522, task-523, task-524, task-525, task-529, test-250]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Audit and normalize every public command example on mdkg.dev and docs.mdkg.dev against current CLI behavior.

# Acceptance Criteria

- Examples are checked against `mdkg help`, generated command contract, or focused command execution.
- Beginner pages use canonical beginner-safe forms first.
- Advanced variants appear only in reference docs with context.
- Homepage/docs command blocks preserve line breaks and do not collapse into blobs.
- Evidence is recorded in `chk-226`.

# Command Focus

Validate `mdkg goal current`, `mdkg goal next`, `mdkg goal next GOAL_ID`, `mdkg goal claim`, `mdkg task done`, `mdkg checkpoint new`, `mdkg handoff create`, `mdkg pack`, and `mdkg fix plan`.

# Files Affected

# Implementation Notes

# Test Plan

# Links / Artifacts
