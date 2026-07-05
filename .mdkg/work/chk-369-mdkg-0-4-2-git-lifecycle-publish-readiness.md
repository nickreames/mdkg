---
id: chk-369
type: checkpoint
title: mdkg 0.4.2 git lifecycle publish readiness
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [chk-362, chk-363, chk-364, chk-365, chk-366, chk-367, chk-368]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-52, task-651, task-653, task-654, task-656, task-655, test-339, test-340]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

`goal-52` is complete for the prepublish lane. `mdkg@0.4.2` implements
low-level `mdkg git` remote lifecycle primitives and has passed local package
publish-readiness gates, including npm pack and npm publish dry-run. No real
npm publish, git push, tag, provider mutation, or downstream repo mutation was
performed.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `src/commands/git.ts`
- `src/cli.ts`
- `src/util/argparse.ts`
- `tests/commands/git.test.ts`
- `package.json` and `package-lock.json` bumped to `0.4.2`
- `CHANGELOG.md`, `README.md`, `CLI_COMMAND_MATRIX.md`
- generated command contract/docs/release notes
- docs source and mirrored docs pages
- `mdkg-dev/src/pages/index.astro`
- `goal-52` scoped tasks/tests and checkpoints

## Boundaries

- in scope: implementation, docs, generated references, changelog, package
  metadata, prepublish gates, registry checks, pack dry-run, and publish
  dry-run
- out of scope: real npm publish, git push, tag push, Vercel/provider
  deployment, DNS, and downstream runtime mutation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes

# Decisions Captured

- `dec-61`
- `dec-62`
- `dec-63`
- `dec-64`
- `edd-62`
- `edd-63`
- `edd-64`

# Implementation Summary

The `mdkg git` command family now supports `inspect`, `clone`, `fetch`,
`closeout`, `push-ready`, and `push`. The implementation uses the system Git
CLI, keeps Git auth external, rejects embedded credential URLs, and writes
refs-first receipts. Closeout writes static JSON/Markdown receipts and sealed
DB snapshot evidence when project DB state exists.

# Goal Closeout

- Goal condition result: achieved for the implementation and prepublish-gate
  lane.
- Scoped nodes closed: `task-651`, `task-653`, `task-654`, `task-656`,
  `task-655`, `test-339`, and `test-340`.
- Remaining deferred work: `goal-53` owns project-memory semantic query design;
  real `mdkg@0.4.2` publish requires explicit approval.

# Verification / Testing

## Command Evidence

- command: `npm run build && npm run build:test && node --test dist/tests/commands/git.test.js`
- result: focused Git lifecycle tests passed, 6 tests total
- command: `npm run test`
- result: full suite passed, 541 tests total
- command: `npm run cli:check`
- result: passed
- command: `npm run cli:contract`
- result: passed with contract hash
  `b6ce5590f19cd90b00820a9488c5773f2824c6525730d83d5f32d6e04612327c`
- command: `npm run docs:check`
- result: generated docs, release notes data, and docs command examples passed
- command: `node scripts/assert-publish-ready.js`
- result: publish readiness passed
- command: `node dist/cli.js validate --changed-only --json`
- result: ok true, 0 warnings, 0 errors
- command: `node dist/cli.js validate --summary --limit 20 --json`
- result: ok true, 0 warnings, 0 errors
- command: `npm pack --dry-run --json`
- result: produced `mdkg-0.4.2.tgz`, 177 files, including
  `dist/commands/git.js`
- command: `npm view mdkg version --registry=https://registry.npmjs.org/`
- result: `0.4.1` before publish
- command: `npm view mdkg@0.4.2 version --registry=https://registry.npmjs.org/`
- result: expected npm 404/unpublished state before publish
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- result: passed; npm reported dry-run publish of `mdkg@0.4.2`

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none

# Known Issues / Follow-ups

- Real publish, push, and tag operations remain explicit-approval work.
- `goal-53` remains the design lane for project-memory semantic queries.

## Follow-up Refs

- `goal-53`

# Links / Artifacts

- implementation commit: `86c49534`
- graph alignment commit: `460666fb`

# Raw Content Safety

- Evidence is summarized through command names, refs, hashes, and file paths.
  Raw credentials, provider payloads, raw prompts, queue bodies, and bulky
  execution traces are excluded.
