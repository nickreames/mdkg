---
id: task-717
type: task
title: Run complete local package graph docs site and tarball preflight
status: done
priority: 1
epic: epic-232
prev: task-716
next: task-718
tags: [release, prepublish, docs, site, tarball]
owners: []
links: []
artifacts: []
relates: [goal-64, test-388]
blocked_by: [task-716]
blocks: [task-718]
refs: [test-388]
context_refs: [goal-64, epic-232, edd-72, dec-69, task-716]
evidence_refs: [chk-493, chk-495]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Run the complete local release ladder and prepare clean release commits before
requesting permission for network checks or external mutations.

# Acceptance Criteria

- Package build/test/CLI contract/docs/graph/loop smoke and publish-readiness pass.
- mdkg.dev and docs builds/smokes pass in dormant and local-active preview modes.
- Npm pack and publish dry-runs pass; tarball contents and isolated install are reviewed.
- Upgrade fixtures, public no-secret scan, responsive Browser preview, and
  `git diff --check` pass.
- Release commit is cleanly separable from the later one-line activation change.

# Files Affected

List files/directories expected to change.

- Entire publish-bound repository diff and local build artifacts
- Temporary tarball/install/browser receipt locations

# Implementation Notes

- Use clean temporary npm cache/userconfig locations and never expose tokens.
- This task performs no push, publish, global replacement, or deployment.

# Test Plan

Complete `test-388` and record one pre-approval checkpoint containing every local
receipt and exact remaining side effects.

# Results / Evidence

- `npm ci --cache /private/tmp/mdkg-npm-cache` completed from a clean install
  with zero reported dependency vulnerabilities.
- The final uninterrupted `npm publish --dry-run
  --registry=https://registry.npmjs.org/ --cache
  /private/tmp/mdkg-npm-cache` lifecycle exited successfully. It covered 577
  core tests, 8 public-release tests, CLI and docs contract checks, full graph
  validation, every installed-package smoke, all seven loop seeds, both sites,
  accessibility, performance, demos, SQLite, parallel behavior, and the final
  publish-readiness assertion.
- The preflight found and fixed three release regressions before the final green
  run: incomplete `task done --checkpoint` headings, a stale site smoke tied to
  pre-projection noindex internals, and shipped demo graphs missing the required
  `loop` schema.
- Final tarball: `/private/tmp/mdkg-v050-final-20260711-1247/mdkg-0.5.0.tgz`.
  It contains 189 files, is 396,982 bytes compressed and 2,084,856 bytes
  unpacked, and has SHA-1
  `ed5069631bb24bc4fd3658cefbb4683c4998c88a` and integrity
  `sha512-83sX8Dm0fQWs6EJpG7YdF9fZmigM20qxnnmfwEsC5jZwB9ofjFphsPUu2QAA34VjirJLLi8zydpeXdxSzAPwrw==`.
- The final tarball installed successfully at
  `/private/tmp/mdkg-v050-final-install-20260711-1248`; its resolved binary
  reported `0.5.0`.
- Current active marketing preview passed 1280x720 and 390x844 Browser checks:
  one H1, no horizontal overflow, no console warnings, loop announcement and
  security CTA present, `noindex, nofollow`, and no unpublished
  `softwareVersion` in JSON-LD.
- Goal 63's committed desktop/mobile docs screenshots remain the visual proof
  for the unchanged security guide layout. The current docs server is available
  at `http://127.0.0.1:4322/`; after an initial refused connection, Browser Use
  blocked retrying the local URL from its generated error page. Automated docs
  route, content, navigation, search, noindex, accessibility, and leak checks
  all passed; the operator is performing the final manual visual audit.
- `git diff --check` passed. No push, publish, global replacement, release
  activation, deployment, or Git tag occurred.
- Post-prepublish manual audit found that the local docs process had stopped,
  not that `/loops/` was absent. All four loop routes returned `200` after the
  active preview restarted. The audit then expanded accessibility/link coverage
  to all preview-only loop pages and moved demo indexing into temporary copies
  so the release lifecycle leaves committed example indexes unchanged. See
  `chk-495` for the final uninterrupted dry-run receipt.

# Remaining Approval-Gated Side Effects

- External npm auth/registry and dependency-advisory checks.
- Repository security scan with any required external access.
- First push and CI observation, npm publication, real `/opt/homebrew` global
  replacement, release activation push, deployment, and production validation.
- No Git tag is authorized or planned.

# Links / Artifacts

- `edd-72`
- `verify-close-and-checkpoint`
