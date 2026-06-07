---
id: chk-59
type: checkpoint
title: 0.3.0 acceptance matrix and release boundary
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-281]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-281]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

Locked the 0.3.0 release boundary and acceptance matrix before functional
implementation. The goal now treats optional SPEC capability indexing plus
deterministic work invocation as the minor-release boundary, while actual npm
publish, tags, pushes, and runtime execution remain out of scope.

# Scope Covered

- `task-281`: semver justification, implementation matrix, proof ladder,
  non-goals, and current gaps carried into the implementation chain.

# Decisions Captured

- `0.3.0` is justified by a new SPEC/work invocation capability track, not by
  template-only changes.
- The goal closeout must prove publish readiness with package dry-runs but must
  not run a real `npm publish`.
- mdkg remains a semantic mirror and local delivery/indexing tool, not a work
  execution runtime.

# Implementation Summary

- Added the acceptance matrix to `task-281`.
- Updated `goal-9` current-state evidence.
- Expanded `goal-9` required checks to include future `mdkg spec ...`,
  `mdkg work trigger`, `work order status`, `work receipt verify`, and
  `smoke:work-invocation` gates.

# Verification / Testing

- `node dist/cli.js capability search "mdkg-0-3-0-foundation" --json` resolved
  `root:edd-15`.
- `node dist/cli.js index` passed.
- `node dist/cli.js validate --json` passed with no warnings or errors.
- `node dist/cli.js goal show goal-9 --json` showed the expanded required
  checks without frontmatter parsing issues.
- `git diff --check` passed.

# Known Issues / Follow-ups

- Implementation begins at `task-282`.
- The future `smoke:work-invocation` script is intentionally required by
  `goal-9` but does not exist yet.
- `capability list --kind spec` still returns zero records until dogfood SPEC
  implementation work lands.

# Links / Artifacts

- `task-281`
- `goal-9`
- `.mdkg/pack/pack_standard_task-281_20260606-104618697.md`
