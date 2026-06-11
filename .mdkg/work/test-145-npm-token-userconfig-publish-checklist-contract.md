---
id: test-145
type: test
title: npm token userconfig publish checklist contract
status: done
priority: 1
epic: epic-69
tags: [release, npm, auth, checklist]
owners: []
links: []
artifacts: []
relates: [goal-14]
blocked_by: [task-352]
blocks: []
refs: []
aliases: []
skills: []
cases: [skill documents temp userconfig, rule documents npm whoami check, no token is printed]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that release docs and skills explain the npm token userconfig flow
without exposing or hardcoding secrets.

# Target / Scope

- `task-352`
- Release skill and release rule publish checklist

# Preconditions / Environment

- Canonical skill is updated first, then mirrored with `mdkg skill sync`.

# Test Cases

- Skill docs mention `NPM_TOKEN`, `--userconfig`, and `npm whoami`.
- Release rule mentions verifying npm auth before real publish.
- Examples do not print the token or include a concrete token value.
- Mirrored `.agents/skills/verify-close-and-checkpoint/SKILL.md` matches the
  canonical skill after sync.

# Results / Evidence

- Passed. `rg` confirmed `NPM_TOKEN`, `--userconfig`, and `npm whoami`
  guidance exists in canonical and mirrored skill docs plus release rules.
- `mdkg skill validate verify-close-and-checkpoint` passed.
- `mdkg skill sync` refreshed `.agents/skills/` and `.claude/skills/`.

# Notes / Follow-ups

- Real publish remains separately requested work.
