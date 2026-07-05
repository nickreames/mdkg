---
id: chk-371
type: checkpoint
title: 0.4.2 generated CLI reference git coverage
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-660]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-660]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

`task-660` is complete locally. The public docs generated CLI reference route
now contains a `Git lifecycle commands` section for `mdkg git`, including
`inspect`, `clone`, `fetch`, `closeout`, `push-ready`, and `push`. The generated
backing reference also now states the system-Git/external-auth boundary for the
`git` command category, and docs smoke coverage fails if the public source page
or generated backing file drops the shipped `mdkg git` command family again.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `docs/src/content/docs/reference/generated-cli-reference.md`
- `scripts/generate-docs-reference.js`
- `docs/_generated/cli-reference.md`
- `scripts/smoke-mdkg-dev-docs.js`
- `task-660` status

## Boundaries

- in scope: docs source, generated docs backing artifact, generator guidance,
  and docs smoke assertions
- out of scope: package runtime behavior, package versioning, npm publish,
  Vercel deployment, DNS, tags, and provider mutation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes

# Decisions Captured

- Kept the Starlight route as a readable public entrypoint instead of dumping
  the full 140KB generated command reference into the route.
- Added focused generated-reference parity checks so future CLI command-family
  additions cannot silently omit the shipped `mdkg git` public surface.

# Implementation Summary

The live-route source now exposes the Git lifecycle command family and the
critical safety boundary text. The generator continues to own the complete
command-contract-derived backing file under `docs/_generated/cli-reference.md`,
and its Git category guidance now mentions system Git with external
authentication.

# Implementation Details

- Code or graph surfaces changed: docs source, docs generator, generated docs
  artifact, smoke coverage, and `task-660`.
- Architecture or data-shape notes: no command contract schema or CLI behavior
  changed.
- Compatibility notes: no package API, CLI runtime, version, or npm payload
  behavior changed beyond docs included in the repo.

# Verification / Testing

## Command Evidence

- command: `npm run docs:generate`
- result: regenerated `docs/_generated/cli-reference.md` and
  `docs/_generated/command-contract-summary.json`
- command: `npm run docs:check`
- result: passed; generated docs, release notes data, and 431 public command
  examples checked with 0 failures
- command: `npm --prefix docs run build`
- result: passed; 28 Starlight pages built including
  `/reference/generated-cli-reference/`
- command: `rg -n "Git lifecycle commands|mdkg git inspect|mdkg git push-ready|authentication stays external|system Git" docs/dist/reference/generated-cli-reference/index.html`
- result: passed; rendered route contains required `mdkg git` markers
- command: `npm run smoke:mdkg-dev-docs`
- result: passed; docs smoke now checks public generated-reference source and
  generated backing file for `mdkg git`
- command: `node dist/cli.js validate --changed-only --json`
- result: passed with `ok: true`, 0 warnings, 0 errors
- command: `node dist/cli.js validate --summary --limit 20 --json`
- result: passed with `ok: true`, 0 warnings, 0 errors
- command: `git diff --check`
- result: passed

## Pass / Fail Status

- status: pass for local implementation and docs validation

## Known Warnings

- warning: none for local validation

# Known Issues / Follow-ups

- The full `goal-54` end condition still requires the live
  `https://docs.mdkg.dev/reference/generated-cli-reference/` page to include
  the new content after an approved push/deploy.
- `test-341` and `task-658` remain open for consistency and live-currentness
  verification.

## Follow-up Refs

- `test-341`
- `task-658`
- `goal-54`

# Links / Artifacts

- rendered local docs route:
  `docs/dist/reference/generated-cli-reference/index.html`
- generated backing reference: `docs/_generated/cli-reference.md`
- public route source:
  `docs/src/content/docs/reference/generated-cli-reference.md`

# Raw Content Safety

- Evidence is summarized through commands, file paths, and marker checks.
  Secrets, credentials, raw prompts, provider payloads, and bulky command output
  are excluded.
