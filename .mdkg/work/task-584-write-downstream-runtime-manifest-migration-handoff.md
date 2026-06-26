---
id: task-584
type: task
title: write downstream runtime MANIFEST migration handoff
status: todo
priority: 2
epic: epic-198
parent: goal-37
tags: [manifest, downstream, runtime, handoff, migration]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54]
context_refs: []
evidence_refs: []
aliases: [downstream-manifest-migration, room-manifest-ref-handoff, spec-driven-to-manifest-driven]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Write the follow-up migration handoff for downstream runtime repos after mdkg
lands canonical `MANIFEST.md` support with a legacy `SPEC.md` alias.

# Acceptance Criteria

- Handoff names mdkg compatibility release as a prerequisite.
- Handoff lists downstream fixture updates from `SPEC.md` to `MANIFEST.md`.
- Handoff recommends gradual internal type renames such as `RoomSpecRef` to
  `RoomManifestRef` and `SpecDocument` to `ManifestDocument`.
- Handoff updates user-facing language from `SPEC-driven startup` to
  `manifest-driven startup`.
- Handoff explicitly keeps legacy SPEC fixture coverage until the
  one-compatibility-release window closes.

# Files Affected

- mdkg handoff/checkpoint nodes only in this repo
- downstream repos are not mutated in this task

# Implementation Notes

- Keep the handoff copy-ready for a coding agent but clear that downstream work
  begins only after mdkg support is present.
- Separate runtime naming cleanup from mdkg package compatibility work.

# Test Plan

- `mdkg pack goal-37 --profile concise`
- `mdkg handoff create goal-37 --json`
- `mdkg validate --json`

# Links / Artifacts

- `goal-37`
- `edd-54`
