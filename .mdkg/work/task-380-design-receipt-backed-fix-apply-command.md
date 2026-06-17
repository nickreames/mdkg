---
id: task-380
type: task
title: design receipt backed fix apply command
status: done
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, fix-apply, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-6]
blocks: [task-382]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design receipt-backed `mdkg fix apply` behavior for graph repair plans.

# Acceptance Criteria

- Plan receipts identify every rewritten id and reference.
- Apply refuses dirty or unsupported states unless explicitly allowed.
- Output is deterministic and reviewable.
- 0.3.4 apply support is limited to IDs-family duplicate repair; index and refs
  families remain planned/manual-review only.
- `mdkg fix apply --family ids [--target <id-or-qid>] [--base-ref <ref>] --json`
  derives a fresh plan, applies only supported changes, then emits a
  deterministic receipt.
- `mdkg fix ids --base-ref <ref> [--target <id-or-qid>] [--apply] --json` is
  the operator shortcut; without `--apply` it returns the same plan shape.
- Apply receipts include `action`, `ok`, `schema_version`, `root`, `family`,
  `target`, `base_ref`, source `plan_id`/`plan_hash`, `applied_changes`,
  `blocked_changes`, `touched_paths`, `ambiguous_reference_rewrites`, and
  validation/index follow-up status.
- Apply refuses:
  - unsupported families
  - blocked plan changes
  - dirty tracked files outside supported conflict-stage repair unless an
    explicit future allow flag is designed
  - path escapes outside registered mdkg document roots
  - ambiguous external reference rewrites that would silently corrupt links

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md

# Implementation Notes

- Use spike findings before implementation.
- Keep dry-run-first behavior.
- Preserve JSON stdout discipline; human-readable diagnostics go to stderr or
  compact text output.
- Use existing atomic-write helpers for graph file rewrites.
- Keep `fix plan` safe for automation: it writes nothing and remains the source
  for reviewable plan hashes.
- A plan change is apply-capable only when it has a single rewrite file,
  collision-free candidate ID, and no unsupported reference mutation.

# Test Plan

- Unit tests for `fix apply` unsupported family refusal.
- Unit tests for IDs-family apply receipt shape.
- Existing read-only plan tests updated so IDs-family changes report supported
  apply while index/refs remain unsupported.
- Packed smoke added in task-384.

# Links / Artifacts

- spike-6
- chk-143
