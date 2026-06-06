---
id: test-99
type: test
title: SPEC section and frontmatter completeness validation
status: todo
priority: 1
epic: epic-46
parent: goal-8
tags: [spec, sections, frontmatter, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-267, task-268]
blocked_by: [task-267, task-268]
blocks: [task-279]
refs: []
aliases: [spec-section-frontmatter-validation]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that SPEC section and frontmatter contracts are decision-complete.

# Test Cases

- Required sections are discoverable.
- Optional sections are classified.
- Frontmatter compatibility policy exists.
- No downstream product names are required.

# Validation Evidence

- `task-267` is done and defines required, conditional, optional, and
  diagnostic-policy section classes.
- `task-268` is done and defines canonical frontmatter, unknown-key policy,
  downstream extension policy, and compatibility/migration rules.
- `chk-45` and `chk-46` record section and frontmatter closeout evidence.
- `node dist/cli.js capability search "SPEC section contract" --json` resolves
  `edd-14`.
- `node dist/cli.js capability search "SPEC frontmatter contract" --json`
  resolves `edd-14`.
- Product-name grep over the new validation lane returned no matches.
