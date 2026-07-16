---
id: test-460
type: test
title: Validate release isolation protected paths and local only closeout
status: done
priority: 1
epic: epic-254
tags: [release-authority, protected-paths, local-only, deterministic]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: []
relates: [goal-74, goal-75, task-799, task-800]
blocked_by: [task-799, task-800]
blocks: []
refs: [goal-74, goal-75, task-799, task-800, edd-79, dec-85]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: []
cases: []
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Prove package release authority remains local and paused while all protected
functional, package, template, and pre-existing semantic surfaces remain
unchanged from the approved baseline.

# Target / Scope

- Local release skill, registry, configured mirrors, and paused `goal-75`.
- Public default seed directory.
- Baseline-to-commit changed paths and pre-existing graph nodes.

# Preconditions / Environment

Use approved baseline
`c8fd346392a247eb8affe65cf84cd4809d717c60` and review both working and staged
diffs before the local commit.

# Test Cases

- Validate `release-mdkg-package` and exact configured mirror equality.
- Assert no `assets/init/skills/default/release-mdkg-package` path or public
  default reference exists.
- Assert `goal-75` is paused and current approval is absent.
- Assert no changed path under functional source, scripts, tests, package/lock,
  dependency, generated-contract, fixture, non-skill template, archive, bundle,
  subgraph, or existing release-node surfaces.
- Assert every modified `.mdkg/work` or `.mdkg/design` node is newly added.
- Run `git diff --check`, review cached paths, create one local commit, and
  verify no push or publication command was run.

# Results / Evidence

- `mdkg skill validate release-mdkg-package --json`: 1 checked, 0 warnings, 0
  errors; canonical and both configured mirrors are exact matches.
- Public defaults contain neither a release skill directory nor a
  `release-mdkg-package` reference.
- `mdkg goal show root:goal-75 --json` reports `goal_state: paused`, no current
  publication approval, and no release scope nodes.
- Baseline path assertions found no changes under functional source, scripts,
  tests, package or lock metadata, dependencies, `.mdkg/templates`, or
  non-skill `assets/init` paths.
- No pre-existing `.mdkg/work` or `.mdkg/design` semantic file changed; every
  semantic node in this lane is newly added.
- `mdkg validate --changed-only --json` and bounded full validation both passed
  with 0 warnings and 0 errors; `git diff --check` passed.
- Before the local closeout commit, `HEAD...origin/main` remained `0 0` and
  selected achieved `root:goal-73` remained unchanged.
- Final cached-path review and the local-only commit/no-push receipt are
  performed at the goal boundary after this test status is recorded.

# Notes / Follow-ups

- Resume `goal-75` only under a future explicit release request and current
  approval.
