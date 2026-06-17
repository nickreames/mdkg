---
id: task-387
type: task
title: implement separate repo graph clone preserving ids
status: done
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, clone]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-386]
blocks: [test-165, task-389]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Implement separate-repo graph clone that preserves node IDs and graph links.

Implemented the initial public `mdkg graph clone` and `mdkg graph fork`
surface for preserved-ID separate-target graph transport.

# Acceptance Criteria

- Destination repo validates.
- IDs and links are preserved.
- Source repo is not mutated.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- Added `src/commands/graph.ts`.
- Added CLI routing/help for `mdkg graph clone|fork|import-template`.
- `clone` and `fork` accept a bundle path or a live directory containing
  `.mdkg/config.json`.
- Targets must be contained under the current mdkg root, empty or absent, and
  outside a live directory source.
- Generated bundle indexes are skipped, then destination indexes are rebuilt and
  the target graph is validated before success.
- `fork --start-goal <goal-id>` writes target selected-goal state after the
  target validates and the goal resolves.
- Same-repo rewritten-ID `import-template` remains intentionally blocked until
  `task-388`.

# Test Plan

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/graph.test.js`
- `node --test dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/cli.test.js dist/tests/commands/command_contract.test.js`

# Links / Artifacts

- src/commands/graph.ts
- tests/commands/graph.test.ts
- scripts/cli_help_targets.js
- dist/command-contract.json
- chk-154
