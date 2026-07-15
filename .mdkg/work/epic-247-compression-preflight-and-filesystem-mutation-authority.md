---
id: epic-247
type: epic
title: Compression preflight and filesystem mutation authority
status: done
priority: 1
tags: [archive, preflight, filesystem, atomic-write]
owners: []
links: []
artifacts: []
relates: [goal-70, edd-76, dec-82, dec-80]
blocked_by: [epic-246]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Goal

Ensure the complete selected set is valid before the first archive write while
preserving centralized filesystem authority and per-file atomic replacement.

# Scope

Selection-plan separation, ownership/path/raw-input preflight, containment,
symlink checks, deterministic ordering, and apply-time atomic writes.

# Milestones

- `task-778` implements the plan/apply boundary.
- Invalid-set and security compatibility tests pass.

# Out of Scope

Cross-archive rollback after unexpected apply-time I/O failure.

# Risks

- Preflight must not reimplement or weaken shared path authority.
- Existing archive lock and reindex behavior must remain compatible.

# Links / Artifacts

- `dec-80`
- `task-778`
- `test-440`
- external links
