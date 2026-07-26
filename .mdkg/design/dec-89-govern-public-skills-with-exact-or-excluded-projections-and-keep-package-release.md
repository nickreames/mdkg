---
id: dec-89
type: dec
title: Govern public skills with exact or excluded projections and keep package release authority repository-local
status: accepted
tags: [skills, public-seed, portability, policy]
owners: []
links: []
artifacts: []
relates: [loop-7]
refs: [loop-7, dec-19, dec-85, goal-74, task-805, test-465]
aliases: []
created: 2026-07-25
updated: 2026-07-25
---
# Context

The Loop 7 audit proved all eight canonical repository skills are exact in the
configured `.agents` and `.claude` mirrors, while the public init seed contains
six members and three of those bodies diverge from canonical. Directory
presence alone cannot distinguish an intentional public catalog from stale
copies.

`root:dec-85` also requires package publication to remain a repository-local
workflow. Exact projection is safe only after the six public bodies are
portable and publication authority is isolated.

# Decision

## Policy Modes

The first policy version supports only:

- `exact`: one portable canonical body must equal configured mirrors, public
  source, built public seed, and fresh-init output; and
- `excluded`: the skill is repository-local and absent from every public seed
  and initialized public default.

Do not add `reviewed_snapshot` until a real exception has an accepted decision,
rationale, canonical hash, public hash, review boundary, and explicit
portability delta.

## Exact Public Catalog

The exact public members are:

- `author-mdkg-skill`;
- `build-pack-and-execute-task`;
- `pursue-mdkg-goal`;
- `pursue-mdkg-loop`;
- `select-work-and-ground-context`; and
- `verify-close-and-checkpoint`.

All six must be portable before equality is enforced.

## Repository-Local Exclusions

- `release-mdkg-package` remains excluded under `root:dec-85`.
- `service-boundary-ownership-check` remains excluded as repository planning
  policy. A future public promotion requires a separate accepted catalog
  decision.

Exclusion is behavioral as well as name-based. Publication, registry
authentication, credential handling, package tag, push, deployment, provider
mutation, or mdkg-package release procedures cannot be embedded under another
public skill slug.

Portable skills may state that publication requires separate authority, but
they may not prescribe or grant package-release operations.

## Portability And Projection

- Canonical `.mdkg/skills` remains the only authoring source.
- All eight canonical bodies must equal configured `.agents` and `.claude`
  mirrors.
- The six exact public bodies must contain no dangling repository-specific
  QIDs, local design links, named internal products, or customer-specific
  behavior.
- Generic `.mdkg` concepts and portable path patterns remain allowed.
- Use canonical edits followed by `mdkg skill sync`; never edit configured
  mirrors directly.
- Store the machine-readable policy at
  `assets/init/skills/public-seed-policy.json`, outside `skills/default/`, and
  copy it to `dist/init/skills/public-seed-policy.json`.
- One reusable validator must serve focused tests, init smoke, skill
  validation, and publish readiness.

## Consumer Upgrade Boundary

The policy governs canonical source, configured mirrors, shipped public source,
built seed, and fresh `mdkg init --agent` behavior. It does not overwrite
existing customized repositories. Create-if-missing and customization
preservation from `root:dec-19` remain intact.

# Alternatives considered

- Copy all eight repository skills publicly. Rejected because release and
  repository boundary policy are not portable defaults.
- Permit unannotated public divergence. Rejected because staleness and policy
  would remain indistinguishable.
- Introduce `reviewed_snapshot` preemptively. Rejected because no current member
  needs it after portability reconciliation.
- Force-update existing initialized repositories. Rejected because it violates
  create-if-missing and customization-preservation behavior.

# Consequences

- Portable body reconciliation must finish before exact projection
  enforcement.
- Public membership becomes an explicit six-member contract rather than a
  directory inference.
- Release authority is tested across behavior, membership, build, and fresh
  init.
- Existing customized consumers remain untouched.
- A future catalog or divergence change is a decision update, not a test bypass.

# Links / references

- `root:goal-78`
- `root:loop-7`
- `root:goal-74`
- `root:dec-19`
- `root:dec-85`
- `root:task-812`
- `root:test-471`
- `root:task-805`
- `root:test-465`
