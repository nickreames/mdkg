---
id: edd-10
type: edd
title: mdkg goal node architecture and recursive agent loop
tags: [architecture, goal, agent-harness, recursive-work, skills]
owners: []
links: [https://developers.openai.com/codex/cli/slash-commands, https://code.claude.com/docs/en/goal, https://code.claude.com/docs/en/commands]
artifacts: []
relates: [prd-3, edd-3, edd-5, edd-8, epic-35]
refs: [rule-3, rule-4, rule-6]
aliases: [goal-node-architecture, recursive-agent-loop, pursue-mdkg-goal]
created: 2026-05-31
updated: 2026-06-01
---

# Overview

The future `goal` node type should make long-running agent objectives durable
inside mdkg. External harnesses such as Codex and Claude Code can keep a session
working toward a goal, but mdkg should hold the canonical objective contract,
recursive loop instructions, evidence requirements, and skill improvement
guardrails.

The goal node is work-like but distinct:

- `epic` is a strategic feature or roadmap container.
- `task` is one bounded executable unit.
- `skill` is a reusable procedure.
- `goal` is a recursive objective contract that chooses and completes concrete
  nodes until its end condition is achieved.

# Architecture

The first implementation should add the node contract before adding automation
depth. mdkg stores the durable goal record; the coding harness executes commands
and records evidence.

Recommended components:

- Goal template and schema for deterministic frontmatter plus human-readable
  body sections.
- Goal-scoped discovery in `mdkg goal next`, using selected local goal state
  when no id is provided and accepting `mdkg goal next <goal-id>` when explicit
  disambiguation is needed.
- Goal inspection and report-only evaluation in future `mdkg goal ...` helpers.
- Canonical `pursue-mdkg-goal` skill that implements the recursive loop.
- Pack support through existing graph traversal, with goal-scoped context and
  related skills included when requested.

Normal `mdkg next` should not select goals by default in the first release. It
should continue selecting concrete work. Goal-scoped next selection belongs in
`mdkg goal next <goal-id>` so general project triage and recursive objective
execution do not compete.

# Data model

The intended frontmatter fields are:

- `goal_state`: goal-specific state such as `active`, `paused`, `achieved`,
  `blocked`, or `budget_limited`.
- `goal_condition`: concise end condition suitable for external `/goal`
  prompts. Keep this under 4,000 characters for cross-harness compatibility.
- `active_node`: the current concrete child node being executed.
- `scope_refs`: explicit scope roots such as epics, features, tasks, bugs, and
  tests. Epics are containers; features, tasks, bugs, and tests are actionable
  candidates.
- `required_skills`: skill slugs the harness should load or consider.
- `required_checks`: report-only commands or checks that prove completion.
- `max_iterations`: optional cap for recursive loops.
- `blocked_after_attempts`: repeated blocker threshold before stopping.

The body should contain these sections:

- Objective
- End Condition
- Non-Goals
- Recursive Algorithm
- Required Skills
- Required Checks
- Acceptance Criteria
- Definition Of Done
- Stop Conditions
- Current State
- Iteration Log
- Skill Improvement Candidates
- Completion Evidence

The node remains Markdown-authoritative. SQLite and JSON indexes may project
goal metadata later, but they remain derived caches.

# APIs / interfaces

Future public CLI shape:

- `mdkg new goal "<title>"` scaffolds a goal node.
- `mdkg goal select <goal-id> --json` stores the selected goal in local ignored
  state.
- `mdkg goal current --json` reports the selected goal or the unique active
  goal fallback.
- `mdkg goal clear --json` clears the selected goal state.
- `mdkg goal show <goal-id> --json` reports condition, state, active node,
  required skills, required checks, and latest evidence.
- `mdkg goal next [goal-id]` selects the next feature, task, bug, or test inside
  the goal. The command is read-only.
- `mdkg goal claim [goal-id] <work-id>` writes `active_node` after a human or
  agent accepts the selected item.
- `mdkg goal evaluate <goal-id>` reports whether evidence appears complete; it
  does not run checks in the first implementation.
- `mdkg goal pause|resume|done <goal-id>` updates structured goal state.

The canonical skill behavior for `pursue-mdkg-goal`:

1. Load the goal with `mdkg show <goal-id>` and `mdkg pack <goal-id>`.
2. Inspect related open work, capabilities, subgraphs, and required skills.
3. If intent or child work is missing, research, ask targeted questions when
   needed, and create missing nodes with explicit evidence.
4. Select exactly one concrete active node.
5. Claim the selected node when durable active-node state is desired.
6. Work that node to 100% correctness and completeness.
7. Run or report the required checks from the goal and child node.
8. Record evidence on the child node and goal.
9. Evaluate the goal condition and definition of done.
10. If complete, mark achieved or done.
11. If blocked repeatedly, stop with blocker evidence.
12. Otherwise repeat from discovery.

# Failure modes

- Vague goal condition: require measurable end state and proof checks before
  marking active.
- Infinite loop risk: use `max_iterations`, `blocked_after_attempts`, and clear
  stop conditions.
- Context loss: require every iteration to record durable evidence before the
  next child node is selected.
- Skill drift: record improvement candidates during ordinary work, but edit
  skills only during explicit skill-maintenance nodes.
- Hidden runtime state: do not store completion proof only in chat history; link
  evidence into mdkg nodes, checkpoints, receipts, or artifacts.

# Observability

Goal progress should be inspectable through the goal node itself:

- Current `goal_state`.
- Current `active_node`.
- Latest iteration evidence.
- Required checks and their last reported results.
- Skill improvement candidates.
- Completion evidence or blocker evidence.

Future CLI JSON should expose deterministic envelopes so orchestration harnesses
can render dashboards or decide whether to continue.

# Security / privacy

Goal nodes must not encourage agents to bypass mdkg repo safety rules. Required
checks are report-only in the first implementation, and runtime permission
approval remains owned by the host harness.

Goal packs and public/internal visibility filtering must follow existing mdkg
pack, archive, bundle, and subgraph policy. Goal bodies should not contain raw
secrets, credentials, live payment state, or private runtime state.

# Testing strategy

Future implementation tests should prove:

- `goal` templates parse and validate.
- `mdkg new goal` creates validation-clean nodes.
- `list`, `search`, `show`, `pack`, and SQLite indexing include goal metadata.
- `mdkg next` does not accidentally select goals as concrete work.
- `mdkg goal next <goal-id>` selects only valid goal-scoped child work.
- `mdkg goal evaluate <goal-id>` is report-only and deterministic.
- `mdkg goal next` can use a selected goal and recursively expand scoped epics
  and features.
- The `pursue-mdkg-goal` skill can be packed and used in a fresh temp repo.

# Rollout plan

Target the goal node implementation as the next `0.1.5` feature slice after
the `0.1.4` subgraph release. Ship the durable node contract and skill-backed
recursive loop before adding deeper automation. Keep evaluation report-only
until real goal usage proves which checks should be executable by mdkg and
which should remain harness-owned.
