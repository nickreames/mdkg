---
id: test-462
type: test
title: prove publish readiness validates goal behavior without stale heading literals
status: backlog
priority: 0
tags: [audit-followup, release, skills, test]
owners: []
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
updated: 2026-07-17
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

Record command, duration, runtime, exit, and projection hashes in a test-proof
checkpoint linked to `root:task-802` and `root:loop-7`.

# Notes / Follow-ups

- Do not require full `prepublishOnly` here; its independent determinism work is
  owned by `root:task-803` and `root:test-463`.
