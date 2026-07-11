---
id: test-400
type: test
title: Clean committed release candidate baseline precedes Goal 62 activation
status: done
priority: 1
prev: task-729
next: task-710
tags: [release, baseline, git, contract]
owners: []
links: []
artifacts: [commit:f28b1f74, commit:a4e17899, package:0.4.2]
relates: [goal-56, goal-61, goal-62, task-729]
blocked_by: [task-729]
blocks: [goal-62, task-710]
refs: [task-729, chk-382, chk-426, chk-427, goal-62, task-710]
context_refs: [goal-56, goal-61, goal-62, dec-73]
evidence_refs: []
aliases: []
skills: []
cases: [clean-worktree, two-local-commits, version-ownership, no-external-side-effects]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove Goal 62 starts from a clean, committed, locally verified release-candidate
baseline rather than relying on a broad dirty-worktree diff.

# Target / Scope

`task-729`; completed Goal 56 and Goal 61 changes, local commits, package
version ownership, and external-side-effect boundaries.

# Preconditions / Environment

Completed `task-729`, its checkpoint, and the local branch containing both
baseline commits without push or tag side effects.

# Test Cases

- Verify the two required commit subjects and record their exact SHAs.
- Verify each commit contains only reviewed Goal 56 or loop/release-program work
  and the combined tree matches the validated release candidate.
- Verify `git status --short --branch` is clean apart from branch tracking state.
- Verify `package.json` is still `0.4.2` and Goal 64 still owns the release bump.
- Verify no tag, push, publish, deployment, global replacement, or activation
  occurred.
- Verify graph validation and `git diff --check` pass from the committed tree.
- Only after this test is done may `goal-62` and `task-710` have this blocker
  removed and Goal 62 be explicitly activated.

# Results / Evidence

Pending `task-729` and its baseline checkpoint.

# Notes / Follow-ups

- A failed or ambiguous scope review keeps Goal 62 paused.
- This test verifies the baseline; it does not activate Goal 62 itself.
- Current `mdkg goal activate` does not hard-enforce goal `blocked_by`; the
  operator must not activate Goal 62 until this test passes and the blocker is
  explicitly removed.
