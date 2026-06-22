---
id: epic-117
type: epic
title: repo-local skill guidance for multi-repo mdkg workflows
status: todo
priority: 1
tags: [skills, multi-repo, subgraph, workflow]
owners: []
links: []
artifacts: []
relates: [goal-23]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Goal

Teach repo-local mdkg skills the safe sequence for warning-heavy multi-repo upgrade and subgraph refresh workflows.

# Scope

- Update canonical `.mdkg/skills` guidance for read-only baselines, matrix approval, one-repo-at-a-time upgrades, child commits before root sync, and no raw secrets/prompts/payloads.
- Sync mirrored skill projections when required.
- Validate changed skills and graph state.

# Milestones

- Skill text reflects safe multi-repo sequencing.
- Mirrored skills are synchronized when local checks require it.
- Skill validation and graph validation pass.

# Out of Scope

- No new skill family unless existing skills cannot cover the workflow.
- No child-repo edits.

# Risks

- Skill guidance must stay generic and mdkg-owned, not product-specific.
- Projection mirrors can drift if not synced after canonical edits.

# Links / Artifacts

- task-433
