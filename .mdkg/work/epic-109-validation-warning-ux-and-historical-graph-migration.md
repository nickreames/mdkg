---
id: epic-109
type: epic
title: validation warning UX and historical graph migration
status: todo
priority: 1
tags: [validation, warnings, migration]
owners: []
links: []
artifacts: []
relates: [goal-22]
blocked_by: [task-414]
blocks: [task-420, test-186]
refs: []
aliases: [warning-ux, heading-migration, validation-noise]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Reduce baseline warning noise while preserving strict graph correctness.

# Scope

- Add typed warning categories and machine-readable remediation metadata.
- Provide a changed-warning mode so large historical graphs can focus on current edits.
- Add a dry-run/apply heading migration path for recommended-heading drift.
- Keep full graph errors strict even when warning output is filtered.

# Acceptance Criteria

- Warning filters do not hide graph errors.
- Heading migration dry-run reports planned changes before writing.
- Historical warning reduction is proven in temp repos with intentionally noisy nodes.

# Milestones

- Add typed warning metadata.
- Add changed-warning view.
- Add heading migration dry-run/apply proof.

# Out of Scope

- Silencing validation errors or hiding graph correctness failures.

# Risks

- Warning filters can confuse operators if they imply a partial graph validation result.

# Related Work

- task-420
- test-186

# Links / Artifacts

- goal-22
