---
id: goal-52
type: goal
title: Implement generic remote Git project-memory primitives
status: blocked
priority: 2
goal_state: blocked
goal_condition: Generic remote Git/project-memory primitives are implemented only after goal-51 planning is accepted, with source descriptors, opaque access refs, accepted revision evidence, graph discovery, history/why/next-work queries, generic agent working-loop surfaces, docs/templates, and release gates all validated without storing credentials or branding mdkg behavior around a downstream product.
scope_refs: [task-651, task-653, task-654, task-655, test-339]
active_node: task-651
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, targeted public naming and credential-safety audit, npm pack --dry-run --json]
max_iterations: 25
blocked_after_attempts: 3
tags: [remote-git, project-memory, generic-capability, implementation, successor]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [goal-51]
blocks: []
refs: [goal-51, task-650, test-338, dec-61, dec-62, edd-62, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-03
---
# Objective

Implement the generic remote Git/project-memory primitive surface planned by
`goal-51`.

# End Condition

This goal is achieved when mdkg can represent remote source descriptors,
opaque authenticated access refs, accepted revision evidence, remote/local graph
discovery, history/why/next-work project-memory queries, and generic agent
working-loop primitives with tests, docs/templates, generated references, and
release evidence.

# Non-Goals

- Do not store raw credentials, PATs, SSH keys, agent sockets, raw prompts, raw
  model output, provider payloads, queue bodies, or runtime state roots.
- Do not mutate downstream repos, push, publish, tag, deploy, change DNS, or
  refresh root bundles without explicit later approval.
- Do not brand public mdkg primitives around a downstream product/runtime.
- Do not start until `goal-51` is closed with planning evidence.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- targeted public naming and credential-safety audit
- `npm pack --dry-run --json`

# Acceptance Criteria

- Source descriptor, access-ref, and accepted revision schemas are implemented
  with generic public names and credential-safe validation.
- Graph discovery and project-memory query surfaces work for local and
  descriptor-backed graph context without requiring a product runtime.
- Agent working-loop surfaces distinguish read-only remote inspection from
  authorized local mutation.
- Docs, templates, fixtures, generated references, and release notes explain
  the generic capability and downstream boundary.
- `test-339` passes and records release-readiness evidence.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Blocked until `goal-51` closes. First node is `task-651`.

# Iteration Log

- 2026-07-03: Created as the explicit implementation lane for `goal-51`
  planning output.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
