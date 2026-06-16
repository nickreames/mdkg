---
id: task-366
type: task
title: harden spike pack visibility exports and command contract parity
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, pack, visibility, command-contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348, task-349]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Harden spike behavior in context packs, visibility-filtered output, structured
exports, and generated command metadata so the new node type behaves like a
first-class work item everywhere agents inspect mdkg state.

# Acceptance Criteria

- `mdkg pack <spike-id>` includes the spike root, relevant edges, and latest
  checkpoint behavior deterministically.
- Goal-root packs include scoped spikes and avoid unrelated spikes.
- Public/internal visibility filtering handles spikes consistently with other
  work-node types.
- `mdkg show/list/search` structured formats include spikes without malformed
  output.
- Generated command contract and command docs account for `mdkg new spike` and
  spike lifecycle wording.

# Files Affected

- Pack ordering/export code and tests.
- Command contract/docs generation outputs.
- Visibility and structured-output tests.

# Implementation Notes

- Treat spike as actionable work, not as architecture/reference-only content.
- Keep pack ordering stable with existing task/bug/test roots.
- Do not expose private-only source material in public packs.

# Test Plan

- `npm run test`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- `npm run smoke:spike`

# Results / Evidence

- Added spike-specific pack coverage in `tests/commands/pack.test.ts`:
  `runPackCommand supports a spike as the pack root across formats` now verifies
  JSON, Markdown, XML, and toon pack output for `root:spike-1`.
- Added spike-specific visibility coverage in `tests/commands/pack.test.ts`:
  public packs fail closed on private spike archive refs and include public
  spike archive refs with `meta.visibility: public`.
- Added spike-specific structured discovery coverage in
  `tests/commands/json_discovery.test.ts`: `list --type spike`, `search
  --type spike`, and `show spike-1` are verified across XML, toon, Markdown,
  and JSON envelopes.
- Extended `scripts/smoke-spike.js` so the packed installed CLI verifies spike
  show/list/search structured formats and `pack spike-1 --format
  json|md|xml|toon`.
- Verification passed:
  - `npm run build`
  - `npm run build:test`
  - `node --test dist/tests/commands/pack.test.js dist/tests/commands/json_discovery.test.js dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/command_contract.test.js`
  - `npm run cli:contract`
  - `npm run smoke:command-docs`
  - `npm run smoke:spike`
  - `npm run test`
  - `node dist/cli.js index`
  - `node dist/cli.js validate --json`
  - `git diff --check`

# Closeout Notes

- No new public `mdkg spike ...` namespace was added.
- No publish, tag, or push was performed.

# Links / Artifacts

- `task-348`
- `task-349`
- `test-154`
