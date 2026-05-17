---
id: task-134
type: task
title: define bundle manifest and visibility contract
status: done
priority: 1
epic: epic-22
tags: [bundle, manifest, visibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Define the v0.1.3 full graph snapshot manifest and visibility rules so bundle
ZIPs are deterministic transport artifacts, not a hidden execution database.

# Acceptance Criteria

- Bundle manifests record mdkg version, manifest version, profile, selected
  workspaces, source repo/head/dirty state, deterministic source tree hash,
  bundle hash, file count, index hashes, and per-file metadata.
- File metadata includes path, kind, workspace, visibility, size, and SHA-256.
- Private bundles include selected authored mdkg files plus generated indexes
  while excluding pack/index/bundle outputs and raw archive source files.
- Public bundles include only public workspace content and fail closed when
  public records reference private graph or archive nodes.

# Files Affected

- `src/commands/bundle.ts`
- `src/core/config.ts`
- `assets/init/config.json`
- `.mdkg/config.json`
- `README.md`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

- Added `bundles.output_dir` and `bundles.default_profile` config defaults.
- Manifest deterministic hashes are derived from sorted included file metadata.
- Bundle source dirty state intentionally ignores `.mdkg/bundles/` so refreshing
  an unchanged bundle does not make the next bundle nondeterministic.
- Public profile excludes raw `.mdkg/config.json` to avoid leaking private
  workspace topology.

# Test Plan

- `npm run test`
- `npm run cli:check`
- `npm run smoke:bundle`
- `npm publish --dry-run`

# Links / Artifacts

- `tests/commands/bundle.test.ts`
- `scripts/smoke-bundle.js`
