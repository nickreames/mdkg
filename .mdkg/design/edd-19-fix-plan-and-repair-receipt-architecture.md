---
id: edd-19
type: edd
title: fix plan and repair receipt architecture
tags: [fix, repair, receipts, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

`mdkg fix plan --json` is the first repair surface for mdkg. It must be
read-only, deterministic, receipt-shaped, and useful before any command is
allowed to mutate graph files, generated caches, or subgraph materializations.

The command exists to answer: "what would mdkg repair, why, how risky is it, and
what paths or references would be touched if an apply surface were later
approved?"

# Architecture

Add a public `fix` command group with one initial subcommand:

- `mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] --json`

The implementation should share graph-loading and validation helpers instead of
adding a second parser. Planning should collect candidate repairs from small
family-specific planners, normalize them into one receipt envelope, sort them
deterministically, and print JSON to stdout. Diagnostics and unsupported apply
warnings go to stderr.

No `fix apply` command is part of this slice. Every proposed change must carry
`apply_supported: false` until the plan contract has enough test evidence to
justify a later apply design.

# Data model

The JSON envelope should be stable enough for tests and automation:

- `action`: `fix.plan`
- `ok`: boolean indicating whether planning completed
- `schema_version`: integer, starting at `1`
- `plan_id`: deterministic id derived from repo root, family selection, target,
  graph/index state hash, and planned changes
- `plan_hash`: stable hash of the canonical plan body
- `generated_at`: ISO timestamp
- `root`: absolute repo root
- `dirty`: boolean plus optional git summary
- `families`: selected repair families and per-family counts
- `risk_counts`: counts for `low`, `medium`, `high`, and `blocked`
- `proposed_changes`: sorted list of reviewable repairs
- `blocked_changes`: sorted list of issues that cannot be safely planned
- `summary`: human-readable counts only, not free-form logs

Each proposed change should include:

- `id`: deterministic within the plan
- `family`: `index`, `refs`, or `ids`
- `risk`: `low`, `medium`, `high`, or `blocked`
- `status`: `planned`, `manual_review`, or `blocked`
- `reason`: short stable reason code
- `paths`: candidate file paths relative to root
- `refs`: relevant node ids or qids
- `before` and `after`: structured values when available
- `command_hint`: non-mutating command guidance such as `mdkg index`
- `apply_supported`: always `false` in `0.3.3`

# Repair Families

`index` covers generated caches and index health. It should detect missing,
stale, or unreadable generated cache artifacts and recommend non-destructive
operator commands such as `mdkg index`. It should not rewrite the index itself.

`refs` covers graph reference planning. It should report missing references,
workspace/visibility boundary problems, and references that can only be resolved
with manual review. It should prefer low-confidence blocked findings over
guessing a replacement id.

`ids` covers duplicate local id planning. It should detect duplicate ids in the
same workspace, propose deterministic candidate renames, and enumerate the
reference paths that a future apply command would need to update. It must not
rename files or edit references in this slice.

# APIs / Interfaces

`mdkg fix --help` should identify fix planning as a review-only operator
surface. `mdkg fix plan --help` should state that it writes nothing, supports
JSON output, and that apply behavior is deferred.

Only JSON is required for the first implementation. Human-readable output can
be added later after the machine contract is stable.

# Failure Modes

- Invalid family or target returns a structured error without partial output.
- Unreadable graph files are represented as blocked changes when possible.
- Corrupt generated caches should not prevent planning for graph files.
- Dirty worktrees are allowed for planning, but the receipt records dirty state.
- Future apply behavior must refuse dirty worktrees unless an explicit design
  says otherwise.

# Observability

The receipt itself is the audit artifact. The command should avoid noisy logs,
keep stdout machine-readable, and put diagnostics on stderr. Future persisted
receipts are out of scope for the first pass.

# Security / Privacy

The planner should not include node bodies in the receipt by default. Paths,
ids, qids, reason codes, hashes, and short structured before/after values are
acceptable. Do not print secrets, environment variables, npm tokens, or raw
private content.

# Testing Strategy

- Unit tests for the receipt envelope and deterministic sorting.
- Family fixtures for index/cache, missing refs, and duplicate ids.
- A temp-repo smoke proving `mdkg fix plan --json` writes nothing.
- CLI help tests proving the review-only boundary is visible.
- Publish-readiness checks proving the command is documented before release.

# Rollout Plan

1. Implement the command skeleton and receipt schema.
2. Add family planners one at a time with fixtures.
3. Add temp-repo smoke and docs.
4. Add prepublish gate only after the smoke is stable.
5. Defer `fix apply` to a later explicit design and approval pass.
