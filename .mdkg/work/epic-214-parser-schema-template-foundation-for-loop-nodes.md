---
id: epic-214
type: epic
title: Parser schema template foundation for loop nodes
status: todo
priority: 1
tags: [loop, implementation, node-type, template]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Establish the minimum source foundation for `type: loop`: parser acceptance,
schema/template support, and fixture-ready metadata without changing runtime
execution semantics.

# Scope

- Add `loop` to mdkg-owned node type recognition.
- Define and ship a validation-clean default loop template.
- Preserve existing `goal` parsing and all Omni semantic file behavior.

# Milestones

- `task-675` accepts and exposes loop node attributes.
- `task-676` adds templates and init/upgrade fallback coverage.
- `test-351` proves parser/template validation works.

# Out of Scope

- No `loop_template` or `loop_run` node types.
- No runtime execution, model routing, tool invocation, or CocoIndex work.

# Risks

- Accidentally treating loops as goals instead of process nodes.
- Missing template fallback paths used by init/upgrade scaffolds.

# Links / Artifacts

- `goal-58`
- `edd-66`
- `dec-65`
