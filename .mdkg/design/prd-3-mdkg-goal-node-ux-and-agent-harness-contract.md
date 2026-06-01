---
id: prd-3
type: prd
title: mdkg goal node ux and agent harness contract
tags: [goal, agent-harness, recursive-work, ux, skills]
owners: []
links: [https://developers.openai.com/codex/cli/slash-commands, https://code.claude.com/docs/en/goal, https://code.claude.com/docs/en/commands]
artifacts: []
relates: [edd-10, edd-3, edd-5, edd-8, epic-35]
refs: [rule-3, rule-4, rule-6]
aliases: [goal-node-ux, recursive-goals, agent-goal-contract]
created: 2026-05-31
updated: 2026-06-01
---

# Problem

Coding agents now support long-running goal behavior, but mdkg only has durable
work containers and bounded work items. Epics capture product scope and tasks
capture executable units, but neither is a precise contract for a recursive
agent loop that should keep selecting, creating, executing, checking, and
improving work until an end condition is satisfied.

mdkg needs a first-class goal UX that lets humans define durable completion
conditions and lets coding harnesses pursue those conditions inside repo
guardrails. The goal record must survive context compaction, session restarts,
and handoffs between Codex, Claude Code, and future orchestrators.

# Goals

- Add a durable product concept for goal-oriented work that can guide long
  agent sessions without replacing epics, tasks, or skills.
- Make goal intent measurable: the node must state the desired end state, the
  required proof, constraints, definition of done, and stop conditions.
- Support recursive execution: inspect the graph, select or create the next
  concrete node, work one node at a time, record evidence, evaluate completion,
  and repeat until done or blocked.
- Keep normal `mdkg next` focused on concrete work selection. `mdkg goal next`
  should use the selected goal when present, while `mdkg goal next <goal-id>`
  remains available for explicit disambiguation.
- Use mdkg skills as the procedural backing for goal pursuit, including skill
  improvement proposals when a repeatable workflow can be made better.

# Non-goals

- Do not make mdkg an autonomous executor in the first goal release.
- Do not run goal checks inside mdkg initially; checks are report-only and are
  run by the human or agent harness.
- Do not let normal goal execution edit skills opportunistically.
- Do not replace epics, tasks, work orders, receipts, or checkpoints.
- Do not create hidden agent state outside the committed mdkg graph.

# Requirements

## Functional

- A goal must have a concise condition that can fit inside coding harness goal
  prompts. The compatibility target is 4,000 characters because Claude goal
  conditions are documented with that limit; longer context belongs in the mdkg
  body.
- A goal must describe one measurable end state and the checks that prove it.
  Examples: `npm run test` exits 0, a backlog query is empty, a pack includes
  expected evidence, or a publish dry-run reports a target version.
- A goal must identify the current active node when a child task is being
  pursued, but selecting the next item must remain read-only. Durable active
  node updates happen through an explicit claim/set-active command.
- A goal must declare deterministic scope roots through `scope_refs`. Scoped
  epics and features can contain child work, while features, tasks, bugs, and
  tests are iterable work items.
- A goal must support recursive selection: if no suitable child node exists, the
  agent should research, ask for alignment when needed, create missing nodes
  with explicit evidence, and then continue.
- A goal must record required skills and required checks so harnesses can
  report the same proof across Codex, Claude Code, and future runtimes.
- A goal must have stop conditions: maximum iterations, repeated blocker count,
  budget exhaustion, user pause, or satisfied definition of done.
- A goal must capture skill improvement candidates as evidence. Skill edits are
  allowed only when the active node is explicitly skill-maintenance.

## Non-functional

- The UX must be readable as plain Markdown and reviewable in Git.
- Goal state must be deterministic enough for indexing, search, pack, and
  future SQLite cache projection.
- The model must be safe for multi-agent handoff: each loop iteration should
  point at one active node and leave durable evidence before moving on.
- Goal nodes must stay compatible with mdkg's source-of-truth hierarchy:
  source code and tests, then mdkg rules/design/work nodes, then skills, then
  prior chat history.

# Acceptance Criteria

- A future `goal` node template can be understood by humans without tool
  support.
- Coding harnesses can load a goal, choose one next node, and know how to prove
  progress.
- Goal completion is based on evidence in the mdkg graph or transcript, not on
  unstated model judgment.
- The UX explains that `mdkg next` remains general work selection while
  `mdkg goal next` is selected-goal work selection and
  `mdkg goal next <goal-id>` is explicit goal-scoped work selection.
- Skill self-improvement is controlled through recorded candidates and explicit
  skill-maintenance work.

# Metrics / Success

- Fresh mdkg repos can create and pack a goal node with all required intent.
- Agents can resume a goal after context compaction by reading only the goal,
  related nodes, and required skills.
- Long-running tasks produce fewer ad hoc plans and more durable child nodes,
  checkpoints, receipts, and improvement candidates.
- Goal closeout includes executed checks, evidence paths, remaining risks, and
  a clear achieved or blocked state.

# Risks

- If goal nodes become too broad, agents may loop without producing concrete
  child-node evidence.
- If checks become executable too early, mdkg may blur the boundary between
  durable graph and runtime harness.
- If skill improvement is too permissive, skills may drift away from original
  reusable intent.
- If the goal condition is too long or vague, external `/goal` harnesses may not
  evaluate it reliably.

# Open Questions

- Should the first implementation expose `mdkg goal evaluate` or keep evaluation
  entirely in the skill body until usage stabilizes?
- Should `goal_state` live alongside normal `status`, or should goal-specific
  states be encoded only in body sections for the first implementation?
- Should goal loop evidence eventually produce receipt nodes, checkpoints, or a
  dedicated goal iteration artifact?

# 2026-06-01 Alignment

- Use `scope_refs` as the explicit goal ownership field.
- Persist the selected goal in local ignored state so agents can run
  `mdkg goal next` without repeating an id.
- Keep `goal next` read-only; use an explicit claim/set-active command to write
  `active_node`.
- Treat `feat`, `task`, `bug`, and `test` as actionable goal candidates.
- Treat `epic` as a scope container that expands to descendant work.
