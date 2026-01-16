---
id: dec-7
type: dec
title: checkpoints (chk) are first-class compression nodes
status: accepted
tags: [checkpoints, mdkg, pack]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Context

Long-running projects accumulate many nodes. Packs can become too large and time-consuming for humans and agents.

We need a way to summarize completed phases while retaining references and verification details.

# Decision

- add `chk-*` nodes as first-class checkpoint records
- checkpoints summarize a set of work and can serve as context anchors
- checkpoints are allowed per workspace
- checkpoint templates include structured sections for summary, scope, verification, and links
- checkpoints should link to the epic and key docs via edges
- checkpoints may include a `scope: [id, ...]` frontmatter list when practical

# Alternatives considered

- rely on linking many done tasks (reject): packs become noisy and slow to read
- external summaries in README/wiki (reject): not graph-connected or pack-aware

# Consequences

- agents can consume checkpoint summaries instead of many individual nodes
- packs can prefer checkpoints (optional future flag) to reduce size
- project continuity improves significantly

# Links / references

- none
