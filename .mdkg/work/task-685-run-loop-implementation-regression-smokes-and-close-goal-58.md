---
id: task-685
type: task
title: run loop implementation regression smokes and close goal 58
status: done
priority: 1
epic: epic-219
parent: goal-58
tags: [loop, regression, closeout]
owners: []
links: []
artifacts: [src/graph/node.ts, src/commands/loop.ts, src/cli.ts, src/pack/pack.ts, tests/commands/loop.test.ts, tests/pack/pack.test.ts, CLI_COMMAND_MATRIX.md, README.md, docs/_generated/cli-reference.md]
relates: []
blocked_by: [task-684, test-351, test-352, test-353, test-354, test-355, test-356, test-357, test-358, test-359, test-360, test-361]
blocks: []
refs: [goal-58, edd-66, dec-65, test-351, test-352, test-353, test-354, test-355, test-356, test-357, test-358, test-359, test-360, test-361]
context_refs: []
evidence_refs: [chk-390]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Run the final implementation verification ladder and close `goal-58` only when
loop node behavior is complete and regression-safe.

# Acceptance Criteria

- All loop-specific tasks and tests are done or have accepted blocker evidence.
- Build, unit tests, CLI checks, docs checks, and relevant smoke tests pass.
- `goal-58` has completion evidence and is ready for `mdkg goal done`.

# Files Affected

- No new implementation surface expected; this is a verification/closeout task.
- May update mdkg evidence/checkpoint nodes after tests pass.

# Implementation Notes

- Do not close the goal if CocoIndex work has entered the implementation
  scope.
- Do not publish, push, deploy, or tag.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- relevant smoke/docs checks from changed surfaces
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --json --limit 20`
- `git diff --check`

# Closeout Evidence

- `npm test` passed with 553 tests and 0 failures.
- `npm run cli:check` passed.
- `npm run cli:contract` passed with command contract hash
  `547c7f55bc28db0e92a38f97ed013414c7d2c45ddb08f1adee00d78692059c1e`.
- `npm run docs:check` passed.
- `npm run smoke:matrix` passed for version `0.4.2`.
- `mdkg validate --changed-only --json` and `mdkg validate --summary --json
  --limit 20` passed with 0 warnings and 0 errors.
- `mdkg goal next goal-58 --json` returned `node: null` after `test-356` was
  closed, so no scoped actionable work remains.
- `mdkg pack task-685 --pack-profile concise --dry-run --stats` completed and
  included the latest closeout context.
- `mdkg search loop --json` returned loop-discovery results, and `mdkg search
  CocoIndex --json` remained limited to the separate CocoIndex planning lane.
- `git diff --check` passed.

# Goal Result

`goal-58` is complete. The implementation keeps `loop` as one mdkg node type,
adds the semantic `mdkg loop` command family, seeds read-only/planning loop
templates, preserves goal and Omni semantic file behavior, and excludes
CocoIndex/provider work.

# Links / Artifacts

- `goal-58`
- `test-351` through `test-361`
- `chk-390`
