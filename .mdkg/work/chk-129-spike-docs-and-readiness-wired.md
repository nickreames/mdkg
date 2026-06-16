---
id: chk-129
type: checkpoint
title: spike docs and readiness wired
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-349]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-349]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

Completed the spike docs, command-matrix, init asset, help/contract, and
publish-readiness wiring for `task-349`. First-class `spike` nodes are now
documented as actionable research/planning work items, with explicit boundaries:
they do not perform web search, execute research, create follow-up nodes, or
generate `SKILL.md` files automatically.

# Scope Covered

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/README.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `src/cli.ts`
- `scripts/assert-publish-ready.js`
- `package.json`
- `scripts/smoke-spike.js`
- spike-related help, command-contract, and smoke coverage

# Decisions Captured

- `spike` remains a work-node type created with `mdkg new spike`, not a new
  top-level `mdkg spike ...` command family.
- Existing `mdkg task start|update|done` lifecycle commands intentionally cover
  spikes.
- Spike evidence and citations remain Markdown body content for this release.
- A spike can recommend follow-up tasks, tests, and skill-authoring candidates,
  but mdkg only creates those records when the user or agent runs explicit
  commands.

# Implementation Summary

The user-facing docs now include a root quickstart and dedicated research-spike
section, seeded init docs include concise spike guidance, and both command
matrices list `mdkg new spike` plus lifecycle behavior. CLI help text and
contract checks were updated through the normal generated snapshot flow.
Publish-readiness now fails if spike template files, README/init guidance,
command matrix references, or `smoke:spike` prepublish wiring drift.

# Verification / Testing

- `npm run smoke:spike`; passed from a packed installed tarball in
  `/private/tmp/mdkg-spike.Qt2fkM/repo`.
- `npm run test`; 461 passed.
- `npm run cli:check`; passed.
- `npm run cli:contract`; passed.
- `npm run smoke:command-docs`; passed, generated command count 84.
- `node scripts/assert-publish-ready.js`; passed.
- `node dist/cli.js validate --json`; passed with zero warnings/errors.
- `git diff --check`; passed.

# Known Issues / Follow-ups

- `task-350` owns the packed temp-repo spike smoke and prepublish gate closeout.
- `task-368` owns the full `0.3.2` release-candidate dry-run checks, including
  `npm pack --dry-run --json` and `npm publish --dry-run`.

# Links / Artifacts

- `task-349`
- `task-350`
- `test-144`
