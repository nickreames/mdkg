---
id: epic-246
type: epic
title: Archive ownership selection and target resolution
status: done
priority: 1
tags: [archive, ownership, targeting, subgraph]
owners: []
links: []
artifacts: []
relates: [goal-70, edd-76, dec-82]
blocked_by: []
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

Resolve archive identity and writable ownership before any filesystem path is
derived.

# Scope

Enabled local workspace selection, `--all --ws`, qid targeting, deterministic
duplicate handling, and imported/disabled/unknown workspace errors.

# Milestones

- Disposable failure fixture passes.
- `task-777` and ownership-focused tests close.

# Out of Scope

Compression writes, public docs deployment, and subgraph source mutation.

# Risks

- Portable ID compatibility must remain stable.
- Imported identities must be rejected without converting virtual paths.

# Links / Artifacts

- `edd-76`
- `dec-82`
- `task-777`
- external links
