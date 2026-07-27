---
id: test-465
type: test
title: enforce declared public skill projection equality and exclusions
status: done
priority: 2
parent: goal-78
prev: task-805
next: task-806
tags: [audit-followup, skills, public-seed, test]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-78/public-skill-projection-verification.json]
relates: [loop-7, task-805]
blocked_by: [task-805]
blocks: [task-806]
refs: [goal-78, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-19, dec-85, dec-89, task-812, test-471, task-805, chk-556]
context_refs: [goal-78, loop-7, chk-544, dec-19, dec-85, dec-89, task-812, test-471, task-805]
evidence_refs: [chk-556]
aliases: []
skills: [verify-close-and-checkpoint, author-mdkg-skill]
cases: [policy_schema, exact_six_members, canonical_configured_eight, public_source_built_six, repository_local_exclusions, public_behavior_exclusions, fresh_init_exact, negative_membership_hash_behavior, customized_upgrade_preserved, focused_projection_integration]
created: 2026-07-17
updated: 2026-07-26
---
# Overview

Enforce the membership, equality, and repository-only exclusions declared by
`root:task-805` so future public seed drift is intentional and reviewable.

# Target / Scope

- canonical `.mdkg/skills`, configured mirrors, public init seed, and built seed
- machine-readable projection policy
- disposable `mdkg init --agent` discovery
- existing customized upgrade preservation

# Preconditions / Environment

- `root:task-805` is done and its projection policy is validation-clean.
- `root:test-471` proved all six exact bodies portable.
- Build current init assets and use a disposable local fixture.

# Test Cases

- Policy schema validates and membership is exactly six public plus two
  repository-local exclusions.
- All eight canonical skills are byte-identical to both configured mirrors.
- All six public members are byte-identical across canonical, public source,
  built seed, and disposable fresh init.
- Release and service-boundary skills are absent from public source, built
  output, and fresh init while present in canonical/configured mirrors.
- Public behavior scan rejects package release, registry/credential,
  push/tag/deploy/provider authority, root QIDs, and dangling local links.
- Missing/extra membership, exact-mode hash drift, excluded membership, or
  embedded release behavior fails with the slug and reason.
- Existing customized upgrade targets remain unchanged.
- `mdkg skill validate` and focused init/publish projection smokes pass.

# Results / Evidence

Attach policy schema, canonical/configured/public/built/init hash matrix,
behavior exclusions, negative fixtures, customization-preservation proof, and
final local release/Git boundary to a test-proof checkpoint.

# Notes / Follow-ups

- A future membership or projection-mode change is a decision/policy update,
  not a test bypass.
- Do not independently run `ci:release` or `prepublishOnly`; the final Goal 78
  closeout checkpoint owns exactly one shared run of each after all five
  lane-specific test nodes are complete.
