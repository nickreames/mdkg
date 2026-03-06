---
id: test-9
type: test
title: v0.4 init omni and ignore defaults
status: done
priority: 1
epic: epic-4
tags: [v0_4, init, safety]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-4, task-33, task-34, task-37, task-47]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [init-omni-flag-contract, init-ignore-defaults, soul-human-core-nodes, seeded-init-event, core-pin-id-contract]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Validate planned v0.4 init behavior around omni bootstrap and default ignore updates.

# Target / Scope

Covers future implementation acceptance checks for `init --omni`, `--llm` compatibility, SOUL/HUMAN core-node scaffolding, skills scaffold contract, and default ignore safety behavior.

# Preconditions / Environment

- repo is initialized
- source-truth docs are aligned
- implementation branch includes init behavior updates

# Test Cases

- Verify `init --omni` contract behavior and scaffolding expectations.
- Verify `init --llm` remains compatible.
- Verify SOUL and HUMAN docs are created as strict core-node targets.
- Verify `.mdkg/skills/` scaffold contract is satisfied without requiring a default example skill file.
- If an optional example skill is created, verify it satisfies validation/indexing/search requirements.
- Verify seeded `.mdkg/work/events/events.jsonl` first line is valid JSONL and uses redacted-safe structure.
- Verify core pin updates use IDs only and include SOUL/HUMAN pins without duplicates.
- Verify no markdown guidance file is created under `.mdkg/work/events/`; guidance lives in existing docs.
- Verify ignore entries are written by default and opt-out behavior matches final spec.
- Verify single-writer and batching references remain guidance text for external orchestrators, not init command runtime enforcement.

# Results / Evidence

Record CLI output, generated file diffs, seeded event line, and updated ignore files.

# Notes / Follow-ups

- Add regressions for existing init flags.
- Confirm no publish safety regressions.
