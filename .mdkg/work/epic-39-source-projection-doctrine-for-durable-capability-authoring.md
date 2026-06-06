---
id: epic-39
type: epic
title: source projection doctrine for durable capability authoring
status: done
priority: 1
tags: [projection, spec, skill, doctrine]
owners: []
links: []
artifacts: [.mdkg/design/dec-21-mdkg-spec-skill-source-of-truth-and-projection-doctrine.md, .mdkg/design/dec-22-codex-agents-as-projection-not-durable-capability-state.md, .mdkg/design/edd-14-spec-skill-template-taxonomy-and-codex-projection-architecture.md]
relates: [goal-6, edd-14]
blocked_by: []
blocks: [task-252]
refs: [dec-21, dec-22]
aliases: [source-projection-doctrine]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Define mdkg/SPEC/SKILL as durable state and `.codex/agents` as projection.

# Goal

Make the source/projection hierarchy explicit.

# Scope

Decision and design nodes only.

# Milestones

- Doctrine decisions added.
- EDD references the decisions.

# Out of Scope

- Exporter implementation.

# Risks

- Projection files become canonical by accident.

# Acceptance Criteria

- Durable source hierarchy is explicit.
- Projection-only doctrine is explicit.
- Draft Omni URI alignment is future-facing and optional.

# Links / Artifacts

- `dec-21`
- `dec-22`
- `edd-14`
