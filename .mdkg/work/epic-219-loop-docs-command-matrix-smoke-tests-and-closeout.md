---
id: epic-219
type: epic
title: Loop docs command matrix smoke tests and closeout
status: todo
priority: 1
tags: [loop, docs, tests, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Finish the loop node feature with docs/help/matrix updates, generated-surface
checks, regression coverage, and goal closeout evidence.

# Scope

- CLI help and command matrix updates.
- Generated docs/check updates required by the repo.
- Unit, command, pack, smoke, and regression validation selected by the changed
  surfaces.
- Final `goal-58` closeout.

# Milestones

- `task-684` updates docs/help/generated surfaces.
- `task-685` runs regression gates and closes the goal.
- `test-360` and `test-361` prove regression and CocoIndex exclusion.

# Out of Scope

- No public positioning copy unless required by command truth.
- No publish, push, deploy, tag, or release action.

# Risks

- Generated docs can drift from CLI help.
- Regression coverage may miss legacy MANIFEST/SPEC compatibility.

# Links / Artifacts

- `goal-58`
- `CLI_COMMAND_MATRIX.md`
- `test-350`
