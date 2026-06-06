---
id: epic-49
type: epic
title: projection metadata drift detection and no secret export policy
status: todo
priority: 1
tags: [projection, drift, security, privacy]
owners: []
links: []
artifacts: []
relates: [goal-8, task-273, test-103]
blocked_by: [epic-46]
blocks: [task-273, test-103]
refs: [edd-14, dec-21, dec-22]
aliases: [projection-drift-policy, no-secret-export-policy]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how durable SPEC state maps to projection surfaces such as agent config,
runtime manifests, packages, and API docs.

# Goal

Make projection linkage and drift handling safe before any exporter is built.

# Scope

- Projection source metadata.
- Drift detection expectations.
- No-secret export policy.

# Milestones

- Complete `task-273` and `test-103`.

# Acceptance Criteria

- Projection metadata is traceable to source SPECs.
- Manual drift is detectable.
- Secrets, credentials, local auth state, and provider config are never exported
  from SPEC templates.

# Out of Scope

- Real projection exporter implementation.

# Risks

- Projection files become canonical by accident.

# Links / Artifacts

- `goal-8`
- `dec-22`
