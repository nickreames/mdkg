---
id: test-393
type: test
title: Two phase dormant then active website deployment is verified
status: todo
priority: 1
epic: epic-235
tags: [release, activation, deploy, two-phase]
owners: []
links: []
artifacts: []
relates: [goal-64, task-722]
blocked_by: [task-722]
blocks: []
refs: [task-722, dec-74, prop-8]
context_refs: [goal-62, goal-63, goal-64, epic-235, edd-71, dec-69, dec-73, dec-74, prop-8, test-386]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Verify public release promotion activates only after npm and global consumer
proof and that the second push deploys the intended source.

# Target / Scope

Dormant first commit, activation diff/second commit, Vercel/current domains.

# Preconditions / Environment

Published npm 0.5.0, passing `test-392`, approved deployment scope.

# Test Cases

- Prove before-state dormant and npm available.
- Prove dormant production omits or makes release routes unavailable and excludes
  release navigation, metadata, sitemap/LLM entries, indexing, and premature
  v0.5.0 version claims across both sites.
- Inspect activation-only diff and second push SHA.
- Verify both production deployments match the second commit.
- Confirm the one shared release-state change exposes the accepted announcement,
  top-level Loops docs, security walkthrough, and active 0.5.0 metadata on both
  custom domains.
- Confirm production matches accepted Process Rail copy and hierarchy from
  `dec-74`, while the Templates and forks docs retain the selected catalog
  treatment and mdkg/harness runtime boundary.

# Results / Evidence

Pending `task-722`.

# Notes / Follow-ups

- Deployment failure is fixed forward.
