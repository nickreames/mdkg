---
id: goal-6
type: goal
title: harden mdkg skill and SPEC authoring foundation for capability projection
status: done
priority: 1
goal_state: achieved
goal_condition: The goal is complete when mdkg has durable source/projection doctrine, hardened author-mdkg-skill guidance, canonical Markdown SPEC/SKILL templates, Codex projection validation requirements, safe exporter deferral, future skill-factory backlog, generic agent-orchestration doctrine, and a root follow-up sync plan with validation evidence.
scope_refs: [epic-39, epic-40, epic-41, epic-42, epic-43, epic-44, epic-45, task-252, task-253, task-254, task-255, task-256, task-257, task-258, task-259, test-88, test-89, test-90, test-91, test-92, test-93, test-94]
active_node: task-259
required_skills: [select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [mdkg index, mdkg validate, mdkg skill validate author-mdkg-skill --json, mdkg goal show goal-6 --json, mdkg goal next goal-6 --json, mdkg capability search "SPEC template taxonomy" --json, mdkg capability search "runtime agent manifest" --json, mdkg capability search "orchestrator agent" --json, mdkg capability search "skill factory backlog" --json, git diff --check]
max_iterations: 20
blocked_after_attempts: 3
tags: [goal, skills, spec, projection, codex, templates, capability-authoring]
owners: []
links: []
artifacts: [.mdkg/skills/author-mdkg-skill/SKILL.md, .mdkg/templates/specs, .mdkg/templates/skills]
relates: [epic-39, epic-40, epic-41, epic-42, epic-43, epic-44, epic-45]
blocked_by: []
blocks: []
refs: [dec-21, dec-22, dec-23, dec-24, dec-25]
aliases: [skill-spec-authoring-foundation, capability-projection-foundation]
skills: [select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-05
---
# Objective

Make mdkg the durable authoring source for generic skills, specs,
capabilities, agent definitions, and projection surfaces.

# End Condition

- Source/projection doctrine exists and is discoverable.
- `author-mdkg-skill` supports SKILL and SPEC authoring standards.
- Canonical Markdown templates exist for the initial SPEC/SKILL taxonomy.
- Root Codex projection validation requirements are recorded.
- Exporter and skill-factory-agent implementation remain deferred behind
  explicit backlog.
- Root follow-up sync plan exists for consuming published mdkg assets.
- Public mdkg naming, templates, examples, and decision records avoid
  downstream product names. Downstream products may author product-specific
  SPECs after consuming mdkg's generic templates.
- Generic agent-orchestration doctrine exists for orchestrator agents,
  subagents, queue/event semantics, single-writer boundaries, and receipt
  closeout.

# Recursive Algorithm

```bash
mdkg goal show goal-6 --json
mdkg goal next goal-6 --json
mdkg goal claim goal-6 <work-id> --json
mdkg pack <work-id>
```

Work exactly the surfaced node. Do not implement a generator, exporter, package
publish, all-repo upgrade, or child repo sync unless a later task explicitly
selects that work.

# Current State

Initial doctrine, template assets, and `author-mdkg-skill` hardening were added
in this pass. The remaining active node is `task-258`, which defines the root
follow-up sync plan after mdkg publishes the hardened assets.

The active hardening pass reframes this goal from downstream product capability
projection to generic capability projection. mdkg remains the open-source
source of truth; downstream products are consumers and proof-of-concept users,
not canonical names for public mdkg templates or authoring guidance.

# Completion Evidence

- Source/projection doctrine exists in `edd-14`, `dec-21`, `dec-22`, `dec-23`,
  `dec-24`, and `dec-25`.
- `author-mdkg-skill` validates and now teaches generic SKILL/SPEC source,
  projection, safety, and repair-task rules.
- Canonical Markdown templates exist for base SKILL, base SPEC, project,
  agent, tool, model, runtime image, capability, integration, API, and runtime
  agent specs.
- `edd-14` records generic orchestrator/subagent vocabulary, queue/event
  semantics, single-writer boundaries, receipt lifecycle, and queue persistence
  doctrine.
- `dec-24` records optional generic capability URI fields and rejects
  downstream product names as canonical mdkg template naming.
- Exporter and skill-factory implementation remain deferred behind explicit
  backlog.
- `task-258`, `test-88`, `test-94`, and `task-259` are done with checkpoints.
- Required checks were run manually: `mdkg index`, `mdkg validate`,
  `mdkg skill validate author-mdkg-skill --json`, `mdkg goal show goal-6
  --json`, `mdkg goal next goal-6 --json`, capability searches for `SPEC
  template taxonomy`, `runtime agent manifest`, `orchestrator agent`, and
  `skill factory backlog`, product-name grep over current public
  doctrine/templates/goal/skill surfaces, template coverage grep, and
  `git diff --check`.
