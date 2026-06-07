---
id: epic-53
type: epic
title: 0.3.0 release scope semver and current state audit
status: done
priority: 1
tags: [release, audit, semver, prepublish]
owners: []
links: []
artifacts: [package.json, CHANGELOG.md]
relates: [goal-9, edd-15]
blocked_by: []
blocks: [task-280, task-281]
refs: [dec-28]
aliases: [mdkg-0-3-0-release-scope, prepublish-current-state-audit]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Ground the 0.3.0 release in current repo state before source work begins.

# Acceptance Criteria

- Current SPEC, WORK, queue, docs, tests, package, and dirty-tree state are
  recorded.
- The release boundary explains why this is `0.3.0` instead of `0.2.1`.
- The publish-ready gate is dry-run only.

# Scope

Audit and release-boundary planning only.

# Milestones

- `task-280`
- `task-281`

# Out of Scope

- No source implementation before the audit is recorded.

# Risks

- Skipping the audit could mix existing behavior with planned 0.3.0 work.

# Links / Artifacts

- `goal-9`
- `edd-15`

# Closeout

Completed by `task-280`, `task-281`, and `test-106`.

- `task-280` recorded the pre-implementation current-state audit, including
  package version, graph validation, SPEC/WORK capability counts, work command
  state, public queue command state, docs/templates, tests, and blockers.
- `task-281` locked the 0.3.0 acceptance matrix and non-publish release
  boundary.
- `test-106` closed the initial recursive goal routing proof with historical
  evidence that `goal next goal-9 --json` selected `task-280` before functional
  work began.
