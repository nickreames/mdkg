---
id: chk-132
type: checkpoint
title: spike pack export parity hardened
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-366]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-366]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

`task-366` hardened spike pack/export parity. Spike nodes now have explicit
regression coverage for pack roots across every supported pack format,
visibility-filtered archive references, structured discovery/show exports, and
packed installed CLI behavior.

# Scope Covered

- `task-366`
- `test-154`
- `tests/commands/pack.test.ts`
- `tests/commands/json_discovery.test.ts`
- `scripts/smoke-spike.js`

# Decisions Captured

- Keep spikes on the existing work-node and task lifecycle surface.
- Do not add a public `mdkg spike ...` command namespace in this release.
- Treat spike export behavior as part of existing pack, visibility, discovery,
  show, command contract, and command-doc guarantees.

# Implementation Summary

- `runPackCommand` coverage now proves `spike-1` can be packed as the root in
  JSON, Markdown, XML, and toon formats.
- Public visibility coverage now includes spike archive references, with private
  archive refs failing closed and public archive refs included with public pack
  metadata.
- Structured discovery coverage now proves `list --type spike`, `search --type
  spike`, and `show spike-1` are well-formed across XML, toon, Markdown, and
  JSON envelopes.
- The packed spike smoke now exercises installed CLI spike show/list/search
  structured exports plus `pack spike-1 --format json|md|xml|toon`.

# Verification / Testing

- Passed `npm run build`.
- Passed `npm run build:test`.
- Passed targeted suites:
  `node --test dist/tests/commands/pack.test.js
  dist/tests/commands/json_discovery.test.js
  dist/tests/commands/cli_help_matrix.test.js
  dist/tests/commands/command_contract.test.js`.
- Passed `npm run cli:contract`.
- Passed `npm run smoke:command-docs`.
- Passed `npm run smoke:spike`; packed installed CLI temp repo:
  `/private/tmp/mdkg-spike.arzPdJ/repo`.
- Passed full `npm run test` with 464 tests.
- Passed `node dist/cli.js validate --json`.
- Passed `git diff --check`.

# Known Issues / Follow-ups

- `task-367` remains next for malformed spike validation and repair guidance.
- Full 0.3.2 RC gates remain in `task-368`; no publish, tag, or push happened
  in this phase.

# Links / Artifacts

- `task-366`
- `test-154`
