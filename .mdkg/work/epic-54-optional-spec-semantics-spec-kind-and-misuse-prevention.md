---
id: epic-54
type: epic
title: optional SPEC semantics spec_kind and misuse prevention
status: done
priority: 1
tags: [spec, spec-kind, validation, diagnostics]
owners: []
links: []
artifacts: [.mdkg/templates/default/spec.md, .mdkg/templates/specs]
relates: [goal-9, edd-15]
blocked_by: []
blocks: [task-282, task-283, test-107, test-108]
refs: [dec-26]
aliases: [optional-spec-semantics, spec-misuse-prevention]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Make `SPEC.md` optional and useful while preventing it from becoming a generic
planning document.

# Acceptance Criteria

- Allowed `spec_kind` values are implemented for new SPEC files.
- Repos with no SPEC files validate.
- Documentation-only SPEC misuse is diagnosed with repair guidance.

# Scope

SPEC semantics, validation, and diagnostics.

# Milestones

- `task-282`
- `task-283`
- `test-107`
- `test-108`

# Out of Scope

- No downstream repo migration in this epic.

# Risks

- Over-validating SPEC could break legacy agent-style fixtures.

# Links / Artifacts

- `goal-9`
- `dec-26`

# Closeout

Completed by `task-282`, `task-283`, `test-107`, and `test-108`.

- Optional `SPEC.md` semantics and allowed `spec_kind` values are defined.
- Validation keeps repositories without `SPEC.md` valid.
- Misuse diagnostics distinguish reusable capability specs from generic
  planning documents and provide repair guidance.
