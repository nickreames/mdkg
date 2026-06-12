---
id: task-355
type: task
title: implement generated public command reference docs gate
status: todo
priority: 2
epic: epic-78
parent: goal-15
tags: [mdkg-dev, command-reference, generated-docs, docs-gate]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Implement the public command-reference generation gate for mdkg.dev. The command
reference should be generated from mdkg-native command metadata so public docs
cannot drift silently from CLI behavior.

# Acceptance Criteria

- Generated docs cover every public command and omit internal-only surfaces.
- Each command entry includes description, aliases where relevant, JSON support,
  mutation/read-only policy, dry-run support, receipts/artifacts, and examples.
- Drift between CLI command metadata and generated docs fails a local check.
- The docs gate runs in a temp repo or deterministic build path without network
  dependencies.

# Files Affected

- `scripts/`
- `dist/command-contract.json`
- future mdkg.dev docs source paths
- `package.json` scripts

# Implementation Notes

- Keep mdkg-native metadata canonical. OpenCLI or other projections can be added
  later, but must not become the source of truth.
- Avoid hand-maintained command tables when generated metadata is available.
- Preserve stdout/stderr discipline for any docs-check command.

# Test Plan

- `npm run cli:contract`
- `npm run smoke:command-docs`
- `node dist/cli.js validate --json`
- `git diff --check`

# Links / Artifacts

- Validated by `test-147`.
