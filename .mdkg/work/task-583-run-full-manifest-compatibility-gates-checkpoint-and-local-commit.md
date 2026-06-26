---
id: task-583
type: task
title: run full MANIFEST compatibility gates checkpoint and local commit
status: done
priority: 1
epic: epic-198
parent: goal-37
tags: [manifest, verification, release-gates, checkpoint, commit]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54]
context_refs: []
evidence_refs: []
aliases: [manifest-full-gates, manifest-compatibility-closeout, manifest-local-commit]
skills: [verify-close-and-checkpoint]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Run the final compatibility and release-readiness gates for `goal-37`, record
evidence, create a checkpoint, and make one local commit. Do not push.

# Acceptance Criteria

- Focused parser/index/work trigger/scaffold/docs tests pass.
- Full required checks from `goal-37` pass or any failure is recorded with a
  blocking reason.
- `node dist/cli.js validate --json` passes under the repo's current warning
  policy.
- `git diff --check` passes.
- A checkpoint summarizes compatibility behavior, warning text, tests, files
  changed, and downstream follow-up.
- One local commit exists with a message similar to
  `feat(omni): rename SPEC.md to MANIFEST.md with legacy alias`.

# Files Affected

- all implementation, docs, generated, fixture, and graph files changed by
  `goal-37`
- `.mdkg/work/chk-*` closeout checkpoint

# Implementation Notes

- Preserve unrelated dirty worktree changes.
- If pre-existing warnings remain, classify whether they are unrelated and
  accepted or blockers for this goal.
- Do not push, publish, tag, deploy, or mutate downstream repos.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:subgraph`
- `npm run docs:check`
- `node dist/cli.js validate --json`
- `git diff --check`
- `git status --short --branch`

# Links / Artifacts

- `goal-37`
- `test-296`
