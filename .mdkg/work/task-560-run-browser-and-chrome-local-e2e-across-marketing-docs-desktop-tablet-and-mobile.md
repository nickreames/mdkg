---
id: task-560
type: task
title: run Browser and Chrome local E2E across marketing docs desktop tablet and mobile
status: done
priority: 1
epic: epic-188
parent: goal-35
tags: [mdkg-dev, browser, chrome, e2e]
owners: []
links: []
artifacts: []
relates: [test-279]
blocked_by: [task-559]
blocks: [task-561]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate local marketing and docs builds in Browser and Chrome before pushing.

# Acceptance Criteria

- Desktop, tablet, and mobile route checks cover marketing home, docs home, quickstart, trust, demo graphs, generated CLI reference, `llms.txt`, and `llms-full.txt`.
- No console errors, broken local navigation, obvious overflow, inaccessible focus traps, or unreadable code blocks remain.
- Evidence is recorded in checkpoints without raw secrets or payloads.

# Test Plan

- Local preview servers.
- Browser and Chrome route checks.
- Relevant focused smokes rerun after fixes.

# Files Affected

# Implementation Notes

# Links / Artifacts
