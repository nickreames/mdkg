---
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: epic-118
type: epic
title: planning source archive and provenance
status: todo
priority: 1
---
# Goal

Make the planning source bundle durable, verifiable, and linked to every distilled planning node.

# Scope

- Archive mdkg_planning_docs.zip as private source evidence.
- Keep original source file paths visible for reviewer traceability.
- Verify the archive sidecar before closing ingestion work.

# Milestones

- Archive bundle is created.
- Archive verification passes.
- Goal 1 evidence refs point to the archive.

# Out of Scope

- No transformation of planning docs into public docs.
- No deletion of original committed planning files.

# Risks

- Archive cache drift if sidecar is not verified after creation.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
