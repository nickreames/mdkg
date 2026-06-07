---
id: dec-28
type: dec
title: npm publish readiness requires dry run proof
status: accepted
tags: [release, npm, publish, dry-run, prepublish]
owners: []
links: []
artifacts: [package.json, CHANGELOG.md]
relates: [goal-9, epic-62]
refs: [edd-15]
aliases: [publish-readiness-dry-run-proof, no-implicit-npm-publish, mdkg-0-3-0-prepublish-gate]
created: 2026-06-06
updated: 2026-06-06
---
# Context

Goal closeout should prove that the npm package is ready, but publishing the
package is a separate operator decision.

# Decision

`goal-9` ends at publish-ready evidence: validation, tests, smoke checks,
packed-package proof, `npm pack --dry-run --json`, and `npm publish --dry-run`.

The actual `npm publish` command is out of scope and must only run under a
separate explicitly selected release/publish task.

# Consequences

- Package metadata may be bumped to `0.3.0` during goal execution.
- Dry-run receipts are required in closeout evidence.
- No agent may claim the package was published unless a separate publish action
  actually ran and produced its own receipt.

# Alternatives considered

- Publish as part of the prepublish goal. Rejected because publishing is an
  external release action that should have its own explicit operator approval.
- End at local tests only. Rejected because npm packaging can fail after tests.

# Links / references

- `edd-15`
- `goal-9`
- `task-302`
