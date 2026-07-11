---
id: task-729
type: task
title: Establish a clean local v0.5.0 release candidate baseline before Goal 62
status: done
priority: 1
next: test-400
tags: [release, baseline, git, local-only]
owners: []
links: []
artifacts: [commit:f28b1f74, commit:a4e17899]
relates: [goal-56, goal-61, goal-62]
blocked_by: []
blocks: [test-400]
refs: [chk-382, chk-426, test-400]
context_refs: [goal-56, goal-61, goal-62, dec-73]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Create a clean, reviewable local Git baseline for the already verified public
copy and v0.5.0 loop release-candidate work before collaborative Goal 62
planning begins. This task records existing work; it does not add implementation
or release mutations.

# Acceptance Criteria

- Review every tracked and untracked path and identify any unrelated change
  before staging.
- Create local commit `docs: clean public copy across mdkg.dev and docs` for the
  completed Goal 56 work and its evidence.
- Create local commit `feat(loop): add first-class loops and v0.5.0 release
  program` for the verified loop implementation, hardening, and release graph.
- Preserve package version `0.4.2`; `goal-64` continues to own the v0.5.0 bump
  and finalized changelog.
- Perform no push, tag, publish, deployment, global install, or release
  activation.
- Record both commit SHAs, staged scope, checks, and residual warnings in a
  checkpoint, then leave the worktree clean for `test-400`.

# Files Affected

- Git index and local commit history for the already reviewed worktree.
- `.mdkg/work/` for the resulting checkpoint and evidence links.
- No new functional source or public-content edits are allowed.

# Implementation Notes

- Use non-interactive, explicit staging. Do not discard or rewrite user changes.
- Shared generated or graph-index files must be assigned to the commit whose
  final tree they represent; correctness of the clean final tree takes priority
  over cosmetic file grouping.
- If unrelated or unverified work is found, stop and document it rather than
  forcing a clean status.

# Test Plan

- `git status --short --branch`
- `git diff --check`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --json --limit 20`
- `git log -2 --oneline`
- Confirm `package.json` remains `0.4.2` and no tag or remote mutation occurred.
- Run `test-400` before clearing Goal 62's blocker.

# Links / Artifacts

- `goal-56`
- `chk-382`
- `goal-61`
- `chk-426`
- `goal-62`
- `test-400`
