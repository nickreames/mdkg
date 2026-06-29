---
id: rule-7
type: rule
title: collaboration profile and operator preferences
tags: [collaboration, preferences, operator]
owners: []
links: []
artifacts: []
relates: [rule-human]
refs: [dec-53]
aliases: [collaboration, operator-profile]
created: 2026-06-27
updated: 2026-06-27
---

# Purpose

Capture stable collaboration preferences, operating boundaries, and repo-specific
human expectations so agents can work with less ambiguity.

# Scope

Applies to planning, implementation, review, release, and handoff interactions in
this repository.

# Compatibility

`COLLABORATION.md` is canonical. `HUMAN.md` remains a one-release legacy alias for
repos and agent prompts that still reference it; read `COLLABORATION.md` first and
then use `HUMAN.md` only for compatibility notes not yet migrated.

# Requirements

- Keep top goals, boundaries, and style preferences current.
- Include ask-before-doing constraints for risky or high-impact actions.
- Record preferred environment assumptions and validation commands.
- Preserve local operator customizations during `mdkg upgrade --apply`.

# Notes

Suggested prompts:
- What are your top 3 goals in this repo right now?
- What should never happen without confirmation?
- What coding/review style should the agent prefer?
- What OS/runtime/test commands should be assumed?
