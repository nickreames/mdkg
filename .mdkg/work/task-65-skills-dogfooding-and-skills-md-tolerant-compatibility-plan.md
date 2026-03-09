---
id: task-65
type: task
title: skills dogfooding and skills md tolerant compatibility plan
status: done
priority: 1
epic: epic-7
tags: [v0_5, skills, compatibility, dogfood]
owners: []
links: []
artifacts: []
relates: [dec-11, edd-5, edd-9, test-31, epic-7]
blocked_by: []
blocks: [test-31]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Plan the next-step skills polish work so mdkg uses real internal skills and tolerates `SKILLS.md` compatibility without abandoning canonical `SKILL.md`.

# Acceptance Criteria

- Canonical vs tolerant filename policy is documented.
- Dogfooding targets identify real internal skills needed to teach the simplified CLI.
- Failure behavior is defined for `SKILL.md` plus `SKILLS.md` conflicts.

# Files Affected

- src/graph/skills_indexer.ts
- README.md
- .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md

# Implementation Notes

- This is a post-v0.4 simplification/polish task, not a release blocker.

# Test Plan

- Validate via `test-31`.

# Links / Artifacts

- epic-7
