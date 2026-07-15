---
id: epic-251
type: epic
title: npm publication and clean consumer proof
status: done
priority: 1
tags: [release, npm, registry, consumer]
owners: []
links: []
artifacts: []
relates: [goal-71, edd-77, dec-83]
blocked_by: [epic-250]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-15
---
# Goal

Publish exactly mdkg@0.5.1 and prove the registry artifact works in a clean
temporary consumer environment.

# Scope

Registry absence/auth checks, npm publish, metadata/integrity/tarball inspection,
temporary installation, resolved binary, and archive command probes.

# Milestones

- `task-784` publishes once after exact-SHA CI.
- `test-445` records immutable registry and install evidence.

# Out of Scope

Unpublish, rollback, real-root mutation, and docs deployment.

# Risks

- Publication is irreversible.
- Local package caches must not substitute for registry-fetched proof.

# Links / Artifacts

- `task-784`
- `test-445`
- external links
