---
id: test-118
type: test
title: 0.3.0 npm prepublish and dry-run readiness validation
status: done
priority: 1
epic: epic-62
parent: goal-9
prev: test-117
tags: [release, npm, prepublish, dry-run]
owners: []
links: []
artifacts: [checks://npm-publish-dry-run]
relates: [goal-9, task-301, task-302, task-304]
blocked_by: [task-301, task-302]
blocks: [task-304]
refs: [dec-28]
aliases: [0-3-0-npm-dry-run-validation]
skills: []
cases: [prepublish, pack-dry-run, publish-dry-run]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate publish readiness without publishing.

# Test Cases

- Package metadata is `0.3.0`.
- `npm run prepublishOnly` passes.
- `npm pack --dry-run --json` passes.
- `npm publish --dry-run` passes.
- Actual npm publish is not run.

# Result

Passed on 2026-06-06.

- Package metadata reports `0.3.0` in `package.json`, `package-lock.json`, and
  the package-lock root package.
- `npm run prepublishOnly` exited 0 in a clean logged run:
  `/private/tmp/mdkg-prepublish-0.3.0.log`.
- `npm pack --dry-run --json` exited 0 and produced a dry-run receipt for
  `mdkg@0.3.0`, `mdkg-0.3.0.tgz`, with 154 entries.
- `npm publish --dry-run` exited 0 and reported registry publication only as
  `(dry-run)`, ending with `+ mdkg@0.3.0`.
- No real npm publish command was run.
