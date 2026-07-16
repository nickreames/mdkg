---
id: task-794
type: task
title: Run automated docs gates and local Chrome route validation
status: todo
priority: 1
parent: goal-73
prev: test-455
next: test-456
tags: [goal-73, docs, validation, chrome, local]
owners: []
links: []
artifacts: []
relates: [test-455, test-456, task-793]
blocked_by: [test-455]
blocks: [test-456]
refs: [goal-73, dec-84, edd-78]
context_refs: [dec-84, edd-78, edd-46]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Run the complete local automated ladder and fresh Chrome validation against the
built docs before any production-triggering push.

# Acceptance Criteria

- Pass public-release tests, release-note generation/check, docs checks/build,
  docs smoke, full tests, mdkg validation, and diff checks.
- Serve `docs/dist` locally and validate Install, Changelog, and Generated CLI
  Reference at desktop `1440x900` and mobile `390x844`.
- Within the current-release supplement require generated v0.5.2 facts and no
  scoped `release-v050-*`, stale v0.5.0 label, or preview availability claim.
- Confirm historical v0.5.0 changelog content remains outside the supplement.
- Confirm links, console health, responsive layout, and no horizontal overflow.
- Store screenshots and a bounded DOM receipt under
  `/private/tmp/mdkg-goal73-current-release/`.

# Files Affected

- Local build output and ignored temporary Chrome artifacts only; do not change
  source merely to record validation.

# Implementation Notes

- Invoke the `chrome:control-chrome` plugin skill explicitly.
- Scope stale v0.5.0 absence checks to the supplement so valid historical
  changelog content does not create a false failure.

# Test Plan

`test-456` is the blocking local route and responsive contract.

# Links / Artifacts

- `test-455`
- `test-456`
- `edd-78`
