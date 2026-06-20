---
id: chk-175
type: checkpoint
title: generic runtime integration graph handoff research completed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [spike-11]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [spike-11]
created: 2026-06-17
updated: 2026-06-17
---
# Summary

Completed the generic runtime integration research spike for goal-22. The spike now records source-grounded findings, implementation ordering, and safety/UX recommendations for completed-goal lifecycle, semantic refs, checkpoint kinds, workflow validation, warning categories, queue adapter contracts, and handoff packaging.

# Scope Covered

- spike-11

# Decisions Captured

- Move completed goals from actionable `active_node` to historical `last_active_node`.
- Add `context_refs` and `evidence_refs` as generic non-executable work-node fields.
- Treat raw secret/prompt/payload markers as warnings by default.
- Implement `mdkg handoff create` as a first-class command instead of hiding handoff UX behind pack profiles only.
- Keep downstream runtime repos read-only during mdkg implementation.

# Implementation Summary

No functional source changes were made in this spike. The mdkg graph now has a completed research node and an audit task that converts the evidence into implementation contracts. The research confirms that current source already has strong foundations in goal lifecycle, workflow validation, queue primitives, and subgraph safety, but needs generic surfaces that downstream integrations do not have to reimplement.

# Verification / Testing

- Reviewed `src/commands/goal.ts`, `src/commands/mcp.ts`, `src/graph/node.ts`, `src/graph/frontmatter.ts`, `src/graph/validate_graph.ts`, `src/commands/checkpoint.ts`, `src/commands/db.ts`, and `src/core/project_db_queue.ts`.
- Reviewed downstream adapter evidence read-only at `/Users/nick/omni-chat-rooms/projects/omni-room-runtime/crates/omni-mdkg-adapter/src/lib.rs`.
- Ran `node dist/cli.js pack spike-11 --format json`.
- Ran `node dist/cli.js validate --json`; validation passed with zero warnings and zero errors before spike closeout.
- Ran `git diff --check`; whitespace check passed before spike closeout.

# Known Issues / Follow-ups

- Implement task-415 through task-422 before docs and packed E2E closeout.
- Current checkpoint template is still generic; task-418 will add kind-specific checkpoint templates.

# Links / Artifacts

- spike-11
- task-414
- goal-22
