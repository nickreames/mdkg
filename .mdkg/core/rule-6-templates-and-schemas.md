---
id: rule-6
type: rule
title: mdkg templates and schemas (global templates, required frontmatter, body guidance)
tags: [mdkg, templates, schema]
created: 2026-01-06
updated: 2026-01-06
---

# Templates and schemas

This rule defines:
- global template sets
- required frontmatter fields per node type
- recommended body headings for agent-friendly editing
- the token substitution contract used by `mdkg new`

## Global templates (v1)

Templates are global and live at:

- `.mdkg/templates/<set>/<type>.md`

Workspace overrides are disabled in v1.

### Template sets

Recommended sets:
- `default` (balanced)
- `minimal` (lean body headings)
- `verbose` (more guidance, more sections)

All sets should provide the same set of types.

## Token substitution

Templates are filled using simple token replacement.

Required tokens supported by v1:
- `{{id}}`
- `{{type}}`
- `{{title}}`
- `{{created}}`
- `{{updated}}`
- `{{status}}` (work items only)
- `{{priority}}` (work items only)

Optional tokens (nice-to-have, may be empty):
- `{{epic}}`
- `{{parent}}`
- `{{prev}}`
- `{{next}}`
- `{{relates}}` (list)
- `{{blocked_by}}` (list)
- `{{blocks}}` (list)
- `{{tags}}` (list)
- `{{owners}}` (list)
- `{{links}}` (list)
- `{{artifacts}}` (list)
- `{{refs}}` (list)
- `{{aliases}}` (list)

## Frontmatter requirements by type

All nodes:
- `id`
- `type`
- `title`
- `created` (YYYY-MM-DD)
- `updated` (YYYY-MM-DD)

Searchable metadata (optional)

All nodes MAY include the following searchable frontmatter lists:
- `tags: [a, b, c]`
- `owners: [a, b, c]`
- `links: [ref, ref]` (any searchable reference string; may include URLs)
- `artifacts: [ref, ref]` (build outputs, releases, commits, PRs, tarballs, etc.)
- `refs: [id, id]` (non-edge references to other nodes)
- `aliases: [text, text]` (extra searchable terms)

List fields SHOULD be written as `[]` when empty.
Optional scalar graph fields (like `epic`, `parent`, `prev`, `next`) should be omitted when empty.

Work items (`epic/feat/task/bug/chk`):
- `status` (enum)
- optional `priority` (0..9)
- optional graph edges: `epic`, `parent`, `relates`, `blocked_by`, `blocks`, `prev`, `next`

Decision records (`dec-*`):
- `status` (enum: `proposed`, `accepted`, `rejected`, `superseded`)
- optional `supersedes: dec-#`

Design docs (`prd/edd/prop`):
- no required status field
- recommended `tags`

Rules (`rule-*`):
- no required status field

## Body headings (guidance only)

Body headings are strongly recommended for agent usability but should not be hard requirements.

### Task / bug template headings (recommended)

- Overview
- Acceptance Criteria
- Files Affected
- Implementation Notes
- Test Plan
- Links / Artifacts

### Epic template headings (recommended)

- Goal
- Scope
- Milestones
- Out of Scope
- Risks
- Links / Artifacts

### Checkpoint template headings (recommended)

- Summary
- Scope Covered
- Decisions Captured
- Implementation Summary
- Verification / Testing
- Known Issues / Follow-ups
- Links / Artifacts

### PRD headings (recommended)

- Problem
- Goals
- Non-goals
- Requirements
- Acceptance Criteria
- Metrics / Success
- Risks
- Open Questions

### EDD headings (recommended)

- Overview
- Architecture
- Data model
- APIs / interfaces
- Failure modes
- Observability
- Security / privacy
- Testing strategy
- Rollout plan

### Decision record headings (recommended)

- Context
- Decision
- Alternatives considered
- Consequences
- Links / references

## Validation behavior

- Frontmatter: strict, hard fail if invalid.
- Body headings: warn only (do not break indexing).
- If a template is missing:
  - `mdkg new` must fail with a helpful error (exit code 3).