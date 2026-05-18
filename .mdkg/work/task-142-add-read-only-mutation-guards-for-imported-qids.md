---
id: task-142
type: task
title: add read only mutation guards for imported qids
status: done
priority: 1
epic: epic-23
tags: [bundle-import, safety, mutation-guard]
owners: []
links: []
artifacts: []
relates: [task-141]
blocked_by: []
blocks: [test-83]
refs: []
aliases: [bundle-import-read-only-guard]
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Ensure imported bundle nodes can be inspected and packed but never mutated
through local mdkg commands.

# Acceptance Criteria

- Mutating commands that receive an imported qid fail with an explicit
  read-only import error.
- The error names the import alias and owning bundle path when available.
- Local graph mutations continue to work normally.
- Imported qids are not silently treated as missing local nodes.

# Files Affected

- `src/commands/task.ts`
- `src/commands/work.ts`
- `src/commands/next.ts`

# Implementation Notes

- Mutation guards resolve against the merged read index so imported qids produce
  a specific read-only error instead of a misleading not-found error.
- Child repositories remain the only owners of imported graph mutations.

# Test Plan

- Tests cover `task start/update/done`, checkpoint or work helpers where
  relevant, and other id-targeted mutation surfaces that could otherwise
  confuse imported qids with local nodes.

# Results / Evidence

- `npm run test`
- `npm run smoke:bundle-import`

# Links / Artifacts

- `cannot mutate read-only imported node`
