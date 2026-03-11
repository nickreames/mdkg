---
id: test-17
type: test
title: 0.0.4 init omni scaffold and core pin contract
status: done
priority: 1
epic: epic-4
tags: [v0_4, init, scaffold, pins]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [prd-1, dec-8, dec-9, edd-4, task-33, task-34, task-47, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [omni-scaffold-paths, soul-human-strict-nodes, core-pin-id-only-ordering, no-events-markdown-guidance, optional-example-skill-only]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Validate the planned 0.0.4 `init --omni` scaffold contract, including strict-node file targets, core pin updates, and safe event guidance placement.

# Target / Scope

Covers future implementation acceptance checks for deterministic scaffold outputs and ID-only core pin behavior.

# Preconditions / Environment

- init omni implementation branch is present
- source-truth planning docs (`edd-4`, related tasks) are integrated
- repo starts from a fresh or controlled baseline

# Test Cases

- Verify required scaffold paths are created when missing (`.mdkg/core/SOUL.md`, `.mdkg/core/HUMAN.md`, `.mdkg/skills/`, `.mdkg/work/events/events.jsonl`).
- Verify SOUL/HUMAN files are valid strict nodes with schema-compliant frontmatter.
- Verify `.mdkg/core/core.md` is updated using IDs only, with SOUL/HUMAN near top and no duplicates.
- Verify no markdown guidance files are created under `.mdkg/work/events/`.
- Verify skills scaffold is created deterministically without requiring a default example skill file.
- If an optional example skill is created, verify it is indexable/valid under planned skills model.

# Results / Evidence

Capture generated file tree, pin list diffs, validation output, and index output snapshots.

# Notes / Follow-ups

- Add overwrite/merge behavior checks under `--force`.
- Add compatibility checks for existing repos with pre-populated `core.md`.
