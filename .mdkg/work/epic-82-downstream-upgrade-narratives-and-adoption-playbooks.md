---
id: epic-82
type: epic
title: downstream upgrade narratives and adoption playbooks
status: todo
priority: 2
tags: [mdkg-dev, downstream, upgrades, adoption]
owners: []
links: []
artifacts: []
relates: [task-359, test-150]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Goal

Explain how downstream repos adopt mdkg safely using dry-run-first upgrade
plans, handoff prompts, and no-cross-repo-mutation boundaries.

# Scope

- downstream upgrade narratives
- dry-run migration examples
- handoff playbooks
- child repo safety boundaries

# Milestones

- `task-359` writes upgrade narratives and handoff playbooks.
- `test-150` validates the narrative contract.

# Out of Scope

- Automated downstream migration implementation.
- Mutating child repos from root orchestration.

# Risks

- Upgrade docs can imply automation that does not exist yet.

# Links / Artifacts

- `goal-15`
- `task-359`
- `test-150`
