---
id: task-381
type: task
title: design base ref priority and id rewrite map
status: done
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, base-ref, id-map]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-6]
blocks: [task-382, task-383]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Define how mdkg prioritizes main/base IDs and rewrites incoming branch IDs while preserving links.

# Acceptance Criteria

- Base branch IDs win by default.
- Rewrite maps cover links, blockers, parents, scope refs, aliases, and body references where supported.
- Ambiguous rewrites are reported, not guessed.
- `--base-ref <ref>` is accepted by `fix plan`, `fix apply`, and `fix ids`.
- For clean duplicate groups, canonical selection order is:
  - record whose path and ID exist at `--base-ref`
  - otherwise existing deterministic lexical path order
- For unresolved same-path conflict stages, stage 2/current keeps the original
  path and ID; stage 3/incoming is written to a new collision-free path and ID.
- Candidate generation is deterministic and collision-free across existing IDs
  and already-planned candidate IDs.
- External references are never silently rewritten when the old ID could refer
  to either the canonical or duplicate node.

# Files Affected

- src/**
- tests/**
- docs/**

# Implementation Notes

- Start with clean duplicate trees and expand to Git-stage repair.
- Clean duplicate rewrite map:
  - `from_id`: duplicate ID
  - `to_id`: candidate ID
  - `from_qid`/`to_qid`
  - `source_path`: duplicate file
  - `canonical_path`: preserved file
  - `candidate_path`: unchanged for clean duplicate repair unless a filename
    collision or conflict-stage split requires a new file
  - `self_reference_rewrites`: same-file textual/frontmatter refs that can be
    rewritten safely
  - `ambiguous_reference_rewrites`: external files that mention the old ID and
    require operator review
- Conflict-stage rewrite map:
  - `stage_2_path`: original conflicted path preserved
  - `stage_3_candidate_path`: new mdkg file path based on candidate ID and
    sanitized title/slug
  - `stage_3_candidate_id`: collision-free ID
  - `resolved_paths`: original path plus new candidate path
  - `git_index_action`: write files and `git add` both paths after content
    generation
- Apply must run validation after changes and include validation status in the
  receipt; it should not hide validation failures.
- Body rewriting remains conservative: same-file old ID references may be
  rewritten, but graph-wide body references are reported as ambiguous unless
  future typed reference ownership can prove intent.

# Test Plan

- Unit fixtures for rewrite maps.
- Clean duplicate fixture where `--base-ref main` preserves the base record.
- Fixture where no base record exists falls back to lexical ordering.
- Unresolved conflict-stage fixture writes a split incoming file.
- Ambiguous external reference fixture proves reporting without blind rewrite.

# Links / Artifacts

- spike-6
- chk-143
- task-380
- chk-144
