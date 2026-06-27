---
id: test-303
type: test
title: arbitrary skill mirror paths and default mirrors contract
status: done
priority: 1
epic: epic-199
parent: goal-41
tags: [0.3.9, skill-mirrors, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-596]
blocks: []
refs: [task-596]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate custom skill mirror target paths without regressing default mirrors.

# Target / Scope

`task-596`, skill mirror config, `mdkg skill sync/audit/prune`, and init
defaults.

# Preconditions / Environment

Use temp repos with default and custom mirror configurations.

# Test Cases

- Default `init --agent` still mirrors to `.agents/skills` and
  `.claude/skills`.
- Custom configured mirror path receives canonical `.mdkg/skills` content.
- Audit reports stale/missing files per configured target.
- Outside-repo or unsafe target paths fail closed.

# Results / Evidence

- `node --test dist/tests/commands/skill_mirrors.test.js` passed: 14 tests.
- `node --test dist/tests/commands/init.test.js` passed: 9 tests.
- Coverage includes default `.agents/skills` and `.claude/skills` mirrors,
  configured custom mirror target paths, managed mirror manifests, drift/missing
  mirror validation warnings, stale mirror pruning, unmanaged collision failure,
  and unsafe mirror target rejection through config validation.
- `task-596` evidence includes a temp-repo custom mirror smoke where
  `.codex/skills` was configured, `mdkg skill sync --json` synced all targets,
  validation passed, and `mdkg upgrade --json` preserved the customization
  overlay.

# Notes / Follow-ups

- Custom mirror paths are paths only, not first-class named agent surfaces.
