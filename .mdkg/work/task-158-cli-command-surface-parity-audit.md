---
id: task-158
type: task
title: cli command surface parity audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, cli, docs, help]
owners: []
links: []
artifacts: [src/cli.ts, CLI_COMMAND_MATRIX.md, README.md, assets/init/CLI_COMMAND_MATRIX.md]
relates: [epic-28, epic-19, epic-22, epic-23, epic-24, epic-25, epic-26, epic-27]
blocked_by: []
blocks: [task-163, task-164]
refs: [rule-3]
aliases: [cli-parity-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Audit the public CLI surface added after 0.1.1 and confirm implementation,
help text, command matrix, README, and seeded init docs all describe the same
behavior.

# Acceptance Criteria

- Compare `src/cli.ts` help for `capability`, `archive`, `work`, `bundle`,
  `bundle import`, `pack --visibility`, `init --agent`, and `upgrade`.
- Confirm root `CLI_COMMAND_MATRIX.md` matches help snapshots.
- Confirm seeded `assets/init/CLI_COMMAND_MATRIX.md` and README guidance match
  the root docs.
- Confirm `npm run cli:check` passes.
- Record any drift as a release blocker before package publish.

# Files Affected

Read-only audit targets:
- `src/cli.ts`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `assets/init/README.md`

# Implementation Notes

This is a parity audit, not a command redesign. If a mismatch is found, patch
the smallest source of drift and rerun the command matrix check before closing.

# Test Plan

- Run `npm run cli:check`.
- Spot-check `node dist/cli.js help capability`, `archive`, `work`, `bundle`,
  `pack`, `init`, and `upgrade`.
- Confirm no removed or stale flags remain in onboarding docs.

# Links / Artifacts

- `epic-28`
- `rule-3`

# Audit Evidence

- `npm run cli:check` passed and reported `cli command matrix check: ok`.
- The help snapshot check rebuilt the CLI and verified help output against
  `CLI_COMMAND_MATRIX.md`.
- Documentation sweep confirmed the current public surfaces are represented in
  `README.md`, `CLI_COMMAND_MATRIX.md`, `assets/init/CLI_COMMAND_MATRIX.md`,
  `assets/init/AGENT_START.md`, and `assets/init/README.md`:
  - `mdkg capability list/search/show`
  - `mdkg archive add/list/show/verify/compress`
  - `mdkg work contract/order/receipt/artifact`
  - `mdkg bundle create/list/show/verify`
  - `mdkg bundle import add/list/rm/enable/disable/verify`
  - `mdkg pack --visibility public|internal|private`
  - `mdkg init --agent`
  - `mdkg upgrade`
- Stale doc sweep found no `AGENT_PROMPT_SNIPPET`, `Once published`,
  absolute `/Users/nick` README links, or obsolete onboarding references.
- `--llm`, `--agents`, `--claude`, and `--omni` appear only as intentional
  removed-flag migration guidance to `mdkg init --agent`.

# Result

CLI/help/docs parity is release-ready for the audited command surface.
