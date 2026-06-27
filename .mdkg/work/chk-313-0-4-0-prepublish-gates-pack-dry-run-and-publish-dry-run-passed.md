---
id: chk-313
type: checkpoint
title: 0.4.0 prepublish gates pack dry run and publish dry run passed
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-613]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-613]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Completed the `mdkg@0.4.0` prepublish gate through npm pack dry-run and npm
publish dry-run. The package is locally publish-ready pending explicit approval
for the real publish node.

No real npm publish, git push, tag, Vercel deploy, DNS change, analytics change,
or provider mutation occurred.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `task-613` closed as done.
- Local command receipts proved package, docs, graph, website, registry, pack,
  publish dry-run, and auth preflight health.

## Boundaries

- in scope: local `0.4.0` prepublish gates, registry availability checks, pack
  dry-run, publish dry-run, and npm auth preflight.
- out of scope: real npm publish, git push, git tag, Vercel deploy, live Chrome
  validation, DNS, analytics, and any provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Real publish remains blocked on `task-614` and explicit approval.
- Website/Vercel/Chrome live proof remains blocked until after npm publish and
  separate deploy approval.

# Implementation Summary

The full local prepublish path completed for `mdkg@0.4.0`. Registry checks
showed npm latest is still `0.3.9` and `mdkg@0.4.0` is unpublished, so the real
publish gate can open only after explicit approval.

# Implementation Details

- Code or graph surfaces changed: mdkg evidence only for this closeout.
- Architecture or data-shape notes: none.
- Compatibility notes: MANIFEST/SPEC compatibility assets remain present in the
  tarball; full mdkg validation still reports the accepted legacy SPEC warning.

# Verification / Testing

## Command Evidence

- command: `git fetch origin main`
- result: pass.
- command: `git status --short --branch`
- result: `main...origin/main [ahead 13]` with local 0.4.0 release-prep and
  graph changes.
- command: `git rev-list --left-right --count origin/main...HEAD`
- result: `0 13`.
- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result: `0.3.9`.
- command: `npm view mdkg@0.4.0 version --registry=https://registry.npmjs.org/`
- result: expected npm 404; `0.4.0` is unpublished.
- command: `npm ci`
- result: pass; 0 vulnerabilities reported.
- command: `npm run test`
- result: pass; 528 tests passed.
- command: `npm run cli:check`
- result: pass.
- command: `npm run cli:contract`
- result: pass; contract hash
  `35018c8d8e9827545d061882bc55ea42d3bdbfff1224ab6414aa8e53a443e4a0`.
- command: `npm run docs:check`
- result: pass; 402 checked examples, 0 failures.
- command: `node scripts/assert-publish-ready.js`
- result: pass.
- command: `npm run smoke:demo-graph`
- result: pass.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- result: pass; package `mdkg@0.4.0`, filename `mdkg-0.4.0.tgz`, 176 files,
  package size about 341.6 kB, unpacked size about 1.8 MB.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- result: pass; dry-run reported `+ mdkg@0.4.0`.
- command: `npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- result: pass as `nickreames`; token value was not printed.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: full graph validation has the accepted legacy `SPEC.md`
  compatibility warning.

# Known Issues / Follow-ups

- `task-614` must perform the real `mdkg@0.4.0` npm publish only after explicit
  approval.
- `task-615` must validate registry state and temp install after publish.
- `task-616` and `task-617` must handle Vercel deploy/currentness and Chrome
  live validation after separate approval.

## Follow-up Refs

- `task-614`
- `task-615`
- `task-616`
- `task-617`
- `test-318`
- `test-319`
- `test-320`

# Links / Artifacts

- Pack dry-run tarball: `mdkg-0.4.0.tgz`
- npm auth userconfig path: `/private/tmp/mdkg-npm-publish.npmrc`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
