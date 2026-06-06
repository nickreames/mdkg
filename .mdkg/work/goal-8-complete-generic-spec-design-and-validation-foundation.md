---
id: goal-8
type: goal
title: complete generic SPEC design and validation foundation
status: progress
priority: 1
goal_state: active
goal_condition: The goal is complete when mdkg has a decision-complete generic SPEC design foundation covering section semantics, frontmatter contracts, template and example coverage, validation diagnostics, capability indexing, projection drift policy, agent-orchestration contracts, compatibility, and release/adoption handoff evidence.
scope_refs: [epic-46, epic-47, epic-48, epic-49, epic-50, epic-51, epic-52, task-266, task-267, task-268, task-269, task-270, task-271, task-272, task-273, task-274, task-275, task-276, task-277, task-278, task-279, test-98, test-99, test-100, test-101, test-102, test-103, test-104, test-105]
active_node: task-267
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [mdkg index, mdkg validate, mdkg goal show goal-8 --json, mdkg goal next goal-8 --json, mdkg capability search "SPEC section contract" --json, mdkg capability search "SPEC validation diagnostics" --json, mdkg capability search "projection drift policy" --json, mdkg capability search "runtime agent manifest" --json, mdkg capability search "orchestrator agent" --json, git diff --check]
max_iterations: 24
blocked_after_attempts: 3
tags: [goal, spec, validation, templates, projection, agent-orchestration]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/default/spec.md]
relates: [epic-46, epic-47, epic-48, epic-49, epic-50, epic-51, epic-52]
blocked_by: []
blocks: [task-266, task-267, task-268, task-269, task-270, task-271, task-272, task-273, task-274, task-275, task-276, task-277, task-278, task-279, test-98, test-99, test-100, test-101, test-102, test-103, test-104, test-105]
refs: [edd-14, dec-21, dec-22, dec-23, dec-24, dec-25]
aliases: [generic-spec-design-foundation, spec-validation-foundation, spec-section-contract]
skills: [pursue-mdkg-goal, select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Objective

Turn the generic SPEC/SKILL foundation from `goal-6` into a decision-complete
SPEC design backlog that can later drive parser, validator, template, example,
projection, and adoption work without downstream product naming.

# End Condition

- Required and optional SPEC section semantics are defined.
- Canonical SPEC frontmatter keys and compatibility rules are defined.
- Template layout, naming, and example fixture coverage are specified.
- Future SPEC validation diagnostics and command-surface options are specified.
- SPEC capability indexing and discovery expectations are specified.
- Projection metadata, drift detection, and no-secret policy are specified.
- Orchestrator, worker, reviewer, summarizer, graph/project, and runtime-agent
  SPEC contracts are specified.
- Queue/event/receipt semantics for agent SPECs are specified.
- Parser/index/validation implementation sequence and migration policy are
  defined.
- Release and downstream adoption handoff is recorded.

# Non-Goals

- No exporter implementation.
- No package publish.
- No all-repo sync.
- No downstream product naming in mdkg canonical docs or templates.
- No source implementation unless a later `goal-8` task explicitly selects it.

# Recursive Algorithm

```bash
mdkg goal show goal-8 --json
mdkg goal next goal-8 --json
mdkg goal claim goal-8 <work-id> --json
mdkg pack <work-id>
```

Work exactly the surfaced node. Run required checks, record evidence, evaluate
the goal, and continue until the end condition is achieved or a real blocker is
recorded.

# Required Checks

- `mdkg index`
- `mdkg validate`
- `mdkg goal show goal-8 --json`
- `mdkg goal next goal-8 --json`
- `mdkg capability search "SPEC section contract" --json`
- `mdkg capability search "SPEC validation diagnostics" --json`
- `mdkg capability search "projection drift policy" --json`
- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "orchestrator agent" --json`
- product-name grep over new `goal-8` lane and new SPEC design nodes
- `git diff --check`

# Current State

`goal-6` genericized the public authoring foundation and was locally committed
as `mdkg: genericize SPEC and agent projection foundation`. This goal starts the
next phase: full generic SPEC design and validation planning.

# Completion Evidence

- `task-266` completed the current SPEC template/default scaffold audit and
  recorded the first handoff checkpoint at `chk-44`.
- `active_node` now routes to `task-267` for the required and optional SPEC
  section contract design pass.
