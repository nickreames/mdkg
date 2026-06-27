---
id: epic-200
type: epic
title: 0.3.9 collaboration doc and legacy alias transition
status: todo
priority: 1
tags: [0.3.9, collaboration, core-docs, compatibility]
owners: []
links: []
artifacts: [.mdkg/core/HUMAN.md, AGENT_START.md, assets/init/core]
relates: []
blocked_by: []
blocks: [task-597, test-304]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Goal

Rename the operator/collaboration profile concept to `COLLABORATION.md` while
keeping `HUMAN.md` as a one-release compatibility alias.

# Scope

- Canonical core doc rename plan and implementation task.
- Upgrade/init compatibility behavior.
- Alignment with the existing MANIFEST/SPEC compatibility bridge.

# Milestones

- `task-597`: implementation of canonical doc and alias behavior.
- `test-304`: compatibility contract across collaboration and manifest naming.

# Out of Scope

- Removing `HUMAN.md` in `0.3.9`; fade-out belongs to a later goal.

# Risks

- Existing initialized repos may have local `HUMAN.md` edits.
- Agent start docs can drift if both names are not handled explicitly.

# Links / Artifacts

- `dec-53`
- `dec-50`
- `task-597`
