---
id: task-699
type: task
title: Pilot typed command descriptors for loop command family
status: done
priority: 1
epic: epic-223
parent: goal-59
tags: [loop, cli, descriptor, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, prop-4, task-691, task-692, test-366, test-372]
context_refs: []
evidence_refs: [chk-403]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Introduce the first typed command descriptor pilot for the `loop` command
family so command routing, help, safety metadata, and contract generation can
start sharing explicit metadata.

# Acceptance Criteria

- A minimal descriptor captures loop command path, args, flags, output formats,
  help notes, safety metadata, and handler binding.
- Existing loop commands keep their current public behavior.
- Descriptor scope is limited to `loop`.
- The descriptor model is small enough to avoid a generic command framework.

# Files Affected

- `src/cli.ts`
- `src/commands/loop.ts`
- new descriptor helper/module if needed
- focused CLI tests

# Implementation Notes

- Use `prop-4` and `task-691` as design context.
- Keep older high-risk command families out of scope.
- Preserve parser aliases and global output flags.

# Test Plan

- `npm run build`
- focused loop command tests
- `test-372`
- `test-373`

# Links / Artifacts

- `prop-4`
- `task-691`
- `test-366`
