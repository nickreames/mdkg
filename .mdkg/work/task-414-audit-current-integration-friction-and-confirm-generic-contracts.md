---
id: task-414
type: task
title: audit current integration friction and confirm generic contracts
status: done
priority: 1
epic: epic-105
parent: goal-22
tags: [audit, integration, contracts]
owners: []
links: []
artifacts: []
relates: [spike-11]
blocked_by: [spike-11]
blocks: [task-415, task-416, task-418, task-419, task-420, task-421]
refs: []
aliases: [integration-friction-audit]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Convert downstream integration feedback into generic mdkg product requirements before functional implementation begins.

# Acceptance Criteria

- Current mdkg behavior is audited for goal lifecycle, refs, checkpoints, workflow validation, warning output, queue docs, and pack/handoff UX.
- Downstream evidence is summarized without copying raw prompts, payloads, or secrets.
- Any product-specific naming is kept out of mdkg node titles, command names, templates, and public docs.
- Open implementation decisions are resolved or captured as design follow-ups.

# Files Affected

- Audit notes in this node or linked checkpoint only.

# Implementation Notes

- Runtime repos are read-only evidence sources during this task.
- Current mdkg source is the implementation authority; downstream adapter code is evidence of product friction, not the implementation target.
- Keep the terms and shipped templates generic. The external runtime repo may be referenced only in handoff deliverables or evidence notes.

# Confirmed Generic Contracts

- Completed-goal lifecycle: move final actionable work from `active_node` to `last_active_node` on done/achieved closeout; quiet `goal next` for completed goals.
- Semantic refs: add `context_refs` and `evidence_refs` on work nodes as non-executable lanes that index, search, show, pack, validate, and respect visibility/subgraph ownership.
- Cross-graph planning: keep configured subgraph qids read-only; explain blocker/readiness state without mutating child graphs.
- Checkpoints: add explicit checkpoint kinds for implementation, test proof, goal closeout, audit, and handoff evidence.
- Workflow validation: generalize SPEC/WORK/WORK_ORDER/RECEIPT validation and diagnostics so adapters do not duplicate mdkg semantic checks.
- Safety warnings: centralize obvious raw-secret, raw-prompt, raw-token, and raw-payload marker warnings; do not reject by default.
- Queue adapter contract: document and optionally expose the stable project DB queue contract while preserving that queue rows are delivery state, not canonical runtime history.
- Handoff UX: add `mdkg handoff create` as a first-class copy-ready agent handoff command backed by pack, goal state, checkpoints, refs, validation evidence, and safety warnings.

# Audit Evidence

- `src/commands/goal.ts` currently leaves `active_node` on done/achieved goals.
- `src/commands/mcp.ts` has an equivalent stale active-node warning path for MCP goal-next responses.
- `src/graph/node.ts` supports goal-only `scope_refs` and `active_node`; `last_active_node` and generic `context_refs` are absent.
- `src/graph/frontmatter.ts` includes `evidence_refs` ordering for agent workflow/proposal usage but not generic work-node context/evidence lanes.
- `src/graph/validate_graph.ts` already validates several workflow edges, so goal-22 should extend rather than replace this validation model.
- `src/commands/checkpoint.ts` currently routes all checkpoint creation through one generic template.
- `src/core/project_db_queue.ts` and `src/commands/db.ts` already provide concrete public queue behavior suitable for an adapter contract.
- The downstream adapter evidence shows mdkg consumers are duplicating raw-marker checks, workflow document discovery, receipt/proposal mirror validation, db verify/stats preflight, capability search, work-order status, receipt verification, and pack calls.

# Decisions Resolved

- No new design node is required before implementation; the scoped task/test stack is sufficient.
- Default raw-content handling is warning-first, with strict failure mode left as an optional future command flag if needed.
- The first handoff surface is a new `mdkg handoff create` command, not only a pack profile.
- Runtime adapter compatibility remains an external handoff task after mdkg surfaces are implemented.

# Test Plan

- node dist/cli.js validate --json
- git diff --check

# Links / Artifacts

- spike-11
- chk-175
