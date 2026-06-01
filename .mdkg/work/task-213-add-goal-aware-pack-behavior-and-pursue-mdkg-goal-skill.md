---
id: task-213
type: task
title: add goal aware pack behavior and pursue mdkg goal skill
status: done
priority: 1
epic: epic-37
prev: task-212
next: task-214
tags: [goal, pack, skills, agent-harness]
owners: []
links: []
artifacts: [src/pack/pack.ts, .mdkg/skills/pursue-mdkg-goal/SKILL.md, .mdkg/skills/registry.md]
relates: [epic-37, task-211, task-212, task-214]
blocked_by: [task-211]
blocks: [task-214]
refs: [rule-2, rule-3, rule-6]
aliases: [pursue-mdkg-goal-skill]
skills: [author-mdkg-skill]
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Make goal packs include scoped context and add canonical skill guidance for the
selected-goal recursive loop.

# Acceptance Criteria

- `mdkg pack <goal-id>` includes the goal plus scoped epics, features, tasks,
  bugs, and tests.
- Non-goal pack behavior remains unchanged.
- Canonical `pursue-mdkg-goal` skill exists and validates.
- Skill registry includes `pursue-mdkg-goal`.
- `select-work-and-ground-context` teaches selected-goal detection.
- Skill mirrors sync cleanly.

# Files Affected

- `src/pack/pack.ts`
- `.mdkg/skills/pursue-mdkg-goal/SKILL.md`
- `.mdkg/skills/registry.md`
- `.mdkg/skills/select-work-and-ground-context/SKILL.md`
- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`

# Implementation Notes

- Skill self-improvement remains proposal-driven unless the active node is
  explicit skill-maintenance work.

# Test Plan

- Pack tests for goal-scoped closure.
- `mdkg skill validate pursue-mdkg-goal --json`
- `mdkg skill sync --json`

# Verification Evidence

- `mdkg pack <goal-id>` now includes scoped goal context.
- Canonical and seeded `pursue-mdkg-goal` skills were added and mirrored.
- `mdkg skill sync --json`, `npm run test`, and `npm run smoke:goal` passed.

# Links / Artifacts

- `task-211`
- `task-214`
