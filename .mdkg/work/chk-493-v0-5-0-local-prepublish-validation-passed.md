---
id: chk-493
type: checkpoint
title: v0.5.0 local prepublish validation passed
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [tarball:///private/tmp/mdkg-v050-final-20260711-1247/mdkg-0.5.0.tgz]
relates: [goal-64, task-717, test-388]
blocked_by: []
blocks: []
refs: [test-388, chk-494, task-718]
context_refs: [goal-64, task-717, test-388]
evidence_refs: [test-388, chk-494]
aliases: []
skills: []
scope: [task-717]
created: 2026-07-11
updated: 2026-07-11
---
# Summary

Full publish dry-run, tarball install, site gates, and local Browser preflight passed; external release actions remain approval-gated.

# Scope Covered

- Completed node: task-717 (Run complete local package graph docs site and tarball preflight)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-717
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Version `0.5.0` is the local release candidate.
- `release/public-release.json` remains `draft`; public sites are not activated.
- No external release action is authorized by this checkpoint and no Git tag is
  planned.

# Implementation Summary

- Finalized package, lockfile, changelog, README, command matrix, generated docs,
  and draft release metadata for `0.5.0`.
- Fixed three regressions discovered by the release gate: incomplete task
  completion checkpoint headings, a stale noindex implementation assertion,
  and missing loop schemas in shipped demo graphs.
- Preserved dormant website state and omitted unpublished `softwareVersion`
  metadata from the canonical draft homepage.

# Verification / Testing

## Command Evidence

- `npm ci --cache /private/tmp/mdkg-npm-cache`: passed; zero reported
  dependency vulnerabilities.
- `npm publish --dry-run --registry=https://registry.npmjs.org/ --cache
  /private/tmp/mdkg-npm-cache`: passed in one uninterrupted final run.
- Final matrix: 577 core tests, 8 release tests, CLI/docs contracts, full graph
  validation, all installed-package smokes, seven loop seeds, site builds,
  accessibility, performance, demos, bundle/clone/MCP/subgraph/visibility,
  SQLite, parallel behavior, goal lifecycle, and publish readiness all passed.
- `npm pack --json --pack-destination
  /private/tmp/mdkg-v050-final-20260711-1247`: passed with 189 files,
  396,982 compressed bytes, and 2,084,856 unpacked bytes.
- Tarball SHA-1: `ed5069631bb24bc4fd3658cefbb4683c4998c88a`.
- Tarball integrity:
  `sha512-83sX8Dm0fQWs6EJpG7YdF9fZmigM20qxnnmfwEsC5jZwB9ofjFphsPUu2QAA34VjirJLLi8zydpeXdxSzAPwrw==`.
- Isolated install at `/private/tmp/mdkg-v050-final-install-20260711-1248`
  resolved `mdkg --version` to `0.5.0`.
- Active local marketing Browser checks passed at 1280x720 and 390x844 with
  one H1, no horizontal overflow, no console warnings, `noindex, nofollow`, the
  loop announcement/CTA, and no unpublished JSON-LD version.
- `node dist/cli.js validate --changed-only --json`, full summary validation,
  and `git diff --check`: passed with zero warnings/errors.

## Pass / Fail Status

- status: done

## Known Warnings

- The docs server is available at `http://127.0.0.1:4322/`, and all automated
  docs route/content/navigation/search/noindex/accessibility/leak checks passed.
  Browser Use blocked a retry after an initial local connection-error page;
  Goal 63's committed desktop/mobile docs screenshots cover the unchanged
  layout, and the operator retained final manual visual review.

# Known Issues / Follow-ups

- Obtain one explicit bounded approval before any external check or mutation.
- Then run npm auth/registry/advisory checks and the repository security scan.
- Only after those pass: first push and CI, npm publication, registry proof,
  real `/opt/homebrew` replacement, activation push, deployment, and live
  production validation.
- Published versions are fixed forward; no Git tag is created by default.

## Follow-up Refs

- `task-718`: capture approval and run external read-only gates.
- `test-389`: verify the single-approval and no-tag contract.
- `goal-64`: continue the two-phase release sequence.

# Links / Artifacts

- `/private/tmp/mdkg-v050-final-20260711-1247/mdkg-0.5.0.tgz`
- `test-388`
- `chk-494`

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
