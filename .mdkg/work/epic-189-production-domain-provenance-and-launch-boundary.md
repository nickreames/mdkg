---
id: epic-189
type: epic
title: production domain provenance and launch boundary
status: done
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
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Define the production-domain cutover boundary and record baseline evidence before implementation.

# Scope

- Goal creation and routing proof.
- Current DNS/Vercel/live-route evidence.
- Explicit no-announcement, no-publish, no-tag, no-analytics, and no-GitHub-settings boundary.

# Milestones

- `task-563` closes the graph-only creation pass.
- `spike-21` captures cutover risk research.
- `test-281` proves routing and scope.

# Out of Scope

- Source implementation beyond later goal-36 tasks.
- Vercel or DNS mutation during the creation-only pass.

# Risks

- Confusing goal creation with domain execution.
- Accidentally committing unrelated untracked image files.

# Links / Artifacts

- `goal-36`
- `task-563`
- `test-281`
- `chk-255`
- `chk-270`

# Closeout

Completed under `goal-36`. The production-domain cutover boundary was kept
clear: custom-domain deployment and verification were in scope; npm publish,
tagging, analytics activation, GitHub settings mutation, and public
announcement were not performed.
