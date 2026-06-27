---
id: chk-314
type: checkpoint
title: 0.4.0 package payload and publish dry run contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-317]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-317]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Validated the `0.4.0` package payload and npm publish dry-run contract.

The dry-run tarball contains the expected CLI runtime, init assets, command
contract, generated docs, changelog, seeded skills, MANIFEST/SPEC compatibility
templates, and postinstall script. The publish dry-run succeeded without a real
publish.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `test-317` closed as done.
- Evidence recorded from pack dry-run, publish dry-run, registry checks, and
  no-side-effect boundary review.

## Boundaries

- in scope: payload coverage and publish dry-run proof.
- out of scope: real npm publish, git push, git tag, Vercel deploy, Chrome live
  validation, DNS, analytics, and provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Passing this contract opens `task-614` for an explicit publish approval
  decision; it does not authorize publish by itself.

# Implementation Summary

The npm package artifact is ready for the real-publish approval gate from a
payload and dry-run perspective.

# Test Proof

- Test target: `task-613` package payload and npm publish dry-run.
- Fixtures or temp repos: `/private/tmp/mdkg-npm-cache` for isolated npm cache;
  smoke suites also created temporary repos under `/private/tmp`.
- Coverage gaps: real registry publish, postpublish temp install, Vercel deploy,
  and Chrome live production validation remain later nodes.

# Verification / Testing

## Command Evidence

- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result: `0.3.9`.
- command: `npm view mdkg@0.4.0 version --registry=https://registry.npmjs.org/`
- result: expected npm 404; `0.4.0` is unpublished.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- result: pass; `mdkg@0.4.0`, `mdkg-0.4.0.tgz`, 176 files, shasum
  `7571e07ef5fc671618c5737bdf096a5dc3df1f7b`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- result: pass; npm reported dry-run publish of `mdkg@0.4.0` with tag `latest`.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: accepted legacy `SPEC.md` compatibility warning remains in full mdkg
  validation.

# Known Issues / Follow-ups

- Real publish requires explicit approval in `task-614`.
- Postpublish temp install and live site validation are still required before
  closing `goal-42`.

## Follow-up Refs

- `task-614`
- `task-615`
- `test-318`
- `task-616`
- `test-319`
- `task-617`
- `test-320`

# Links / Artifacts

- `chk-313`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
