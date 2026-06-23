---
id: chk-188
type: checkpoint
title: mdkg.dev docs and generated reference proof accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [mdkg-dev, docs, generated-reference, command-contract, goal-25]
owners: []
links: []
artifacts: []
relates: [task-447, task-448]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-447, task-448, edd-22, edd-24, edd-27, dec-31]
evidence_refs: []
aliases: []
skills: []
scope: [task-448]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The repo now has a GitBook-ready docs source scaffold plus deterministic generated CLI reference docs. `/docs` contains navigation, start-here pages, concepts, guides, advanced alpha, reference, project pages, generated reference outputs, and preserved historical docs. `scripts/generate-docs-reference.js` derives command docs from `dist/command-contract.json`, and `npm run docs:check` fails when generated docs drift.

# Scope Covered

- task-447: GitBook-ready docs source scaffold.
- task-448: command-contract-to-docs generation and drift checks.

## Changed Surfaces

- `docs/README.md`
- `docs/SUMMARY.md`
- `docs/start-here/*`
- `docs/concepts/*`
- `docs/guides/*`
- `docs/advanced-alpha/*`
- `docs/reference/*`
- `docs/project/*`
- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`
- `scripts/generate-docs-reference.js`
- `package.json`
- `.mdkg/work/task-447-*`
- `.mdkg/work/task-448-*`
- `.mdkg/work/chk-188-*`

## Boundaries

- in scope: repo-owned docs source, docs navigation, command-reference generation, docs drift check.
- out of scope: GitBook production config, custom domain, generated website reference pages, final public copy, examples, Vercel deploy, analytics activation, npm publish, tag, push, and public launch.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- GitBook remains a renderer/sync target; repo files remain canonical.
- Existing historical docs were preserved.
- Local absolute paths in preserved historical docs were sanitized before `/docs` becomes public source.
- Generated command reference output lives under `docs/_generated/`.
- `CLI_COMMAND_MATRIX.md` remains useful repo-local inventory, but public reference docs now have a generated path from the command contract.

# Implementation Summary

The docs tree now has an IA that matches the planning bundle: Start Here, Concepts, Guides, Advanced Alpha, Reference, and Project. The command reference generator writes a Markdown reference plus JSON summary with command counts, categories, output formats, danger level, side effects, read/write paths, dry-run support, lock policy, atomic policy, receipts, usage, and common flags.

# Implementation Details

- Code or graph surfaces changed: docs tree, generator script, npm scripts, mdkg task/checkpoint nodes.
- Architecture or data-shape notes: generated docs carry the `dist/command-contract.json` source marker and command contract hash.
- Compatibility notes: `npm run docs:generate` and `npm run docs:check` both run the root build first so the command contract is fresh.

# Verification / Testing

## Command Evidence

- command: `find docs -maxdepth 3 -type f -print | sort`
  result: confirmed docs inventory including preserved historical docs and generated docs.
- command: `rg -n "/Users/nick|PRIVATE KEY|AKIA|BEGIN RSA|npm_[A-Za-z0-9]" docs mdkg-dev/src mdkg-dev/DESIGN.md mdkg-dev/public scripts/generate-docs-reference.js`
  result: no matches.
- command: `npm run docs:generate`
  result: generated `docs/_generated/cli-reference.md` and `docs/_generated/command-contract-summary.json`.
- command: `npm run docs:check`
  result: passed.
- command: `npm run cli:contract`
  result: passed after rerunning sequentially.
- command: `npm run smoke:command-docs`
  result: passed; packed temp smoke reported command count 98.
- command: `node dist/cli.js validate --summary --json --limit 20`
  result: graph valid; stale-cache warning appears until index refresh after graph edits.
- command: `git diff --check`
  result: passed.

## Pass / Fail Status

- status: pass for docs source plus generated reference proof.

## Known Warnings

- warning: running multiple `npm run build` commands in parallel can race on `dist/` cleanup/copy. The first parallel `cli:contract` and `docs:check` attempt failed because of that local race, then both passed when rerun sequentially. Do not treat the parallel failure as a product regression.

# Known Issues / Follow-ups

- task-449 must expand public copy, claims matrix, metadata, `llms-full.txt`, sitemap/robots quality, and public alpha trust content.
- task-452 must add full docs/site/link/no-secret/SEO smoke automation.
- Generated docs are intentionally broad; future polish can split command families into separate pages.

## Follow-up Refs

- task-449
- task-452
- test-201
- test-202

# Links / Artifacts

- generated markdown: `docs/_generated/cli-reference.md`
- generated summary: `docs/_generated/command-contract-summary.json`
- generator: `scripts/generate-docs-reference.js`
- source command contract: `dist/command-contract.json`

# Raw Content Safety

- Evidence is summarized with command receipts and generated artifact paths. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
