---
id: epic-114
type: epic
title: warning-scale validate and heading formatter UX
status: todo
priority: 1
tags: [warnings, validate, format, headings, ux]
owners: []
links: []
artifacts: []
relates: [goal-23]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Goal

Make validation and heading-format dry-runs usable in warning-heavy repos without losing full machine diagnostics.

# Scope

- `validate` warning summaries grouped by id, category, node type, path, and top qids.
- `validate --summary`, `--limit`, and `--json-out` behavior.
- `format --headings --dry-run --summary --json --limit` summary-first receipts.
- Unit coverage for 1000+ warnings and JSON output compatibility.

# Milestones

- Warning summary contract specified.
- Validate and format commands implemented.
- High-volume fixtures pass without unbounded stdout.

# Out of Scope

- No automatic heading application without `--apply`.
- No removal of existing full JSON arrays.

# Risks

- Large JSON receipts can still be intentionally large when callers ask for full diagnostics.
- Summary fields must stay deterministic enough for CI assertions.

# Links / Artifacts

- spike-12
- task-429
- task-430
- task-431
- test-191
- test-192
- test-193
