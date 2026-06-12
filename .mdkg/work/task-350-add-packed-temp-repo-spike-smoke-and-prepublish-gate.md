---
id: task-350
type: task
title: add packed temp-repo spike smoke and prepublish gate
status: todo
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, smoke, prepublish, temp-repo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: [test-144]
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Add a packed temp-repo smoke that proves the new spike surface works from an
installed package, then wire that smoke into prepublish readiness.

# Acceptance Criteria

- Add `scripts/smoke-spike.js`.
- Add `npm run smoke:spike`.
- Add `smoke:spike` to `prepublishOnly`.
- Smoke packs mdkg, installs into a temp prefix, creates a fresh temp repo, and
  uses only the installed CLI.
- Smoke covers `mdkg new spike`, lifecycle mutation, goal routing, search/show,
  pack, validate, and command docs recognition.

# Files Affected

- `scripts/smoke-spike.js`
- `package.json`
- Test and publish-readiness support files

# Implementation Notes

- The smoke should create at least one follow-up task and record at least one
  skill-authoring candidate from the spike output.
- Use `/private/tmp/mdkg-spike.XXXXXX` for temp repo evidence.

# Test Plan

- `npm run smoke:spike`
- `npm run prepublishOnly`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Links / Artifacts

- `task-348`
- `test-144`
