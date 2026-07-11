---
id: dec-69
type: dec
title: Publish v0.5.0 with one approval two phase push no tag and real global verification
status: accepted
tags: [release, approval, npm, deploy, decision]
owners: []
links: []
artifacts: []
relates: [goal-64, edd-72]
refs: [goal-64, edd-72, goal-61, goal-62, goal-63]
aliases: [v0-5-0-release-side-effect-policy]
created: 2026-07-10
updated: 2026-07-10
---
# Context

Publishing changes registry, origin, the real global tool, and production sites.
The release needs one explicit authorization boundary and an order that keeps
public availability claims behind package proof.

# Decision

- Goal 64 owns the `0.5.0` package/lockfile bump and finalized changelog.
- After all local dry-runs pass, request one explicit approval covering external
  security/advisory checks, first push, npm publish, real global replacement,
  second push, and production deployment.
- First push the package release commit while the public announcement flag is
  dormant; require green CI.
- Publish and verify npm, temp consumers, upgrade, and `/opt/homebrew` global
  behavior before activating the sites in a second push.
- Do not create a Git tag by default.
- Never unpublish a successful npm release; fix subsequent failures forward.

# Alternatives considered

- Publish before pushing source. Rejected because registry provenance would
  temporarily lack an origin commit.
- Push active website copy with the package commit. Rejected because the site
  could advertise an unavailable package.
- Create a matching Git tag automatically. Rejected because the operator chose
  no tag by default.
- Use only a temporary global prefix. Rejected because the operator requires
  verification of the real `/opt/homebrew` installation.

# Consequences

Goal 3 must implement a deterministic dormant activation mechanism. Goal 4 must
prepare a clean first release commit, stop for one approval, preserve strict
push/publish/activation ordering, and record receipts for each irreversible or
environment-changing operation.

# Links / references

- `edd-72`
- `goal-64`
- `task-716` through `task-723`
