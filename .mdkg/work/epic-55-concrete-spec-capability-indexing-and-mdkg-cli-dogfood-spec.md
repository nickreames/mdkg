---
id: epic-55
type: epic
title: concrete SPEC capability indexing and mdkg CLI dogfood SPEC
status: done
priority: 1
tags: [spec, capability-index, dogfood, cli]
owners: []
links: []
artifacts: []
relates: [goal-9, edd-15]
blocked_by: []
blocks: [task-284, task-285, task-286, test-109, test-110]
refs: [dec-26]
aliases: [dogfood-cli-spec, concrete-spec-indexing]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Prove that concrete SPEC nodes are indexed and discoverable by shipping a
dogfood mdkg CLI tool SPEC.

# Acceptance Criteria

- `capability list --kind spec` returns at least the mdkg CLI dogfood SPEC.
- Capability search can find the CLI tool SPEC and its command matrix.
- A focused `mdkg spec` command surface or equivalent exposes list/show/validate.

# Scope

Concrete SPEC node, SPEC capability metadata, and focused SPEC discovery.

# Milestones

- `task-284`
- `task-285`
- `task-286`
- `test-109`
- `test-110`

# Out of Scope

- No exporter implementation.

# Risks

- A dogfood SPEC that is too broad could blur CLI, runtime, and docs contracts.

# Links / Artifacts

- `goal-9`
- `edd-15`

# Closeout

Completed by `task-284`, `task-285`, `task-286`, `test-109`, and `test-110`.

- The repo now includes a concrete dogfood mdkg CLI `SPEC.md`.
- SPEC records are indexed with capability metadata and discoverable via
  `capability list/search/show`.
- `mdkg spec list/show/validate` exposes the focused public SPEC helper
  surface for the dogfood record.
