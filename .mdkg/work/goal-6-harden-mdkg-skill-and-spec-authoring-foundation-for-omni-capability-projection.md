---
id: goal-6
type: goal
title: harden mdkg skill and SPEC authoring foundation for Omni capability projection
status: blocked
priority: 1
goal_state: paused
goal_condition: The goal is complete when mdkg has durable source/projection doctrine, hardened author-mdkg-skill guidance, canonical Markdown SPEC/SKILL templates, root Codex projection validation requirements, safe exporter deferral, future skill-factory backlog, and a root follow-up sync plan with validation evidence.
scope_refs: [epic-39, epic-40, epic-41, epic-42, epic-43, epic-44, epic-45, task-252, task-253, task-254, task-255, task-256, task-257, task-258, task-259, test-88, test-89, test-90, test-91, test-92, test-93, test-94]
active_node: task-258
required_skills: [select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [mdkg index, mdkg validate, mdkg skill validate author-mdkg-skill --json, mdkg goal show goal-6 --json, mdkg goal next goal-6 --json, mdkg capability search "SPEC template taxonomy" --json, mdkg capability search "skill factory backlog" --json, git diff --check]
max_iterations: 20
blocked_after_attempts: 3
tags: [goal, skills, spec, projection, codex, templates, omni]
owners: []
links: []
artifacts: [.mdkg/skills/author-mdkg-skill/SKILL.md, .mdkg/templates/specs, .mdkg/templates/skills]
relates: [epic-39, epic-40, epic-41, epic-42, epic-43, epic-44, epic-45]
blocked_by: []
blocks: []
refs: [dec-21, dec-22, dec-23, dec-24, dec-25]
aliases: [skill-spec-authoring-foundation, omni-capability-projection-foundation]
skills: [select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-05
---
# Objective

Make mdkg the durable authoring source for Omni skills, specs, capabilities,
agent definitions, and Codex projections.

# End Condition

- Source/projection doctrine exists and is discoverable.
- `author-mdkg-skill` supports SKILL and SPEC authoring standards.
- Canonical Markdown templates exist for the initial SPEC/SKILL taxonomy.
- Root Codex projection validation requirements are recorded.
- Exporter and skill-factory-agent implementation remain deferred behind
  explicit backlog.
- Root follow-up sync plan exists for consuming published mdkg assets.

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
