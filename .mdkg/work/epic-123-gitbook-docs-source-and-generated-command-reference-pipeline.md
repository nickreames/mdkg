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
id: epic-123
type: epic
title: GitBook docs source and generated command reference pipeline
status: todo
priority: 1
---
# Goal

Create repo-canonical GitBook docs source and generated command-reference drift checks.

# Scope

- Scaffold /docs source.
- Generate command docs from command contract.
- Add drift checks and docs smoke.

# Milestones

- Docs source exists.
- Generated command reference is reproducible.
- Drift check fails on stale hand edits.

# Out of Scope

- No hand-maintained command reference as source of truth.

# Risks

- Generated docs could leak internal command metadata if visibility filters are incomplete.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
