---
id: epic-138
type: epic
title: Starlight docs implementation readiness
status: todo
priority: 1
tags: []
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
---
# Goal

Implement a real Starlight docs project under `docs/` while preserving the repo's existing generated docs and docs smoke checks.

# Scope

- Add Starlight/Astro app structure in `docs/`.
- Preserve or migrate current docs content into `src/content/docs/`.
- Keep generated command reference and existing `docs:check` compatibility.

# Milestones

- `docs/` builds locally with Starlight.
- Starlight navigation covers start-here, concepts, guides, advanced alpha, reference, and project docs.

# Out of Scope

- No hosted docs project setup until local docs pass.

# Risks

- Moving files could break current docs smokes; prefer copy/migration that preserves current checked paths until scripts are intentionally updated.

# Links / Artifacts

- `task-473`
- `task-474`
- `test-219`
