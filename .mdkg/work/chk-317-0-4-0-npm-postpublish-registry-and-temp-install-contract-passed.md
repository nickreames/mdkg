---
id: chk-317
type: checkpoint
title: 0.4.0 npm postpublish registry and temp install contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-0.4.0-postpublish.g9HJiz, /private/tmp/mdkg-0.4.0-workspace.wNjwcV]
relates: [test-318]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-318]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The npm postpublish registry and temp install contract passed for `mdkg@0.4.0`.

The published `latest` package installs from npm, reports version `0.4.0`, and
passes the required clean-workspace behavior probes without relying on local
repo source.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `test-318` closed as done.
- Evidence attached for registry, dist-tags, temp install, and temp workspace.

## Boundaries

- in scope: npm postpublish validation contract.
- out of scope: Vercel deploy, git tag, DNS, analytics, Chrome live production
  validation, and final launch closeout.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Passing this test unblocks `task-616`; it does not authorize Vercel deploy by
  itself.

# Implementation Summary

The npm package is published and validated; website deployment can now safely
claim `mdkg@0.4.0` availability after approved Vercel deployment and live
verification.

# Test Proof

- Test target: `mdkg@0.4.0` npm registry, `latest` dist-tag, installed binary,
  and temp workspace behavior.
- Fixtures or temp repos: `/private/tmp/mdkg-0.4.0-postpublish.g9HJiz` and
  `/private/tmp/mdkg-0.4.0-workspace.wNjwcV`.
- Coverage gaps: Vercel production deployment and Chrome live production
  validation remain later nodes.

# Verification / Testing

## Command Evidence

- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result: `0.4.0`.
- command: `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
- result: `latest` is `0.4.0`.
- command: isolated global install of `mdkg@latest`
- result: pass.
- command: installed `mdkg --version`
- result: `0.4.0`.
- command: temp workspace `init --agent`, `index`, `status --json`,
  `validate --json`, `new manifest`, `skill sync --json`, `upgrade --apply --json`
- result: pass.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: initial temp status before indexing reported missing generated
  caches, then passed after `mdkg index`.

# Known Issues / Follow-ups

- Vercel deploy and Chrome live validation are still required before closing
  `goal-42`.

## Follow-up Refs

- `task-616`
- `test-319`
- `task-617`
- `test-320`

# Links / Artifacts

- `chk-316`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
