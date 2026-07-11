---
id: edd-66
type: edd
title: First-class loop node operating model and reusable template lifecycle
tags: [loop, node-type, agent-harness, templates, planning]
owners: []
links: []
artifacts: []
relates: [goal-57, goal-58, dec-65]
refs: [edd-10, edd-63, goal-53, goal-57, goal-58, dec-65]
aliases: [loop-node-operating-model, loop-template-lifecycle]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Add a first-class mdkg `loop` node type to represent reusable, inspectable
agentic processes. A loop is more ambitious than a goal: it can coordinate
multiple goals and subgoals, link to tasks, tests, spikes, proposals,
checkpoints, receipts, events, decisions, artifacts, and other loops, and keep
working toward a high definition of done even when one path becomes blocked.

The planning stance is intentionally operating-model first. This EDD does not
define final low-level frontmatter fields, edge names, persistence rules, or
source implementation details. Those should be grounded in the actual mdkg
source during implementation planning.

# Acceptance State

Accepted for the mdkg-only planning lane on 2026-07-05. The implementation goal
remains paused and blocked until a later source-work session expands `goal-58`
from this EDD, `dec-65`, and the linked planning tasks/tests.

# Architecture

The ownership split is:

- mdkg CLI: high-level human and agent command surface.
- mdkg core: graph semantics, node/link rules, validation, migrations,
  persistence contracts, and derived indexes.
- mdkg loop core: loop lifecycle, template/fork/run behavior, linked-subnode
  materialization, quorum rules, context rules, blocker-continuation behavior,
  and template-promotion rules.
- mdkg context/index surfaces: deterministic context packs, derived search,
  show/list projections, and cache rebuilds.
- omni-room-runtime: agent execution, tools, approvals, sandboxes, traces, and
  model routing.
- Codex/plugins: specialized execution capabilities used by runtimes or
  operators, not mdkg core semantics.

The CLI should stay semantic rather than structural. It should expose commands
such as `mdkg loop list`, `mdkg loop show`, `mdkg loop fork`, `mdkg loop plan`,
and run/evidence inspection without making users hand-author raw graph edges.

Boundary decisions from `task-668`:

- `goal` remains outcome-oriented; `loop` is process-oriented.
- `skill` remains procedural instruction; `loop` is graph state with identity,
  lineage, evidence, and projections.
- Existing work nodes remain bounded units. A loop links them but does not
  replace tasks, tests, spikes, proposals, checkpoints, decisions, receipts, or
  goals.
- Agent workflow mirrors keep their existing semantics. Loop planning must not
  alter `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`,
  or `PROPOSAL.md`.
- Runtime execution remains outside mdkg. mdkg can prepare state, context, and
  validation contracts; omni-room-runtime and agent harnesses execute.
- Product-specific runtime or plugin names should not leak into generic mdkg
  primitive names.

## Source-Grounded Implementation Surface

`task-667` audited the current implementation and identified these required
source surfaces for the later implementation goal:

- `src/graph/node.ts`: add `loop` to allowed/work type contracts, parse
  frontmatter, extract loop attributes, and preserve existing goal validation.
- `.mdkg/templates/default/loop.md` plus bundled fallback templates: define the
  schema before validation can parse loop nodes.
- `src/commands/new.ts`: scaffold loop nodes or delegate to a dedicated
  `mdkg loop` command without inheriting goal's default active lifecycle by
  accident.
- `src/graph/goal_scope.ts` and `src/graph/validate_graph.ts`: decide whether
  loops are valid goal-scope roots, actionable nodes, containers, or contextual
  refs, and validate active/current loop state separately from goal state.
- `src/graph/indexer.ts`: ensure `ALLOWED_TYPES` and template schema loading can
  index loop nodes.
- `src/commands/list.ts`, `src/commands/search.ts`, and `src/commands/show.ts`:
  generic discovery should work after indexing, but user-facing loop semantics
  should be exposed through `mdkg loop`.
- `src/pack/pack.ts` and `src/pack/order.ts`: explicitly order loop packs and
  decide how linked subnodes, recent evidence, checkpoints, proposals, and
  receipts enter context.
- `src/cli.ts`, `CLI_COMMAND_MATRIX.md`, generated docs, and smoke/unit tests:
  add a first-class command family and keep documentation/test contracts in
  sync.

# Data model

MVP decision: `loop` is one node type. A loop may behave as a reusable template,
a scoped fork, or a run-bearing loop through metadata and graph links. Separate
`loop_template` and `loop_run` node types are out of MVP unless `dec-65` is
superseded.

Conceptually, a loop should be able to connect to:

- goals and subgoals it supports;
- definition of done and acceptance criteria;
- constraints and applicable rules;
- context sources, folders, docs, prior decisions, and evidence;
- steps or phases;
- runs, attempts, events, checkpoints, and receipts;
- evidence, observations, findings, recommendations, and decisions;
- outputs and artifacts;
- approvals, gates, evaluations, and validation results;
- other loops for recursive or follow-up process work.

Template/fork/run lifecycle:

- A template loop is reusable process knowledge.
- A scoped loop is forked or bound to a repo, folder, goal, or work surface.
- A run is execution evidence associated with a loop; implementation may model
  this through linked graph nodes, receipts, checkpoints, JSONL events, or a
  layered combination.
- A loop output is an artifact or graph update produced by a run.

Every fork should preserve provenance: source template, scope, linked goals,
constraints, version/hash or revision where practical, materialized children,
outputs, and reusable improvements proposed back to the template.

Fork policy from `task-669`:

- The fork gets a new loop identity; it does not mutate the source template.
- The fork records template lineage, scope binding, linked goals/subgoals,
  inherited constraints/context, materialized children, local specializations,
  and output/evidence refs.
- Default materialization creates linked child nodes immediately. A
  planning-only/no-child mode creates a scoped loop shell with pending
  materialization guidance.
- Template changes should make forks inspectably current or stale using recorded
  template identity/version/hash or accepted graph revision where practical.
- Reusable improvements from a fork become explicit template update proposals.
  They are never silently promoted back into the template.

# APIs / interfaces

Initial public CLI planning target:

- `mdkg loop list`
- `mdkg loop show <loop>`
- `mdkg loop fork <template> --scope <scope>`
- `mdkg loop plan <loop>`
- `mdkg loop runs <loop>` or equivalent evidence inspection if run evidence is
  represented through existing nodes/events

Agent-oriented flags should include structured output such as `--json`, and the
implementation should align with the existing show/discovery output family.

UX contract from `task-672`:

- CLI commands should express loop intent rather than requiring users to create
  raw nodes and edges by hand.
- `loop fork` should have deterministic preview/dry-run behavior before graph
  mutation where feasible.
- Receipts should include loop qid/path/type/title/status, mode, scope,
  template lineage, materialized children, warnings, and validation hints.
- Command wording must keep execution ownership clear: mdkg defines and
  preserves process state; runtimes execute agents and tools.

Default fork behavior should create linked child nodes immediately. A
planning-only or no-child materialization option should exist for cases where
operators want a scoped loop shell before subnode expansion.

Initial seed catalog from `task-671`:

- security audit;
- design/frontend UX audit;
- backend/API/CLI design-bloat audit;
- tech-stack best-practices audit;
- duplicate-code/linting audit;
- test/CI/SKILL.md infrastructure audit;
- user-story audit and recommendations.

These seed loops should be read-only or planning-oriented in MVP. Each seed
should declare intended mode, scope expectations, definition of done, expected
linked child nodes, evidence requirements, and blocker-continuation behavior.

# Failure modes

- Loop is treated as passive prose: validation and docs should describe it as a
  durable runtime-consumable graph object.
- Loop replaces goal semantics: keep goals outcome-oriented and loops
  process-oriented.
- CLI exposes raw graph mechanics: keep user-facing commands semantic and put
  structural rules in core APIs.
- Forks lose lineage: require template/source provenance.
- A loop blocks too early: require spike/proposal/recommendation behavior and
  continued progress on other scoped work when possible.
- Runtime concerns leak into mdkg: execution remains runtime-owned.
- CocoIndex scope leaks into loop implementation: keep provider/index planning
  in `goal-53` or a later successor.

Blocker-continuation policy from `task-670`:

- Branch blockers produce evidence on affected nodes rather than immediately
  blocking the whole loop.
- Material uncertainty should create or request a spike. If current external
  facts matter, the spike should ask the executing agent/harness for web search
  plus source-code grounding.
- Non-trivial blockers should create or request a proposal with at least three
  viable options and one recommended path.
- The loop should then continue toward other useful scoped work when possible.
- Whole-loop blocked state is reserved for repeated/global blockers that prevent
  meaningful progress across the remaining definition of done.

# Observability

Loop state should be explainable through mdkg graph queries and packs:

- why the loop exists;
- what scope it applies to;
- what goal or subgoal it supports;
- whether it came from a template and whether the fork is stale;
- what runs or attempts happened;
- what evidence, findings, decisions, outputs, blockers, and follow-ups exist;
- what validation or quorum checks were applied.

Current state should be a projection over durable nodes, links, events,
checkpoints, receipts, and decisions rather than a hidden mutable runtime state.

# Security / privacy

Loops must follow existing mdkg safety rules for packs, archive refs, bundles,
subgraphs, work mirrors, and visibility filtering. They must not store raw
secrets, credentials, provider payloads, live auth state, queue bodies, payment
state, or runtime state roots.

Read-only and write-capable loops should be distinguishable in the operating
model: audit/planning loops, patch-proposal loops, write-with-approval loops,
and autonomous local loops have different risk profiles.

# Testing strategy

Planning should produce test contracts for:

- canonical `loop` recognition and validation;
- loop search/show/list/pack discoverability;
- loop fork provenance;
- default child-node materialization plus planning-only/no-child option;
- blocker-continuation behavior that routes to spike, proposal with at least
  three options, and recommended path;
- seeded reusable loop catalog;
- preservation of `goal` behavior;
- CocoIndex remaining out of scope.

Implementation coverage from `task-673` should include parser/template tests,
creation/fork tests, validation tests for loop modes and provenance, generic
index/search/show/list tests, semantic `mdkg loop` command tests, pack ordering
and bounded-context tests, generated command matrix/docs checks, seed catalog
smokes, and regression checks proving existing goal behavior is preserved.

# Rollout plan

1. Finish `goal-57` planning and accept or supersede `dec-65`.
2. Populate `goal-58` with concrete source, docs, tests, template, seed, and
   validation scope.
3. Implement the minimal first-class node and CLI loop surface.
4. Seed read-only and planning loop templates.
5. Dogfood audit and planning loops before adding write-capable automation.
6. Keep CocoIndex optional-provider planning separate under `goal-53` or a
   future superseding goal.
