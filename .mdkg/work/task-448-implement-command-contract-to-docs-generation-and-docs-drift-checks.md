---
id: task-448
type: task
title: implement command contract to docs generation and docs drift checks
status: done
priority: 1
epic: epic-123
parent: goal-25
tags: [mdkg-dev, command-contract, docs-drift]
owners: []
links: []
artifacts: []
relates: [task-447, task-453]
blocked_by: [task-447]
blocks: [task-449, test-201]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-5, edd-22, edd-24, edd-27]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Implement the command-contract-to-docs path for mdkg.dev and `/docs` so public command reference content does not drift from the CLI.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and task-447 has a docs source target.
- Generated command docs are derived from `dist/command-contract.json` or the canonical generation source.
- The generated reference has a stable output path for `/docs/reference/cli.md` or a generated docs entrypoint selected in task-445.
- Drift checks fail when command contract output and docs reference diverge.
- Public command docs separate core launch commands from advanced alpha commands.
- No hand-maintained full CLI matrix is copied into website/docs without drift protection.
- No public publish, deploy, push, tag, DNS change, or production promotion occurs.

# Files Affected

- docs/reference command output
- mdkg-dev generated reference pages if selected
- scripts only if task-445 allows docs-generation script wiring

# Implementation Notes

- Use `npm run cli:contract` as the source drift gate.
- Keep `CLI_COMMAND_MATRIX.md` authoritative for repo-local command inventory until generated docs are proven.
- Record command contract hash or generated file inventory in a checkpoint with task-447.

# Implementation Summary

Added deterministic docs generation from `dist/command-contract.json`.

New generator:

- `scripts/generate-docs-reference.js`
- `npm run docs:generate`
- `npm run docs:check`

Generated outputs:

- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`

Docs integration:

- `docs/SUMMARY.md` links the generated CLI reference under Reference.
- `docs/reference/README.md` links the generated reference.
- `docs/reference/command-contract.md` documents the generated outputs and commands.

Drift behavior:

- `npm run docs:generate` rebuilds the CLI, writes the command contract, then writes generated docs.
- `npm run docs:check` rebuilds the CLI and fails if generated docs differ from the command contract.

Evidence:

- `npm run docs:generate` passed and wrote both generated outputs.
- `npm run docs:check` passed.
- Generated docs contain contract hash `bb6d15e23a09b9a013aed406eac42e4e90f8ef6cb799759198a7777b3527ca74`.
- Generated summary reports 98 commands across 32 categories.

# Test Plan

- `npm run cli:contract`
- `npm run smoke:command-docs`
- docs drift smoke added by goal-25

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-123
- context: edd-22
- context: GitBook repo-first ownership policy
