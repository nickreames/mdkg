---
id: epic-21
type: epic
title: hierarchical subgraph snapshot aggregation
status: backlog
priority: 4
tags: [future, subgraph, orchestration, snapshot-bundle, capability-cache]
owners: []
links: []
artifacts: []
relates: [epic-19, epic-20, epic-22, epic-23, epic-27]
blocked_by: [epic-22, epic-23]
blocks: []
refs: []
aliases: [subgraph-capability-aggregation]
skills: []
created: 2026-05-14
updated: 2026-05-14
---

# Goal

Design higher-level orchestration graphs that aggregate read-only child graph
snapshots from registered repos, submodules, agents, and projects.

The root graph should lazy-load child capabilities and semantic context from
full `.mdkg` snapshot bundles instead of scanning the full child checkout by
default.

# Scope

- Aggregate read-only child graph data from snapshot bundles.
- Preserve root/child boundaries for `agents/` and `project/` submodule
  orchestration models.
- Preserve cache freshness and source visibility metadata.
- Avoid mutating child graph state from the root import view.

# Milestones

- Root orchestration graphs can search, show, and pack imported child graph
  snapshot content.
- Aggregated records include source repo, source commit, bundle freshness,
  public/private profile, and visibility metadata.
- Higher-level graphs can lazy-load child capabilities and subagents without
  scanning full submodule contents.
- Child repos remain the mutation owners for their full mdkg graph state.

# Out of Scope

- No direct write-through mutation into child snapshots.
- No generated semantic summaries unless a later design explicitly approves them.
- No hosted orchestration service.

# Risks

- Root graphs may reason over stale child snapshots unless freshness and commit
  metadata are prominent.
- Private-local snapshots must not be mistaken for public/export-safe bundles.
- Child repo cache failures should degrade clearly without corrupting root graph
  state.

# Links / Artifacts

- `epic-19`
- `epic-20`
- `epic-22`
- `epic-23`
- Future implementation should add subgraph aggregation fixtures and consumer-repo smoke coverage.
