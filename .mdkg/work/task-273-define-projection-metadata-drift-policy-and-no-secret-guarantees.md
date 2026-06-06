---
id: task-273
type: task
title: define projection metadata drift policy and no secret guarantees
status: done
priority: 1
epic: epic-49
parent: goal-8
tags: [projection, drift, secrets, security]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-49, test-103]
blocked_by: [task-267]
blocks: [task-276]
refs: [edd-14, dec-21, dec-22]
aliases: [projection-drift-policy]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how SPEC source maps to projection surfaces and how drift is detected.

# Source Doctrine

`SPEC.md`, `SKILL.md`, mdkg design nodes, and mdkg work nodes are durable
source. Projection files are runtime-specific outputs or local adapters. A
projection may be useful to a runtime, but it must not become the only place a
durable capability, authority boundary, validation rule, queue/event contract,
resource permission, or receipt expectation is defined.

Projection surfaces include agent config files, runtime manifests, generated
protocol resources, package metadata, API reference exports, and local tool
profile files. They are reviewable artifacts, not canonical mdkg memory.

# Projection Metadata Contract

Every generated or manually maintained projection should carry enough metadata
to trace it back to source:

- `source_qid`: canonical mdkg/SPEC/SKILL node or capability id.
- `source_path`: repository-relative source path when available.
- `source_hash`: stable hash of the source content or normalized capability
  contract used to generate the projection.
- `source_updated`: source updated date or version marker.
- `projection_kind`: target surface, such as agent config, runtime manifest,
  package metadata, API reference, or protocol resource.
- `projection_version`: target schema or adapter version.
- `generated_by`: mdkg command, script, or manual authoring workflow.
- `generated_at`: deterministic timestamp for generated artifacts, or explicit
  author-supplied timestamp for manual projections.
- `projection_hash`: hash of the generated projection body after metadata is
  stripped or normalized.
- `visibility`: public, internal, or private boundary.
- `managed`: `generated`, `manual`, or `local-only`.

Manual projections still need source metadata. They may set `managed: manual`,
but they are not exempt from source linkage or no-secret checks.

# Drift Policy

Projection drift is detected by comparing the current source and projection
state against metadata:

- Source drift: current source hash differs from `source_hash`.
- Projection drift: projection content hash differs from `projection_hash`.
- Target drift: projection target schema differs from `projection_version`.
- Missing source: `source_qid` or `source_path` cannot be resolved.
- Projection-only behavior: a durable behavior appears in the projection but
  cannot be found in linked mdkg/SPEC/SKILL source.

Generated projection writers must not silently overwrite drift. The future
exporter should default to dry-run diagnostics, emit a reviewable receipt, and
require explicit apply intent before replacing files. If projection drift is
accepted, the durable follow-up is repair work: update the source SPEC/SKILL,
mark the projection local-only, or record a compatibility exception. Silent
projection overwrite is not a valid repair.

# No-Secret Export Policy

Projection generation and validation are fail-closed for sensitive material.
Projections must not export raw secrets, credentials, session tokens, local
auth state, provider credential values, production controls, private keys,
wallet or ledger state, hidden form values, personal host paths, or runtime
database contents.

Allowed references are opaque and non-sensitive, such as a generic
`credential_ref`, `secret_ref`, policy name, capability id, or environment
variable name. The referenced value remains outside mdkg and outside generated
projection content.

Unknown high-risk fields in templates or projections should produce an error
until explicitly classified. Redaction that leaves enough material to
reconstruct a secret is still a violation.

# Diagnostic And Repair Expectations

Future validation should report projection issues with stable diagnostics:

- `projection.missing_source`: required source metadata is absent or unresolved.
- `projection.source_stale`: source hash differs from projection metadata.
- `projection.manual_drift`: projection body changed after generation.
- `projection.target_schema_stale`: target schema version changed.
- `projection.secret_material`: forbidden sensitive material is present.
- `projection.behavior_without_source`: projection contains durable behavior
  not represented in source.

Repair work should be explicit and durable. A repair task may update source,
regenerate a projection, mark a file local-only, add an allowlisted opaque ref,
or remove unsafe content. It must not move canonical behavior into projection
files.

# Future Command Boundary

This task does not implement an exporter. A future command surface can expose a
projection check or export flow after SPEC parsing exists, but the default
behavior should remain non-mutating:

```text
mdkg spec project --check --json
mdkg spec project --target <surface> --dry-run --json
mdkg spec project --target <surface> --apply --receipt <path>
```

`mdkg validate` should continue to be the repository trust gate once projection
checks are wired in. Target-specific commands may provide sharper diagnostics,
but they should not replace the graph-wide validation pass.

# Acceptance Criteria

- Projection metadata links generated or manual projection files back to source
  SPECs.
- Manual edits are detectable and never silently overwritten.
- No secrets, credentials, local auth, provider config, or production controls
  are exported.
- Projection-only durable behavior creates repair work.

# Test Plan

- `mdkg capability search "projection drift policy" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Keep exporter implementation deferred.

# Links / Artifacts

- `goal-8`
- `epic-49`
