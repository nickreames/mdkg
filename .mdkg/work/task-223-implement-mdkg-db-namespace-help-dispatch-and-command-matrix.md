---
id: task-223
type: task
title: implement mdkg db namespace help dispatch and command matrix parity
status: todo
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, db-cli, cli, docs]
owners: []
links: []
artifacts: []
relates: [goal-1, epic-30, edd-12, task-181]
blocked_by: []
blocks: [task-224, task-225, task-226, task-230, task-231]
refs: [edd-12, rule-3]
aliases: [db-namespace, mdkg-db-cli-dispatch]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Add the public `mdkg db ...` namespace and route it through help, dispatch,
usage errors, and command matrix parity without changing existing `mdkg index`
behavior.

# Acceptance Criteria

- `mdkg db --help` and `mdkg help db` describe the DB command family.
- Dispatch recognizes `mdkg db index`, `mdkg db init`, `mdkg db migrate`,
  `mdkg db verify`, and `mdkg db stats`.
- Unknown and malformed `mdkg db ...` invocations return command-specific usage
  guidance.
- `CLI_COMMAND_MATRIX.md` and help snapshots include the namespace.
- `mdkg index` remains visible and unchanged as a compatibility shortcut.

# Explicit Exclusions

- No real npm publish.
- No raw SQL command.
- No project DB profiles.

# Files Affected

- CLI dispatch and help.
- Command matrix and help snapshot script.
- DB command implementation entrypoint.

# Implementation Notes

Add only namespace routing and usage scaffolding here. Deeper command behavior
belongs to the downstream tasks.

# Test Plan

- Unit/CLI tests cover db help, dispatch, malformed usage, and matrix parity.
- `npm run cli:check` passes.
- `node dist/cli.js validate` passes.

# Closeout Evidence

- Record help output parity and test commands before marking done.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
