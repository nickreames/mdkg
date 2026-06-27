---
id: chk-316
type: checkpoint
title: mdkg 0.4.0 npm postpublish validation passed
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-0.4.0-postpublish.g9HJiz, /private/tmp/mdkg-0.4.0-workspace.wNjwcV]
relates: [task-615]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-615]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Validated the published `mdkg@0.4.0` package from npm.

The registry reports `0.4.0` as latest, a clean temp global install reports
`0.4.0`, and a temp workspace exercised init, index, status, validate,
canonical manifest creation, skill sync, custom skill mirror targets, and
upgrade apply from the published package.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `task-615` closed as done.
- Temp install and temp workspace evidence recorded.

## Boundaries

- in scope: npm registry/dist-tag validation, temp global install, temp
  workspace published-package probes.
- out of scope: Vercel deploy, git tag, DNS, analytics, Chrome live production
  validation, and final launch closeout.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- npm postpublish validation is sufficient to unblock Vercel deployment
  planning, but not sufficient to deploy without separate approval.

# Implementation Summary

The published package behaves as expected from clean temp environments and can
serve as the package baseline for the website/docs deployment lane.

# Implementation Details

- Code or graph surfaces changed: mdkg evidence only.
- Architecture or data-shape notes: temp workspace used the installed binary at
  `/private/tmp/mdkg-0.4.0-postpublish.g9HJiz/bin/mdkg`.
- Compatibility notes: `COLLABORATION.md`, legacy `HUMAN.md`, canonical
  `MANIFEST.md`, custom skill mirrors, and preserved customization overlays were
  verified from the published package.

# Verification / Testing

## Command Evidence

- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result: `0.4.0`.
- command: `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
- result: `latest` is `0.4.0`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-postpublish-cache npm install -g mdkg@latest --prefix /private/tmp/mdkg-0.4.0-postpublish.g9HJiz --registry=https://registry.npmjs.org/`
- result: pass.
- command: `/private/tmp/mdkg-0.4.0-postpublish.g9HJiz/bin/mdkg --version`
- result: `0.4.0`.
- command: `mdkg init --agent` in `/private/tmp/mdkg-0.4.0-workspace.wNjwcV`
- result: pass; 68 files created, agent bootstrap and 10 skill mirror
  operations reported.
- command: `mdkg index`, `mdkg status --json`, `mdkg validate --json`
- result: pass; status `ok`, graph count 11, validation warning count 0.
- command: `mdkg new manifest "published package postpublish probe" --id capability.postpublish-probe --json`
- result: pass; created canonical `MANIFEST.md`.
- command: `mdkg skill sync --json` after adding `.custom-agent/skills`
- result: pass; 15 synced across 3 targets.
- command: `mdkg upgrade --apply --json` after adding the custom mirror target
- result: pass; safe to apply, customization overlay preserved.
- assertions: custom mirror skill file exists; `COLLABORATION.md` and legacy
  `HUMAN.md` exist; canonical probe `MANIFEST.md` exists.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: first temp `status --json` before indexing reported missing caches;
  this was expected post-init state and resolved by `mdkg index`.

# Known Issues / Follow-ups

- `task-616` remains blocked on explicit Vercel deployment approval.
- `task-617` remains blocked on post-deploy Chrome live validation.

## Follow-up Refs

- `test-318`
- `task-616`
- `task-617`
- `test-319`
- `test-320`

# Links / Artifacts

- temp global install prefix: `/private/tmp/mdkg-0.4.0-postpublish.g9HJiz`
- temp workspace: `/private/tmp/mdkg-0.4.0-workspace.wNjwcV`
- npm package: `https://www.npmjs.com/package/mdkg/v/0.4.0`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
