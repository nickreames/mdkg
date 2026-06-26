---
id: epic-195
type: epic
title: implement MANIFEST parser validation and duplicate detection
status: todo
priority: 1
tags: [manifest, parser, validation, diagnostics]
owners: []
links: []
artifacts: []
relates: [goal-37, edd-54, dec-50]
blocked_by: [epic-194]
blocks: [task-575, task-576, test-289, test-290, test-291]
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-parser-validation, manifest-duplicate-detection, spec-legacy-diagnostics]
skills: []
created: 2026-06-25
updated: 2026-06-25
---
# Goal

Make `MANIFEST.md` the canonical parsed semantic file while preserving legacy
`SPEC.md` input and rejecting ambiguous duplicate files.

# Scope

- Internal semantic kind normalization.
- File basename recognition for `MANIFEST.md` and legacy `SPEC.md`.
- Frontmatter validation for canonical, legacy, and transitional forms.
- Deprecation warnings and duplicate-file ambiguity errors.

# Milestones

- `task-575`: semantic kind and basename recognition.
- `task-576`: validation, warnings, and ambiguity errors.
- `test-289` through `test-291`: parser and validation contracts.

# Out of Scope

- No removal of legacy `SPEC.md`.
- No changes to non-manifest workflow file semantics.

# Risks

- Normalizing too aggressively could hide duplicate source files.
- Accepting transitional frontmatter without warnings could prolong confusion.

# Links / Artifacts

- `goal-37`
- `edd-54`
- `dec-50`
- external links
