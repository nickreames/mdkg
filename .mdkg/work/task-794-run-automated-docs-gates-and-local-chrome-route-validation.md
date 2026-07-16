---
id: task-794
type: task
title: Run automated docs gates and local Chrome route validation
status: done
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

# Results / Evidence

- `npm run test` passed all 658 compiled tests plus the 18-test public-release
  and security-remediation suite.
- Release-note generation/check, docs checks/build, docs smoke, full and
  changed-only mdkg validation, and `git diff --check` passed; mdkg validation
  reported zero warnings and zero errors.
- Chrome validated Install, Changelog, and Generated CLI Reference at
  `1440x900` and `390x844`. Every route rendered one `release-current-*`
  supplement with generated `v0.5.2` facts, no stale scoped v0.5.0 marker,
  no draft-only claim, no document overflow, and no console errors.
- Historical v0.5.0 changelog content remained visible outside the supplement.
- DOM receipt: `/private/tmp/mdkg-goal73-current-release/local-dom-receipt.json`.
  Six route/viewport screenshots are stored beside it as
  `local-{install,changelog,reference}-{desktop,mobile}.png`.

# Links / Artifacts

- `test-455`
- `test-456`
- `edd-78`
