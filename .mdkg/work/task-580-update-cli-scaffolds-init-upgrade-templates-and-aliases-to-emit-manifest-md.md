---
id: task-580
type: task
title: update CLI scaffolds init upgrade templates and aliases to emit MANIFEST.md
status: todo
priority: 1
epic: epic-197
parent: goal-37
tags: [manifest, cli, scaffold, templates, upgrade, init]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54]
context_refs: []
evidence_refs: []
aliases: [manifest-cli-scaffold, manifest-template-upgrade, mdkg-new-spec-legacy-alias]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Switch new scaffolds and templates to emit `MANIFEST.md` while preserving old
CLI paths as intentional legacy aliases for the compatibility release.

# Acceptance Criteria

- Canonical new manifest scaffold creates `MANIFEST.md`.
- `mdkg new manifest` creates `MANIFEST.md` as the canonical path.
- `mdkg new spec` remains as a legacy alias for one compatibility release,
  emits `MANIFEST.md`, and prints clear deprecation/legacy messaging.
- Init and upgrade assets use manifest-first templates.
- Rich templates formerly named `*.SPEC.md` have canonical manifest successors
  without silently deleting legacy compatibility fixtures.
- Upgrade dry-run reports affected paths and safe side effects before apply.

# Files Affected

- `.mdkg/templates/default/spec.md`
- `.mdkg/templates/specs/*.SPEC.md`
- packaged init assets under `src/**` or generated dist assets
- `src/commands/new.ts`
- upgrade smoke fixtures and scripts

# Implementation Notes

- Keep legacy template files only when tests need them for compatibility; do not
  keep stale SPEC-first names as canonical examples.
- Any generated `AGENT_START.md` or startup text should say manifest first.

# Test Plan

- `test-294`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `node dist/cli.js new manifest "image worker" --id agent.image-worker --json`
- Legacy alias check for `mdkg new spec` according to `task-574`.

# Links / Artifacts

- `edd-54`
- `task-574`
- `test-294`
