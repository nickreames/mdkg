---
id: task-333
type: task
title: add operator health temp repo smoke and docs
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [smoke, docs, status, doctor, 0-3-2]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-332]
blocks: [task-327, test-134]
refs: [edd-17]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Add packed/temp-repo proof and docs for the `0.3.2` operator health surface.

# Acceptance Criteria

- Add an operator-health smoke that uses a fresh temp repo.
- Smoke proves clean repo, dirty repo, selected-goal, and DB-enabled scenarios.
- README/init docs and `CLI_COMMAND_MATRIX.md` document status/doctor strict
  behavior without implying repairs are applied.
- Publish-readiness assertions require the status and doctor strict help/docs
  surface.

# Files Affected

- Future smoke script.
- Future docs, command matrix, help snapshots, and package script wiring.

# Implementation Notes

- The smoke should use only the built or packed CLI against `/private/tmp`.
- Do not perform npm publish, tag, or push.

# Test Plan

- `npm run smoke:operator-health` once added.
- Existing build/test/cli check/prepublish dry-run ladder.

# Links / Artifacts

- `edd-17`
- `test-134`
