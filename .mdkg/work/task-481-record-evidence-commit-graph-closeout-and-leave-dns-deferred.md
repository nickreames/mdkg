---
id: task-481
type: task
title: record evidence commit graph closeout and leave DNS deferred
status: todo
priority: 1
epic: epic-142
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Record final evidence for the preview implementation and keep public launch work explicitly deferred.

# Acceptance Criteria

- mdkg evidence records preview URLs, Vercel project ids/slugs, deployment ids, validation result, known warnings, and deferred work.
- A final checkpoint confirms no DNS, production promotion, npm publish, git tag, analytics activation, or public launch occurred.
- Closeout graph changes are committed and pushed to `origin/main`.

# Files Affected

List files/directories expected to change.

- `.mdkg/work/goal-28-*`
- final checkpoint

# Implementation Notes

- Use refs and URLs only; never store secrets, cookies, tokens, or private bypass values.

# Test Plan

- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal next goal-28 --json`
- `git status --short --branch`
- `git push origin main`

# Links / Artifacts

- `test-223`
