---
id: task-726
type: task
title: Harden graph target writes against symlink containment escape
status: done
priority: 1
parent: loop-5
tags: [security, path, symlink, release-blocker]
owners: []
links: []
artifacts: []
relates: [loop-5, goal-61, spike-30, test-397]
blocked_by: []
blocks: []
refs: [loop-5, goal-61, spike-30, test-397]
context_refs: [spike-30]
evidence_refs: [spike-30]
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prevent graph clone and fork targets from escaping the allowed root through an existing target symlink or a symlinked ancestor. The v0.5.0 security dogfood reproduced a write outside the repository even though the lexical target path remained below the configured root.

# Acceptance Criteria

- Existing target symlinks and symlinked target ancestors are rejected before any target write.
- Existing real directories and absent in-root targets continue to work.
- Clone and fork apply the same containment policy and preserve compatible receipts and diagnostics.
- The implementation documents the remaining filesystem race boundary honestly; it must not claim process-wide TOCTOU elimination.
- `test-397` proves rejection and verifies that no file appears at the outside symlink destination.

# Files Affected

- `src/commands/graph.ts`
- Graph command tests under `tests/commands/`

# Implementation Notes

- Inspect existing path components with `lstat` before creating or writing the target.
- Resolve the nearest existing real ancestor and verify it remains inside the configured graph root.
- Keep archive-entry containment checks intact; this task protects the destination path itself.
- Prefer one shared target-resolution helper so all graph write modes receive the same rule.

# Test Plan

- Run focused graph command tests including direct-target and ancestor-symlink cases.
- Re-run the pre-fix temporary-directory reproduction and verify the command fails before writing outside.
- Run the complete test and release-readiness ladders before closing `goal-61`.

# Links / Artifacts

- Finding and reproduction: `spike-30`
- Regression contract: `test-397`
