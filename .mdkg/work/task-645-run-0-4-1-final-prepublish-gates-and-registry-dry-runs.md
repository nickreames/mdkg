---
id: task-645
type: task
title: run 0.4.1 final prepublish gates and registry dry-runs
status: done
priority: 1
parent: goal-50
tags: [0.4.1, npm, prepublish, registry, dry-run]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-646]
refs: [goal-49, test-335, test-337, task-636, task-649]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Run final local, registry, npm pack, and npm publish dry-run gates for
`mdkg@0.4.1` after implementation readiness is proven.

# Acceptance Criteria

- `test-335` is done and records implementation publish-readiness.
- `test-337` is done and records that publish-bound public naming is generic.
- Git freshness, ahead commits, release diff, package version, changelog, docs,
  generated references, and package metadata are audited.
- Public package/docs/readiness claims do not present downstream product names
  or runtime policy as mdkg public behavior.
- Remote Git/project-memory primitive claims are out of scope for this
  prepublish gate unless referenced only as deferred generic successor planning.
- Full prepublish suite passes or exact gaps are recorded.
- Registry latest is below `0.4.1` and `mdkg@0.4.1` is unpublished.
- Npm pack dry-run and publish dry-run pass with isolated cache.
- Real publish is not attempted in this task.

# Files Affected

- mdkg checkpoint/evidence only unless gaps require a later implementation
  follow-up.

# Implementation Notes

- If package version is not `0.4.1`, stop and record a blocker.
- If registry state shows `0.4.1` already published, stop and record a blocker
  rather than publishing over it.

# Test Plan

- `git fetch origin main`
- `git status --short --branch`
- `git log --oneline origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- targeted public naming audit from `test-337`
- `npm ci`
- full package/docs/CLI/smoke gate suite
- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg@0.4.1 version --registry=https://registry.npmjs.org/`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`

# Links / Artifacts

- `test-335`
- `test-337`
- `task-636`
