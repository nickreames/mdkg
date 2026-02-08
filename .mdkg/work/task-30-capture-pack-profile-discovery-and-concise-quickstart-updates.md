---
id: task-30
type: task
title: capture pack profile discovery and concise quickstart updates
status: done
priority: 2
epic: epic-3
tags: [pack, ux, docs]
owners: []
links: []
artifacts: []
relates: [task-27, task-31, task-32]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-07
updated: 2026-02-08
---
# Overview

Improve discoverability of concise pack workflows and built-in body profiles so new users can find the right pack mode without digging into source docs.

# Acceptance Criteria

- `mdkg pack --list-profiles` prints built-in profile names, body modes, and defaults.
- `mdkg pack --list-profiles` works outside initialized repos.
- Help and quickstart include a concise preview flow (`--pack-profile concise --dry-run --stats`).
- Coverage exists for parser/help/list-profiles behavior.

# Files Affected

- `src/cli.ts`
- `src/util/argparse.ts`
- `src/pack/profile.ts`
- `README.md`
- `tests/commands/cli.test.ts`
- `tests/util/argparse.test.ts`
- `tests/pack/profile.test.ts`

# Implementation Notes

- Added profile catalog metadata in `src/pack/profile.ts` via `listPackProfiles()`.
- Added `--list-profiles` boolean flag parsing and pack help/usage coverage.
- Added a config bypass path in CLI root checks when pack is called with `--list-profiles`.
- Added concise quickstart command to global help and README quickstart sections.

# Test Plan

- Run: `npm run test`
- Run: `node dist/cli.js pack --list-profiles`
- Run: `node dist/cli.js help pack`
- Run from temp dir without `.mdkg`: `node <repo>/dist/cli.js pack --list-profiles`

# Links / Artifacts

- `README.md`
- `src/cli.ts`
- `src/pack/profile.ts`
