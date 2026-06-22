---
id: test-195
type: test
title: packed temp-repo warning UX prepublish smoke contract
status: done
priority: 1
epic: epic-116
parent: goal-23
tags: [smoke, prepublish, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Prove the warning-scale UX works from a temp repo in the same style as CI/prepublish automation.

# Target / Scope

- `scripts/smoke-warning-ux.js`
- `npm run smoke:warning-ux`
- `prepublishOnly`

# Preconditions / Environment

- Fresh temp repo.
- Built or packed local mdkg CLI.
- No network dependency.

# Test Cases

- `npm run smoke:warning-ux` creates a fresh temp repo.
- The temp repo has 1000+ warning-producing nodes.
- Validate summary, validate `--json-out`, format summary, changed-only validation, index, and full validation are exercised.
- The smoke is wired into `prepublishOnly`.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If the smoke is too slow, reduce fixture overhead while keeping 1000+ diagnostics.
