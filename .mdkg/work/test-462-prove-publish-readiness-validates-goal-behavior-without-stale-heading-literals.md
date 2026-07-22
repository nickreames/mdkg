---
id: test-462
type: test
title: prove publish readiness validates goal behavior without stale heading literals
status: done
priority: 0
tags: [audit-followup, release, skills, test]
owners: [root]
links: []
artifacts: []
relates: [loop-7, task-802]
blocked_by: [task-802]
blocks: []
refs: [loop-7, spike-32, test-461, chk-541, chk-542, task-802]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-17
updated: 2026-07-21
---
# Overview

Prove the P0 repair in `root:task-802` validates portable goal-pursuit behavior
without coupling publication to a prose heading.

# Target / Scope

- `scripts/assert-publish-ready.js`
- canonical/public/built `pursue-mdkg-goal` projections
- local package pack consumers and the `ci:release` gate

# Preconditions / Environment

- `root:task-802` is done.
- Node 24 satisfies the package engine; npm is forced offline for pack smokes.
- Tests use temporary skill fixtures and do not mutate canonical skill source.

# Test Cases

- A semantically complete fixture passes after renaming or moving its headings.
- Removing explicit-QID routing, `mdkg goal next`, ownership, checkpoint,
  evaluation, or conditional-done behavior fails with an identity-specific
  message.
- Canonical/public/dist projection checks pass under the declared policy.
- `npm run test:public-release`, `node scripts/assert-publish-ready.js`,
  `npm run smoke:consumer`, `npm run smoke:git-materialize`, and
  `npm run ci:release` pass once.
- Final Git checks prove no unintended tracked output.

# Results / Evidence

Verified on Node 24.18.0 with exit 0 for every required gate:

- `node --test tests/publish-readiness-goal-contract.test.mjs`: eight focused
  cases pass, including heading-insensitivity, one precise failure per behavior
  identity, and canonical-skill coverage.
- `npm run test:public-release`: 26/26 tests pass in 95.997 ms of reported test
  duration.
- `node scripts/assert-publish-ready.js`: `publish readiness ok`.
- `npm run smoke:consumer`: packaged consumer smoke passes for 0.5.2.
- `npm run smoke:git-materialize`: packed-consumer acceptance, commit-mismatch,
  and clone-compatibility cases pass.
- `npm run ci:release`: the 658-test compiled suite passes in 83.129 seconds;
  public-release, CLI, docs, security, materialization, loop, and readiness
  gates also pass.
- Diagnostic `npm run prepublishOnly`: exits 0 after the complete smoke matrix,
  ending with `smoke:goal ok` and `publish readiness ok`. This proves the repair
  does not leave the previously observed pack-time failure; it does not publish
  the package or transfer the independent authority of `root:task-803` and
  `root:test-463`.
- Canonical, Codex mirror, Claude mirror, public seed, and built public seed are
  byte-identical at SHA-256
  `3b8493ee443a289ba257ed0e30045be84e9b647ef7ebfd88782319382f489776`.
- `git diff --check` passes, and the worktree contains no changed skill content,
  dependency, lockfile, package version, workflow, tag, release, or publication
  surface.

# Notes / Follow-ups

- Do not require full `prepublishOnly` here; its independent determinism work is
  owned by `root:task-803` and `root:test-463`.
