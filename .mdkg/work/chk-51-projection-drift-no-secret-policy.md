---
id: chk-51
type: checkpoint
title: Projection drift no-secret policy
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-273-define-projection-metadata-drift-policy-and-no-secret-guarantees.md]
relates: [task-273]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-273]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-273` defined the projection metadata, drift detection, no-secret export,
diagnostic, and repair-work policy for goal-8. Projection surfaces remain
reviewable runtime outputs, while `SPEC.md`, `SKILL.md`, mdkg design nodes, and
mdkg work nodes remain durable source.

# Scope Covered

- Durable source doctrine for SPEC/SKILL/mdkg versus projection files.
- Required projection metadata for generated and manual projections.
- Source, projection, target-schema, missing-source, and projection-only
  behavior drift classes.
- Fail-closed no-secret export policy.
- Future diagnostic codes and explicit repair-work outcomes.
- Non-mutating future command boundary for projection checks and dry runs.

# Decisions Captured

- Generated projection writers must not silently overwrite drift.
- Manual projections still require source linkage and no-secret checks.
- Opaque credential or secret references are allowed, but secret values and
  local auth state are not.
- Durable behavior found only in projection files creates repair work instead
  of becoming canonical.

# Implementation Summary

Only mdkg graph/design state changed. `task-273` now carries the projection
drift policy, and `goal-8` routes next to `task-274` for generic agent role
SPEC requirements.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "projection drift policy" --json`
- Product-name grep over `task-273`
- `git diff --check`

# Known Issues / Follow-ups

- `test-103` must validate the projection drift and no-secret policy contract.
- `task-274` must define generic agent role SPEC requirements.
- Exporter implementation remains deferred.

# Links / Artifacts

- `goal-8`
- `task-273`
- `epic-49`
