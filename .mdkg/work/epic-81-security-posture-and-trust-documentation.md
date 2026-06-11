---
id: epic-81
type: epic
title: security posture and trust documentation
status: todo
priority: 2
tags: [mdkg-dev, security, trust, no-secret]
owners: []
links: []
artifacts: []
relates: [task-358, test-149]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Goal

Make mdkg.dev credible on security and trust by documenting local-first
boundaries, no-secret rules, generated artifacts, and repository safety.

# Scope

- no-secret public docs
- local runtime vs committed state explanation
- project DB runtime/state guidance
- subgraph and downstream mutation boundaries
- public audit checks

# Milestones

- `task-358` writes security/trust docs.
- `test-149` audits public docs and examples for no-secret safety.

# Out of Scope

- Formal security certification.
- Public claims not backed by repo behavior or tests.

# Risks

- Public docs can accidentally leak local paths or overstate safety.

# Links / Artifacts

- `goal-15`
- `task-358`
- `test-149`
