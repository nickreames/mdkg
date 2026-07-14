---
id: dec-83
type: dec
title: Publish v0.5.1 with explicit approval no tag and fix-forward verification
status: accepted
tags: [release, v0.5.1, approval, no-tag, fix-forward]
owners: []
links: []
artifacts: []
relates: [goal-71, goal-70, edd-77, goal-64]
refs: [goal-71, goal-70, edd-77, goal-64]
aliases: []
created: 2026-07-14
updated: 2026-07-14
---
# Context

The ownership fix changes mutation selection and needs real consumer proof, but
versioning, push, npm publication, global replacement, root mutation, and public
deployment are irreversible or externally visible operations.

# Decision

- Goal 70 keeps package version 0.5.0 and produces a local implementation commit.
- Goal 71 alone bumps package/lockfile/changelog to 0.5.1.
- One explicit approval must enumerate push, npm publication, real global
  replacement, root command execution, and documentation deployment.
- Push the immutable candidate to a release branch and open a draft pull
  request so exact-SHA CI can pass without advancing `main`.
- Keep `main` unchanged until npm publication and the real root proof pass,
  because both Vercel production projects auto-deploy Git pushes to `main`.
- Require exact-SHA pull-request CI before npm publication.
- Publish to npm `latest`, verify integrity and clean installation, then perform
  the real root proof. Fast-forward `main` to the same candidate SHA only at the
  documentation gate, then verify both Git-triggered production deployments.
- Create no Git tag by default.
- Never unpublish or roll back 0.5.1; repair post-publication defects forward.

# Alternatives considered

- Bump the version in Goal 70. Rejected to keep implementation readiness
  reversible and publication ownership isolated.
- Skip the real root proof. Rejected because mixed local/imported ownership is
  the motivating consumer topology.
- Reuse Goal 64. Rejected because it is terminal v0.5.0 release history.

# Consequences

The release lane has an explicit approval boundary and complete consumer proof.
The release branch prevents source publication from implicitly becoming an
early production documentation deployment.
Unrelated root state may remain only after operator classification and must be
shown unchanged. A post-publication failure creates a fix-forward follow-up.

# Links / references

- `goal-70`
- `goal-71`
- `edd-77`
- `goal-64`
