---
id: goal-14
type: goal
title: Add first-class research spike work-node support for mdkg.dev readiness
status: todo
priority: 1
goal_state: active
active_node: task-347
goal_condition: Ship first-class research spike work-node support through implementation, docs, packed temp-repo smoke coverage, and prepublish dry-run readiness for the next mdkg release slice.
scope_refs: [epic-76, epic-77, task-347, task-348, task-349, task-350, task-351, test-142, test-143, test-144]
required_skills: [pursue-mdkg-goal, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:spike, npm run smoke:command-docs, npm run prepublishOnly, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [spike, research, mdkg-dev, node-type, roadmap]
owners: []
links: []
artifacts: []
relates: [epic-69, epic-74, epic-75]
blocked_by: []
blocks: []
refs: [goal-11, goal-13]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Objective

Add `spike` as a first-class mdkg work-node type for research, planning,
documentation discovery, security/UX/data-structure investigation, and
structured creation of follow-up mdkg nodes and skill-authoring work.

# End Condition

- `mdkg new spike "..." --json` creates validation-clean `spike-#` nodes under
  `.mdkg/work/`.
- Spike nodes participate in the same first-class work flows as task-like nodes:
  `mdkg task start/update/done`, `mdkg next`, `mdkg goal next`, `mdkg goal claim`,
  search, show, pack, validate, and generated command contract/docs.
- The default spike template guides research question framing, web/docs/mdkg
  search plans, findings, options, recommendation, follow-up nodes, skill
  candidates, evidence, and mdkg.dev launch implications.
- Packed temp-repo smoke coverage proves spike creation, lifecycle, discovery,
  goal routing, pack inclusion, follow-up node planning, and skill candidate
  recording from an installed tarball.
- Prepublish dry-run readiness passes without a real npm publish, tag, or push.

# Non-Goals

- No automatic web search execution in the mdkg CLI.
- No automatic creation of follow-up nodes or `SKILL.md` files in the first pass.
- No top-level `mdkg spike ...` namespace in this slice.
- No public worker execution, public event/reducer/lease/materializer CLI, or
  downstream migration automation from paused `goal-11`.
- No mdkg.dev website implementation; this goal creates the research node type
  and dogfoods it toward that launch.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `pursue-mdkg-goal`
- `author-mdkg-skill`
- `verify-close-and-checkpoint`

# Required Checks

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`
- `npm run smoke:spike`
- `npm run smoke:command-docs`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `spike` is accepted by parser, validators, templates, creation, task lifecycle,
  next selection, goal traversal, pack ordering, command docs, and init assets.
- Docs state that spikes are research/planning work nodes, not execution agents.
- The smoke proves the public CLI experience from a temp repo using an installed
  package tarball.
- Dogfood evidence creates or updates mdkg.dev launch planning through spike
  output, not scattered notes.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.
- Do not run a real npm publish, git tag, or push unless separately requested.

# Current State

`mdkg@0.3.1` is published and globally installed. Existing work-node types do
not include `spike`; this goal starts with `task-347` to lock the semantics and
release boundary before implementation.

# Iteration Log

- No iterations recorded yet.

# Skill Improvement Candidates

- Capture any repeatable spike authoring workflow as a future update to
  `author-mdkg-skill`.

# Completion Evidence

- Pending.
