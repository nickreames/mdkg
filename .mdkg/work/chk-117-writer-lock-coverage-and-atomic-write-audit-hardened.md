---
id: chk-117
type: checkpoint
title: Writer lock coverage and atomic write audit hardened
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-343]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-343]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-343` hardened writer lock coverage and atomic writes for several
high-risk mutating paths.

# Scope Covered

- `task-343`
- Workspace config mutations.
- Format command Markdown rewrites.
- Skill creation, registry refresh, and mirror sync command entry points.
- Source-level mutation safety audit coverage.

# Decisions Captured

- Workspace add/remove/enable/disable now run under the repo mutation lock.
- Format rewrites now run under the repo mutation lock and use atomic writes.
- Skill new/sync now run under the repo mutation lock; registry and canonical
  skill writes use atomic writes.
- Existing output-only/report/bootstrap writes remain explicit exceptions for
  now and are covered by the audit table rather than silently treated as graph
  mutation paths.

# Implementation Summary

- `src/commands/workspace.ts`: config writes now use `atomicWriteFile`; mutating
  workspace commands are lock-wrapped.
- `src/commands/format.ts`: format updates now use `atomicWriteFile` under
  `withMutationLock`.
- `src/commands/skill.ts`: `skill new` and `skill sync` are lock-wrapped;
  canonical skill writes use `atomicWriteFile`.
- `src/commands/skill_support.ts`: registry creation/refresh uses
  `atomicWriteFile`.
- `tests/commands/mutation_safety.test.ts`: records command-path lock/write
  expectations and asserts the high-risk source patterns.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/mutation_safety.test.js dist/tests/commands/workspace.test.js dist/tests/commands/format.test.js`
- `node --test dist/tests/commands/skill_new.test.js dist/tests/commands/skill_mirrors.test.js dist/tests/commands/skill_namespace.test.js dist/tests/commands/skill_validate.test.js dist/tests/commands/skills.test.js`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-344` still needs the packed/temp two-branch branch-conflict smoke and
  prepublish gate.

# Links / Artifacts

- `src/commands/workspace.ts`
- `src/commands/format.ts`
- `src/commands/skill.ts`
- `src/commands/skill_support.ts`
- `tests/commands/mutation_safety.test.ts`
