---
id: task-347
type: task
title: align spike semantics release boundary and mdkg.dev research use cases
status: done
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, semantics, release-boundary, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-348]
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Lock the exact semantics for the new `spike` node type before implementation.
This prevents the feature from drifting into a browser/search executor,
automatic skill generator, or separate command namespace.

# Acceptance Criteria

- Decide and document that the public node type is `spike`, with ids `spike-#`
  and storage under `.mdkg/work/`.
- Define `spike` as an actionable work-node type compatible with existing task
  lifecycle, next selection, goal routing, search/show, pack, validate, and
  command docs.
- Define the first-pass template sections for research question, search plan,
  findings, options, recommendation, follow-up nodes, skill candidates,
  security/UX/data-structure/algorithm notes, evidence, and mdkg.dev launch
  implications.
- Confirm non-goals: no automatic web search, no automatic node/SKILL.md
  creation, no `mdkg spike` namespace, no worker execution.

# Files Affected

- `.mdkg/work/task-347-*`
- Implementation follow-ups under `task-348` through `task-351`

# Implementation Notes

- Treat this as a product/contract alignment task. It should end with a concise
  implementation contract that `task-348` can execute without further product
  decisions.
- Use current work-node behavior as the compatibility baseline.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-14 --json`

# Links / Artifacts

- `goal-14`
- `epic-76`

# Spike Semantics Contract

The new public node type is `spike`.

- It is an actionable work-node type, stored under `.mdkg/work/`, with allocated
  ids like `spike-1`.
- It participates in existing work flows: `mdkg new spike`, `mdkg task
  start/update/done`, `mdkg next`, `mdkg goal next`, `mdkg goal claim`, search,
  show, pack, validate, and generated command docs.
- It is not a passive note. Open spikes are eligible work candidates when they
  are scoped to a goal or otherwise rank in normal next selection.
- It is not an autonomous browser, web search, or research execution engine.
  Agents/humans perform research with their available tools and record findings
  in the spike.
- It does not automatically create follow-up mdkg nodes or `SKILL.md` files in
  the first release. The template should make recommended follow-up nodes and
  skill candidates explicit so an agent can create them intentionally.
- It does not introduce a public `mdkg spike ...` namespace in this slice.
  Convenience commands such as `mdkg spike summarize` remain deferred until the
  base work-node behavior has real dogfood evidence.

# Template Contract

The default spike template should include these body sections:

- Research Question
- Context And Constraints
- Search Plan
- Findings
- Options And Tradeoffs
- Recommendation
- Follow-Up Nodes To Create
- Skill Candidates
- Data Structures And Algorithms Notes
- UX Notes
- Security Notes
- mdkg.dev Launch Implications
- Evidence And Sources

Sources and citations stay in Markdown body sections for now. No structured
frontmatter citation schema is required in the first implementation pass.

# Release Boundary

`task-348` owns implementation. `task-349` owns docs and publish-readiness
alignment. `task-350` owns packed temp-repo smoke coverage. `task-351` dogfoods
real spike usage toward mdkg.dev planning.

This foundation can target the next source release line, but this task does not
publish, tag, or push.

# Evidence

- `task-347` started and this contract was written before implementation work.
- Decisions captured from the alignment pass: `spike` remains a work-node type;
  convenience namespace deferred; Markdown source/evidence sections for now;
  mdkg.dev gets a broader umbrella goal for later dogfooding.
