---
id: test-397
type: test
title: Graph target rejects symlink escape before writes
status: done
priority: 1
parent: loop-5
tags: [security, path, symlink, regression]
owners: []
links: []
artifacts: []
relates: [loop-5, task-726, goal-61]
blocked_by: []
blocks: []
refs: [loop-5, task-726, goal-61]
context_refs: [spike-30]
evidence_refs: [spike-30]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove that graph write commands cannot follow a target symlink or symlinked ancestor outside the configured root. This is the regression contract for the validated containment escape from `spike-30`.

# Target / Scope

- `task-726`
- Graph clone and fork target resolution
- Destination write containment and compatible valid-target behavior

# Preconditions / Environment

Use temporary repositories with an empty outside directory. Create symlinks only inside the temporary test root and assert both command diagnostics and outside-directory contents.

# Test Cases

- Reject an existing target path that is itself a symlink to an outside directory.
- Reject a target beneath an in-root ancestor symlink to an outside directory.
- Accept an absent in-root target and an existing real in-root directory.
- Cover every graph write mode that uses the shared resolver.
- Verify rejected commands create no files in the outside destination.

# Results / Evidence

Pre-fix evidence: the bounded `graph clone` reproduction exited successfully and wrote through `clones/demo` into an outside directory. Post-fix evidence must invert both conditions: non-zero/rejected operation and an unchanged outside directory.

# Notes / Follow-ups

- Keep the test local and deterministic; no network clone is required.
- If a platform cannot create symlinks, skip only with an explicit platform reason rather than silently weakening the suite.
