---
id: goal-51
type: goal
title: plan generic remote Git project-memory primitives
status: blocked
priority: 1
goal_state: paused
goal_condition: Generic mdkg remote Git/project-memory primitive planning is ready when mdkg-owned capabilities for remote repository descriptors, authenticated Git access refs, .mdkg graph discovery, accepted revision evidence, history/why/next-work queries, and agent working-loop primitives are specified with generic public names, product-specific runtime policy is assigned to downstream consumers, credential and raw payload storage is forbidden, and follow-up implementation/release gates are explicit.
scope_refs: [task-650, test-338]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, mdkg status --json, targeted generic public naming audit over successor remote Git/project-memory nodes, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --limit 20 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [remote-git, project-memory, generic-capability, agent-loop, successor-planning]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48, goal-50, task-649, test-337]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-03
---
# Objective

Plan the next generic mdkg capability surface for remote Git and project-memory
work without making it part of the `mdkg@0.4.1` publish lane.

This successor lane exists because remote Git repositories, authenticated Git
access refs, `.mdkg` graph discovery, accepted revisions, history/why/next-work
queries, and agent working-loop primitives are mdkg-owned generic capabilities,
but they are not proven publish-bound behavior for the current 0.4.1
contract-profile release.

# End Condition

This goal is achieved when:

- `task-650` defines the generic primitive surface, ownership boundaries,
  credential/ref safety rules, query model, agent-loop model, and release gates;
- `test-338` defines a public naming contract that rejects product-specific
  public primitive names and raw credential/payload storage;
- downstream runtime or product policy is explicitly consumer-owned and not
  advertised as mdkg public behavior;
- any future implementation, docs, template, package, or publish work is routed
  to a later explicit mdkg-owned execution goal.

# Non-Goals

- No TypeScript/source implementation in this planning lane.
- No package metadata, public docs, generated docs, default template, init asset,
  seed asset, dist, publish, tag, push, deploy, provider, root bundle, or
  downstream repo mutation.
- No raw Git credentials, PATs, SSH key material, agent socket paths, raw
  prompts, raw model output, queue bodies, provider dumps, or runtime state
  roots in mdkg.
- No product-specific public names for generic mdkg primitives.
- No claim that 0.4.1 publishes these remote Git/project-memory primitives.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Apply `service-boundary-ownership-check` before selecting implementation
   scope.
3. Work `task-650` to specify generic mdkg-owned primitives and forbidden
   surfaces.
4. Work `test-338` to specify the public naming and credential-safety gate.
5. Run required checks and record checkpoint evidence before any local commit.
6. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `mdkg status --json`
- targeted generic public naming audit over successor remote Git/project-memory
  nodes
- `mdkg index`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`
- `git diff --check`

# Acceptance Criteria

- Remote repositories are represented as generic source descriptors or refs, not
  product-branded runtime objects.
- Authenticated Git access is represented by opaque access refs, capability
  names, or policy refs only; credentials and live auth material are forbidden.
- `.mdkg` graph discovery, accepted revision evidence, history/why/next-work
  queries, and agent working-loop primitives are mdkg-owned generic capabilities.
- Downstream runtime/profile policy remains consumer-owned and private unless a
  later mdkg decision explicitly generalizes it.
- The 0.4.1 publish lane can reference this goal only as deferred successor
  planning, not as publish-readiness scope.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Paused successor lane seeded from `goal-50`/`test-337` naming clarification.
`task-650` and `test-338` are the initial concrete nodes. This is not the active
publish lane and does not block approval-gated `task-646`.

# Iteration Log

- 2026-07-03: Seeded as a generic successor lane after confirming the 0.4.1
  publish scope does not prove remote Git/project-memory primitives.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
