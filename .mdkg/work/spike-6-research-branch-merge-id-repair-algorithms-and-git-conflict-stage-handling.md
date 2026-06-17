---
id: spike-6
type: spike
title: research branch merge ID repair algorithms and Git conflict-stage handling
status: done
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, spike, id-repair, git]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-380, task-381, task-383]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Research Question

What repair model best resolves duplicate mdkg IDs created on separate branches while preserving links and prioritizing main branch IDs?

# Context And Constraints

- Both clean-tree duplicate repair and unresolved Git conflict-stage repair belong to the same future command surface.
- Base/main IDs should win by default.
- Repair output must be receipt-shaped and auditable.

# Search Plan

- Review Git index stage behavior and common merge-conflict tooling patterns.
- Inspect mdkg node reference fields and validation failure modes.
- Compare deterministic rename-map and content-hash-assisted repair approaches.

# Findings

- Existing `src/commands/fix.ts` already has a deterministic read-only `ids`
  family that groups duplicate local IDs, picks a canonical record, proposes
  `<id>-dup-<n>` candidates, and reports reference rewrite candidates.
- Existing tests and smokes intentionally assert `fix apply` is unavailable, so
  0.3.4 must update the command contract, help, docs, publish-readiness checks,
  and packed smokes together.
- Clean branch merges usually surface as a valid Git tree with duplicate mdkg
  IDs in different files. These can be repaired by rewriting non-canonical node
  frontmatter IDs to collision-free IDs, then rebuilding indexes and validating.
- Unresolved Git conflict stages surface through Git's unmerged index. For mdkg
  same-path node conflicts, a safe repair model is to keep the stage-2/current
  file at the original path and split the stage-3/incoming node into a new
  collision-free file with a rewritten ID.
- Main/base IDs should win when the duplicate ID exists at `--base-ref`; when no
  duplicate record exists at the base ref, fall back to the existing
  deterministic path ordering.
- Link preservation cannot be guessed globally when two nodes share the same
  old ID. The safe first apply behavior is to rewrite the duplicate node's own
  frontmatter ID and same-file self references, report all external ambiguous
  references in the receipt, and fail closed for unsupported reference shapes.

# Options And Tradeoffs

- Rewrite every textual occurrence of the old ID across the graph.
  - Pro: simple and appears to clear duplicate IDs quickly.
  - Con: unsafe because it may steal references that should continue pointing to
    the canonical/base node.
- Rewrite only the duplicate node and report ambiguous external references.
  - Pro: preserves the base node and avoids silent link corruption.
  - Con: operators may need a follow-up targeted ref repair when external links
    truly belonged to the duplicate.
- Split unresolved stage-3 content into a new file while keeping stage-2 at the
  conflicted path.
  - Pro: gives both branch-created nodes durable files and preserves the current
    branch/base path.
  - Con: only supports mdkg node-file conflicts; other conflict shapes remain
    blocked with receipts.

# Recommendation

- Implement one command surface with two entrypoints:
  - `mdkg fix apply --family ids [--target <id-or-qid>] [--base-ref <ref>] --json`
  - `mdkg fix ids --base-ref <ref> [--target <id-or-qid>] [--apply] --json`
- Keep `mdkg fix plan` as the dry-run planner, but allow its IDs-family changes
  to declare `apply_supported: true` when they are clean duplicate ID rewrites
  or supported unresolved conflict-stage split repairs.
- Apply only supported IDs-family plans. Keep index and refs families
  read-only/unsupported in 0.3.4.
- Prefer base-ref IDs:
  - If exactly one duplicate file path has the same ID at `--base-ref`, keep it
    canonical.
  - If the duplicate conflict is unresolved at one path, keep stage 2 at the
    original path and write stage 3 to a new collision-free file.
  - If base-ref does not identify a winner, keep deterministic lexical ordering.
- Emit a receipt with `plan_id`, `plan_hash`, `applied_changes`,
  `blocked_changes`, rewritten IDs, touched paths, ambiguous references, and
  validation/index follow-up status.

# Follow-Up Nodes To Create

- task-380: capture the command contract and receipt shape before implementation.
- task-381: encode base-ref priority and deterministic candidate generation.
- task-382: implement apply for supported IDs-family clean duplicate repairs.
- task-383: implement `fix ids --base-ref ... --apply` and conflict-stage split
  repair.
- task-384: add packed temp-repo smokes for clean duplicates and unresolved
  conflict stages.
- test-162/test-163/test-164: prove clean repair, conflict-stage repair, and
  link preservation / ambiguous reference reporting.

# Skill Candidates

- Future skill candidate: branch-conflict repair operator workflow covering
  `git status`, `mdkg fix ids --base-ref main --json`, `--apply`, review,
  validate, and commit.

# Data Structures And Algorithms Notes

- Extend fix plan changes with `apply_supported`, `apply_kind`,
  `canonical_record`, `rewrite_record`, `candidate_id`, `candidate_path`, and
  `ambiguous_reference_rewrites`.
- Keep hashes deterministic by excluding timestamps from the hashed plan body.
- Use collision-free candidate generation against all parsed current IDs and all
  planned candidate IDs.
- Detect unresolved Git conflict stages with `git ls-files -u -- .mdkg`, read
  stage content with `git show :2:<path>` and `git show :3:<path>`, and support
  only parseable mdkg node files.

# UX Notes

- `fix plan` stays dry-run-first.
- `fix apply` is explicit mutation and should reject unsupported families.
- `fix ids --base-ref main --apply --json` is the focused operator shortcut for
  the branch-merge scenario.
- Text output should be concise; JSON receipts are the authoritative automation
  surface.

# Security Notes

- Do not execute arbitrary Git hooks or shell fragments beyond fixed Git
  inspection commands.
- Refuse path escapes; candidate files must stay under mdkg workspace document
  roots.
- Do not silently rewrite external references where ownership cannot be
  determined.
- Use atomic writes for file updates and keep mutation receipts deterministic.

# Evidence And Sources

- `src/commands/fix.ts`: existing `fix plan` planner and duplicate-ID logic.
- `tests/commands/fix.test.ts`: current duplicate-ID, spike-ID, and branch
  merge read-only planner coverage.
- `scripts/smoke-branch-conflicts.js`: existing packed branch-conflict smoke
  proving deterministic read-only duplicate-ID plans.
- `src/cli.ts` and `scripts/generate-command-contract.js`: public help and
  command contract surfaces that must change with apply support.
