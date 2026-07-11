---
id: epic-211
type: epic
title: Design mdkg loop CLI UX and context surfaces
status: todo
priority: 1
tags: [loop, planning, cli, context, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, edd-66, dec-65, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Goal

Design a high-level loop command and API surface that is useful to humans and
agents without exposing low-level graph construction details.

# Scope

- Minimal `mdkg loop` family shape: `list`, `show`, `fork`, `plan`, and
  run/evidence inspection.
- Structured output expectations for agents.
- Context-pack behavior for loops, forks, and scoped planning.
- Human-facing wording that presents loops as durable process state, not shell
  execution or passive prose.
- Relationship to existing `mdkg goal`, `mdkg task`, `mdkg pack`, `mdkg search`,
  and `mdkg show` surfaces.

# Milestones

- Draft command UX expectations.
- Define semantic command behavior vs internal graph rules.
- Create future implementation checks for CLI tests and command matrix updates.

# Out of Scope

- Implementing command handlers.
- Exposing structural `node create --edge ...` style UX.
- Runtime execution commands.

# Risks

- CLI flag bloat could make loops harder to use than raw graph nodes.
- Agent JSON output could drift from existing discovery/show conventions.
- Users could misread `loop run` wording as mdkg owning runtime execution.

# Links / Artifacts

- `goal-57`
- `task-672`
- `edd-63`
