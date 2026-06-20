---
id: epic-111
type: epic
title: handoff command and cross-repo agent prompt packaging
status: todo
priority: 1
tags: [handoff, pack, agent]
owners: []
links: []
artifacts: []
relates: [goal-22]
blocked_by: [task-416, task-418]
blocks: [task-422, task-423, test-188]
refs: []
aliases: [handoff-command, agent-handoff-packaging]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Create first-class sanitized handoff packaging for agents and cross-repo work.

# Scope

- Add `mdkg handoff create <id-or-qid>` as a public command.
- Build on pack, checkpoints, goal state, refs, boundaries, and validation evidence.
- Emit raw-content warnings and structured receipts.
- Keep manual node detail writing with the human or coding agent; the CLI packages context and safety boundaries.

# Acceptance Criteria

- Handoff output is copy-ready for an agent and includes objective, current state, boundaries, required checks, relevant nodes, checkpoints, validation evidence, and next actions.
- Handoff creation fails closed only for structural errors; raw-content markers are warnings unless strict mode is explicitly enabled.
- Tests prove sanitized output excludes obvious raw secret/prompt/payload content.

# Milestones

- Add `mdkg handoff create`.
- Integrate handoff with pack/checkpoint/goal state.
- Prove sanitized output in temp repo.

# Out of Scope

- Automatic node detail authoring or autonomous runtime execution.

# Risks

- Handoff output must be useful without overpromising complete secret detection.

# Related Work

- task-422
- task-423
- test-188

# Links / Artifacts

- goal-22
