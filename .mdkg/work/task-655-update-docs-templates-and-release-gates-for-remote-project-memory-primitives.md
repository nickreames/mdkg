---
id: task-655
type: task
title: update docs templates and release gates for remote project-memory primitives
status: done
priority: 1
parent: goal-52
tags: [remote-git, docs, templates, release-gates, credential-safety]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-653, task-654, task-656]
blocks: [test-339, test-340]
refs: [goal-51, goal-53, task-650, test-338, dec-61, dec-62, dec-63, dec-64, edd-62, edd-63, edd-64]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-05
---
# Overview

Update public and init-facing surfaces after implementation behavior is proven,
then run release gates for the generic remote Git/project-memory capability.

# Acceptance Criteria

- README, CLI command matrix, generated command docs, docs site source,
  templates/init assets, examples/fixtures, changelog, and release notes are
  updated as needed.
- Public wording uses generic names and does not imply downstream runtime
  policy.
- Examples use opaque access refs, policy refs, and hashes, never credentials.
- Docs explain `mdkg git` as the low-level command family for clone, fetch,
  inspect, closeout, push readiness, and explicit-authority push.
- Docs state that project-memory semantic queries are deferred to `goal-53`.
- Release gates include build, test, CLI, docs, mdkg validation, pack dry-run,
  public naming audit, push-readiness boundary audit, and credential-safety
  audit.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `docs/**`
- `assets/init/**`
- `.mdkg/templates/**`
- examples/fixtures
- `CHANGELOG.md`
- generated docs after source docs are updated

# Implementation Notes

- Update generated surfaces through repo scripts, not manual drift.
- Real npm publish remains a separate approval-gated release goal.

# Test Plan

- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `node dist/cli.js validate --json`
- `npm pack --dry-run --json`

# Links / Artifacts

- `test-339`
- `test-340`
- `goal-52`
- `goal-53`
