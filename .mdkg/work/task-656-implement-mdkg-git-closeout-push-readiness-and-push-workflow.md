---
id: task-656
type: task
title: implement mdkg git closeout push-readiness and push workflow
status: done
priority: 1
parent: goal-52
tags: [0.4.2, git, remote-git, sqlite-closeout, push-readiness, git-push]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-654]
blocks: [task-655, test-340]
refs: [goal-52, dec-63, dec-64, edd-64, edd-62, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Implement the `mdkg git` closeout, push-readiness, and direct push workflow for
generic remote Git lifecycle support.

# Acceptance Criteria

- `mdkg git` can prepare push-readiness evidence for a writable local workspace
  with explicit remote and branch target.
- When project DB or SQLite state participated in the run, closeout produces
  both sealed DB snapshot evidence and static Markdown/JSON receipts before
  push.
- Push readiness requires high validation gates, credential-safety checks,
  explicit external Git auth boundary, staged-change summary, and refs-first
  closeout evidence.
- Direct push to origin is supported through the system Git CLI only after
  push-readiness gates pass.
- Push receipts record refs, commit hashes, validation refs, closeout refs, and
  truncation state without raw credentials, provider payloads, prompts, queue
  bodies, or runtime state roots.

# Files Affected

- source/CLI modules selected during `task-651`
- focused tests and fixtures
- generated docs only after behavior is stable

# Implementation Notes

- Do not infer push authority from a descriptor.
- Do not run live remote pushes in tests; use local temp remotes for automated
  proof.
- Keep downstream runtime adoption out of this goal.

# Test Plan

- local temp git remote push-readiness and push fixture
- missing external auth or missing target failure tests
- SQLite sealed snapshot plus static Markdown/JSON closeout fixture
- credential-safety fixture audit
- `test-340`

# Links / Artifacts

- `dec-63`
- `dec-64`
- `edd-64`
- `test-340`
