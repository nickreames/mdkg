---
id: task-668
type: task
title: Define loop versus goal skill runtime and work-node boundaries
status: done
priority: 1
epic: epic-208
parent: epic-208
tags: [loop, planning, boundaries, ownership]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, epic-208, edd-66, dec-65, edd-10, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Define the service and semantic boundaries for `loop` so it does not blur into
goals, skills, runtime jobs, receipts, or arbitrary config.

# Acceptance Criteria

- `loop` is described as durable graph state for reusable processes.
- `goal` remains outcome-oriented and is not replaced.
- Skills remain procedural instructions and do not become graph state.
- omni-room-runtime remains responsible for execution, approvals, tools,
  sandboxes, traces, and model routing.
- Existing work/order/receipt/feedback/dispute/proposal semantics remain
  unchanged.
- Boundary decisions and open questions are reflected in `edd-66`.

# Files Affected

Planning-only graph/docs targets:

- `.mdkg/design/edd-66-*`
- `.mdkg/design/dec-65-*`
- `.mdkg/work/goal-57-*`

# Implementation Notes

- Use the local `service-boundary-ownership-check` skill when grounding the
  implementation pass.
- Be explicit about product-specific runtime names that should not become
  generic mdkg public primitives.

# Boundary Decisions

- `loop` is durable mdkg graph state for reusable agentic processes. It owns
  process identity, purpose, scope, lineage, linked subnodes, evidence refs,
  current projection, and design-time lifecycle semantics.
- `goal` remains durable outcome state. Goals answer what outcome should become
  true; loops answer what reusable process is being followed to make progress
  and preserve learning.
- `skill` remains procedural instruction for agents. A skill may help execute a
  loop, but a skill is not the loop's graph state, lineage, or evidence record.
- Existing work nodes remain bounded work items. Loops can link tasks, tests,
  spikes, proposals, checkpoints, decisions, receipts, and goals, but they do
  not replace those node types.
- Work mirrors remain semantic mirrors. `WORK.md`, `WORK_ORDER.md`,
  `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md` behavior should
  remain unchanged.
- mdkg core owns graph semantics, validation, indexing, pack/context behavior,
  templates, migrations, and command surface.
- mdkg loop core owns template/fork/run semantics, child materialization,
  blocker-continuation guidance, provenance, quorum/evaluation concepts, and
  template-promotion rules.
- omni-room-runtime owns execution: agents, tools, approvals, sandboxes, traces,
  model routing, runtime state, and external tool invocation.
- Codex/plugins provide specialized execution capabilities to the runtime or
  operator. They should not become generic mdkg public primitive names.

# Open Questions For Implementation Planning

- Should loop be a goal-scope container, actionable work type, or separate
  process type for routing purposes?
- Which loop lifecycle fields are required at parse time versus validated by
  higher-level loop commands?
- Should run evidence be represented entirely by existing linked nodes/events
  in MVP, or should a minimal run summary live on the loop node?
- How should stale template forks be detected without making derived indexes an
  authoritative source of truth?
- Which loop modes should be valid in MVP beyond read-only audit and planning?

# Test Plan

- `mdkg show edd-66`
- `mdkg show dec-65`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `epic-208`
- `edd-66`
- `dec-65`
