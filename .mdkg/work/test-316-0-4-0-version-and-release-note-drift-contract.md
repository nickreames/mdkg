---
id: test-316
type: test
title: 0.4.0 version and release note drift contract
status: done
priority: 1
epic: epic-202
parent: goal-42
tags: [0.4.0, version-drift, changelog, release-notes, docs, test]
owners: []
links: []
artifacts: [package.json, package-lock.json, CHANGELOG.md, docs/_generated/release-notes.json, docs/_generated/cli-reference.md, docs/_generated/command-contract-summary.json, docs/src/content/docs/project/changelog.md, docs/project/changelog.md, mdkg-dev/src/pages/index.astro]
relates: []
blocked_by: [task-612]
blocks: [task-613, task-606, test-312]
refs: [task-612, task-606, test-312, chk-311]
context_refs: []
evidence_refs: [chk-312]
aliases: []
skills: []
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate that all local release metadata has moved from the prepublish `0.3.9`
state to a coherent `0.4.0` release target.

# Target / Scope

`task-612`, package metadata, `CHANGELOG.md`, generated docs/release notes,
docs changelog pages, mdkg.dev structured metadata, and public launch copy.

# Preconditions / Environment

`task-612` has run, generated files are refreshed, and no npm publish or Vercel
deployment side effect is required for this test.

# Test Cases

- `package.json` and `package-lock.json` both report `0.4.0`.
- `CHANGELOG.md` has a dated `0.4.0` section with every publish-bound change
  mapped from `v0.3.9..HEAD`.
- Generated release-note data and CLI reference show the same `0.4.0` package
  version target.
- `docs.mdkg.dev` source has a `0.4.0` release/changelog entry or a deliberate
  prepublish state that blocks launch readiness.
- `mdkg-dev` structured `softwareVersion` and visible version copy are aligned
  with source state and do not imply live npm publication before `task-615`.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Failure blocks all npm dry-run, publish, closeout, and launch proof nodes.
