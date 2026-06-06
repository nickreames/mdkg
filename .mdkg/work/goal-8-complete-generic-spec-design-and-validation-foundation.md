---
id: goal-8
type: goal
title: complete generic SPEC design and validation foundation
status: done
priority: 1
goal_state: achieved
goal_condition: The goal is complete when mdkg has a decision-complete generic SPEC design foundation covering section semantics, frontmatter contracts, template and example coverage, validation diagnostics, capability indexing, projection drift policy, agent-orchestration contracts, compatibility, and release/adoption handoff evidence.
scope_refs: [epic-46, epic-47, epic-48, epic-49, epic-50, epic-51, epic-52, task-266, task-267, task-268, task-269, task-270, task-271, task-272, task-273, task-274, task-275, task-276, task-277, task-278, task-279, test-98, test-99, test-100, test-101, test-102, test-103, test-104, test-105]
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
- `task-267` defined required, conditional, optional, and diagnostic-policy
  semantics for canonical SPEC body sections and recorded `chk-45`.
- `task-268` defined canonical SPEC frontmatter and compatibility rules,
  including required keys, optional keys, unknown-key severity, migration, and
  downstream-extension policy; checkpoint `chk-46` records the closeout.
- `task-269` defined SPEC layout, naming, and template taxonomy, including the
  default-scaffold/rich-template split and future promotion policy; checkpoint
  `chk-47` records the closeout.
- `task-270` defined positive and negative SPEC example fixture coverage for
  the initial template taxonomy and recorded `chk-48`.
- `task-271` defined future SPEC validation diagnostics and command-surface
  options, preserving `mdkg validate` as the repo trust gate while recommending
  focused future `mdkg spec validate`; checkpoint `chk-49` records the
  closeout.
- `task-272` defined future SPEC capability index and discovery expectations,
  including read-only capability commands, `kind: spec` record fields, search,
  resolve, visibility, freshness, and imported subgraph policy; checkpoint
  `chk-50` records the closeout.
- `task-273` defined projection metadata, drift detection, no-secret export,
  diagnostics, and repair-work policy; checkpoint `chk-51` records the
  closeout.
- `task-274` defined the generic agent role SPEC contract for orchestrator,
  worker, reviewer, summarizer, and graph/project agents; checkpoint `chk-52`
  records the closeout.
- `task-275` defined queue event and receipt semantics for agent and
  runtime-agent SPECs, including TriggerEvent, AgentRun, AttemptReceipt,
  ValidationReceipt, FinalReceipt, queue state boundaries, retry/cancellation,
  dead-letter policy, single-writer invariants, and runtime-agent manifest
  expectations; checkpoint `chk-53` records the closeout.
- `task-276` defined the future SPEC parser, index, validation, diagnostics,
  command, template, upgrade, and projection-check implementation sequence,
  including source anchors, ordered phases, exit gates, package dry-run checks,
  and exporter deferral; checkpoint `chk-54` records the closeout.
- `task-277` defined SPEC template migration and backcompat policy, including
  current/compat/strict/downstream-local modes, upgrade dry-run receipt
  expectations, template promotion order, downstream extension preservation,
  test expectations, and release note boundaries; checkpoint `chk-55` records
  the closeout.
- `task-278` defined the root/downstream SPEC adoption handoff, including
  separate local accepted SHA, package publish, and root subgraph refresh paths,
  per-repo downstream adoption policy, all-repo sync deferral, handoff
  checklist, and adoption blockers; checkpoint `chk-56` records the closeout.
- Validation nodes `test-98` through `test-105` are done and record current
  evidence for recursive routing, section/frontmatter completeness, template
  and example coverage, capability discovery, diagnostics, projection
  drift/no-secret policy, agent-orchestration discoverability, and
  release/adoption readiness.
- Scoped epics `epic-46` through `epic-52` are done and record child closeout
  evidence for their goal-8 slices.
- `task-279` is done and records final closeout evidence for the goal.
- `chk-57` records the goal-8 design foundation closeout summary.
- Final checks passed: `node dist/cli.js index`, `node dist/cli.js validate
  --json`, `node dist/cli.js goal show goal-8 --json`,
  `node dist/cli.js goal next goal-8 --json`, the required capability
  searches, product-name grep over the new goal-8 lane, and `git diff --check`.
- `node dist/cli.js goal next goal-8 --json` returned `node: null` after the
  scoped tasks and validation nodes were closed.
- Source implementation, exporter work, package publish, root sync, downstream
  sync, and all-repo sync remain deferred to separately selected future goals.
