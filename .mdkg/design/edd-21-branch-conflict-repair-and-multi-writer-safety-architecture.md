---
id: edd-21
type: edd
title: branch conflict repair and multi writer safety architecture
tags: [branches, multi-writer, ids, 0-3-6, 0-3-7]
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

Design the branch-conflict and multi-writer hardening lane for `goal-13`.
mdkg already has repo-local mutation locks, atomic writes, SQLite id
reservation, and `fix plan --family ids`. This design connects those pieces
into branch-aware conflict detection, deterministic repair planning, reference
rewrite receipts, and temp-repo merge proof before mdkg claims safe
multi-developer operation.

# Architecture

The lane has four layers:

1. Detection: validation and fix-plan logic must detect duplicate ids in local
   workspaces even when the normal index cannot be built.
2. Planning: `fix plan --family ids` expands from duplicate-file proposals to a
   branch-conflict repair receipt that includes candidate ids, affected files,
   reference rewrite scope, risk, and blockers.
3. Write safety: mutating commands continue to use repo-local locks and atomic
   writes, while tests audit that new and existing mutation paths either use
   the shared lock or are explicitly read-only.
4. Merge proof: a temp Git repo creates two branches that independently create
   conflicting numeric ids, merges them, and proves mdkg reports and plans a
   deterministic repair without mutating files.

# Data model

- Duplicate group: `{ id, workspace, canonical_path, duplicate_paths,
  candidate_ids, reference_paths }`.
- Reference rewrite item: `{ from, to, path, location_kind, confidence,
  replacement_count }`.
- Repair receipt: `{ action, plan_id, plan_hash, family, risk_counts,
  proposed_changes, blocked_changes, apply_supported }`.
- Writer audit item: `{ command, mutation_kind, lock_required, lock_observed,
  atomic_write_observed, notes }`.
- Merge-smoke receipt: `{ branches, merge_status, duplicate_groups,
  plan_hash, mutated_files_before_after }`.

# APIs / interfaces

Public surfaces:

- `mdkg validate --json`: must report duplicate ids with stable file paths when
  a merged branch introduces duplicates.
- `mdkg fix plan --family ids --json`: must emit deterministic candidate ids
  and reference rewrite planning while keeping `apply_supported: false`.
- Future `mdkg status --json` and `mdkg doctor --strict --json` can surface
  stale selected-goal and duplicate-id health, but they should remain summaries
  over validation/fix-plan primitives.

Internal surfaces:

- Tolerant graph scanning for duplicate ids remains separate from normal index
  construction.
- Reference rewrite planning covers frontmatter edge fields, `scope_refs`,
  workflow links between WORK/WORK_ORDER/RECEIPT records, archive/work refs,
  and known Markdown inline qid/id mentions.
- Lock audit can be implemented as tests over command code paths and temp
  parallel command execution; no public lock-inspection CLI is required first.

# Failure modes

- Ambiguous reference rewrite: block the change and emit a manual-review item.
- Candidate id collision: increment deterministic suffix until unused.
- Selected goal points at a missing/done/stale node after merge: report through
  strict doctor/fix-plan, then plan selected-goal repair separately from id
  rewrite.
- Concurrent writers both hold no lock: test failure; mutation path must be
  wrapped in the shared lock or converted to explicit read-only behavior.
- Partial writes or temp files: atomic-write tests must assert no truncated
  Markdown and no orphan temp files after interrupted writes where practical.

# Observability

- JSON receipts stay the primary observability surface.
- Plan hashes make duplicate-id and rewrite plans comparable in CI.
- Temp smoke records branch names, SHAs, duplicate ids, candidate ids, and
  before/after file hashes.
- Diagnostics stay on stderr; machine-readable JSON stays on stdout.

# Security / privacy

- Repair plans should include paths, ids, qids, and counts, not full file
  bodies.
- Markdown snippet capture is out of scope unless redacted and explicitly
  requested later.
- No cross-repo mutation or child repo mutation is introduced.
- No public `fix apply` is introduced in this lane.

# Testing strategy

- Unit tests for duplicate-id groups and deterministic candidate ids.
- Unit tests for reference rewrite path discovery and manual-review blockers.
- Temp repo tests for stale selected-goal state.
- Parallel temp repo tests for mutation locks and atomic write behavior.
- Two-branch smoke:
  - branch A creates `task-1`
  - branch B independently creates `task-1`
  - merge creates duplicate id state
  - `validate --json` reports duplicates
  - `fix plan --family ids --json` emits deterministic repair plan
  - file hashes prove planning does not mutate state.

# Rollout plan

1. `task-341`: duplicate-id detection and deterministic rewrite planning.
2. `task-342`: reference rewrite receipts and selected-goal repair planning.
3. `task-343`: writer-lock coverage and atomic-write audit.
4. `task-344`: two-branch conflict smoke and prepublish gate.

Do not publish/tag/push from this lane without a separate explicit release
request.
