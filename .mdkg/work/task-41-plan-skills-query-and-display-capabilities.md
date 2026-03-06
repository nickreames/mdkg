---
id: task-41
type: task
title: plan skills query and display capabilities
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, query]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-5]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Define capability-level contracts for skills discovery and display in mdkg query flows while keeping exact CLI command names deferred.

# Acceptance Criteria

- Skills discovery requirements are documented for list/show/search capability surfaces.
- Skills searchability fields are explicitly defined (slug, name, description, tags, path).
- Metadata-only and full-body skill view capabilities are documented.
- Discovery-to-load flow is explicit: metadata search first, full body on demand.
- CLI naming remains non-normative in this phase.

# Files Affected

- src/commands/list.ts
- src/commands/show.ts
- src/commands/search.ts
- src/cli.ts
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md

# Implementation Notes

- Keep resolution behavior deterministic and avoid ambiguous query semantics.
- Keep current node query behavior unchanged until skills capability is implemented.

# Test Plan

Future implementation should validate discoverability/search coverage for indexed skills (`test-12`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-5
- epic-4
