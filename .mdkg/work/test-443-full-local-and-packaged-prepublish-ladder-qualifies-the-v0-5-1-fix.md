---
id: test-443
type: test
title: Full local and packaged prepublish ladder qualifies the v0.5.1 fix
status: done
priority: 0
epic: epic-249
tags: [release-readiness, prepublish, package]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-781]
blocks: [task-783]
refs: [goal-70, task-781, task-782]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Qualify the complete Goal 70 worktree and package without performing release
mutations.

# Target / Scope

All required builds, tests, smokes, CLI/docs contracts, graph checks, package
contents, pack/publish dry-runs, and Git hygiene.

# Preconditions / Environment

Package version and lockfile must remain 0.5.0; use isolated npm cache.

# Test Cases

- Every Goal 70 required check passes serially.
- Tarball includes intended runtime/docs artifacts and excludes local evidence.
- No push, publish, tag, global install, deploy, or real-root mutation occurs.

# Results / Evidence

Passed: `npm run prepublishOnly`, explicit publish-readiness assertion, tarball
dry-run, and `npm publish --dry-run` all completed at version 0.5.0. Detailed
evidence and the Goal 71 handoff are recorded in `chk-518`.

# Notes / Follow-ups

- Pass hands one local implementation commit to Goal 71.
