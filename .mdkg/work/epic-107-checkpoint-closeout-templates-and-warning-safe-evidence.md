---
id: epic-107
type: epic
title: checkpoint closeout templates and warning-safe evidence
status: todo
priority: 1
tags: [checkpoint, templates, evidence]
owners: []
links: []
artifacts: []
relates: [goal-22]
blocked_by: [task-414]
blocks: [task-418, test-184]
refs: []
aliases: [checkpoint-template-hardening, closeout-evidence-templates]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Make checkpoints more useful as durable closeout memory instead of thin generated shells.

# Scope

- Add checkpoint kinds for implementation milestones, test proofs, goal closeout, read-only audits, and handoffs.
- Improve `mdkg task done --checkpoint` and `mdkg checkpoint new` templates.
- Include evidence, commands, pass/fail status, known warnings, changed surfaces, boundaries, and follow-up refs.
- Emit warnings for obvious raw-secret, raw-prompt, or raw-payload markers.

# Acceptance Criteria

- Generated checkpoints pass recommended-heading validation.
- Raw-content risk markers are warnings, not hard failures.
- Checkpoint templates are covered by unit and temp-repo smoke tests.

# Milestones

- Add checkpoint kind selection.
- Update task done checkpoint behavior.
- Prove generated headings and safety warnings.

# Out of Scope

- Perfect secret detection or storing raw runtime payloads in checkpoints.

# Risks

- Richer templates must stay concise enough for repeated agent use.

# Related Work

- task-418
- test-184

# Links / Artifacts

- goal-22
