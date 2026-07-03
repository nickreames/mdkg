---
id: task-633
type: task
title: inventory Omni Room contract release candidates and current mdkg surfaces
status: todo
priority: 1
tags: [goal-48, inventory, contracts]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Inventory the Omni Room contract release candidates from the root handoffs and
compare them with current mdkg source, templates, validators, CLI, docs, and
release/package surfaces.

This is the first executable node when `goal-48` resumes. It is read-only until
the inventory has a reviewed candidate matrix.

# Acceptance Criteria

- Root handoffs and root source nodes are summarized with file paths and
  relevant qids.
- Current mdkg support is inventoried for MANIFEST, WORK, WORK_ORDER, RECEIPT,
  `mdkg new`, `mdkg work`, focused workflow validation, raw-content warnings,
  `mdkg upgrade`, templates, init assets, docs, and package gates.
- Candidate fields from the root handoff are listed without treating them as
  accepted schema.
- Inventory separates generic mdkg candidates from runtime-only Omni Room
  policy and seed/default asset changes.
- No source, package, template, docs, skills, generated docs, or default asset
  files are modified by this inventory task.

# Files Affected

- Planning updates only under `.mdkg/work/**` unless a later explicit
  implementation goal authorizes source edits.
- Expected read-only inputs include current mdkg source/docs and root handoff
  files.

# Implementation Notes

- Required root inputs:
  - `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_goal_41_mdkg_release.md`
  - `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_task_398_boundary.md`
  - `/Users/nick/omni-chat-rooms/.mdkg/work/goal-41-plan-mdkg-cli-template-schema-release-for-omni-room-contract-support.md`
  - `/Users/nick/omni-chat-rooms/.mdkg/work/task-398-create-backend-mdkg-and-root-follow-up-boundary-handoff.md`
- Current child evidence to inspect includes `.mdkg/templates/default/*`,
  `src/graph/agent_file_types.ts`, `src/commands/validate.ts`,
  `src/commands/upgrade.ts`, `src/commands/work.ts`, `src/cli.ts`,
  `README.md`, and `CLI_COMMAND_MATRIX.md`.
- Treat `contract_profile`, `receipt_kind`, and `redaction_class` as candidate
  terms until an accepted decision or implementation task selects names and
  compatibility behavior.

# Test Plan

- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`
- Confirm the produced matrix names all required candidate categories and
  records non-goals.

# Links / Artifacts

- `goal-48`
