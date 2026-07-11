---
id: task-669
type: task
title: Define loop template fork run provenance and stale-fork policy
status: done
priority: 1
epic: epic-209
parent: epic-209
tags: [loop, planning, templates, forks, provenance]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, epic-209, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Define how a loop can be reused as a template, forked into a scoped loop, and
associated with run evidence without introducing separate MVP node types.

# Acceptance Criteria

- Template loop, scoped/forked loop, run-bearing loop, and loop output are
  defined conceptually.
- Forks preserve source template, scope, linked goals, constraints, materialized
  children, version/hash or revision where practical, and produced outputs.
- Default fork behavior creates linked child nodes immediately.
- A planning-only/no-child materialization option is defined.
- Stale-fork detection and template-promotion concepts are captured.
- The design avoids separate `loop_template` and `loop_run` node types for MVP.

# Files Affected

Planning-only graph/docs targets:

- `.mdkg/design/edd-66-*`
- `.mdkg/design/dec-65-*`
- `.mdkg/work/test-346-*`

# Implementation Notes

- Do not decide exact field names until implementation audits the current node
  schema and validation code.
- Prefer provenance that can be rebuilt or verified from committed graph state.

# Lifecycle Policy

MVP uses one first-class node type: `loop`.

- Template loop: a reusable process pattern. It should record purpose,
  intended mode, definition of done, expected child-node plan, constraints,
  context expectations, and evaluation guidance.
- Scoped loop: a fork or bound instance of a template for a repo, folder, goal,
  subgoal, or other mdkg scope. It receives a new identity and preserves
  lineage to the template.
- Run-bearing loop: the same loop identity after one or more attempts have
  produced evidence. Run evidence may be linked checkpoints, receipts, JSONL
  events, proposals, artifacts, findings, decisions, or summaries.
- Loop output: durable artifacts and graph updates produced by a run, including
  findings, recommendations, decisions, child goals/tasks/tests/spikes, and
  follow-up loops.

# Fork Provenance Requirements

A fork should preserve enough lineage to answer:

- which template produced this loop;
- which template version, hash, revision, or accepted graph state was used;
- what scope the fork applies to;
- which goals/subgoals it supports;
- which constraints and context refs were inherited or rebound;
- which child nodes were materialized by default;
- which local specializations differ from the template;
- which outputs and reusable improvements came from the fork.

# Materialization Defaults

- Default: `mdkg loop fork` should create linked child nodes immediately when
  the template defines expected planning/audit subnodes.
- Optional: a planning-only/no-child mode should create only the scoped loop
  shell with lineage, scope, and pending materialization guidance.
- Child materialization should be deterministic enough for dry-run previews and
  test fixtures.

# Stale Fork And Promotion Policy

- Template mutation must not silently rewrite forks.
- If the source template changes, derived forks should be inspectable as current
  or stale based on recorded template identity/version/hash.
- Useful local learning from a fork should become an explicit template update
  proposal, not an automatic parent-template mutation.
- Promotion should separate local project detail from reusable process
  improvement before changing the template.

# Test Plan

- `mdkg show edd-66`
- `mdkg show test-346`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `epic-209`
- `test-346`
- `edd-66`
