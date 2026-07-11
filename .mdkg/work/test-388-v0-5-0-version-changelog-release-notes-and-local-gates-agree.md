---
id: test-388
type: test
title: v0.5.0 version changelog release notes and local gates agree
status: done
priority: 1
epic: epic-232
tags: [release, version, changelog, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-64, task-716, task-717]
blocked_by: [task-717]
blocks: []
refs: [task-716, task-717]
context_refs: [goal-64, epic-232, edd-72, dec-69]
evidence_refs: [chk-494, chk-495]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Prove the v0.5.0 candidate is internally consistent and locally releasable before
external approval or mutation.

# Target / Scope

Version/lock/changelog/generated docs/sites, full gates, tarball, upgrade, previews.

# Preconditions / Environment

Clean release commit candidate, temporary npm cache, local site servers/browser.

# Test Cases

- Scan all visible version and release-note surfaces for 0.5.0 parity.
- Map every publish-bound change to release notes or explicit classification.
- Run full package/graph/docs/site/smoke/pack/publish dry-run ladder.
- Prove public activation remains dormant in committed source.

# Results / Evidence

- Package, lockfile, README, command matrix, changelog, generated CLI/docs data,
  and the shared release manifest agree on target `0.5.0`; committed public
  release state remains `draft`.
- `npm ci`, 585 tests, CLI contract, docs checks, root graph validation, all
  installed-package smokes, seven loop seeds, site builds, accessibility,
  performance, demo graphs, SQLite, parallel behavior, `npm pack`, and the full
  `npm publish --dry-run` lifecycle passed.
- Final tarball SHA-1:
  `ed5069631bb24bc4fd3658cefbb4683c4998c88a`; integrity:
  `sha512-83sX8Dm0fQWs6EJpG7YdF9fZmigM20qxnnmfwEsC5jZwB9ofjFphsPUu2QAA34VjirJLLi8zydpeXdxSzAPwrw==`.
- Isolated tarball install resolved `mdkg --version` to `0.5.0`; installed
  consumer and upgrade behavior were also exercised by the final package smoke
  matrix.
- Draft builds omit dormant loop routes and unpublished version metadata.
  Active local previews remain unavailable to indexing and passed the release
  route/content/leak contract.
- Current marketing desktop/mobile Browser checks passed. Goal 63's committed
  docs screenshots plus current automated docs checks cover the unchanged docs
  layout; the operator retained final manual visual review.
- Three failures discovered by prepublish validation were repaired and rerun in
  one final uninterrupted green lifecycle. No release mutation occurred.
- A later manual route check added 19-page active-preview accessibility/link
  coverage and corrected the demo smoke so repeated prepublish runs do not
  rewrite committed index timestamps. `chk-495` records the focused checks and
  final uninterrupted full rerun evidence.

# Notes / Follow-ups

- Any local failure blocks the approval request.
- External registry/auth/advisory/security gates and all release mutations remain
  owned by `task-718` and later tasks.
