---
id: epic-108
type: epic
title: agent workflow validation and reusable integration templates
status: todo
priority: 1
tags: [spec, work, validation, templates]
owners: []
links: []
artifacts: []
relates: [goal-22, goal-8, goal-9]
blocked_by: [task-414]
blocks: [task-419, test-185]
refs: []
aliases: [workflow-validation-hardening, integration-fixtures]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Strengthen generic SPEC, WORK, WORK_ORDER, and RECEIPT validation so integration repos do not hand-roll the same semantic checks.

# Scope

- Add or improve workflow validation commands for reusable capability contracts, execution requests, and receipt mirrors.
- Provide generic fixtures and templates for coordinator, worker, capability, order, and receipt patterns.
- Warn on obvious raw-secret, raw-prompt, raw-token, or raw-payload markers.

# Acceptance Criteria

- Valid fixtures pass focused validation.
- Invalid refs, missing required semantics, and raw-content markers produce typed diagnostics.
- No shipped template or docs node uses product-specific naming.

# Milestones

- Add focused workflow validation commands or subcommands.
- Add generic workflow fixtures.
- Prove raw-marker warning behavior.

# Out of Scope

- Making mdkg the canonical runtime execution ledger.

# Risks

- Workflow validation must remain generic and avoid adapter-specific assumptions.

# Related Work

- task-419
- test-185

# Links / Artifacts

- goal-22
